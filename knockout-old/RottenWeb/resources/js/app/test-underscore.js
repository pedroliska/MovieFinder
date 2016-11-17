require(['underscore'], function(_) {
    console.log(_);

    var collection = [1, 2, 3];
    console.log(collection);

    var redFunc = function(memo, num) {
        return memo + num;
    };
    var result = _.reduce(collection, redFunc, 0);
    console.log(result);
});