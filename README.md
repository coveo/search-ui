# Search-UI [![Build Status](https://travis-ci.org/coveo/search-ui.svg?branch=master)](https://travis-ci.org/coveo/search-ui) [![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-v18.svg?v=100)](https://github.com/ellerbrock/typescript-badges/) [![bitHound Overall Score](https://www.bithound.io/github/coveo/search-ui/badges/score.svg)](https://www.bithound.io/github/coveo/search-ui) [![bitHound Code](https://www.bithound.io/github/coveo/search-ui/badges/code.svg)](https://www.bithound.io/github/coveo/search-ui)
Coveo Search UI framework

<img src='./docs/readme.png' />

## Install
    npm install --save coveo-search-ui

All resources will be available under `node_modules/coveo-search-ui/bin`. You can simply include those in your pages as a `<script>` tag.

If you are already using a module bundler (Browserify, webpack, Babel, etc.), then you can simply `require('coveo-search-ui')`.

## Basic usage

```
<!-- Include the library scripts -->
<script src="js/CoveoJsSearch.js"></script>
<script src="js/CoveoJsSearch.Dependencies.js"></script>
<script src="js/templates/templatesNew.js"></script>

<!-- Every DOM element with a class starting with Coveo (uppercase) will instantiate a Component -->
<body id="search" class='CoveoSearchInterface'>

    <!-- Every DOM element with a class starting with coveo- (lowercase) is only for CSS/alignment purposes. -->
    <div class='coveo-search-section'>

        <!-- Every Coveo Component can be removed (or added) and none are actually required for the page to "load" -->
        <div class="CoveoSearchbox"></div>
    </div>

    <!-- The data- attributes on each component allow you to pass options to a specific Component instance -->
    <div class="CoveoFacet" data-title="Author" data-field="@author" data-tab="All"></div>
    <div class="CoveoFacet" data-title="Year" data-field="@year" data-tab="All"></div>


    <script>
        // Configure an endpoint to perform search.
        // Coveo.SearchEndpoint.configureCloudEndpoint('MyCoveoCloudEnpointName', 'my-authentification-token');

        // We provide a sample endpoint with public sources for demo purposes.
        Coveo.SearchEndpoint.configureSampleEndpoint();
        // Initialize the framework by targeting the root in the interface.
        // It does not have to be the body of the document.
        Coveo.init(document.body);
    </script>
</body>

```

See more examples of fully configured pages in `./pages`.

## Build
    npm install -g gulp
    npm install
    gulp

## Important gulp tasks
* `gulp default` -> Build the whole project (CSS, templates, TypeScript, ...).
* `gulp compile` -> Build only the TypeScript code and generate its output in the `./bin` folder.
* `gulp css` -> Build only the Sass code and generate its output in the `./bin` folder.
* `gulp sprites` -> Regenerate the sprites image as well as the generated Sass/CSS code.
* `gulp test` -> Build and run the unit tests.
* `gulp doc` -> Generate the documentation website for the project.

## Dev

Ensure that you were able to run `gulp` completely without any errors first. Then you can start the dev-server.

    gulp dev

This will start a [webpack-dev-server instance](https://webpack.github.io/docs/webpack-dev-server.html).
Load [http://localhost:8080/Index.html](http://localhost:8080/Index.html) in a web browser.

Any time you hit save in a source file, the bundle will be recompiled, and the dev page will reload.

If you need to modify the content of the search page (the markup itself and not the TypeScript code), modify the Index.html page under `./bin`. This page is not committed in the repository, so don't be afraid to break anything. However, if you need to modify the original `Index.html` for a good reason, feel free to do so.

## Build a custom version of the library.

For advanced users and people concerned with loading speed in their integration, there is a way to compile a completely customized version of the library by including only the components you wish to use.

A classic use case would be someone wanting to display only a search box with a minimal result list, with no facets, tabs, or any other more "advanced" components.

By building a bundle with only those components, you can cut down the size of the resulting JavaScript code by a substantial amount, without having to include useless code related to components you do not use.

1. Install [plop](https://github.com/amwmedia/plop) globally with `npm install -g plop`
2. Change directory to `./plop`
3. Run `plop` to automatically start the small command line utility, choose the "Create a new bundle" option, and choose the components you wish to include in your bundle.
4. Run `node plop.build.js` to compile the file created in `./bin/`.
5. Once compilation finished, your new bundle should be available in `./bin/CoveoJsSearch.Custom.js`

### I want to add a new component !

First, fork our repo.

1. Install [plop](https://github.com/amwmedia/plop) globally with `npm install -g plop`
2. Change directory to `./plop`
3. Run `plop` to automatically start the small command line utility, choose the "Create a new component" option, and choose the component name.
4. This will automatically generate 4 things :
    * Plop will create a new source file under `./src/ui/{{your component name}}/{{your component name}}.ts`. This is where your component logic should be implemented.
    * Plop will export your component in `./src/Index.ts`. This will make it globally available under the Coveo namespace.
    * Plop will add your component to `./tsconfig.json`. This will make it so it's recognized by the project.
    * Plop will create a new file under `./test/ui/{{your component name}}Test.ts`. This is a blank test file, and where you should add your UT.
    * Plop will reference your component in `./test/Test.ts`. This will build your test like the rest of the components.
5. Now, make it work ! (your mileage may vary).
6. Add tests for your component
7. You should test the entire public API of your component : This means all public methods as well as all available options.
8. Create a pull request to merge your changes in the master branch.

We are very eager to receive external contributions as well as collaborating with other developers!

### Tests

Tests are written using [Jasmine](http://jasmine.github.io/2.4/introduction.html). To run them you call `npm run test` to run tests in PhantomJS.

If you wish to write new UT, you can do so by starting a new [webpack-dev-server instance](https://webpack.github.io/docs/webpack-dev-server.html).

To start the server execute `gulp devTest`.

Load [http://localhost:8081/tests/SpecRunner.html](http://localhost:8081/tests/SpecRunner.html).

Every time you hit save in a source file, the dev server will reload and re-execute your tests.

The code coverage will be reported in `./bin/coverage`

## Documentation
Generated using TypeDoc. Available [here](https://coveo.github.io/search-ui/).

Hand written documentation with more examples available [here](https://developers.coveo.com/display/JsSearchV1/JavaScript+Search+Framework+V1+Home)

You can also reach [search.coveo.com](https://search.coveo.com) to search for a particular issue and/or question.
