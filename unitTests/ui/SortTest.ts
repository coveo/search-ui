import { IQuerySuccessEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Sort } from '../../src/ui/Sort/Sort';
import { SortCriteria } from '../../src/ui/Sort/SortCriteria';
import { $$, Dom } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { l } from '../../src/strings/Strings';
import { Simulate } from '../Simulate';
import { KEYBOARD } from '../../src/utils/KeyboardUtils';

export function SortTest() {
  describe('Sort', function() {
    var test: Mock.IBasicComponentSetup<Sort>;

    const caption = 'foobarde';
    function buildSort(
      sortCriteria: string,
      queryStateModelValues?: { [attribute: string]: string },
      modifyBuilder?: (builder: Mock.MockEnvironmentBuilder) => Mock.MockEnvironmentBuilder
    ) {
      var elem: HTMLElement = document.createElement('div');
      elem.dataset['sortCriteria'] = sortCriteria;
      elem = Dom.createElement('div', {
        'data-sort-criteria': sortCriteria
      });
      return Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: elem,
        cmpOptions: { caption },
        modifyBuilder: builder => {
          if (queryStateModelValues) {
            (builder.queryStateModel.get as jasmine.Spy).and.callFake((attribute: string) => queryStateModelValues[attribute]);
          }
          return modifyBuilder ? modifyBuilder(builder) : builder;
        }
      });
    }

    beforeEach(function() {
      test = buildSort('date ascending');
    });

    afterEach(function() {
      test = null;
    });

    it('should build the correct criteria from its attribute', function() {
      expect(test.cmp.options.sortCriteria[0].sort).toEqual('date');
      expect(test.cmp.options.sortCriteria[0].direction).toEqual('ascending');
    });

    it('should build the correct field value from its attribute', function() {
      test = buildSort('@somefield ascending');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('@somefield ascending');
    });

    it("should trigger 'select' on click", function() {
      test = buildSort('relevancy');

      spyOn(test.cmp, 'select');

      test.env.element.click();
      expect(test.cmp.select).toHaveBeenCalled();
    });

    it("should trigger 'selectAndExecuteQuery' on click", function() {
      test = buildSort('relevancy');

      spyOn(test.cmp, 'selectAndExecuteQuery');

      test.env.element.click();
      expect(test.cmp.selectAndExecuteQuery).toHaveBeenCalled();
    });

    it("should set a 'hidden' CSS class when the results from a querySuccess are empty", function() {
      $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
        results: {
          results: []
        }
      });
      expect($$(test.cmp.element).hasClass('coveo-sort-hidden')).toBe(true);
    });

    it("should not set a 'hidden' CSS class when the results from a querySuccess are not empty", function() {
      $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
        results: {
          results: [{}, {}]
        }
      });
      expect($$(test.cmp.element).hasClass('coveo-sort-hidden')).toBe(false);
    });

    it("should set a 'hidden' CSS class when there is a query error", function() {
      $$(test.env.root).trigger(QueryEvents.queryError);
      expect($$(test.cmp.element).hasClass('coveo-sort-hidden')).toBe(true);
    });

    it('should be a radiogroup', () => {
      expect(test.cmp.element.getAttribute('role')).toEqual('radiogroup');
    });

    it('if an ancestor is a radiogroup, should not be a radiogroup', () => {
      test = buildSort('date ascending', {}, builder => {
        builder.root.setAttribute('role', 'radiogroup');
        return builder;
      });
      expect(test.cmp.element.getAttribute('role')).toBeNull();
    });

    it('should contain a single radio button', () => {
      expect(test.cmp.element.querySelectorAll('[role="radio"]').length).toEqual(1);
    });

    it('should give a label to its radio button', () => {
      expect(test.cmp.element.querySelector('[role="radio"]').getAttribute('aria-label')).toEqual(l('SortResultsBy', caption));
    });

    it('should not check its radio button', () => {
      expect(test.cmp.element.querySelector('[role="radio"]').getAttribute('aria-checked')).toEqual('false');
    });

    it('should check its radio button when active', () => {
      test = buildSort('date ascending', { sort: 'date ascending' });
      expect(test.cmp.element.querySelector('[role="radio"]').getAttribute('aria-checked')).toEqual('true');
    });

    describe('with a toggle', function() {
      beforeEach(function() {
        test = buildSort('date ascending,date descending');
      });

      it('should build the correct criteria on toggle from its attribute', function() {
        expect(test.cmp.options.sortCriteria[0].equals(new SortCriteria('date ascending'))).toBe(true);
        expect(test.cmp.options.sortCriteria[1].equals(new SortCriteria('date descending'))).toBe(true);
      });

      it('should toggle between its criterias when selected', function() {
        test.cmp.select();
        expect(test.cmp.getCurrentCriteria().toString()).toEqual('date ascending');
        test.cmp.select();
        expect(test.cmp.getCurrentCriteria().toString()).toEqual('date descending');
      });

      it('should set direction without toggling when selected with explicit direction', function() {
        test.cmp.select('descending');
        expect(test.cmp.getCurrentCriteria().direction).toEqual('descending');
      });

      it('should display an icon', function() {
        var icon = $$(test.env.element).find('.coveo-icon');
        expect(icon).toBeDefined();
      });

      describe('with a live queryStateModel', function() {
        function buildSort(sortCriteria: string) {
          var elem = document.createElement('div');
          elem.dataset['sortCriteria'] = sortCriteria;
          return Mock.advancedComponentSetup<Sort>(
            Sort,
            new Mock.AdvancedComponentSetupOptions(elem, { caption }, (builder: Mock.MockEnvironmentBuilder) => {
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

        beforeEach(function() {
          test = buildSort('date ascending,date descending');
        });

        it('should set itself as selected on the queryStateModel when selected', function() {
          test.cmp.select();
          expect(test.env.queryStateModel.get(QueryStateModel.attributesEnum.sort)).toBe('date ascending');
        });

        it('should add the correct relevancy sorting expression to the query', function() {
          test = buildSort('relevancy');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('relevancy');
        });

        it('should add the correct date sorting expression to the query', function() {
          test = buildSort('date ascending');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('date ascending');

          test = buildSort('date descending');
          test.cmp.select();
          queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('date descending');
        });

        it('should add the correct qre sorting expression to the query', function() {
          test = buildSort('qre');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('qre');
        });

        it('should add the correct field sorting expression to the query', function() {
          test = buildSort('@field ascending');
          test.cmp.select();
          var queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('@field ascending');

          test = buildSort('@field descending');
          test.cmp.select();
          queryBuilder = fireBuildingQuery(test.env.root);
          expect(queryBuilder.sortCriteria).toEqual('@field descending');
        });

        describe('with radio buttons', () => {
          let radioButtons: HTMLElement[];
          function getRadioButtonsState(attribute = 'aria-checked') {
            return radioButtons.map(radio => radio.getAttribute(attribute));
          }

          function updateRadioButtons() {
            radioButtons = $$(test.cmp.element).findAll('[role="radio"]');
          }

          beforeEach(() => {
            updateRadioButtons();
          });

          it('should contain two radio buttons', () => {
            expect(radioButtons.length).toEqual(2);
          });

          it('should set as aria-controls the list of result list components ids', () => {
            (test.cmp.searchInterface.getComponents as jasmine.Spy).and.callFake(cmp => {
              if (cmp === 'ResultList') {
                return [{ element: $$('div', { id: 'id1' }).el }, { element: $$('div', { id: 'id2' }).el }];
              }
              return [];
            });
            test.cmp.createDom();
            updateRadioButtons();
            expect(getRadioButtonsState('aria-controls')).toEqual(['id1 id2', 'id1 id2']);
          });

          it('should give labels to its radio buttons', () => {
            expect(getRadioButtonsState('aria-label')).toEqual([
              l('SortResultsByAscending', caption),
              l('SortResultsByDescending', caption)
            ]);
          });

          it('should not change the labels of radio buttons when selecting them', () => {
            test.cmp.select();
            expect(getRadioButtonsState('aria-label')).toEqual([
              l('SortResultsByAscending', caption),
              l('SortResultsByDescending', caption)
            ]);
            test.cmp.select();
            expect(getRadioButtonsState('aria-label')).toEqual([
              l('SortResultsByAscending', caption),
              l('SortResultsByDescending', caption)
            ]);
          });

          it('should not check its radio buttons', () => {
            expect(getRadioButtonsState()).toEqual(['false', 'false']);
          });

          it('should check only the first radio button if the first criteria is used', () => {
            test.cmp.select('ascending');
            expect(getRadioButtonsState()).toEqual(['true', 'false']);
          });

          it('should check only the second radio button if the second criteria is used', () => {
            test.cmp.select('descending');
            expect(getRadioButtonsState()).toEqual(['false', 'true']);
          });

          it('should only check the first radio button when clicking it', () => {
            radioButtons[0].click();
            expect(getRadioButtonsState()).toEqual(['true', 'false']);
          });

          it('should only check the second radio button when clicking it', () => {
            radioButtons[1].click();
            expect(getRadioButtonsState()).toEqual(['false', 'true']);
          });

          it('should set the sort criteria to the first criteria when clicking the first radio button', () => {
            radioButtons[0].click();
            const queryBuilder = fireBuildingQuery(test.env.root);
            expect(queryBuilder.sortCriteria).toEqual('date ascending');
          });

          it('should set the sort criteria to the second criteria when clicking the second radio button', () => {
            radioButtons[1].click();
            const queryBuilder = fireBuildingQuery(test.env.root);
            expect(queryBuilder.sortCriteria).toEqual('date descending');
          });

          it('should select the first radio button when pressing the right arrow key', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.RIGHT_ARROW);
            expect(getRadioButtonsState()).toEqual(['true', 'false']);
          });

          it('should select the first radio button when pressing the down arrow key', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            expect(getRadioButtonsState()).toEqual(['true', 'false']);
          });

          it('should select the first radio button when pressing the left arrow key twice', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.LEFT_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.LEFT_ARROW);
            expect(getRadioButtonsState()).toEqual(['true', 'false']);
          });

          it('should select the first radio button when pressing the up arrow key twice', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            expect(getRadioButtonsState()).toEqual(['true', 'false']);
          });

          it('should select the last radio button when pressing the left arrow key', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.LEFT_ARROW);
            expect(getRadioButtonsState()).toEqual(['false', 'true']);
          });

          it('should select the last radio button when pressing the up arrow key', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            expect(getRadioButtonsState()).toEqual(['false', 'true']);
          });

          it('should select the last radio button when pressing the right arrow key twice', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.RIGHT_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.RIGHT_ARROW);
            expect(getRadioButtonsState()).toEqual(['false', 'true']);
          });

          it('should select the last radio button when pressing the down arrow key twice', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            expect(getRadioButtonsState()).toEqual(['false', 'true']);
          });

          it("shouldn't change the labels of the radio buttons when selecting the first select button", () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            expect(getRadioButtonsState('aria-label')).toEqual([
              l('SortResultsByAscending', caption),
              l('SortResultsByDescending', caption)
            ]);
          });

          it("shouldn't change the labels of the radio buttons when selecting the last select button", () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            expect(getRadioButtonsState('aria-label')).toEqual([
              l('SortResultsByAscending', caption),
              l('SortResultsByDescending', caption)
            ]);
          });

          it('should focus the first radio button when selecting the first radio button', () => {
            const focus = spyOn(radioButtons[0], 'focus');
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            expect(focus).not.toHaveBeenCalled();
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            expect(focus).toHaveBeenCalledTimes(1);
          });

          it('should focus the last radio button when selecting the last radio button', () => {
            const focus = spyOn(radioButtons[1], 'focus');
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            expect(focus).not.toHaveBeenCalled();
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            expect(focus).toHaveBeenCalledTimes(1);
          });

          it('should set the sort criteria to the first criteria when selecting the first radio button', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.UP_ARROW);
            const queryBuilder = fireBuildingQuery(test.env.root);
            expect(queryBuilder.sortCriteria).toEqual('date ascending');
          });

          it('should set the sort criteria to the second criteria when selecting the second radio button', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            Simulate.keyUp(radioButtons[0], KEYBOARD.DOWN_ARROW);
            const queryBuilder = fireBuildingQuery(test.env.root);
            expect(queryBuilder.sortCriteria).toEqual('date descending');
          });

          it('should set the sort criteria to the first criteria when pressing space on the first radio button', () => {
            Simulate.keyUp(radioButtons[0], KEYBOARD.SPACEBAR);
            const queryBuilder = fireBuildingQuery(test.env.root);
            expect(queryBuilder.sortCriteria).toEqual('date ascending');
          });

          it('should set the sort criteria to the second criteria when pressing space on the second radio button', () => {
            Simulate.keyUp(radioButtons[1], KEYBOARD.SPACEBAR);
            const queryBuilder = fireBuildingQuery(test.env.root);
            expect(queryBuilder.sortCriteria).toEqual('date descending');
          });

          describe('in the DOM', () => {
            beforeEach(() => {
              document.body.appendChild(test.env.root);
            });

            afterEach(() => {
              test.env.root.remove();
            });

            it("shouldn't set the sort criteria when focusing on the first radio button", () => {
              radioButtons[0].focus();
              const queryBuilder = fireBuildingQuery(test.env.root);
              expect(queryBuilder.sortCriteria).toEqual('relevancy');
            });

            it("shouldn't set the sort criteria when focusing on the second radio button", () => {
              radioButtons[1].focus();
              const queryBuilder = fireBuildingQuery(test.env.root);
              expect(queryBuilder.sortCriteria).toEqual('relevancy');
            });
          });
        });
      });
    });

    it('should only accept a valid sort criteria', function() {
      expect(() => buildSort('invalidname')).toThrow();
      expect(() => buildSort('relevancy,failingmiserably')).toThrow();
    });

    it('should only accept a valid sort direction', function() {
      expect(() => buildSort('date in-order-of-failure')).toThrow();
    });

    it('should require at least one sort criteria to properly initialize', function() {
      expect(() => new Sort(document.createElement('div'))).toThrow();
    });

    it('should validate if a direction is present when sorting a date or a field', function() {
      expect(() => buildSort('date')).toThrow();
      expect(() => buildSort('@field-of-failure')).toThrow();
    });

    it("should validate that there is no direction on any other criteria than 'date' or a field", function() {
      expect(() => buildSort('bogus-criteria ascending')).toThrow();
      expect(() => buildSort('relevancy ascending')).toThrow();
      expect(() => buildSort('date ascending')).not.toThrow();
      expect(() => buildSort('@field descending')).not.toThrow();
    });

    it('should use data-caption as a body if no body is specified', function() {
      test = Mock.advancedComponentSetup<Sort>(Sort, <Mock.AdvancedComponentSetupOptions>{
        element: $$('div', {
          'data-sort-criteria': 'relevancy',
          'data-caption': 'foo'
        }).el
      });
      expect(test.env.element.innerText).toEqual('foo');
    });

    it('should override the body with data-caption if both are defined', function() {
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

    it('should remove unnecessary spaces between sort and direction', function() {
      test = buildSort('date            ascending');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('date ascending');
    });

    it('should remove unnecessary spaces before sort criteria', function() {
      test = buildSort('           date descending');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('date descending');
    });

    it('should remove unnecessary spaces after sort criteria', function() {
      test = buildSort('date ascending             ');
      expect(test.cmp.options.sortCriteria[0].toString()).toEqual('date ascending');
    });

    it('should remove unnecessary spaces between multiple sort criterias', function() {
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
