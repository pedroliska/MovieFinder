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
    title: string;

    //constructor(
    //    private titleService: Title,
    //    private fields: MovieFieldsService,
    //    private rotten: RottenTomatoesService) { }

    ngOnInit(): void {
        this.title = this.movieInfo.title;
        //this.
    }
}