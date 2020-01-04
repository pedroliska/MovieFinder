import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MyHttpService {

    constructor(private http: HttpClient) { }

    fetchJson(jsonSourceUrl: string, withJsonFn: (json: any) => void): void {
        this.http
            .get<string>(jsonSourceUrl)
            .subscribe(withJsonFn);
    }

    getJson(jsonSourceUrl: string): Promise<any> {
        return this.http
            .get<string>(jsonSourceUrl)
            .toPromise();
    }
}
