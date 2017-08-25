#echo "npm install"
#npm install

echo "clear out transpiled .ts files"
rm -rf src/app/*.js

echo "clear out transpiled .map files"
rm -rf src/app/*.map

echo "clear out dist folder"
rm -rf dist

echo "transpile .ts files"
npm run build

echo "executing dist-systemjs-builder.js"
node dist-systemjs-builder.js

echo "copying app folder"
cp -r src/app/ dist/
echo "removing all but .html files from app folder"
find dist/app/ -type f ! -name '*.html' -delete

echo "copying resources folder"
cp -r src/resources/ dist/

echo "copying top-rentals.aspx"
cp -r src/top-rentals.aspx dist/

echo "copying index.html"
cp -r src/index.html dist/

echo "executing dist-jsreference-updater.js"
node dist-jsreference-updater.js
