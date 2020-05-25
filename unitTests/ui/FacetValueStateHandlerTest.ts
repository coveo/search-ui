import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import { FacetValueStateHandler } from '../../src/ui/SearchInterface/FacetValueStateHandler';
import * as Mock from '../MockEnvironment';

export function FacetValueStateHandlerTest() {
  describe('FacetValueStateHandler', () => {
    let test: FacetValueStateHandler;
    let facetMatchingFvState: Mock.IBasicComponentSetup<Facet>;
    const facetId = 'somefield';
    const fieldIdWithoutFacet = 'bloup';
    const someFacetValue = 'fishfishfish';
    const getFacetValueStateWithField = key => {
      return {
        [key]: [someFacetValue]
      };
    };

    beforeEach(() => {
      facetMatchingFvState = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        id: facetId,
        field: facetId
      });

      test = new FacetValueStateHandler(facetMatchingFvState.env.searchInterface);
      (test.searchInterface.getComponents as jasmine.Spy).and.returnValue([facetMatchingFvState.cmp]);
    });

    afterEach(() => {
      test = null;
      facetMatchingFvState = null;
    });

    describe('with a facet matching the facet value state', () => {
      let state;
      beforeEach(() => {
        state = {
          fv: getFacetValueStateWithField(facetId)
        };
      });
      afterEach(() => {
        state = null;
      });

      it('should remove the facet value state', () => {
        test.handleFacetValueState(state);

        expect(Object.keys(state.fv)).not.toContain(facetId);
      });

      it('should set the facet state with the original fv value', () => {
        test.handleFacetValueState(state);

        const facetField = `f:${facetId}`;
        expect(Object.keys(state)).toContain(facetField);
        expect(state[facetField]).toContain(someFacetValue);
      });
    });

    describe('without facets matching the facet value state', () => {
      let state;
      beforeEach(() => {
        state = {
          fv: getFacetValueStateWithField(fieldIdWithoutFacet)
        };
      });
      afterEach(() => {
        state = null;
      });

      it('should remove the facet value state', () => {
        test.handleFacetValueState(state);

        expect(Object.keys(state.fv)).not.toContain(fieldIdWithoutFacet);
      });

      it('should set and hidden query expression with the value', () => {
        test.handleFacetValueState(state);

        expect(Object.keys(state)).toContain(`hq`);
        expect(state.hq).toBe(`${fieldIdWithoutFacet}=="${someFacetValue}"`);
      });
    });
  });
}
