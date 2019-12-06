import { Injectable } from '@angular/core';
import { MyHttpService } from './my-http.service';
import { ThrottledHttpService } from './throttled-http.service';
import * as _ from 'lodash';

import { IMovie } from './movie';

@Injectable()
export class TmdbService {

    constructor(private myHttp: ThrottledHttpService) { }

    enhanceMovies(movies: IMovie[], movieUpdated: () => void): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            // get the genres, they are needed to enhance each movie
            this.myHttp.fetchJson(this.createTmdbUrl('/genre/movie/list'), (json: IGenresJson) => {
                var genreDict: { [id: number]: string } = {};
                json.genres.forEach(g => {
                    genreDict[g.id] = g.name;
                });

                // search each movie and enhance it
                let lastMovie = movies[movies.length - 1];
                movies.forEach(localMovie => {

                    let movieUrl = this.createTmdbUrl('/search/movie', localMovie.title);
                    this.myHttp.fetchJson(movieUrl, (json: IMoviesJson) => {

                        // making genres not be null means we tried to get the genre for
                        // this movie. A spinner will stop once we're done fetching all 
                        // genres.
                        localMovie.genres = [];

                        let movieResults: IMovieJson[] = json.results;
                        var tmdbMovie: IMovieJson;
                        if (movieResults.length === 1) {
                            tmdbMovie = movieResults[0];
                        } else {

                            //// refine what TMDB returned.
                            // get only exact title matches
                            // sort by relese date desc (not needed since that's the sort that comes from TMDB)
                            // get the first result

                            tmdbMovie = _(json.results)
                                .filter((m: IMovieJson) => m.title.toLowerCase() === localMovie.title.toLowerCase())
                                .head();
                        }
                        if (tmdbMovie) {
                            localMovie.year = Number(tmdbMovie.release_date.substring(0, 4));
                            localMovie.genres.push.apply(localMovie.genres, tmdbMovie.genre_ids.map(id => genreDict[id]));
                            localMovie.audienceRating = tmdbMovie.vote_average * 10;
                        }

                        movieUpdated();

                        if (localMovie === lastMovie) {
                            resolve();
                        }
                    });
                });
            });
        });
    }

    private createTmdbUrl(apiUrl: string, query: string = ''): string {
        if (query) {
            query = '&query=' + encodeURIComponent(query);
        }
        let tmdbUrl = 'https://api.themoviedb.org/3' + apiUrl + '?api_key=7fab4a62931d29948d1d9942f6d84e21' + query;
        let proxiedUrl = 'http://bridge.pedroliska.com?url=' + encodeURIComponent(tmdbUrl);
        return proxiedUrl;
    }
}

interface IMoviesJson {
    results: IMovieJson[];
}

interface IMovieJson {
    title: string;
    release_date: string;
    genre_ids: number[];
    vote_average: number;
}

interface IGenresJson {
    genres: IGenreJson[];
}

interface IGenreJson {
    id: number;
    name: string;
}

