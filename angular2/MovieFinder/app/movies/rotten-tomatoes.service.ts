import { Injectable }   from '@angular/core';
import { Http }        from '@angular/http';
import { Observable }   from 'rxjs/Observable'; 

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/toPromise';

import { IMovie }   from './movie';

@Injectable()
export class RottenTomatoesService {
    private queueIsBeingProcessed = false;
    private requestQueue: IRequest[] = [];
    private beganCountingOn: number = null;
    private maxHitsPerSecond = 5;
    private hitCounter = 0;
    private apiRoot = 'http://api.rottentomatoes.com/api/public/v1.0/';
    private debug = true;

    constructor(private http: Http) { }

    getTopRentals(withJsonFn: (movies: IMovie[]) => void): void {
        let url = 'top-rentals.aspx'; 
        this.fetchJson(url, (json: any) => {
            let rankCount = 0;
            let movies: IMovie[] = json.results
                .map((x: any) => {
                    return {
                        rank: ++rankCount,
                        title: x.title,
                        //year: x.year,
                        mpaaRating: x.mpaaRating,
                        imageUrl: x.posters.primary,
                        url: 'https://www.rottentomatoes.com' + x.url,
                        //genres: <string>[],
                        audienceRating: x.popcornScore,
                        criticsRating: x.tomatoScore
                    };
                });
            withJsonFn(movies);
        });
    }

    private fetchJson(jsonSourceUrl: string, withJsonFn: (json: any) => void): void {
        this.http
            .request(jsonSourceUrl, { method: 'get' })
            .map((resp) => { return resp.json() })
            .catch(this.handleError)
            .subscribe(withJsonFn);
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
        //this.jsonp
        //    .request(queueItem.url + '&callback=JSONP_CALLBACK', {method: 'get'})
        //    .map((resp) => { return resp.json() })
        //    .catch(this.handleError)
        //    .subscribe(queueItem.withJsonFn);
        this.http
            .get(queueItem.url)
            .map((resp) => { return resp.json() })
            .catch(this.handleError)
            .subscribe(queueItem.withJsonFn);       this.processQueue();
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

interface IRequest {
    url: string;
    withJsonFn: (json: any) => void;
}