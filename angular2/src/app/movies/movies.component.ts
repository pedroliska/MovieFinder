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
    sortBy: string = 'audienceRating';

    moviesAll: IMovie[] = [];
    moviesForUi: IMovie[] = [];
    sortFields: IMovieField[]; 

    constructor(
        private titleService: Title,
        private fieldsService: MovieFieldsService,
        private rotten: RottenTomatoesService) { }

    ngOnInit(): void {

        this.titleService.setTitle(this.title);

        this.sortFields = this.fieldsService.fields;

        this.rotten.getTopRentals(movies => {
            this.moviesAll = movies;
            this.filterAndSortMovies(true);
        });
    }

    onSortChange(selectedSort: string) {
        this.sortBy = selectedSort;
        this.sortMovies(this.moviesForUi);
    }

    onEmptyRatingsFilterChange(checked: boolean) {
        this.filterAndSortMovies(checked);
    }

    filterAndSortMovies(filterEmptyRatings: boolean) {
        let filteredMovies: IMovie[] = filterEmptyRatings
            ? _.filter(
                this.moviesAll,
                m => m.audienceRating != null && m.criticsRating != null)
            : this.moviesAll;

        this.sortMovies(filteredMovies);
    }

    sortMovies(movies: IMovie[]) {
        let sortedMovies = _.sortBy(
            movies,
            m => m[this.sortBy] != null ? m[this.sortBy] : -1);

        let descSort = this.fieldsService.getField(this.sortBy).descSort;
        if (descSort) {
            sortedMovies = sortedMovies.reverse();
        }
        this.moviesForUi = sortedMovies;
    }
}