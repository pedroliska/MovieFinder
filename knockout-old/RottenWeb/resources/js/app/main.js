//requirejs(["app/test-jquery"]);
//requirejs(["app/test-underscore"]);
//requirejs(["app/test-knockout"]);

require(['knockout', 'app/moviesViewModel', 'jquery'], function(ko, MoviesViewModel, $) {

    ko.applyBindings(new MoviesViewModel(), $('#htmlTop')[0]);

});