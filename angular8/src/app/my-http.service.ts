import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class MyHttpService {

    constructor(private http: HttpClient) { }

    fetchJson(jsonSourceUrl: string, withJsonFn: (json: any) => void): void {
        this.http
            .get<string>(jsonSourceUrl)
            .subscribe(withJsonFn);
    }
}