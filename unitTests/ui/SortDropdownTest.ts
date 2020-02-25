import { IQuerySuccessEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { QUERY_STATE_ATTRIBUTES } from '../../src/models/QueryStateModel';
import { SortDropdown } from '../../src/ui/SortDropdown/SortDropdown';
import { Sort } from '../../src/ui/Sort/Sort';
import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';

export function SortDropdownTest() {
  describe('SortDropdown', function() {
    let sorts: Sort[];
    var test: Mock.IBasicComponentSetup<SortDropdown>;

    function createFakeSort(sortCriteria: string, caption: string) {
      const container = $$('div', {
        'data-sort-criteria': sortCriteria,
        'data-caption': caption
      });

      return Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: container.el
      });
    }

    function initializeSorts() {
      sorts = [createFakeSort('date ascending', 'Newest').cmp, createFakeSort('relevancy', 'Relevancy').cmp];
    }

    function initializeSortDropdown() {
      test = Mock.advancedComponentSetup<SortDropdown>(SortDropdown, <Mock.AdvancedComponentSetupOptions>{
        cmpOptions: {},
        modifyBuilder: builder => {
          sorts.forEach(sort => builder.element.appendChild(sort.element));
          return builder.withLiveQueryStateModel();
        }
      });
    }

    function triggerAfterComponentsInitialization() {
      sorts.forEach(sort => {
        Simulate.initialization(sort.getBindings() as Mock.IMockEnvironment);
      });

      Simulate.initialization(test.env);
    }

    function triggerQuerySuccessWithResults(results: any[]) {
      $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
        results: {
          results
        }
      });
    }

    function findSelect() {
      return $$(test.cmp.element).find('select');
    }

    beforeEach(() => {
      initializeSorts();
      initializeSortDropdown();
      triggerAfterComponentsInitialization();
    });

    afterEach(function() {
      test = null;
      sorts = [];
    });

    it('should create a select element after initialization', () => {
      expect($$(test.cmp.element).find('select')).toBeTruthy();
    });

    it('should create same number of select options when all sort components are valid, ', () => {
      expect($$(test.cmp.element).findAll('select > option').length).toEqual(sorts.length);
    });

    it('should not create an option if the sort criteria is a toggle and warn the user', () => {
      sorts.push(createFakeSort('@date ascending,@date descending', 'foobar').cmp);
      initializeSortDropdown();
      spyOn(test.cmp.logger, 'warn');
      triggerAfterComponentsInitialization();

      expect($$(test.cmp.element).findAll('select > option').length).toEqual(sorts.length - 1);
      expect(test.cmp.logger.warn).toHaveBeenCalled();
    });

    it('should be visible when there are results', function() {
      triggerQuerySuccessWithResults([{}, {}]);

      expect($$(test.cmp.element).isVisible()).toBe(true);
    });

    it('should not be visible when there are no results', function() {
      triggerQuerySuccessWithResults([]);

      expect($$(test.cmp.element).isVisible()).toBe(false);
    });

    it('should not be visible when there is a query error', function() {
      $$(test.env.root).trigger(QueryEvents.queryError);
      expect($$(test.cmp.element).isVisible()).toBe(false);
    });

    it('should update the select element when the query state changes', function() {
      const selectElement = <HTMLSelectElement>findSelect();

      test.env.queryStateModel.set(QUERY_STATE_ATTRIBUTES.SORT, 'relevancy');
      expect(selectElement.value).toEqual('relevancy');

      test.env.queryStateModel.set(QUERY_STATE_ATTRIBUTES.SORT, 'date ascending');
      expect(selectElement.value).toEqual('date ascending');
    });

    it('should add a selected class if an option is active', function() {
      test.env.queryStateModel.set(QUERY_STATE_ATTRIBUTES.SORT, 'relevancy');

      expect($$(findSelect()).hasClass('coveo-selected')).toBe(true);
    });

    it('should not add a selected class if an option does not exist', function() {
      test.env.queryStateModel.set(QUERY_STATE_ATTRIBUTES.SORT, '@fieldy');

      expect($$(findSelect()).hasClass('coveo-selected')).toBe(false);
    });

    it('should change the value of the element on select', function() {
      const selectElement = <HTMLSelectElement>findSelect();
      test.cmp.select('relevancy', true);

      expect(selectElement.value).toBe('relevancy');
    });

    it('should not change the value of the element if an option doesnt exist select', function() {
      const selectElement = <HTMLSelectElement>findSelect();
      const prevValue = selectElement.value;
      test.cmp.select('@aField', true);

      expect(selectElement.value).toBe(prevValue);
    });

    it(`when adding tab attributes
    should remove them`, () => {
      test = Mock.advancedComponentSetup<SortDropdown>(SortDropdown, <Mock.AdvancedComponentSetupOptions>{
        cmpOptions: {},
        modifyBuilder: builder => {
          builder.element.setAttribute('data-tab', 'allo');
          builder.element.setAttribute('data-tab-not', 'bye');
          return builder.withLiveQueryStateModel();
        }
      });

      expect(test.cmp.element.hasAttribute('data-tab')).toBe(false);
      expect(test.cmp.element.hasAttribute('data-tab-not')).toBe(false);
    });

    it(`when disabling a Sort component
      should hide it's corresponding option`, () => {
      sorts[0].disable();
      triggerQuerySuccessWithResults([{}, {}]);

      const hiddenSort = $$(test.cmp.element).find(`option[hidden][value="${sorts[0].options.sortCriteria}"]`);
      expect(hiddenSort).toBeTruthy();
    });

    it(`when re-enabling a Sort component
      should show it's corresponding option`, () => {
      sorts[0].disable();
      sorts[0].enable();
      triggerQuerySuccessWithResults([{}, {}]);

      const hiddenSort = $$(test.cmp.element).find(`option[hidden][value="${sorts[0].options.sortCriteria}"]`);
      expect(hiddenSort).toBeFalsy();
    });
  });
}
