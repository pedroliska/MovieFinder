import { Injectable }   from '@angular/core';
import { MyHttpService } from './my-http.service';
import { IMovie }   from './movie';

@Injectable()
export class RottenTomatoesService {

    constructor(private myHttp: MyHttpService) { }

    getTopRentals(withJsonFn: (movies: IMovie[]) => void): void {
        let url = 'http://pedroliska.com/movies/top-rentals.aspx'; 
        //let url = 'top-rentals.aspx'; 
        this.myHttp.fetchJson(url, (json: any) => {
            let rankCount = 0;
            let movies: IMovie[] = json.results
                .map((x: any) => {
                    return {
                        rank: ++rankCount,
                        title: x.title,
                        //year: x.year,
                        mpaaRating: x.mpaaRating,
                        imageUrl: x.posters.primary,
                        url: 'https://www.rottentomatoes.com' + x.url,
                        //genres: <string>[],
                        audienceRating: x.popcornScore === -1 ? null : x.popcornScore,
                        criticsRating: x.tomatoScore
                    };
                });
            withJsonFn(movies);
        });
    }
}