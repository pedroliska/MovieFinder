import { Injectable }   from '@angular/core';
import { MyHttpService } from './my-http.service';
import { IMovie }   from './movie';

@Injectable()
export class RottenTomatoesService {

    constructor(private myHttp: MyHttpService) { }

    async getTopRentals(): Promise<IMovie[]> {
        // let url = 'https://www.rottentomatoes.com/api/private/v2.0/browse?limit=200&type=top-dvd-streaming&sortBy=popularity';
        // let url = 'http://pedroliska.com/movies/top-rentals.aspx';
        // tslint:disable-next-line: max-line-length
        const url = 'http://bridge.pedroliska.com?url=https%3A%2F%2Fwww.rottentomatoes.com%2Fapi%2Fprivate%2Fv2.0%2Fbrowse%3Flimit%3D200%26type%3Dtop-dvd-streaming%26sortBy%3Dpopularity';
        const reply = await this.myHttp.getJson(url);

        let rankCount = 0;
        const movies: IMovie[] = reply.results
            .map((x: any) => {
                return {
                    rank: ++rankCount,
                    title: x.title,
                    mpaaRating: x.mpaaRating,
                    imageUrl: x.posters.primary,
                    url: 'https://www.rottentomatoes.com' + x.url,
                    genres: null as string[],
                    criticsRating: x.tomatoScore
                };
            });
        return movies;
    }
}
