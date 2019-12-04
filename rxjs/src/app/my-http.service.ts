import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class MyHttpService {

    constructor(private http: HttpClient) { }

    fetchJson(jsonSourceUrl: string, withJsonFn: (json: any) => void): void {
        this.http
            .get<string>(jsonSourceUrl)
            .pipe(tap(x => withJsonFn(x)));
        // this.http
        //     .request(jsonSourceUrl, { method: 'get' })
        //     .map((resp) => { return resp.json() })
        //     .catch(this.handleError)
        //     .subscribe(withJsonFn);
    }

    // private handleError(error: any) {
    //     console.error(error);
    //     return Observable.throw(error.json().error || 'Server error');
    // }
}