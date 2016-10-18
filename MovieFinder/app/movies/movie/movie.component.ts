import { Component, Input } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { MovieFieldsService } from '../movie-fields.service';
import { RottenTomatoesService, IMovie } from '../rotten-tomatoes.service';

@Component({
    selector: 'movie',
    templateUrl: 'app/movies/movie/movie-component.html',
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
    }
}