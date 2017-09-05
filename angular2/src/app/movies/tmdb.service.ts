import { Injectable } from '@angular/core';
import { MyHttpService } from './my-http.service';
import * as _ from 'lodash';

import { IMovie } from './movie';

@Injectable()
export class TmdbService {

    genreDict: { [id: number]: string } = null;

    constructor(private myHttp: MyHttpService) { }

    enhanceMovies(movies: IMovie[]): void {

        console.log(movies.length);
        let url = this.getFullUrl('/search/movie');
        movies.forEach(localMovie => {
            var movieUrl = url + encodeURIComponent(localMovie.title);
            this.myHttp.fetchJson(movieUrl, (json: IMoviesJson) => {

                //// refine what TMDB returned.
                // get only exact title matches
                // sort by relese date desc (not needed since that's the sort that comes from TMDB)
                // get the first result

                var tmdbMovie = _(json.results)
                    .filter((m: IMovieJson) => m.title === localMovie.title)
                    .head();
                if (tmdbMovie) {
                    localMovie.year = Number(tmdbMovie.release_date.substring(0, 4));
                    this.fetchAndAddMovieGenres(localMovie, tmdbMovie.genre_ids);
                }
            });
        });
    }

    private fetchAndAddMovieGenres(localMovie: IMovie, genreIds: number[]): void {
        if (!this.genreDict) {
            this.myHttp.fetchJson(this.getFullUrl('/genre/movie/list'), (json: IGenresJson) => {
                this.genreDict = {};
                json.genres.forEach(g => {
                    this.genreDict[g.id] = g.name;
                });
                this.addMovieGenres(localMovie, genreIds);
            });
        } else {
            this.addMovieGenres(localMovie, genreIds);
        }
    }

    private addMovieGenres(localMovie: IMovie, genreIds: number[]): void {
        localMovie.genres.push.apply(localMovie.genres, genreIds.map(id => this.genreDict[id]));
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

