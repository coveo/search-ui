import * as Mock from '../MockEnvironment';
import { FacetSlider } from '../../src/ui/FacetSlider/FacetSlider';
import { Slider } from '../../src/ui/Misc/Slider';
import { IFacetSliderOptions } from '../../src/ui/FacetSlider/FacetSlider';
import { Simulate } from '../Simulate';
import { BreadcrumbEvents } from '../../src/events/BreadcrumbEvents';
import { IPopulateBreadcrumbEventArgs } from '../../src/events/BreadcrumbEvents';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import { QueryEvents } from '../../src/events/QueryEvents';

export function FacetSliderTest() {
  describe('FacetSlider', function() {
    let test: Mock.IBasicComponentSetup<FacetSlider>;
    let facetSliderOptions: IFacetSliderOptions;

    beforeEach(function() {
      facetSliderOptions = { start: 0, end: 100, field: '@foo' };
      test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, facetSliderOptions);
      (<jasmine.Spy>test.env.queryStateModel.get).and.returnValue([0, 100]);
      (<jasmine.Spy>test.env.queryStateModel.getDefault).and.returnValue([0, 100]);
    });

    afterEach(function() {
      test = null;
    });

    it("should not add a query expression if the slider is in it's default state", function() {
      test.cmp.setSelectedValues([0, 100]);
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBeUndefined();
    });

    it("should add a query expression if the slider is not in it's default state", function() {
      test.cmp.setSelectedValues([5, 25]);
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBe('@foo==5..25');
    });

    it('should request a group by', function() {
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

    it("should return the correct selected values after a query, which is it's options", function() {
      Simulate.query(test.env);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([0, 100]));
    });

    it('should return undefined values if there has not been a query yet', function() {
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([undefined, undefined]));
    });

    it('should return selected values from the query state if available', function() {
      let spy: jasmine.Spy = jasmine.createSpy('rangeState');
      spy.and.returnValue([60, 75]);
      test.env.queryStateModel.get = spy;
      Simulate.query(test.env);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([60, 75]));
    });

    it('should populate breadcrumb only if not in default state', function() {
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

      beforeEach(() => {
        slider = jasmine.createSpyObj('slider', ['drawGraph']);
        mockEnvironmentBuilder = new Mock.MockEnvironmentBuilder();
        env = mockEnvironmentBuilder.build();
      });

      it('should draw the graph on resize when there are results', done => {
        let facetSlider = new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);

        facetSlider.onResize(new Event('resize'));

        setTimeout(() => {
          expect(slider.drawGraph).toHaveBeenCalled();
          done();
        }, FacetSlider.DEBOUNCED_RESIZE_DELAY + 1);
      });

      it('should not draw the graph on resize when there are no results', done => {
        let facetSlider = new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);

        $$(env.root).trigger(QueryEvents.noResults);
        facetSlider.onResize(new Event('resize'));

        setTimeout(() => {
          expect(slider.drawGraph).not.toHaveBeenCalled();
          done();
        }, FacetSlider.DEBOUNCED_RESIZE_DELAY + 1);
      });

      it('should draw the graph when draw delayed graph data is called', done => {
        let fakeResults = createFacetSliderGraphGroupByResults();
        $$(env.element).addClass('coveo-facet-column');

        facetSliderOptions = { start: 0, end: 100, field: '@bar', graph: { steps: 4 } };
        let facetSlider = new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);

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
        let facetSlider = new FacetSlider(env.element, facetSliderOptions, mockEnvironmentBuilder.getBindings(), slider);

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

    describe('exposes options', function() {
      it('dateField should change the query expression to a correct date expression', function() {
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

      it('queryOverride should output a query override in the group by request', function() {
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
              queryOverride: '@foo>50',
              field: '@foo'
            })
          ])
        );
      });

      it('title should modify the header', function() {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: 0,
          end: 100,
          field: '@foo',
          title: 'nice title'
        });

        test.cmp.ensureDom();
        expect($$($$(test.cmp.facetHeader.build()).find('.coveo-facet-header-title')).text()).toBe('nice title');
      });
    });
  });
}
