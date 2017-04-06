import { Injectable }   from '@angular/core';
import { Http }        from '@angular/http';
import { Observable }   from 'rxjs/Observable'; 

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { IMovie }   from './movie';

// This service throttles the hits we do on the rottentomatoes API.
// This used to be important with their public API, but they wanted
// me to pay for it. Now that I'm using the private API it probably
// doesn't matter but I'm leaving the throttling here because it 
// works. I might remove it if it gets in the way.
@Injectable()
export class RottenTomatoesService {
    private queueIsBeingProcessed = false;
    private requestQueue: IRequest[] = [];
    private beganCountingOn: number = null;
    private maxHitsPerSecond = 5;
    private hitCounter = 0;
    private debug = true;

    constructor(private http: Http) { }

    getTopRentals(withJsonFn: (movies: IMovie[]) => void): void {
        let url = 'http://pedroliska.com/movies/top-rentals.aspx'; 
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