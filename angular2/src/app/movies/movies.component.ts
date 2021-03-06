﻿/* 
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
import { ThrottledHttpService } from './throttled-http.service';
import { MovieComponent } from './movie/movie.component';
import { IMovie } from './movie';
import * as _ from 'lodash';

@Component({
    selector: 'movies', 
    templateUrl: 'app/movies/movies.html',
    providers: [MovieFieldsService, RottenTomatoesService, TmdbService, MyHttpService, ThrottledHttpService, MovieComponent]
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

    fetchingGenres: boolean = true;
    genreAllIsVisible: boolean = true;
    genreSelectIsVisible: boolean = false;
    genreClearIsVisible: boolean = false;
    allGenres: string[];
    genreToShow: string = null;
    
    constructor(
        private titleService: Title,
        private fieldsService: MovieFieldsService,
        private rotten: RottenTomatoesService,
        private tmdb: TmdbService) { }

    async ngOnInit(): Promise<void> {

        this.titleService.setTitle(this.title);

        this.sortFields = this.fieldsService.fields;

        this.rotten.getTopRentals(async movies => {
            this.moviesAll = movies;

            this.allMpaaRatings = (<string[]>_(movies).map('mpaaRating').uniq().sort().value());
            this.allMpaaRatings.forEach(r => {
                this.mpaaRatingShownDict[r] = true;
            });

            this.filterAndSortMovies();
            await this.tmdb.enhanceMovies(this.moviesAll, () => { this.filterAndSortMovies(); });
            this.fetchingGenres = false;
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

        // apply Genre filter
        if (this.genreToShow) {
            filteredMovies = _.filter(filteredMovies, m => m.genres === null || _.includes(m.genres, this.genreToShow));
        }
        

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

    selectGenreFilter() {
        this.allGenres = <string[]>(_.chain(this.moviesAll).map(x => x.genres).flatten().uniq().sort().value());

        this.genreAllIsVisible = false;
        this.genreSelectIsVisible = true;
    }

    selectSciFi() {
        this.genreToShow = "Science Fiction";
        this.filterAndSortMovies();

        this.genreAllIsVisible = false;
        this.genreClearIsVisible = true;
    }

    genreSelected(genre: string) {
        this.genreToShow = genre;
        this.filterAndSortMovies();

        this.genreSelectIsVisible = false;
        this.genreClearIsVisible = true;
    }

    clearGenreFilter() {
        this.genreToShow = null;
        this.filterAndSortMovies();

        this.genreClearIsVisible = false;
        this.genreAllIsVisible = true;
    }
}