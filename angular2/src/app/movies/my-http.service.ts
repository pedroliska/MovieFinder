import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MyHttpService {

    constructor(private http: Http) { }

    fetchJson(jsonSourceUrl: string, withJsonFn: (json: any) => void): void {
        this.http
            .request(jsonSourceUrl, { method: 'get' })
            .map((resp) => { return resp.json() })
            .catch(this.handleError)
            .subscribe(withJsonFn);
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}