import { Injectable } from '@angular/core';
import { MyHttpService } from './my-http.service';
import * as _ from 'lodash';

import { IMovie } from './movie';

@Injectable()
export class TmdbService {

    constructor(private myHttp: MyHttpService) { }

    enhanceMovies(movies: IMovie[]): void {

        console.log(movies.length);
        let url = 'https://api.themoviedb.org/3/search/movie?api_key=7fab4a62931d29948d1d9942f6d84e21&query=';
        movies.forEach(localMovie => {
            var movieUrl = url + encodeURIComponent(localMovie.title);
            this.myHttp.fetchJson(movieUrl, (json: any) => {

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
}
