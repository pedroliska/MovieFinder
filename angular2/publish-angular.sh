#echo "npm install"
#npm install

echo "clear out transpiled .ts files"
rm -rf src/app/*.js

echo "clear out transpiled .map files"
rm -rf src/app/*.map

echo "#clear out dist folder"
rm -rf dist

echo "transpile .ts files"
npm run build

echo "sytemjs-builder"
node systemjs-builder.js
