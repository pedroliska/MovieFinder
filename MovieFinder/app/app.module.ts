import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MoviesComponent }  from './movies.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ MoviesComponent ],
  bootstrap: [ MoviesComponent ]
})
export class AppModule { }
