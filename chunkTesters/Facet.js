'use strict';

describe('Facet', function () {
  it('should load only facets', function () {
    console.log(Coveo.Facet);
    console.log(webpackJsonpCoveo__temporary);
    console.log(webpackJsonpCoveo__temporary([4]));
    /*Coveo.Initialization.getLazyRegisteredComponent('Facet').then(function () {
     console.log('success')
     done();
     }).catch(function () {
     console.log('error')
     done();
     })*/
    //expect(Coveo.Initialization.getListOfLoadedComponents().length).toBe(0);
  });
})
