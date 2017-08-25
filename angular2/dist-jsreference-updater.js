var fs = require('fs')
var fileName = 'dist/index.html';
fs.readFile(fileName, 'utf8', function (err,fileHtml) {
  if (err) {
    return console.log(err);
  }
  var regex = /<!-- BEGIN code to be replaced for release -->[\s\S]+<!-- END code to be replaced for release -->/gm;
  var result = fileHtml.replace(regex, '<script src="main.min.js"></script>');

  fs.writeFile(fileName, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
