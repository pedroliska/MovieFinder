/* 
  The MoviesComponent takes care of
  - using the movie service to get movies
  - sorting movies
*/

import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { MovieFieldsService } from './movie-fields.service';
import { RottenTomatoesService, IMovie } from './rotten-tomatoes.service';

@Component({
    selector: 'movies',
    templateUrl: 'app/movies/movies-component.html',
    providers: [MovieFieldsService, RottenTomatoesService]
})
export class MoviesComponent {

    title = 'Top Movie Rentals';
    movies: IMovie[] = [];

    constructor(
        private titleService: Title,
        private fields: MovieFieldsService,
        private rotten: RottenTomatoesService) { }

    ngOnInit(): void {

        this.titleService.setTitle(this.title);

        //this.rotten.test();
        this.rotten.getTopRentals(movies => {
            console.log(movies);
            this.movies = movies;
        });
    }
}