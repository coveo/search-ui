import { CategoryFacet, ICategoryFacetOptions } from '../../../src/ui/CategoryFacet/CategoryFacet';
import * as Mock from '../../MockEnvironment';
import { $$ } from '../../../src/utils/Dom';
import { IQueryResults } from '../../../src/rest/QueryResults';
import { IBasicComponentSetup } from '../../MockEnvironment';
import { Simulate, ISimulateQueryData } from '../../Simulate';
import { FakeResults } from '../../Fake';
import { QueryBuilder } from '../../../src/Core';

export function CategoryFacetTest() {
  function buildSimulateQueryData(): ISimulateQueryData {
    const fakeResults = FakeResults.createFakeResults();
    const queryBuilder = new QueryBuilder();
    queryBuilder.categoryFacets.push({
      field: '@field',
      path: [],
      maximumNumberOfValues: 11
    });
    fakeResults.categoryFacets.push(FakeResults.createFakeCategoryFacetResult('@field', [], 'value', 11));
    return { results: fakeResults, query: queryBuilder.build() };
  }

  describe('CategoryFacet', () => {
    let test: IBasicComponentSetup<CategoryFacet>;
    let simulateQueryData: ISimulateQueryData;

    beforeEach(() => {
      simulateQueryData = buildSimulateQueryData();
      test = Mock.basicComponentSetup<CategoryFacet>(CategoryFacet);
    });

    it('calling hide adds the coveo hidden class', () => {
      test.cmp.hide();
      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBeTruthy();
    });

    describe('calling changeActivePath', () => {
      let newPath: string[];
      let queryPromise: Promise<IQueryResults>;
      beforeEach(() => {
        newPath = ['new', 'path'];
        queryPromise = test.cmp.changeActivePath(newPath);
      });

      it('sets the new path', () => {
        expect(test.cmp.activePath).toEqual(['new', 'path']);
      });

      it('triggers a new query', () => {
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      });

      it('sets the path in the query state', () => {
        expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(test.cmp.queryStateAttribute, newPath);
      });

      it('shows a wait animation', () => {
        const waitIcon = $$(test.cmp.element).find('.' + CategoryFacet.WAIT_ELEMENT_CLASS);
        expect(waitIcon.style.visibility).toEqual('visible');
      });

      it('hides the wait animation after the query', done => {
        queryPromise.then(() => {
          const waitIcon = $$(test.cmp.element).find('.' + CategoryFacet.WAIT_ELEMENT_CLASS);
          expect(waitIcon).not.toBeNull();
          expect(waitIcon.style.visibility).toEqual('hidden');
          done();
        });
      });
    });

    it('calling reload calls changeActivePath', () => {
      spyOn(test.cmp, 'changeActivePath');
      test.cmp.reload();
      expect(test.cmp.changeActivePath).toHaveBeenCalledWith(test.cmp.activePath);
    });

    describe('when moreLess is enabled', () => {
      beforeEach(() => {
        test = Mock.optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
          field: '@field',
          enableMoreLess: true,
          numberOfValues: 10
        });
      });
      it('downward arrow is appended when there are more results to fetch', () => {
        Simulate.query(test.env, simulateQueryData);
        const moreArrow = $$(test.cmp.element).find('.coveo-category-facet-more');
        expect(moreArrow).not.toBeNull();
      });

      it('upward arrow is appended when we are not on the first page of results', () => {
        test.cmp.showMore();
        Simulate.query(test.env, simulateQueryData);
        const downArrow = $$(test.cmp.element).find('.coveo-category-facet-less');
        expect(downArrow).not.toBeNull();
      });
    });

    it('showMore should increment the number of values requested according the the pageSize', () => {
      const initialNumberOfValues = test.cmp.options.numberOfValues;
      const pageSize = test.cmp.options.pageSize;
      Simulate.query(test.env, simulateQueryData);

      test.cmp.showMore();
      const { queryBuilder } = Simulate.query(test.env, simulateQueryData);

      expect(queryBuilder.categoryFacets[0].maximumNumberOfValues).toBe(initialNumberOfValues + pageSize + 1);
    });
  });
}
