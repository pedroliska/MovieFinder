import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JsonpModule }   from '@angular/http';

import { MoviesComponent }  from './movies/movies.component';

@NgModule({
  imports: [ BrowserModule, JsonpModule ],
  declarations: [ MoviesComponent ],
  bootstrap: [ MoviesComponent ]
})
export class AppModule { }
