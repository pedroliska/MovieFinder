import { Injectable } from '@angular/core';
import { MyHttpService } from './my-http.service';
import { ThrottledHttpService } from './throttled-http.service';
import * as _ from 'lodash';

import { IMovie } from './movie';

@Injectable()
export class TmdbService {

    constructor(private myHttp: ThrottledHttpService) { }
    enhanceMovies(movies: IMovie[]): void {

        console.log(movies.length);

        // get the genres, they are needed to enhance each movie
        this.myHttp.fetchJson(this.getFullUrl('/genre/movie/list'), (json: IGenresJson) => {
            var genreDict: { [id: number]: string } = {};
            json.genres.forEach(g => {
                genreDict[g.id] = g.name;
            });

            // search each movie and enhance it
            let url = this.getFullUrl('/search/movie');
            movies.forEach(localMovie => {
                var movieUrl = url + encodeURIComponent(localMovie.title);
                this.myHttp.fetchJson(movieUrl, (json: IMoviesJson) => {

                    //// refine what TMDB returned.
                    // get only exact title matches
                    // sort by relese date desc (not needed since that's the sort that comes from TMDB)
                    // get the first result

                    var tmdbMovie = _(json.results)
                        .filter((m: IMovieJson) => m.title.toLowerCase() === localMovie.title.toLowerCase())
                        .head();
                    if (tmdbMovie) {
                        localMovie.year = Number(tmdbMovie.release_date.substring(0, 4));
                        localMovie.genres.push.apply(localMovie.genres, tmdbMovie.genre_ids.map(id => genreDict[id]));
                    }
                });
            });
        });
    }

    private getFullUrl(apiUrl: string) : string {
        return 'https://api.themoviedb.org/3' + apiUrl + '?api_key=7fab4a62931d29948d1d9942f6d84e21&query=';
    }
}

interface IMoviesJson {
    results: IMovieJson;
}

interface IMovieJson {
    title: string;
    release_date: string;
    genre_ids: number[];
}

interface IGenresJson {
    genres: IGenreJson[];
}

interface IGenreJson {
    id: number;
    name: string;
}

