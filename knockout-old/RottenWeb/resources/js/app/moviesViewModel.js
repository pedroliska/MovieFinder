define(
    ['app/common', 'app/movie', 'app/rottenTomatoes', 'knockout', 'underscore'],
    function (common, Movie, rt, ko, _) {

    return function() {
        var self = this;
        self.movies = ko.observableArray([]);
        self.title = "Top Rentals";

        self.sortFields = common.fields;
        self.selectedSortField = ko.observable();
        self.selectedSortField.subscribe(function(selectedField) {
            var fieldName = selectedField.fieldName;
            var descSort = selectedField.descSort;
            var movies = self.movies();
            var sortedMovies = _.sortBy(movies, function(item) {
                var fName = (item[fieldName + common.sortSuffix]) ? fieldName + common.sortSuffix : fieldName;
                return item[fName];
            });
            if (descSort) {
                sortedMovies.reverse();
            }
            self.movies(sortedMovies);
        });

        rt.getTopRentals(function(json) {
            var movies = _.map(json.movies, function(item) {
                return new Movie(item);
            });
            self.movies(movies);
            self.selectedSortField(self.sortFields[0]);
        });
    };

});