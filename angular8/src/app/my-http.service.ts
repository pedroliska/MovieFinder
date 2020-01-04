import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MyHttpService {

    constructor(private http: HttpClient) { }

    getJson(jsonSourceUrl: string): Promise<any> {
        return this.http
            .get<string>(jsonSourceUrl)
            .toPromise();
    }
}
