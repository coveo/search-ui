import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../src/events/BreadcrumbEvents';
import { QueryEvents } from '../../src/events/QueryEvents';
import { Defer } from '../../src/misc/Defer';
import { FacetSlider, IFacetSliderOptions } from '../../src/ui/FacetSlider/FacetSlider';
import { Slider } from '../../src/ui/Misc/Slider';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';

export function FacetSliderTest() {
  describe('FacetSlider', () => {
    let test: Mock.IBasicComponentSetup<FacetSlider>;
    let facetSliderOptions: IFacetSliderOptions;

    beforeEach(() => {
      Simulate.removeJQuery();
      facetSliderOptions = { start: 0, end: 100, field: '@foo' };
      test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, facetSliderOptions);
      (<jasmine.Spy>test.env.queryStateModel.get).and.returnValue([0, 100]);
      (<jasmine.Spy>test.env.queryStateModel.getDefault).and.returnValue([0, 100]);
    });

    afterEach(() => {
      test = null;
    });

    it('should be currentlyDisplayed by default', () => {
      expect(test.cmp.isCurrentlyDisplayed()).toBeTruthy();
    });

    it('should not be currentlyDisplayed if display:none', () => {
      test.cmp.element.style.display = 'none';
      expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
    });

    it('should not be currentlyDisplayed if visibility:hidden', () => {
      test.cmp.element.style.visibility = 'hidden';
      expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
    });

    it('should not be currentlyDisplayed if disabled by a tab', () => {
      test.cmp.element.className = 'coveo-tab-disabled';
      expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
    });

    it('should not be currentlyDisplayed if it is empty', () => {
      test.cmp.element.className = 'coveo-disabled-empty';
      expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
    });

    it("should not add a query expression if the slider is in it's default state", () => {
      test.cmp.setSelectedValues([0, 100]);
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBeUndefined();
    });

    it("should add a query expression if the slider is not in it's default state", () => {
      test.cmp.setSelectedValues([5, 25]);
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBe('@foo==5..25');
    });

    it('should request a group by', () => {
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().groupBy).toEqual(
        jasmine.arrayContaining([
          jasmine.objectContaining({
            field: '@foo',
            generateAutomaticRanges: false
          })
        ])
      );
    });

    describe('when deciding if the facet is empty', () => {
      const isConsideredEmpty = () => {
        return $$(test.cmp.element).hasClass('coveo-disabled-empty');
      };

      it('should not be considered empty if a single value is returned with a count different than 0', () => {
        const groupByResults = [
          {
            field: '@foo',
            values: [FakeResults.createFakeGroupByRangeValue(0, 10, 'foo', 1)]
          }
        ];

        Simulate.query(test.env, {
          groupByResults
        });
        expect(isConsideredEmpty()).toBe(false);
      });

      it('should be considered empty if there is no group by results', () => {
        const groupByResults = [];

        Simulate.query(test.env, {
          groupByResults
        });

        expect(isConsideredEmpty()).toBe(true);
      });

      it('should be considered empty if a single value is returned with a count of 0', () => {
        const groupByResults = [
          {
            field: '@foo',
            values: [FakeResults.createFakeGroupByRangeValue(0, 10, 'foo', 0)]
          }
        ];

        Simulate.query(test.env, {
          groupByResults
        });
        expect(isConsideredEmpty()).toBe(true);
      });

      it('should be considered empty if a multiple values have a count of 0', () => {
        const groupByResults = [
          {
            field: '@foo',
            values: [
              FakeResults.createFakeGroupByRangeValue(0, 10, 'foo', 0),
              FakeResults.createFakeGroupByRangeValue(10, 20, 'foo2', 0),
              FakeResults.createFakeGroupByRangeValue(30, 40, 'foo3', 0)
            ]
          }
        ];

        Simulate.query(test.env, {
          groupByResults
        });

        expect(isConsideredEmpty()).toBe(true);
      });

      it('should not be considered empty if at least one value out of multiple has a count different than 0', () => {
        const groupByResults = [
          {
            field: '@foo',
            values: [
              FakeResults.createFakeGroupByRangeValue(0, 10, 'foo', 0),
              FakeResults.createFakeGroupByRangeValue(10, 20, 'foo2', 0),
              FakeResults.createFakeGroupByRangeValue(30, 40, 'foo3', 1)
            ]
          }
        ];

        Simulate.query(test.env, {
          groupByResults
        });
        expect(isConsideredEmpty()).toBe(false);
      });
    });

    it("should return the correct selected values after a query, which is it's options", () => {
      Simulate.query(test.env);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([0, 100]));
    });

    it('should return undefined values if there has not been a query yet', () => {
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([undefined, undefined]));
    });

    it('should return selected values from the query state if available', () => {
      let spy: jasmine.Spy = jasmine.createSpy('rangeState');
      spy.and.returnValue([60, 75]);
      test.env.queryStateModel.get = spy;
      Simulate.query(test.env);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([60, 75]));
    });

    it('should populate breadcrumb only if not in default state', () => {
      let breadcrumbs = [];
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, <IPopulateBreadcrumbEventArgs>{ breadcrumbs: breadcrumbs });
      expect(breadcrumbs.length).toBe(0);

      breadcrumbs = [];
      test.cmp.setSelectedValues([50, 60]);
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, <IPopulateBreadcrumbEventArgs>{ breadcrumbs: breadcrumbs });
      expect(breadcrumbs.length).toBe(1);
    });

    it('should be disabled if the query results is not a range response', () => {
      let disableSpy = jasmine.createSpy('spy');
      test.cmp.disable = disableSpy;
      let correctGroupByValue = FakeResults.createFakeGroupByRangeValue(0, 100, 'foo', 5);
      let correctGroupBy = FakeResults.createFakeGroupByResult('@foo', 'foo', 10);
      correctGroupBy.values = [correctGroupByValue];
      Simulate.query(test.env, {
        groupByResults: [correctGroupBy]
      });
      expect(test.cmp.disable).not.toHaveBeenCalled();

      let badGroupByValue = FakeResults.createFakeGroupByValue('foo', 5);
      let badGroupBy = FakeResults.createFakeGroupByResult('@foo', 'foo', 10);
      badGroupBy.values = [badGroupByValue];
      Simulate.query(test.env, {
        groupByResults: [badGroupBy]
      });

      expect(test.cmp.disable).toHaveBeenCalled();
    });

    describe('draws the graph', () => {
      let slider: Slider;
      let mockEnvironmentBuilder: Mock.MockEnvironmentBuilder;
      let env: Mock.IMockEnvironment;
      let facetSlider: FacetSlider;

      beforeEach(() => {
        slider = jasmine.createSpyObj('slider', ['drawGraph', 'onMoving']);
        mockEnvironmentBuilder = new Mock.MockEnvironmentBuilder();
        env = mockEnvironmentBuilder.build();
      });

      describe('on resize', () => {
        beforeEach(() => {
          facetSlider = new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);
        });

        it('should draw the graph on resize when there are results', done => {
          facetSlider.onResize(new Event('resize'));

          setTimeout(() => {
            expect(slider.drawGraph).toHaveBeenCalled();
            done();
          }, FacetSlider.DEBOUNCED_RESIZE_DELAY);
        });

        it('should execute the onMoving function of the slider on resize', done => {
          facetSlider.onResize(new Event('resize'));

          setTimeout(() => {
            expect(slider.onMoving).toHaveBeenCalled();
            done();
          }, FacetSlider.DEBOUNCED_RESIZE_DELAY);
        });

        it('should not execute the onMoving function of the slider if it is not instantiated', done => {
          facetSlider['slider'] = null;
          facetSlider.onResize(new Event('resize'));

          setTimeout(() => {
            expect(slider.onMoving).not.toHaveBeenCalled();
            done();
          }, FacetSlider.DEBOUNCED_RESIZE_DELAY);
        });

        it('should not draw the graph on resize when there are no results', done => {
          $$(env.root).trigger(QueryEvents.noResults);
          facetSlider.onResize(new Event('resize'));

          setTimeout(() => {
            expect(slider.drawGraph).not.toHaveBeenCalled();
            done();
          }, FacetSlider.DEBOUNCED_RESIZE_DELAY);
        });
      });

      it('should draw the graph when draw delayed graph data is called', done => {
        const fakeResults = createFacetSliderGraphGroupByResults();
        $$(env.element).addClass('coveo-facet-column');

        facetSliderOptions = { start: 0, end: 100, field: '@bar', graph: { steps: 4 } };
        facetSlider = new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);

        hideFacetColumn(env);

        // wait until delayed graph data has been saved
        $$(env.root).on(QueryEvents.deferredQuerySuccess, () => {
          showFacetColumn(env);
          facetSlider.drawDelayedGraphData();
          expect(slider.drawGraph).toHaveBeenCalled();
          done();
        });
        Simulate.query(env, { results: fakeResults });
      });

      it('should not draw the graph when draw delayed graph data is called and there is no results', done => {
        let fakeResults = createFacetSliderGraphGroupByResults();
        $$(env.element).addClass('coveo-facet-column');

        facetSliderOptions = { start: 0, end: 100, field: '@bar', graph: { steps: 4 } };
        facetSlider = new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);

        hideFacetColumn(env);

        Simulate.query(env, { results: fakeResults });
        // wait until delayed graph data has been saved and no results event has been fired
        $$(env.root).on(QueryEvents.noResults, () => {
          showFacetColumn(env);
          facetSlider.drawDelayedGraphData();
          expect(slider.drawGraph).not.toHaveBeenCalled();
          done();
        });
        $$(env.root).trigger(QueryEvents.noResults);
      });

      it('should draw the graph when a popup is opened', done => {
        $$(env.element).addClass('coveo-facet-column');
        new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);
        showFacetColumn(env);

        $$(env.root).trigger('onPopupOpen');
        setTimeout(() => {
          expect(slider.drawGraph).toHaveBeenCalled();
          done();
        }, FacetSlider.DEBOUNCED_RESIZE_DELAY + 1);
      });

      it('should draw the graph when there are no group by results returned', done => {
        let fakeResults = createFacetSliderGraphGroupByResults();
        // Remove group by results
        fakeResults.groupByResults[0].values = [];
        facetSliderOptions = { start: 0, end: 100, field: '@bar', graph: { steps: 4 } };

        new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);

        $$(env.root).on(QueryEvents.deferredQuerySuccess, () => {
          Defer.defer(() => {
            expect(slider.drawGraph).toHaveBeenCalled();
            done();
          });
        });

        Simulate.query(env, { results: fakeResults });
      });

      function hideFacetColumn(env: Mock.IMockEnvironment) {
        env.element.style.display = 'none';
      }

      function showFacetColumn(env: Mock.IMockEnvironment) {
        env.element.style.display = 'block';
      }

      function createFacetSliderGraphGroupByResults() {
        let fakeGroupByResult = FakeResults.createFakeRangeGroupByResult('@bar', 1, 100, 25);
        let fakeResults = FakeResults.createFakeResults();
        fakeResults.groupByResults = [fakeGroupByResult, fakeGroupByResult]; // need two because the graph is enabled.
        return fakeResults;
      }
    });

    describe('exposes options', () => {
      it('dateField should change the query expression to a correct date expression', () => {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: '2000/01/01',
          end: '3000/01/01',
          field: '@foo',
          dateField: true
        });
        let startSelected = new Date(Date.UTC(2100, 0, 1));
        let endSelected = new Date(Date.UTC(2200, 0, 1));

        test.cmp.setSelectedValues([startSelected.getTime(), endSelected.getTime()]);
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().aq).toBe('@foo==2100/01/01@00:00:00..2200/01/01@00:00:00');
      });

      it('queryOverride should output a query override in the group by request', () => {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: 0,
          end: 100,
          field: '@foo',
          queryOverride: '@foo>50'
        });

        (<jasmine.Spy>test.env.queryStateModel.get).and.returnValue([0, 100]);
        (<jasmine.Spy>test.env.queryStateModel.getDefault).and.returnValue([0, 100]);

        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              advancedQueryOverride: '@foo>50',
              field: '@foo'
            })
          ])
        );
      });

      it('title should modify the header', () => {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: 0,
          end: 100,
          field: '@foo',
          title: 'nice title'
        });

        test.cmp.ensureDom();
        expect($$($$(test.cmp.facetHeader.build()).find('.coveo-facet-header-title')).text()).toBe('nice title');
      });

      it('should have a "simpleSliderConfig" attribute if the start and end attribute is specified', () => {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: 0,
          end: 100,
          field: '@foo',
          title: 'nice title'
        });

        expect(test.cmp.isSimpleSliderConfig).toBeTruthy();
      });

      it('should not have a "simpleSliderConfig" attribute if the start and end attribute is not specified', () => {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          field: '@foo',
          title: 'nice title'
        });

        expect(test.cmp.isSimpleSliderConfig).toBeFalsy();
      });
    });

    describe('when setuping slider with no predetermined range', () => {
      beforeEach(() => {
        facetSliderOptions = { field: '@foo' };
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, facetSliderOptions);
      });

      const simulateStateRange = (start: number, end: number) => {
        (<jasmine.Spy>test.env.queryStateModel.get).and.returnValue([start, end]);
        (<jasmine.Spy>test.env.queryStateModel.getDefault).and.returnValue([start, end]);
      };

      const simulateGroupBy = (start: number, end: number) => {
        const groupByResults = [
          {
            field: '@foo',
            values: [FakeResults.createFakeGroupByRangeValue(start, end, 'foo', 1)]
          }
        ];
        Simulate.query(test.env, {
          groupByResults,
          callbackDuringQuery: () => (test.cmp.facetQueryController.lastGroupByRequestForFullRangeIndex = 0)
        });
      };

      it('should use smallest value from state versus group by to determine start of range', () => {
        simulateStateRange(1, 3);
        simulateGroupBy(2, 3);
        expect(test.cmp.initialStartOfSlider).toBe(1);
      });

      it('should use smallest value from group by versus state to determine start of range', () => {
        simulateStateRange(2, 3);
        simulateGroupBy(1, 3);
        expect(test.cmp.initialStartOfSlider).toBe(1);
      });

      it('should use the largest value from state versus group by to determine end of range', () => {
        simulateStateRange(1, 3);
        simulateGroupBy(1, 2);
        expect(test.cmp.initialEndOfSlider).toBe(3);
      });

      it('should use the largest value from group by versus state by to determine end of range', () => {
        simulateStateRange(1, 2);
        simulateGroupBy(1, 3);
        expect(test.cmp.initialEndOfSlider).toBe(3);
      });
    });
  });
}
