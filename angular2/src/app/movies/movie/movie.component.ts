import { Component, Input } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { MovieFieldsService, IMovieField } from '../movie-fields.service';
import { RottenTomatoesService } from '../rotten-tomatoes.service';
import { IMovie }   from '../movie';

@Component({
    selector: 'movie', 
    templateUrl: 'app/movies/movie/movie.html',
    providers: [MovieFieldsService, RottenTomatoesService]
})
export class MovieComponent {

    @Input() movieInfo: IMovie;
    displayFields: IMovieField[];

    constructor(
        private fieldsService: MovieFieldsService) { }

    ngOnInit(): void {
        this.displayFields = this.fieldsService.fields;
    }

    onClick(url: any) {
        window.open(url,'_blank');
    }
}