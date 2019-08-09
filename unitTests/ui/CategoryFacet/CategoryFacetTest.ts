import { CategoryFacet, ICategoryFacetOptions } from '../../../src/ui/CategoryFacet/CategoryFacet';
import * as Mock from '../../MockEnvironment';
import { $$ } from '../../../src/utils/Dom';
import { IBasicComponentSetup, mock } from '../../MockEnvironment';
import { Simulate, ISimulateQueryData } from '../../Simulate';
import { FakeResults } from '../../Fake';
import { QueryBuilder } from '../../../src/Core';
import { CategoryFacetQueryController } from '../../../src/controllers/CategoryFacetQueryController';
import { IBuildingQueryEventArgs } from '../../../src/events/QueryEvents';
import { first, range, pluck, shuffle, partition, chain } from 'underscore';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';
import { ResultListUtils } from '../../../src/utils/ResultListUtils';

export function buildCategoryFacetResults(numberOfResults = 11, numberOfRequestedValues = 11, field = '@field'): ISimulateQueryData {
  const fakeResults = FakeResults.createFakeResults();
  const queryBuilder = new QueryBuilder();
  fakeResults.categoryFacets.push(FakeResults.createFakeCategoryFacetResult(field, [], 'value', numberOfResults));
  queryBuilder.categoryFacets.push({
    field,
    path: pluck(fakeResults.categoryFacets[0].parentValues, 'value'),
    maximumNumberOfValues: numberOfRequestedValues
  });
  return { results: fakeResults, query: queryBuilder.build() };
}

export function CategoryFacetTest() {
  describe('CategoryFacet', () => {
    let test: IBasicComponentSetup<CategoryFacet>;
    let simulateQueryData: ISimulateQueryData;

    beforeEach(() => {
      simulateQueryData = buildCategoryFacetResults();
      test = Mock.advancedComponentSetup<CategoryFacet>(
        CategoryFacet,
        new Mock.AdvancedComponentSetupOptions(null, { field: '@field' }, env => env.withLiveQueryStateModel())
      );
      test.cmp.activePath = simulateQueryData.query.categoryFacets[0].path;
    });

    function allCategoriesButton() {
      return $$(test.cmp.element).find('.coveo-category-facet-all-categories');
    }

    it('when calling getVisibleParentValues returns all the visible parent values', () => {
      Simulate.query(test.env, simulateQueryData);
      const visibleParentValues: string[] = pluck(test.cmp.getVisibleParentValues(), 'value');
      for (let i = 0; i < test.cmp.activePath.length; i++) {
        expect(visibleParentValues[i]).toEqual(`parent${i}`);
      }
    });

    it('when calling getVisibleParentValues when there are no parents returns empty array', () => {
      simulateQueryData.results.categoryFacets[0].parentValues = [];
      simulateQueryData.query.categoryFacets[0].path = [];
      test.cmp.activePath = [];

      const visibleParentValues = test.cmp.getVisibleParentValues();

      expect(visibleParentValues).toEqual([]);
    });

    it('when calling getAvailableValues returns children of the last parent', () => {
      Simulate.query(test.env, simulateQueryData);
      const values: string[] = pluck(test.cmp.getAvailableValues(), 'value');
      for (let i = 0; i < simulateQueryData.results.categoryFacets[0].values.length - 1; i++) {
        expect(values[i]).toEqual(`value${i}`);
      }
    });

    it('when calling deselectCurrentValue it strips the last element of the path', () => {
      test.cmp.activePath = ['value1', 'value2'];
      test.cmp.deselectCurrentValue();
      expect(test.cmp.activePath).toEqual(['value1']);
    });

    it('when calling deselectCurrentValue and the path is empty the path remains empty', () => {
      test.cmp.activePath = [];
      test.cmp.deselectCurrentValue();
      expect(test.cmp.activePath).toEqual([]);
    });

    it('when calling selectValue with a non-existent value throws an error', () => {
      Simulate.query(test.env, simulateQueryData);
      expect(() => test.cmp.selectValue('inexistentvalue')).toThrowError();
    });

    it('when calling selectValue appends the given value to the path', () => {
      const currentPath = test.cmp.activePath;
      Simulate.query(test.env, simulateQueryData);

      test.cmp.selectValue('value9');

      expect(test.cmp.activePath).toEqual(currentPath.concat(['value9']));
    });

    it('calling hide adds the coveo hidden class', () => {
      test.cmp.hide();
      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBeTruthy();
    });

    it('calling "scrollToTop" should call "scrollToTop" on the ResultListUtils', () => {
      spyOn(ResultListUtils, 'scrollToTop');
      test.cmp.scrollToTop();

      expect(ResultListUtils.scrollToTop).toHaveBeenCalledWith(test.cmp.root);
    });

    describe('when there is no results', () => {
      const simulateNoResults = () => {
        const emptyCategoryFacetResults = FakeResults.createFakeCategoryFacetResult('@field', [], undefined, 0);
        simulateQueryData.results = { ...simulateQueryData.results, categoryFacets: [emptyCategoryFacetResults] };
        spyOn(test.cmp, 'hide');

        Simulate.query(test.env, simulateQueryData);
      };

      it('hides the component by default', () => {
        simulateNoResults();
        expect(test.cmp.hide).toHaveBeenCalled();
      });

      it('does not hide the component when the facet has available values', () => {
        test.cmp.activePath = ['value1'];
        spyOn(test.cmp, 'getAvailableValues').and.returnValue(['value1', 'value2']);
        simulateNoResults();
        expect(test.cmp.hide).not.toHaveBeenCalled();
      });

      describe(`when the facet does not have available values,
      when simulating no results`, () => {
        it(`does not call the query state model (doing so would prevent going back in history using the back button)`, () => {
          spyOn(test.cmp.queryStateModel, 'set');
          simulateNoResults();
          expect(test.cmp.queryStateModel.set).not.toHaveBeenCalled();
        });

        it('hides the component', () => {
          spyOn(test.cmp, 'getAvailableValues').and.returnValue([]);
          simulateNoResults();
          expect(test.cmp.hide).toHaveBeenCalled();
        });
      });
    });

    it('should correctly evaluate isCurrentlyDisplayed() when the facet is not in an active state, but has available values', () => {
      spyOn(test.cmp, 'getAvailableValues').and.returnValue(['value1']);
      test.cmp.activePath = [];
      expect(test.cmp.isCurrentlyDisplayed()).toBe(true);
    });

    it('should correctly evaluate isCurrentlyDisplayed() when the facet is not in an active state and has no available values', () => {
      spyOn(test.cmp, 'getAvailableValues').and.returnValue([]);
      test.cmp.activePath = [];
      expect(test.cmp.isCurrentlyDisplayed()).toBe(false);
    });

    describe('when categoryFacet is not implemented on the endpoint', () => {
      beforeEach(() => {
        const categoryFacetResults = FakeResults.createFakeCategoryFacetResult('@field', []);
        const fakeResults = FakeResults.createFakeResults();
        simulateQueryData = {
          ...simulateQueryData,
          results: { ...fakeResults, categoryFacets: [{ ...categoryFacetResults, notImplemented: true }] }
        };
      });

      it('disables the component', () => {
        Simulate.query(test.env, simulateQueryData);

        expect(test.cmp.disabled).toBe(true);
      });

      it('hides the component', () => {
        spyOn(test.cmp, 'hide');
        Simulate.query(test.env, simulateQueryData);
        expect(test.cmp.hide).toHaveBeenCalled();
      });
    });

    describe('calling changeActivePath', () => {
      let newPath: string[];
      beforeEach(() => {
        newPath = ['new', 'path'];
        spyOn(test.cmp.queryStateModel, 'set').and.callThrough();
        test.cmp.changeActivePath(newPath);
      });

      it('sets the new path', () => {
        expect(test.cmp.activePath).toEqual(['new', 'path']);
      });

      it('does not trigger a new query', () => {
        expect(test.cmp.queryController.executeQuery).not.toHaveBeenCalled();
      });

      it('sets the path in the query state', () => {
        expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(test.cmp.queryStateAttribute, newPath);
      });

      it('shows a wait animation', () => {
        test.cmp.executeQuery();
        const waitIcon = $$(test.cmp.element).find('.' + CategoryFacet.WAIT_ELEMENT_CLASS);
        expect(waitIcon.style.visibility).toEqual('visible');
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

      it('more arrow is appended when there are more results to fetch', () => {
        Simulate.query(test.env, simulateQueryData);
        const moreArrow = $$(test.cmp.element).find('.coveo-category-facet-more');
        expect(moreArrow).not.toBeNull();
      });

      it('less arrow is appended when there are more results than the numberOfValues option', () => {
        const numberOfValues = test.cmp.options.numberOfValues + 2; // +1 for the fetchMoreValues and +1 to trigger the less values
        Simulate.query(test.env, buildCategoryFacetResults(numberOfValues, numberOfValues));

        const downArrow = $$(test.cmp.element).find('.coveo-category-facet-less');
        expect(downArrow).not.toBeNull();
      });

      it('should not render the downward arrow when there are less values than the numberOfValues option', () => {
        test.cmp.changeActivePath(['path']);
        Simulate.query(test.env, buildCategoryFacetResults(3));

        const downArrow = $$(test.cmp.element).find('.coveo-category-facet-less');
        expect(downArrow).toBeNull();
      });

      it('showMore should increment the number of values requested according the the pageSize', () => {
        const initialNumberOfValues = test.cmp.options.numberOfValues;
        const pageSize = test.cmp.options.pageSize;
        Simulate.query(test.env, simulateQueryData);

        test.cmp.showMore();
        const { queryBuilder } = Simulate.query(test.env, simulateQueryData);

        expect(queryBuilder.categoryFacets[0].maximumNumberOfValues).toBe(initialNumberOfValues + pageSize + 1);
      });

      it('showLess should decrement the number of values requested according to the pageSize', () => {
        const pageSize = test.cmp.options.pageSize;
        const initialNumberOfValues = 20;
        test.cmp.showMore();
        simulateQueryData = buildCategoryFacetResults(21, 21);
        Simulate.query(test.env, simulateQueryData);

        test.cmp.showLess();
        const { queryBuilder } = Simulate.query(test.env, simulateQueryData);

        expect(queryBuilder.categoryFacets[0].maximumNumberOfValues).toBe(initialNumberOfValues - pageSize + 1);
      });

      it('showLess should not request less values than the numberOfValues option', () => {
        const initialNumberOfValues = test.cmp.options.numberOfValues;
        simulateQueryData = buildCategoryFacetResults(13, 13);
        Simulate.query(test.env, simulateQueryData);

        test.cmp.showLess();
        const { queryBuilder } = Simulate.query(test.env, simulateQueryData);

        expect(queryBuilder.categoryFacets[0].maximumNumberOfValues).toBe(initialNumberOfValues + 1);
      });

      it('showMore should log an analytics event when showing more results', () => {
        const expectedMetadata = jasmine.objectContaining({
          facetId: test.cmp.options.id,
          facetField: test.cmp.options.field.toString(),
          facetTitle: test.cmp.options.title
        });
        test.cmp.showMore();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.facetShowMore,
          expectedMetadata,
          test.cmp.element
        );
      });

      it('showLess should log an analytics event when showing less results', () => {
        const expectedMetadata = jasmine.objectContaining({
          facetId: test.cmp.options.id,
          facetField: test.cmp.options.field.toString(),
          facetTitle: test.cmp.options.title
        });
        test.cmp.showMore();
        test.cmp.showLess();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.facetShowLess,
          expectedMetadata,
          test.cmp.element
        );
      });
    });

    it('adds a facet search functionality by default', () => {
      Simulate.query(test.env, simulateQueryData);
      expect(test.cmp.categoryFacetSearch).toBeDefined();
      expect($$(test.cmp.element).find('.coveo-category-facet-search-container')).toBeDefined();
    });

    it('render properly when the facet search functionality is disabled', () => {
      test = Mock.optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        enableFacetSearch: false,
        field: '@someField'
      });

      Simulate.query(test.env, simulateQueryData);
      expect(test.cmp.categoryFacetSearch).toBeUndefined();
      expect($$(test.cmp.element).find('.coveo-category-facet-search-container')).toBeNull();
    });

    it('calls putCategoryFacetInQueryBuilder when building the query', () => {
      const queryBuilder = mock(QueryBuilder);
      const buildingQueryArgs = { queryBuilder } as IBuildingQueryEventArgs;
      test.cmp.categoryFacetQueryController = mock(CategoryFacetQueryController);
      const path = (test.cmp.activePath = ['some', 'path']);

      test.cmp.handleBuildingQuery(buildingQueryArgs);

      expect(test.cmp.categoryFacetQueryController.putCategoryFacetInQueryBuilder).toHaveBeenCalledWith(
        queryBuilder,
        path,
        test.cmp.options.numberOfValues + 1
      );
    });

    it(`when the #valueCaption option is an empty object,
    it displays the facet search box`, () => {
      test = Mock.optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        field: '@field',
        valueCaption: {}
      });

      expect(test.cmp.categoryFacetSearch).toBeTruthy();
    });

    describe(`when the #valueCaption option is defined`, () => {
      beforeEach(() => {
        test = Mock.optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
          field: '@field',
          valueCaption: { value: 'caption' }
        });
      });

      it(`does not render the facet search box`, () => {
        expect(test.cmp.categoryFacetSearch).toBe(undefined);
      });
    });

    describe('renders', () => {
      function removeAllCategoriesButton() {
        allCategoriesButton() && $$(allCategoriesButton()).detach();
      }

      function verifyParents(numberOfParents: number) {
        removeAllCategoriesButton();
        const parentCategoryValues = $$(test.cmp.element).findAll('.coveo-category-facet-parent-value');

        const expectedValues = ['0', '251', '502', '753', '1,004', '1,255', '1,506', '1,757', '2,008', '2,259'];
        for (const i of range(numberOfParents)) {
          const valueCaption = $$(parentCategoryValues[i]).find('.coveo-category-facet-value-caption');
          const valueCount = $$(parentCategoryValues[i]).find('.coveo-category-facet-value-count');
          expect($$(valueCaption).text()).toEqual(`parent${i}`);
          expect($$(valueCount).text()).toEqual(expectedValues[i]);
        }
      }

      function verifyChildren(numberOfValues: number) {
        removeAllCategoriesButton();
        const categoryValues = $$(test.cmp.element).findAll('.coveo-category-facet-child-value');
        for (const i of range(0, numberOfValues)) {
          const valueCaption = $$(categoryValues[i]).find('.coveo-category-facet-value-caption');
          const valueCount = $$(categoryValues[i]).find('.coveo-category-facet-value-count');
          expect($$(valueCaption).text()).toEqual(`value${i}`);
          expect($$(valueCount).text()).toEqual('5');
        }
      }

      function splitSelectableParents() {
        const parentValuesLabel = $$(test.cmp.element).findAll('.coveo-category-facet-parent-value label');
        return partition(parentValuesLabel, parentLabel => $$(parentLabel).hasClass('coveo-selectable'));
      }

      beforeEach(() => {
        Object.defineProperty(test.cmp, 'activePath', {
          get: () => simulateQueryData.query.categoryFacets[0].path
        });
      });

      it('when there are only children', () => {
        const numberOfValues = simulateQueryData.results.categoryFacets[0].values.length - 1; //-1 because we always request one more result
        simulateQueryData.query.categoryFacets[0].path = [];
        simulateQueryData.results.categoryFacets[0].parentValues = [];
        Simulate.query(test.env, simulateQueryData);

        verifyChildren(numberOfValues);
      });

      it('when there are only parents', () => {
        const numberOfParents = simulateQueryData.results.categoryFacets[0].parentValues.length - 1;
        simulateQueryData.results.categoryFacets[0].values = [];
        Simulate.query(test.env, simulateQueryData);

        verifyParents(numberOfParents);
      });

      it('when there are children and parents', () => {
        const numberOfValues = simulateQueryData.results.categoryFacets[0].values.length - 1;
        Simulate.query(test.env, simulateQueryData);
        verifyChildren(numberOfValues);
      });

      it('correctly sorts parents', () => {
        const numberOfParents = simulateQueryData.results.categoryFacets[0].parentValues.length - 1;
        simulateQueryData.results.categoryFacets[0].values = [];
        simulateQueryData.results.categoryFacets[0].parentValues = shuffle(simulateQueryData.results.categoryFacets[0].parentValues);

        Simulate.query(test.env, simulateQueryData);

        verifyParents(numberOfParents);
      });

      it('correct number of children when there are less results than what has been queried for', () => {
        // We usually render one less result than what we queried for, because the extra result queried is just a check.
        // This makes sure we don't do it when there are less results than we queries for.
        const numberOfRequestedValues = test.cmp.options.numberOfValues - 1;
        const numberOfReturnedValues = numberOfRequestedValues - 1;
        simulateQueryData = buildCategoryFacetResults(numberOfReturnedValues, numberOfRequestedValues);
        simulateQueryData.results.categoryFacets[0].parentValues = [];

        Simulate.query(test.env, simulateQueryData);

        removeAllCategoriesButton();
        expect($$(test.cmp.element).findAll('.coveo-category-facet-value').length).toEqual(numberOfReturnedValues);
      });

      it('appends an all categories button when there are parents', () => {
        Simulate.query(test.env, simulateQueryData);
        expect(allCategoriesButton()).not.toBeNull();
      });

      it('does not append an all categories button when there are no parents', () => {
        simulateQueryData.query.categoryFacets[0].path = [];
        Simulate.query(test.env, simulateQueryData);
        expect(allCategoriesButton()).toBeNull();
      });

      it('all categories button should call "scrollToTop" and "reset" when clicked', () => {
        Simulate.query(test.env, simulateQueryData);
        spyOn(test.cmp, 'scrollToTop');
        spyOn(test.cmp, 'reset');

        $$(allCategoriesButton()).trigger('click');
        expect(test.cmp.reset).toHaveBeenCalled();
        expect(test.cmp.scrollToTop).toHaveBeenCalled();
      });

      it('should make child values label selectable', () => {
        Simulate.query(test.env, simulateQueryData);
        const childValuesLabel = $$(test.cmp.element).findAll('.coveo-category-facet-child-value label');
        childValuesLabel.forEach(childValue => expect($$(childValue).hasClass('coveo-selectable')).toBe(true));
      });

      it('should make parent values label selectable except the current active filter', () => {
        Simulate.query(test.env, simulateQueryData);

        const [selectables, notSelectable] = splitSelectableParents();
        expect(notSelectable.length).toBe(1);

        const currentActiveFilterLabel = notSelectable[0];
        expect($$(currentActiveFilterLabel).text()).toContain(test.cmp.activeCategoryValue.categoryValueDescriptor.value);
        expect(selectables.length).toBeGreaterThan(1);
      });

      it('should add a collapsible arrow to all parent values except the current active filter', () => {
        Simulate.query(test.env, simulateQueryData);
        const [selectables, notSelectable] = splitSelectableParents();
        expect($$(notSelectable[0]).find('.coveo-category-facet-collapse-children')).toBeNull();
        selectables.forEach(selectable => expect($$(selectable).find('.coveo-category-facet-collapse-children')).toBeDefined());
      });
    });

    it('when default path is specified, sends the correct path in the query', () => {
      test = Mock.optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        field: '@field',
        basePath: ['base', 'path']
      });
      const { queryBuilder } = Simulate.query(test.env, simulateQueryData);
      expect(first(queryBuilder.categoryFacets[0].path, 2)).toEqual(['base', 'path']);
    });

    it('when default path is specified, exclude those values from the rendered values', () => {
      test = Mock.optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        field: '@field',
        basePath: ['parent0', 'parent1']
      });
      Simulate.query(test.env, simulateQueryData);

      const values = $$(test.cmp.element)
        .findAll('.coveo-category-facet-value-caption')
        .map(el => $$(el).text());
      expect(values).not.toContain('parent0');
      expect(values).not.toContain('parent1');
    });

    describe('when populating the breadcrumb', () => {
      const populateBreadcrumb = () => {
        Simulate.query(test.env, simulateQueryData);
        test.cmp.selectValue('value0');
        return Simulate.breadcrumb(test.env);
      };

      const getClearElement = () => {
        return $$(populateBreadcrumb()[0].element).find('.coveo-facet-breadcrumb-clear');
      };

      it('should populate the correct title', () => {
        test.cmp.options.title = 'My Category Facet';
        expect(populateBreadcrumb()[0].element.textContent).toContain('My Category Facet');
      });

      it('should populate the correct breadcrumb value', () => {
        expect(populateBreadcrumb()[0].element.textContent).toContain('parent0/parent1/parent2');
        expect(populateBreadcrumb()[0].element.textContent).toContain('/value0');
      });

      it('should populate the correct breadcrumb value if the facet is configured with a base path that points to the last parent', () => {
        const completeBasePathUntilLastParent = chain(range(0, 10)).map(val => `parent${val}`);

        test = Mock.advancedComponentSetup<CategoryFacet>(
          CategoryFacet,
          new Mock.AdvancedComponentSetupOptions(
            undefined,
            {
              field: '@field',
              basePath: completeBasePathUntilLastParent
            },
            env => env.withLiveQueryStateModel()
          )
        );

        const breadcrumbBuilt = populateBreadcrumb()[0];

        expect(breadcrumbBuilt.element.textContent).toContain('value0');
        // Also do a check on a leading /, to ensure the test is building the "right" full path hierarchy
        // If the base path is not "full", there would otherwise be a leading /
        expect(breadcrumbBuilt.element.textContent).not.toContain('/value0');
      });

      it('should clear the facet when the clear button is clicked', () => {
        $$(getClearElement()).trigger('click');
        expect(test.cmp.activePath).toEqual([]);
      });

      it('should log an analytics event when the clear button is clicked', () => {
        $$(getClearElement()).trigger('click');
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.breadcrumbFacet,
          jasmine.objectContaining({
            categoryFacetId: test.cmp.options.id,
            categoryFacetField: test.cmp.options.field,
            categoryFacetPath: jasmine.arrayContaining(['value0']),
            categoryFacetTitle: test.cmp.options.title
          })
        );
      });

      it('should clear the facet when the clearBreadcrumb event is triggered', () => {
        populateBreadcrumb();
        expect(test.cmp.activePath).not.toEqual([]);
        Simulate.clearBreadcrumb(test.env);
        expect(test.cmp.activePath).toEqual([]);
      });

      it('should not trigger a query when clearBreadcrumb event is triggered', () => {
        populateBreadcrumb();
        // Reset since it's called once inside "populateBreadcrumb()"
        (test.env.queryController.executeQuery as jasmine.Spy).calls.reset();

        Simulate.clearBreadcrumb(test.env);
        expect(test.env.queryController.executeQuery).not.toHaveBeenCalled();
      });
    });

    describe("when there's many parent values to display", () => {
      beforeEach(() => {
        simulateQueryData = buildCategoryFacetResults(30, 30);
        Simulate.query(test.env, simulateQueryData);
      });

      it('should only return the non-ellipsed values as visible', () => {
        const visibles = test.cmp.getVisibleParentValues();

        // NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING parents + 1 child value
        expect(visibles.length).toBe(CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING + 1);
      });

      it('should properly build the ellipse boundaries', () => {
        const visibles = test.cmp.getVisibleParentValues();
        const indexBeforeEllipse = CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING / 2 - 1;

        const firstValue = visibles[0].value;
        const beforeEllipse = visibles[indexBeforeEllipse].value;
        const afterEllipse = visibles[indexBeforeEllipse + 1].value;
        const lastParent = visibles[visibles.length - 2].value;
        const lastChild = visibles[visibles.length - 1].value;

        expect(firstValue).toContain('parent0');
        expect(beforeEllipse).toContain('parent4');
        expect(afterEllipse).toContain('parent25');
        expect(lastParent).toBe('parent29');
        expect(lastChild).toBe('value0');
      });

      it('should properly render an ellipse section', () => {
        const ellipsis = $$(test.cmp.element).find('.coveo-category-facet-ellipsis');
        expect(ellipsis).toBeDefined();
        expect(ellipsis.previousSibling.textContent).toContain('parent4');
        expect(ellipsis.nextSibling.textContent).toContain('parent25');
      });
    });
  });
}
