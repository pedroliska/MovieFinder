/* 
  The MoviesComponent takes care of
  - using the movie service to get movies
  - sorting movies
*/

import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { MovieFieldsService, IMovieField, StringDict } from './movie-fields.service';
import { RottenTomatoesService } from './rotten-tomatoes.service';
import { TmdbService } from './tmdb.service';
import { MyHttpService } from './my-http.service';
import { MovieComponent } from './movie/movie.component';
import { IMovie } from './movie';
import * as _ from 'lodash';

@Component({
    selector: 'movies', 
    templateUrl: 'app/movies/movies.html',
    providers: [MovieFieldsService, RottenTomatoesService, TmdbService, MyHttpService, MovieComponent]
})
export class MoviesComponent {

    title = 'Top Movie Rentals';
    sortBy: string = 'audienceRating';

    moviesAll: IMovie[] = [];
    moviesForUi: IMovie[] = [];
    sortFields: IMovieField[]; 
    isHidingMoviesWithNoRating: boolean = true;

    mpaaRatingShownDict: StringDict<boolean> = {};
    allMpaaRatings: string[];


    constructor(
        private titleService: Title,
        private fieldsService: MovieFieldsService,
        private rotten: RottenTomatoesService,
        private tmdb: TmdbService) { }

    ngOnInit(): void {

        this.titleService.setTitle(this.title);

        this.sortFields = this.fieldsService.fields;

        this.rotten.getTopRentals(movies => {
            this.moviesAll = movies;
            //this.moviesAll = _.take(movies, 6);

            this.allMpaaRatings = (<string[]>_(movies).map('mpaaRating').uniq().sort().value());
            this.allMpaaRatings.forEach(r => {
                this.mpaaRatingShownDict[r] = true;
            });

            this.filterAndSortMovies();
            this.tmdb.enhanceMovies(this.moviesAll);
        });
    }

    onSortChange(selectedSort: string) {
        this.sortBy = selectedSort;
        this.sortMovies(this.moviesForUi);
    }

    onMpaaFilterChange(rating: string, checked: boolean) {
        this.mpaaRatingShownDict[rating] = checked;
        this.filterAndSortMovies();
    }

    onEmptyRatingsFilterChange(checked: boolean) {
        this.isHidingMoviesWithNoRating = checked;
        this.filterAndSortMovies();
    }

    filterAndSortMovies() {

        // apply isHidingMoviesWithNoRating filter
        let filteredMovies: IMovie[] = this.isHidingMoviesWithNoRating
            ? _.filter(
                this.moviesAll,
                m => m.audienceRating != null && m.criticsRating != null)
            : this.moviesAll;

        // apply MPAA ratings filter
        filteredMovies = _.filter(filteredMovies, m => this.mpaaRatingShownDict[m.mpaaRating]);

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