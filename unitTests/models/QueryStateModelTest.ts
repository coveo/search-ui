/// <reference path="../../lib/jasmine/index.d.ts" />
import { QueryStateModel } from '../../src/models/QueryStateModel';
import * as Mock from '../MockEnvironment';

export function QueryStateModelTest() {
  describe('QueryStateModel', () => {
    var queryState: QueryStateModel;
    var div: HTMLDivElement;

    beforeEach(() => {
      div = document.createElement('div');
      new Mock.MockEnvironmentBuilder().withRoot(div).build();
      queryState = new QueryStateModel(div, undefined);
    });

    afterEach(() => {
      div = null;
      queryState = null;
    });

    it('can determine if a facet is active if one facet has selected values', () => {
      queryState.registerNewAttribute('f:@foobar', ['foo', 'bar']);
      queryState.set('f:@foobar', ['not', 'default', 'value']);
      expect(queryState.atLeastOneFacetIsActive()).toBe(true);
    });

    it('can determine if a facet is active if more than one facet has selected values', () => {
      queryState.registerNewAttribute('f:@foobar', ['foo', 'bar']);
      queryState.registerNewAttribute('f:@foobar2', ['foo2']);
      queryState.set('f:@foobar', ['not', 'default']);
      queryState.set('f:@foobar2', ['not', 'default', 'for', 'facet', '2']);
      expect(queryState.atLeastOneFacetIsActive()).toBe(true);
    });

    it('can determine if a facet is active if one facet has excluded values', () => {
      queryState.registerNewAttribute('f:@foobar:not', ['foo', 'bar']);
      queryState.set('f:@foobar:not', ['not', 'default']);
      expect(queryState.atLeastOneFacetIsActive()).toBe(true);
    });

    it('can determine if no facet is active if nothing is selected', () => {
      queryState.registerNewAttribute('f:@foobar', []);
      expect(queryState.atLeastOneFacetIsActive()).toBe(false);
    });

    it('can determine that no facet is active if the default value is the one selected', () => {
      queryState.registerNewAttribute('f:@foobar', ['foo', 'bar']);
      queryState.set('f:@foobar', ['foo', 'bar']);
      expect(queryState.atLeastOneFacetIsActive()).toBe(false);
    });

    it('can validate on the first attribute', () => {
      expect(() => queryState.set('first', -1)).toThrow();
      expect(() => queryState.set('first', 'haha')).toThrow();
      expect(() => queryState.set('first', {})).toThrow();
      expect(() => queryState.set('first', false)).toThrow();
    });
  });
}
