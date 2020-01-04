import { Injectable } from '@angular/core';

@Injectable()
export class MovieFieldsService {

    fields: IMovieField[];

    private fieldsDict: StringDict<IMovieField> = {};

    constructor() {
        const simpleFields = [
            ['criticsRating', 'Critics Rating', true],
            ['audienceRating', 'Audience Rating', true],
            ['rank', 'Rental Rank', false],
            ['year', 'Year', true],
            ['mpaaRating', 'MPAA Rating', true]
        ];

        const mapFn = (item: [string, string, boolean]) =>
            ( { fieldName: item[0], prettyName: item[1], descSort: item[2] } as IMovieField);

        this.fields = simpleFields.map(mapFn);
        this.fields.forEach(f => {
            this.fieldsDict[f.fieldName] = f;
        });
    }

    getField(fieldName: string): IMovieField {
        return this.fieldsDict[fieldName];
    }
}

export interface IMovieField {
    fieldName: string;
    prettyName: string;
    descSort: boolean;
}

export interface StringDict<T> {
    [k: string]: T;
}
