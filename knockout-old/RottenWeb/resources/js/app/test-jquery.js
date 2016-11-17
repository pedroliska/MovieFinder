require(['jquery'], function ($) {
    console.log($); // OK

    var jqTest = $('#jqTest');
    jqTest.hide().text('jQuery was loaded successfully').show('slow');
});

require(['jquery'], function (jq) {
    console.log(jq); // OK
});

require(['jquery'], function () {
    console.log($); // UNDEFINED!
});

require(['jquery'], function () {
    console.log(jQuery); // UNDEFINED!
});
