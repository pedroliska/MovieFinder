import { Injectable } from '@angular/core';

@Injectable()
export class MovieFieldsService {

    fields : IMovieField[];

    constructor() {
        let simpleFields = [
            ['audienceRating', 'Audience Rating', true],
            ['criticsRating', 'Critics Rating', true],
            ['rank', 'Rental Rank', false],
            ['year', 'Year', true],
            ['mpaaRating', 'MPAA Rating', true]
        ];

        let mapFn = (item: [string, string, boolean]) =>
            (<IMovieField>{ fieldName: item[0], prettyName: item[1], descSort: item[2] });

        this.fields = simpleFields.map(mapFn);
    }
}

export interface IMovieField {
    fieldName: string;
    prettyName: string;
    descSort: boolean;
}