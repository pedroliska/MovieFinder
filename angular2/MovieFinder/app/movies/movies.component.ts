/* 
  The MoviesComponent takes care of
  - using the movie service to get movies
  - sorting movies
*/

import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { MovieFieldsService, IMovieField } from './movie-fields.service';
import { RottenTomatoesService } from './rotten-tomatoes.service';
import { MovieComponent } from './movie/movie.component';
import { IMovie } from './movie';
import * as _ from 'lodash';

@Component({
    selector: 'movies', 
    templateUrl: 'app/movies/movies.html',
    providers: [MovieFieldsService, RottenTomatoesService, MovieComponent]
})
export class MoviesComponent {

    title = 'Top Movie Rentals';
    movies: IMovie[] = [];
    sortFields: IMovieField[]; 

    constructor(
        private titleService: Title,
        private fieldsService: MovieFieldsService,
        private rotten: RottenTomatoesService) { }

    ngOnInit(): void {

        this.titleService.setTitle(this.title);

        this.sortFields = this.fieldsService.fields;

        this.rotten.getTopRentals(movies => {
            this.sortMovies(movies, 'audienceRating');
        });
    }

    onSortChange(selectedSort: string) {
        this.sortMovies(this.movies, selectedSort);
    }

    sortMovies(movies: IMovie[], fieldName: string) {
        let sortedMovies = _.sortBy(
            movies,
            m => m[fieldName] != null ? m[fieldName] : -1);

        let descSort = this.fieldsService.getField(fieldName).descSort;
        if (descSort) {
            sortedMovies = sortedMovies.reverse();
        }
       this.movies = sortedMovies;
    }
}