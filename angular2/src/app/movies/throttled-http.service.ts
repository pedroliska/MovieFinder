import { Injectable } from '@angular/core';
import { MyHttpService } from './my-http.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ThrottledHttpService {

    private queueIsBeingProcessed = false;
    private requestQueue: IRequest[] = [];
    private beganCountingOn: number = null;
    private maxHitsPerInterval = 40;
    private intervalInSeconds = 10;
    private hitCounter = 0;
    private debug = true;

    constructor(private myHttp: MyHttpService) { }

    fetchJson(jsonSourceUrl: string, withJsonFn: (json: any) => void): void {
        this.requestQueue.push({ url: jsonSourceUrl, withJsonFn: withJsonFn });
        if (!this.queueIsBeingProcessed) {
            this.processQueue();
        }
    }

    // recursive function. will process only one item
    // each time it is called but it will call itself
    // until there are no more items to process
    private processQueue(): void {

        this.queueIsBeingProcessed = true;
        this.consoleOut(
            'processQueue start at:', this.getMilisecondsSinceEpoch(),
            'beganCountingOn:', this.beganCountingOn,
            'hitCounter:', this.hitCounter,
            'items in queue', this.requestQueue.length);
        if (this.requestQueue.length === 0) {
            this.consoleOut('queue is empty');
            this.queueIsBeingProcessed = false;
            return;
        }

        if (!this.beganCountingOn) {
            this.beganCountingOn = this.getMilisecondsSinceEpoch();
        }

        // timeout processQueue if we have reached the maxHitsPerInterval
        if (this.hitCounter >= this.maxHitsPerInterval) {
            const milisecondsToTimeout = this.intervalInSeconds * 1000;
            this.beganCountingOn = null;
            this.hitCounter = 0;
            this.consoleOut('reset counters');
            if (milisecondsToTimeout > 0) {
                this.consoleOut(`timing out for ${milisecondsToTimeout}ms`);
                window.setTimeout(() => { this.processQueue(); }, milisecondsToTimeout);
                return;
            }
            this.consoleOut('no need to timeout');
        }

        this.hitCounter++;
        const queueItem = this.requestQueue.shift();

        this.consoleOut('fetching: ' + queueItem.url);
        this.myHttp.fetchJson(queueItem.url, queueItem.withJsonFn);
        this.processQueue();
    }

    private consoleOut(...args: any[]): void {
        if (this.debug) {
            console.log.apply(console, args);
        }
    }

    getMilisecondsSinceEpoch(): number {
        return new Date().getTime();
    };
}

interface IRequest {
    url: string;
    withJsonFn: (json: any) => void;
}
