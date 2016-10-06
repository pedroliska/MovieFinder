/* 
  The MoviesComponent takes care of
  - using the movie service to get movies
  - sorting movies
*/

import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MovieFieldsService } from './movie-fields.service';

@Component({
    selector: 'movies',
    templateUrl: 'app/movies-component.html',
    providers: [MovieFieldsService]
})
export class MoviesComponent {
    title: string = 'Top Movie Rentals';
    constructor(private _titleService : Title, private _fieldsService : MovieFieldsService) {  }
    ngOnInit(): void {
        this._titleService.setTitle(this.title);
    }
}