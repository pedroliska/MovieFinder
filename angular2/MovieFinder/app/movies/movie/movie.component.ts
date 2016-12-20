import { Component, Input } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { MovieFieldsService } from '../movie-fields.service';
import { RottenTomatoesService } from '../rotten-tomatoes.service';
import { IMovie }   from '../movie';

@Component({
    selector: 'movie', 
    templateUrl: 'app/movies/movie/movie.html',
    providers: [MovieFieldsService, RottenTomatoesService]
})
export class MovieComponent {

    @Input() movieInfo: IMovie;
    displayFields: INameValue[];

    constructor(
        private fieldsService: MovieFieldsService) { }

    ngOnInit(): void {
        this.displayFields = this.fieldsService.fields.map(f => {
            var displayField = {
                name: f.prettyName,
                value: this.movieInfo[f.fieldName]
            };
            return displayField;
        });
    }
}
export interface INameValue {
    name: string;
    value: string;
}