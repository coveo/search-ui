import { IQuerySuccessEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Sort } from '../../src/ui/Sort/Sort';
import { SortCriteria } from '../../src/ui/Sort/SortCriteria';
import { $$, Dom } from '../../src/utils/Dom';
import { Mock } from '../../testsFramework/TestsFramework';

export function SortTest() {
  describe('Sort', () => {
    let test: Mock.IBasicComponentSetup<Sort>;

    function buildSort(sortCriteria: string) {
      var elem: HTMLElement = document.createElement('div');
      elem.dataset['sortCriteria'] = sortCriteria;
      elem = Dom.createElement('div', {
        'data-sort-criteria': sortCriteria
      });
      return Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: elem,
        cmpOptions: { caption: 'foobarde' }
      });
    }

    beforeEach(() => {
      test = buildSort('date ascending');
    });

    afterEach(() => {
      test = null;
    });

    it('should build the correct criteria from its attribute', () => {
      expect(test.cmp.options.sortCriteria[0].sort).toEqual('date');
      expect(test.cmp.options.sortCriteria[0].direction).toEqual('ascending');
    });

    it('should build the correct field value from its attribute', () => {
      test = buildSort('@somefield ascending');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('@somefield ascending');
    });

    it("should trigger 'select' on click", () => {
      test = buildSort('relevancy');

      spyOn(test.cmp, 'select');

      test.env.element.click();
      expect(test.cmp.select).toHaveBeenCalled();
    });

    it("should set a 'hidden' CSS class when the results from a querySuccess are empty", () => {
      $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
        results: {
          results: []
        }
      });
      expect($$(test.cmp.element).hasClass('coveo-sort-hidden')).toBe(true);
    });

    it("should not set a 'hidden' CSS class when the results from a querySuccess are not empty", () => {
      $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
        results: {
          results: [{}, {}]
        }
      });
      expect($$(test.cmp.element).hasClass('coveo-sort-hidden')).toBe(false);
    });

    it("should set a 'hidden' CSS class when there is a query error", () => {
      $$(test.env.root).trigger(QueryEvents.queryError);
      expect($$(test.cmp.element).hasClass('coveo-sort-hidden')).toBe(true);
    });

    describe('with a toggle', () => {
      beforeEach(() => {
        test = buildSort('date ascending,date descending');
      });

      it('should build the correct criteria on toggle from its attribute', () => {
        expect(test.cmp.options.sortCriteria[0].equals(new SortCriteria('date ascending'))).toBe(true);
        expect(test.cmp.options.sortCriteria[1].equals(new SortCriteria('date descending'))).toBe(true);
      });

      it('should toggle between its criterias when selected', () => {
        test.cmp.select();
        expect(test.cmp.getCurrentCriteria().toString()).toEqual('date ascending');
        test.cmp.select();
        expect(test.cmp.getCurrentCriteria().toString()).toEqual('date descending');
      });

      it('should set direction without toggling when selected with explicit direction', () => {
        test.cmp.select('descending');
        expect(test.cmp.getCurrentCriteria().direction).toEqual('descending');
      });

      it('should display an icon', () => {
        var icon = $$(test.env.element).find('.coveo-icon');
        expect($$(icon).nodeListToArray.length).toBeGreaterThan(0);
      });

      describe('with a live queryStateModel', () => {
        function buildSort(sortCriteria: string) {
          var elem = document.createElement('div');
          elem.dataset['sortCriteria'] = sortCriteria;
          return Mock.advancedComponentSetup<Sort>(
            Sort,
            new Mock.AdvancedComponentSetupOptions(elem, { caption: 'foobarde' }, (builder: Mock.MockEnvironmentBuilder) => {
              return builder.withLiveQueryStateModel();
            })
          );
        }

        function fireBuildingQuery(elem: HTMLElement, queryBuilder?: QueryBuilder): QueryBuilder {
          queryBuilder = queryBuilder || new QueryBuilder();

          $$(elem).trigger(QueryEvents.buildingQuery, {
            queryBuilder: queryBuilder
          });
          $$(elem).trigger(QueryEvents.doneBuildingQuery, {
            queryBuilder: queryBuilder
          });

          return queryBuilder;
        }

        beforeEach(() => {
          test = buildSort('date ascending,date descending');
        });

        it('should set itself as selected on the queryStateModel when selected', () => {
          test.cmp.select();
          expect(test.env.queryStateModel.get(QueryStateModel.attributesEnum.sort)).toBe('date ascending');
        });

        it('should add the correct relevancy sorting expression to the query', () => {
          test = buildSort('relevancy');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('relevancy');
        });

        it('should add the correct date sorting expression to the query', () => {
          test = buildSort('date ascending');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('date ascending');

          test = buildSort('date descending');
          test.cmp.select();
          queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('date descending');
        });

        it('should add the correct qre sorting expression to the query', () => {
          test = buildSort('qre');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('qre');
        });

        it('should add the correct field sorting expression to the query', () => {
          test = buildSort('@field ascending');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('@field ascending');

          test = buildSort('@field descending');
          test.cmp.select();
          queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('@field descending');
        });
      });
    });

    it('should only accept a valid sort criteria', () => {
      expect(() => buildSort('invalidname')).toThrow();
      expect(() => buildSort('relevancy,failingmiserably')).toThrow();
    });

    it('should only accept a valid sort direction', () => {
      expect(() => buildSort('date in-order-of-failure')).toThrow();
    });

    it('should require at least one sort criteria to properly initialize', () => {
      expect(() => new Sort(document.createElement('div'))).toThrow();
    });

    it('should validate if a direction is present when sorting a date or a field', () => {
      expect(() => buildSort('date')).toThrow();
      expect(() => buildSort('@field-of-failure')).toThrow();
    });

    it("should validate that there is no direction on any other criteria than 'date' or a field", () => {
      expect(() => buildSort('bogus-criteria ascending')).toThrow();
      expect(() => buildSort('relevancy ascending')).toThrow();
      expect(() => buildSort('date ascending')).not.toThrow();
      expect(() => buildSort('@field descending')).not.toThrow();
    });

    it('should use data-caption as a body if no body is specified', () => {
      test = Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: $$('div', {
          'data-sort-criteria': 'relevancy',
          'data-caption': 'foo'
        }).el
      });
      expect(test.env.element.innerText).toEqual('foo');
    });

    it('should override the body with data-caption if both are defined', () => {
      test = Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: Dom.createElement(
          'div',
          {
            'data-sort-criteria': 'relevancy',
            'data-caption': 'overrider'
          },
          'gettingreplaced'
        )
      });
      expect(test.env.element.innerText).toEqual('overrider');
    });

    it('should use the body if the data-caption is not defined', () => {
      test = Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: Dom.createElement(
          'div',
          {
            'data-sort-criteria': 'relevancy'
          },
          'notgettingreplaced'
        )
      });
      expect(test.env.element.innerText).toEqual('notgettingreplaced');
    });

    it('should remove unnecessary spaces between sort and direction', () => {
      test = buildSort('date            ascending');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('date ascending');
    });

    it('should remove unnecessary spaces before sort criteria', () => {
      test = buildSort('           date descending');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('date descending');
    });

    it('should remove unnecessary spaces after sort criteria', () => {
      test = buildSort('date ascending             ');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('date ascending');
    });

    it('should remove unnecessary spaces between multiple sort criterias', () => {
      test = buildSort('date descending   ,    date ascending');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('date descending');
      expect(test.cmp.options.sortCriteria[1].toString()).toEqual('date ascending');
    });

    it('should update when enabled', () => {
      test = buildSort('date descending, date ascending');
      (<jasmine.Spy>test.env.queryStateModel.get).and.returnValue('date descending');

      test.cmp.select('ascending');
      expect(test.cmp.getCurrentCriteria().toString()).toEqual('date ascending');

      test.cmp.enable();

      expect(test.cmp.getCurrentCriteria().toString()).toEqual('date descending');
    });

    it('should update on first creation', () => {
      const elem = $$('div', { 'data-sort-criteria': 'date descending, date ascending' }).el;
      test = Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: elem,
        modifyBuilder: builder => {
          (<jasmine.Spy>builder.queryStateModel.get).and.returnValue('date ascending');
          return builder;
        }
      });
      expect(test.cmp.getCurrentCriteria().toString()).toEqual('date ascending');
    });
  });
}
