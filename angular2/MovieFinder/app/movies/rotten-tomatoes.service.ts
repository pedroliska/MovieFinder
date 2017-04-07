import { Injectable }   from '@angular/core';
import { Http }        from '@angular/http';
import { Observable }   from 'rxjs/Observable'; 

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { IMovie }   from './movie';

@Injectable()
export class RottenTomatoesService {

    constructor(private http: Http) { }

    getTopRentals(withJsonFn: (movies: IMovie[]) => void): void {
        //let url = 'http://pedroliska.com/movies/top-rentals.aspx'; 
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
                        audienceRating: x.popcornScore === -1 ? null : x.popcornScore,
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

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}