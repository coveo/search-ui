# Search-UI
Coveo Search UI framework

## Work in progress
This repository contain the Coveo Search UI, written in Typescript. 
We are in the process of moving the old internal repository to github. 

As such, some part are currently not working.

We are gradually removing our internal dependencies to jQuery, as well as moving our module pattern to commonjs from AMD, as well as integrating webpack.

## Build
    npm install -g gulp
    npm install -g typings
    npm install
    typings install
    npm run build

You can also install webpack globally (`npm install webpack -g`) and call `webpack` from the top of the repo to compile only the typescript code

## Tests

Tests are written with [jasmine](http://jasmine.github.io/2.4/introduction.html). To run them you can either call `npm run test` to run tests in phantom js, or open `./test/SpecRunner.html` in a web browser and easier debugging.

To rebuild tests : `gulp buildTest`

To rebuild and run tests : `gulp test`

NB : Calling `gulp test` does *NOT* rebuild the main library code.

## Documentation
Generated using typedoc. Available [here](https://coveo.github.io/search-ui/)
