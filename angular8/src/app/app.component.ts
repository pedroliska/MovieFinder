import { Component, OnInit } from '@angular/core';
import { IMovie } from './movie';
import { IMovieField, StringDict, MovieFieldsService } from './movie-fields.service';
import { Title } from '@angular/platform-browser';
import { RottenTomatoesService } from './rotten-tomatoes.service';
import { TmdbService } from './tmdb.service';
import { MyHttpService } from './my-http.service';
import { ThrottledHttpService } from './throttled-http.service';
import { MovieComponent } from './movie/movie.component';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import _uniq from 'lodash-es/uniq';
import _map from "lodash-es/map";
import _flatten from "lodash-es/flatten";
import _sortBy from "lodash-es/sortBy";
import _flow from "lodash-es/flow";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MovieFieldsService, RottenTomatoesService, TmdbService, MyHttpService, ThrottledHttpService, MovieComponent],
})
export class AppComponent implements OnInit {
  title = 'Top Movie Rentals';
  sortBy: string = 'audienceRating';

  moviesAll: IMovie[] = [];
  moviesForUi: IMovie[] = [];
  sortFields: IMovieField[];
  isHidingMoviesWithNoRating: boolean = true;

  mpaaRatingShownDict: StringDict<boolean> = {};
  allMpaaRatings: string[];

  fetchingGenres: boolean = true;
  genreAllIsVisible: boolean = true;
  genreSelectIsVisible: boolean = false;
  genreClearIsVisible: boolean = false;
  allGenres: string[];
  genreToShow: string = null;

  constructor(
      private titleService: Title,
      private fieldsService: MovieFieldsService,
      private rotten: RottenTomatoesService,
      private tmdb: TmdbService
  ) { }

  async ngOnInit(): Promise<void> {

    this.titleService.setTitle(this.title);

    this.sortFields = this.fieldsService.fields;

    const movies = await this.rotten.getTopRentals();

    this.moviesAll = movies;

    this.allMpaaRatings = _uniq(_map(movies, 'mpaaRating')).sort();
    this.allMpaaRatings.forEach(r => {
        this.mpaaRatingShownDict[r] = true;
    });

    this.filterAndSortMovies();
    await this.tmdb.enhanceMovies(this.moviesAll, () => { this.filterAndSortMovies(); });
    this.fetchingGenres = false;
  }

  onSortChange(selectedSort: string) {
      this.sortBy = selectedSort;
      this.sortMovies(this.moviesForUi);
  }

  onMpaaFilterChange(rating: string, checked: boolean) {
      this.mpaaRatingShownDict[rating] = checked;
      this.filterAndSortMovies();
  }

  onEmptyRatingsFilterChange(checked: boolean) {
      this.isHidingMoviesWithNoRating = checked;
      this.filterAndSortMovies();
  }

  filterAndSortMovies() {

      // apply isHidingMoviesWithNoRating filter
      let filteredMovies: IMovie[] = this.isHidingMoviesWithNoRating
          ? _filter(
              this.moviesAll,
              m => m.audienceRating != null && m.criticsRating != null)
          : this.moviesAll;

      // apply MPAA ratings filter
      filteredMovies = _filter(filteredMovies, m => this.mpaaRatingShownDict[m.mpaaRating]);

      // apply Genre filter
      if (this.genreToShow) {
        filteredMovies = _filter(filteredMovies, m => m.genres === null || _includes(m.genres, this.genreToShow));
    }


      this.sortMovies(filteredMovies);
  }

  sortMovies(movies: IMovie[]) {
      let sortedMovies = _sortBy(
          movies,
          m => m[this.sortBy] != null ? m[this.sortBy] : -1);

      let descSort = this.fieldsService.getField(this.sortBy).descSort;
      if (descSort) {
          sortedMovies = sortedMovies.reverse();
      }
      this.moviesForUi = sortedMovies;
  }

  selectGenreFilter() {
    this.allGenres = _uniq(_flatten(_map(this.moviesAll, x => x.genres))).sort();

      this.genreAllIsVisible = false;
      this.genreSelectIsVisible = true;
  }

  selectSciFi() {
      this.genreToShow = "Science Fiction";
      this.filterAndSortMovies();

      this.genreAllIsVisible = false;
      this.genreClearIsVisible = true;
  }

  genreSelected(genre: string) {
      this.genreToShow = genre;
      this.filterAndSortMovies();

      this.genreSelectIsVisible = false;
      this.genreClearIsVisible = true;
  }

  clearGenreFilter() {
      this.genreToShow = null;
      this.filterAndSortMovies();

      this.genreClearIsVisible = false;
      this.genreAllIsVisible = true;
  }
}
