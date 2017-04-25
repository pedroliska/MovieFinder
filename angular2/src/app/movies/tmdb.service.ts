import { Injectable, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import { IMovie } from './movie';

@Injectable()
export class TmdbService {

    constructor(private http: Http) { }

    enhanceMovies(movies: IMovie[]): void {

        console.log(movies.length);
        let url = 'https://api.themoviedb.org/3/search/movie?api_key=7fab4a62931d29948d1d9942f6d84e21&query=';
        movies.forEach(localMovie => {
            var movieUrl = url + encodeURIComponent(localMovie.title);
            this.fetchJson(movieUrl, (json: any) => {

                //// refine what TMDB returned.
                // get only exact title matches
                // sort by relese date desc (not needed since that's the sort that comes from TMDB)
                // get the first result

                var tmdbMovie = _(json.results)
                    .filter((m: any) => m.title === localMovie.title)
                    .head();
                if (tmdbMovie) {
                    localMovie.year = tmdbMovie.release_date.substring(0,4);
                }
            });
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

export interface ITmdbMovie {
    release_date: string;
}