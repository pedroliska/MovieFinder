//var path = require("path");
var System = require('systemjs');
var Builder = require('systemjs-builder');

// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('', 'src/systemjs.config.js');
builder.config({defaultJSExtensions: true});
builder
    .buildStatic('src/main.js', 'dist/main.min.js', { 'minify': true, sourceMaps: true })
    .catch(function(err) {
        console.log('Build mainfile error');
        console.log(err);
    });
builder
    .buildStatic("node_modules/zone.js/dist/zone.js", 'dist/node_modules/zone.js/dist/zone.js', { 'minify': true })
    .catch(function(err) {
        console.log('Build zone.js error');
        console.log(err);
    });
builder
    .buildStatic("node_modules/core-js/client/shim.js", 'dist/node_modules/core-js/client/shim.min.js', { 'minify': true })
    .catch(function(err) {
        console.log('Build shim.js error');
        console.log(err);
    });

// builder
// .bundle('local/module.js', 'outfile.js')
// .then(function() {
//   console.log('Build complete');
// })
// .catch(function(err) {
//   console.log('Build error');
//   console.log(err);
// });