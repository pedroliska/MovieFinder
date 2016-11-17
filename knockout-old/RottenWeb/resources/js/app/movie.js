define(['jquery', 'underscore', 'knockout', 'app/common', 'app/rottenTomatoes'], function($, _, ko, common, rt) {

    var rentalRank = 0;

    return function(jsonMovie) {

        var self = this;
        this.rank = ++rentalRank;
        this.title = jsonMovie.title;
        this.year = jsonMovie.year;
        this.mpaaRating = jsonMovie.mpaa_rating;
        // all the properties under jsonMovie.posters.* now have the same
        // value and it is the thumbnail.
        this.image = jsonMovie.posters.detailed;
        //this.image = jsonMovie.posters.detailed.replace(/tmb/, 'det');
        this.externalLink = jsonMovie.links.alternate;
        this.detailsLink = jsonMovie.links.self;

        this.genres = ko.observable([]);
        this.genresDisplay = ko.computed(function() {
            return self.genres().join(', ');
        });

        var ratings = ['audience', 'critics'];
        $.each(ratings, function(index, ratingGroup) {

            var newPropertyName = ratingGroup + 'Rating',
                scoreProperty = ratingGroup + "_score",
                jsonRatings = jsonMovie.ratings;
            var score = jsonRatings[scoreProperty];
            self[newPropertyName] = score + '%';

            var newSortPropertyName = newPropertyName + common.sortSuffix;
            self[newSortPropertyName] = score;

        });

        this.displayFields = _.map(common.fields, function(item) {
            return [item.prettyName, self[item.fieldName]];
        });

        // fetch the genres, since JS is single threaded, this should really slow things down
        rt.getMovieDetails(jsonMovie.id, function(jsonResponse) {
            self.genres(jsonResponse.genres);
        });
    };

});