import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }   from '@angular/http';

import { MoviesComponent }  from './movies/movies.component';
import { MovieComponent }  from './movies/movie/movie.component';

@NgModule({
  imports: [ BrowserModule, HttpModule ],
  declarations: [ MoviesComponent, MovieComponent ],
  bootstrap: [ MoviesComponent ]
})
export class AppModule { }
