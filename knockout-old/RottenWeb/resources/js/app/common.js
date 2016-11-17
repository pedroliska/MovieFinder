define(['underscore', 'jquery'], function(_, $) {

    var mapFunction = function(item) {
            return { fieldName: item[0], prettyName: item[1], descSort: item[2], };
        },
        data = [
            ['audienceRating', "Audience Rating", true],
            ['criticsRating', "Critics Rating", true],
            ['rank', "Rental Rank", false],
            ['year', "Year", true],
            ['mpaaRating', "MPAA Rating", true]
        ];

    return {
        sortSuffix: '_sort',
        fields: _.map(data, mapFunction),
        withJson: function(jsonSource, withJsonAction) {
            sleep(300);

            jsonSource += (jsonSource.indexOf('?') === -1) ? '?' : '&';
            jsonSource += 'apikey=bwb666kgs348vaw35zu3u64v';

            $.ajax({
                url: jsonSource,
                dataType: 'jsonp',
                success: withJsonAction,
                error: function() {
                    throw new Error("unable to get json data");
                },
            });
        }
    };
});