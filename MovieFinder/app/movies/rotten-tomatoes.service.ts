import { Injectable }   from '@angular/core';
import { Jsonp }        from '@angular/http';
import { Observable }   from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RottenTomatoesService {
    private apiKey = 'bwb666kgs348vaw35zu3u64v';
    private apiKeyAndName = `apiKey=${this.apiKey}`;
    private queueIsBeingProcessed = false;
    private requestQueue: IRequest[] = [];
    private beganCountingOn: number = null;
    private maxHitsPerSecond = 5;
    private hitCounter = 0;
    private apiRoot = 'http://api.rottentomatoes.com/api/public/v1.0/';
    private debug = true;

    constructor(private jsonp: Jsonp) {}

    test() {
        let url =
            "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?limit=50&apiKey=bwb666kgs348vaw35zu3u64v&callback=JSONP_CALLBACK";
        this.jsonp
            .request(url, {method: 'get'})
            .map((resp) => { return resp.json() })
            .catch(this.handleError)
            .subscribe((json: string) => {console.log(json);});
    }

    getTopRentals(withJsonFn: (json: string) => void): void {
        // http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?limit=50&apiKey=bwb666kgs348vaw35zu3u64v
        const url = this.apiRoot + "lists/dvds/top_rentals.json?limit=50&" + this.apiKeyAndName;
        return this.fetchJson(url, withJsonFn);
    }

    getMovieDetails(movieId: number, withJsonFn: (json: IMovie[]) => void): void {
        const url = this.apiRoot + 'movies/' + movieId + '.json?' + this.apiKeyAndName;
        return this.fetchJson(url, withJsonFn);
    }

    private fetchJson(jsonSourceUrl: string, withJsonFn: (json: any) => void): void {
        this.consoleOut('fetchJson');
        this.requestQueue.push({ url: jsonSourceUrl, withJsonFn: withJsonFn } as IRequest);
        if (!this.queueIsBeingProcessed) {
            this.processQueue();
        }
    }

    private consoleOut(...args: any[]): void {
        if (this.debug) {
            //console.log.apply(console, arguments);
            console.log.apply(console, args);
        }
    }

    getMilisecondsSinceEpoch(): number {
        return new Date().getTime();
    };

    // recursive function. will process only one item
    // each time it is called but it will call itself
    // until there are no more items to process
    private processQueue(): void {
        this.queueIsBeingProcessed = true;
        this.consoleOut('processQueue start', this.getMilisecondsSinceEpoch(), this.beganCountingOn, this.hitCounter);
        if (this.requestQueue.length === 0) {
            this.consoleOut('queue is empty');
            this.queueIsBeingProcessed = false;
            return;
        }
        if (!this.beganCountingOn) {
            this.beganCountingOn = this.getMilisecondsSinceEpoch();
        }
        // timeout processQueue if we have reached the maxHitsPerSecond
        if (this.hitCounter >= this.maxHitsPerSecond) {
            const milisecondsToTimeout = 1000;
            this.beganCountingOn = null;
            this.hitCounter = 0;
            this.consoleOut('reset counters');
            if (milisecondsToTimeout > 0) {
                this.consoleOut(`timing out for ${milisecondsToTimeout}ms`);
                window.setTimeout(this.processQueue, milisecondsToTimeout);
                return;
            }
            this.consoleOut('no need to timeout');
        }

        this.hitCounter++;
        const queueItem = this.requestQueue.shift();

        this.consoleOut('fetching url');
        //this.consoleOut($);
        //this.http
        //    .get(queueItem.url)
        //    .map((resp) => { return resp.json() })
        //    .catch(this.handleError)
        //    .subscribe(queueItem.withJsonFn);
        this.jsonp
            .request(queueItem.url, {method: 'get'})
            .map((resp) => { return resp.json() })
            .catch(this.handleError)
            .subscribe(queueItem.withJsonFn);
        //$.ajax({
        //  url: queueItem.url,
        //  dataType: 'jsonp',
        //  success: queueItem.action,
        //  error: function () {
        //    throw new Error("unable to get json data");
        //  }
        //});
        this.processQueue();
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

export interface IMovie {
    fieldName: string;
    prettyName: string;
    descSort: boolean;
}

interface IRequest {
    url: string;
    withJsonFn: (json: string) => void;
}