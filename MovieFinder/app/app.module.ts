import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JsonpModule }   from '@angular/http';

import { MoviesComponent }  from './movies/movies.component';
import { MovieComponent }  from './movies/movie/movie.component';

@NgModule({
  imports: [ BrowserModule, JsonpModule ],
  declarations: [ MoviesComponent, MovieComponent ],
  bootstrap: [ MoviesComponent ]
})
export class AppModule { }
