# Search-UI [![Build Status](https://travis-ci.org/coveo/search-ui.svg?branch=master)](https://travis-ci.org/coveo/search-ui) [![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-v18.svg?v=100)](https://github.com/ellerbrock/typescript-badges/)
Coveo Search UI framework

## Work in progress
This repository contain the Coveo Search UI, written in Typescript. 
We are in the process of moving the old internal repository to github. 

As such, some parts are currently not working.

We are gradually removing our internal dependencies to jQuery, as well as moving our module pattern to commonjs from AMD, as well as integrating webpack.

## Build
    npm install -g gulp
    npm install -g typings
    npm install
    typings install
    npm run build

You can also install webpack globally (`npm install webpack -g`) and call `webpack` from the top of the repo to compile only the typescript code

## Dev

Ensure that you were able to run `npm run build` completely without any error first. Then you can start the dev-server.

    gulp dev

This will start a [webpack-dev-server instance](https://webpack.github.io/docs/webpack-dev-server.html).
Load [http://localhost:8080/index.html](http://localhost:8080/index.html) in a web browser.

Any time you hit save in a source file, the bundle will be recompiled, and the dev page will reload.

If you need to modify the content of the search page (the markup itself and not the typescript code), modify the Index.html page under `./bin`. This page is not committed in the repository, so don't be afraid to break anything. However, if you need to modify the original `Index.html` for a good reason, feel free to do so.

### I want to add a new component !

First, fork our repo.

* Create a new folder under `./src/ui/` that match the name of your component. Then, create a `.ts` file that match the same name.
* Add your file to the `.tsconfig.json`
* Create the basic scaffolding of your component. For example copy SearchButton (a very simple component), and change it's ID + various imports
* Export the class associated with your component in `./src/Index.ts` so that it's available in the global scope.
* Make it work ! (your mileage may vary)

Now, add tests for your component
* Create a new file matching your component name under `./test/ui`
* Follow the same pattern that other components use (Copy SearchButton, for example). 
* You should try to test all public API of your component : This means all public methods as well as all available options.
* Reference your test file in `./test/Test.ts`.

Create a pull request to merge your changes in the master branch.

We are very eager to receive external contributions as well as collaborating with other developers !

### Tests

Tests are written with [jasmine](http://jasmine.github.io/2.4/introduction.html). To run them you can either call `npm run test` to run tests in phantom js, or open `./test/SpecRunner.html` in a web browser and easier debugging.

To rebuild tests : `gulp buildTest`

To rebuild and run tests : `gulp test`

NB : Calling `gulp test` does *NOT* rebuild the main library code.

## Documentation
Generated using typedoc. Available [here](https://coveo.github.io/search-ui/)
