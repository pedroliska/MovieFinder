import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable()
export class MyHttpService {
    public pendingQueue: QueueItem[] = [];
    public processingQueue: QueueItem[] = [];
    private concurrentUploads = 5;

    constructor(private http: HttpClient) {}

    public async get(url: string): Promise<any> {
        let resolveFn: (reply: any) => void;
        const promise = new Promise(resolve => {
            resolveFn = resolve;
        });
        const item = new QueueItem(url, resolveFn);
        this.pendingQueue.push(item);
        this.processQueue();
        return promise;
    }

    private async processQueue() {
        if (this.processingQueue.length >= this.concurrentUploads) {
            return;
        }

        while (
            this.pendingQueue.length > 0 &&
            this.processingQueue.length < this.concurrentUploads
        ) {
            const item = this.pendingQueue.shift();
            this.processingQueue.push(item);

            this.http
                .get<HttpResponse<any>>(item.url)
                .toPromise()
                .then(reply => {
                    this.processingQueue.splice(this.pendingQueue.indexOf(item), 1);
                    item.resolveFn(reply);
                    this.processQueue();
                });
        }
    }
}

class QueueItem {
    constructor(public url: string, public resolveFn: (reply: any) => any) {}
}
