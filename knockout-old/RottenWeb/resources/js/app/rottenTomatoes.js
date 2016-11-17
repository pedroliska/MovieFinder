define(['jquery'], function($) {

    var apiKey = 'bwb666kgs348vaw35zu3u64v',
        apiKeyAndName = 'apiKey=' + apiKey,
        queueIsBeingProcessed = false,
        requestQueue = [],
        beganCountingOn = null,
        maxHitsPerSecond = 5,
        hitCounter = 0,
        apiRoot = 'http://api.rottentomatoes.com/api/public/v1.0/',
        debug = false;

    var getMilisecondsSinceEpoch = function() {
        return new Date().getTime();
    };
    var consoleOut = function(args) {
        if (debug) {
            console.log.apply(console, arguments);
        }
    };

    // recursive function. will process only one item
    // each time it is called but it will call itself
    // until there are no more items to process
    var processQueue = function() {
        queueIsBeingProcessed = true;
        consoleOut('processQueue start', getMilisecondsSinceEpoch(), beganCountingOn, hitCounter);
        if (requestQueue.length === 0) {
            consoleOut('queue is empty');
            queueIsBeingProcessed = false;
            return;
        }
        if (!beganCountingOn) {
            beganCountingOn = getMilisecondsSinceEpoch();
        }
        // timeout processQueue if we have reached the maxHitsPerSecond
        if (hitCounter >= maxHitsPerSecond) {
            // to make milisecondsToTimeout be smarter, you need to know how many hits
            // you've done in the last second. The approach below is wrong.
            //var milisecondsSinceCountingOn = getMilisecondsSinceEpoch() - beganCountingOn;
            //var milisecondsToTimeout = 1000 - milisecondsSinceCountingOn;
            var milisecondsToTimeout = 1000;
            beganCountingOn = false;
            hitCounter = 0;
            consoleOut('reset counters');
            if (milisecondsToTimeout > 0) {
                consoleOut('timing out for ' + milisecondsToTimeout + 'ms');
                window.setTimeout(processQueue, milisecondsToTimeout);
                return;
            }
            consoleOut('no need to timeout');
        }

        hitCounter++;
        var queueItem = requestQueue.shift();

        consoleOut('fetching url');
        $.ajax({
          url: queueItem.url,
          dataType: 'jsonp',
          success: queueItem.action,
          error: function () {
            throw new Error("unable to get json data");
          }
        });
        processQueue();
    };

    var fetchJson = function(jsonSource, withJsonAction) {
        consoleOut('fetchJson');
        requestQueue.push({ url: jsonSource, action: withJsonAction });
        if (!queueIsBeingProcessed) {
            processQueue();
        }
    }

    return {
        getTopRentals: function(withJsonAction) {
            // http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?limit=50&apiKey=bwb666kgs348vaw35zu3u64v
            var url = apiRoot + "lists/dvds/top_rentals.json?limit=50&" + apiKeyAndName;
            fetchJson(url, withJsonAction);
        },
        getMovieDetails: function(movieId, withJsonAction) {
            var url = apiRoot + 'movies/' + movieId + '.json?' + apiKeyAndName;
            fetchJson(url, withJsonAction);
        }
    };
});