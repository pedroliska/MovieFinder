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

echo "sytemjs-builder"
node systemjs-builder.js

echo "copying resources folder"
cp -r src/resources/ dist/

echo "copying app folder"
cp -r src/app/ dist/

echo "removing all but .html files from app folder"
find dist/app/ -type f ! -name '*.html' -delete

echo "copying index.html"
cp -r src/index.html dist/
