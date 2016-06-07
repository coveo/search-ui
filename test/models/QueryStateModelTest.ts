module Coveo {
  describe('QueryStateModel', function() {
    var queryState: QueryStateModel;
    var div: HTMLDivElement;
    var env: Mock.IMockEnvironment;

    beforeEach(function() {
      div = document.createElement('div');
      env = new Mock.MockEnvironmentBuilder().withRoot(div).build();
      queryState = new QueryStateModel(div, undefined);
    })

    afterEach(function() {
      div = null;
      env = null;
      queryState = null;
    })

    it('can determine if a facet is active if one facet has selected values', function() {
      queryState.registerNewAttribute('f:@foobar', ['foo', 'bar']);
      expect(queryState.atLeastOneFacetIsActive()).toBe(true);
    })

    it('can determine if a facet is active if more than one facet has selected values', function() {
      queryState.registerNewAttribute('f:@foobar', ['foo', 'bar']);
      queryState.registerNewAttribute('f:@foobar2', ['foo2']);
      expect(queryState.atLeastOneFacetIsActive()).toBe(true);
    })

    it('can determine if a facet is active if one facet has excluded values', function() {
      queryState.registerNewAttribute('f:@foobar:not', ['foo', 'bar']);
      expect(queryState.atLeastOneFacetIsActive()).toBe(true);
    })

    it('can determine if no facet is active if nothing is selected', function() {
      queryState.registerNewAttribute('f:@foobar', []);
      expect(queryState.atLeastOneFacetIsActive()).toBe(false);
    })

    it('can validate on the first attribute', function() {
      expect(() => queryState.set('first', -1)).toThrow();
      expect(() => queryState.set('first', 'haha')).toThrow();
      expect(() => queryState.set('first', {})).toThrow();
      expect(() => queryState.set('first', false)).toThrow();
    })
  })
}
