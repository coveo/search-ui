import * as Mock from '../MockEnvironment';
import { ISimpleFilterOptions, SimpleFilter } from '../../src/ui/SimpleFilter/SimpleFilter';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../src/events/BreadcrumbEvents';
import { FakeResults } from '../Fake';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function SimpleFilterTest() {
  describe('SimpleFilter', () => {
    let aSimpleFilter: Mock.IBasicComponentSetup<SimpleFilter>;

    beforeEach(() => {
      aSimpleFilter = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions>{
        field: '@field',
        maximumNumberOfValues: 5,
        title: 'FooTitleBar',
        values: ['foo', 'bar'],
        availableSorts: ['score'],
        sortCriteria: 'score',
        valueCaption: {
          bar: 'baz',
          gmailmessage: 'Gmail Message',
          lithiummessage: 'Lithium Message',
          youtubevideo: 'Youtube Video',
          message: 'Message'
        }
      });

      aSimpleFilter.cmp.toggleContainer();
    });

    afterEach(() => {
      aSimpleFilter = null;
    });

    it('should set the title correctly', () => {
      expect(aSimpleFilter.cmp.options.title).toBe('FooTitleBar');
    });

    it('should set the field correctly', () => {
      expect(aSimpleFilter.cmp.options.field).toBe('@field');
    });

    it('should allow to getValueCaption', () => {
      aSimpleFilter.cmp.options.field = '@filetype';
      expect(aSimpleFilter.cmp.getValueCaption('bar')).toBe('baz');
    });

    it('should set the values correctly', () => {
      expect(aSimpleFilter.cmp.options.values).toEqual(['foo', 'bar']);
    });

    it('should set the sortCriteria correctly', () => {
      expect(aSimpleFilter.cmp.options.sortCriteria).toBe('score');
    });

    it('should expand the component correctly', () => {
      aSimpleFilter.cmp.openContainer();
      expect($$(aSimpleFilter.cmp.getValueContainer()).hasClass('coveo-simplefilter-value-container-expanded')).toBe(true);
    });

    it('should collapse the component correctly', () => {
      aSimpleFilter.cmp.closeContainer();
      expect($$(aSimpleFilter.cmp.getValueContainer()).hasClass('coveo-simplefilter-value-container-expanded')).toBe(false);
    });

    it('should use the correct selected values', () => {
      aSimpleFilter.cmp.selectValue('foo');
      expect(aSimpleFilter.cmp.getSelectedCaptions()).toEqual(['foo']);
    });

    it('should trigger a query when a checkbox is checked', () => {
      aSimpleFilter.cmp.toggleValue('foo');
      expect(aSimpleFilter.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('should log an analytics event when a checkbox is checked', () => {
      aSimpleFilter.cmp.toggleValue('foo');
      const eventDefinition = analyticsActionCauseList.simpleFilterSelectValue;

      expect(aSimpleFilter.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: eventDefinition.name,
          type: eventDefinition.type
        }),
        jasmine.objectContaining({
          simpleFilterTitle: aSimpleFilter.cmp.options.title,
          simpleFilterSelectedValue: 'foo'
        })
      );
    });

    it('should log an analytics event when a checkbox is unselected', () => {
      aSimpleFilter.cmp.toggleValue('foo');
      (aSimpleFilter.env.usageAnalytics.logSearchEvent as jasmine.Spy).calls.reset();
      aSimpleFilter.cmp.toggleValue('foo');

      expect(aSimpleFilter.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'deselectValue'
        }),
        jasmine.objectContaining({
          simpleFilterTitle: aSimpleFilter.cmp.options.title
        })
      );
    });

    it('should set the field in the query', () => {
      aSimpleFilter.cmp.options.values = undefined;
      let simulation = Simulate.query(aSimpleFilter.env);
      expect(simulation.queryBuilder.groupByRequests).toEqual(
        jasmine.arrayContaining([
          jasmine.objectContaining({
            field: '@field'
          })
        ])
      );
    });

    it('should set the sortCriteria in the query', () => {
      aSimpleFilter.cmp.options.values = undefined;
      let simulation = Simulate.query(aSimpleFilter.env);
      expect(simulation.queryBuilder.groupByRequests).toEqual(
        jasmine.arrayContaining([
          jasmine.objectContaining({
            sortCriteria: 'score'
          })
        ])
      );
    });

    it('should set the selected values in the query', () => {
      aSimpleFilter.cmp.selectValue('foo');
      let simulation = Simulate.query(aSimpleFilter.env);
      expect(simulation.queryBuilder.advancedExpression.build()).toEqual('@field==foo');
    });

    it('should set the right title depending on values selected', () => {
      aSimpleFilter.cmp.selectValue('foo');
      expect($$($$(aSimpleFilter.cmp.root).find('.coveo-simplefilter-selecttext')).text()).toEqual('foo');
      aSimpleFilter.cmp.selectValue('bar');
      expect($$($$(aSimpleFilter.cmp.root).find('.coveo-simplefilter-selecttext')).text()).toEqual('FooTitleBar');
    });

    it('should handle the backdrop correctly', () => {
      expect($$(aSimpleFilter.cmp.root).find('.coveo-dropdown-background')).not.toBe(undefined);
      aSimpleFilter.cmp.openContainer();
      expect($$($$(aSimpleFilter.cmp.root).find('.coveo-dropdown-background')).hasClass('coveo-dropdown-background-active')).toBe(true);
      aSimpleFilter.cmp.closeContainer();
      expect($$($$(aSimpleFilter.cmp.root).find('.coveo-dropdown-background')).hasClass('coveo-dropdown-background-active')).toBe(false);
    });

    it('should populate the breadcrumb when values are selected', () => {
      aSimpleFilter.cmp.selectValue('bar');

      let args: IPopulateBreadcrumbEventArgs = {
        breadcrumbs: []
      };
      $$(aSimpleFilter.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
      expect(args.breadcrumbs.length).toBe(1);
    });

    it('should reset checkboxes when clearBreadcrumb is triggered', () => {
      aSimpleFilter.cmp.selectValue('foo');
      aSimpleFilter.cmp.selectValue('bar');
      let args: IPopulateBreadcrumbEventArgs = {
        breadcrumbs: []
      };
      $$(aSimpleFilter.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
      $$(aSimpleFilter.env.root).trigger(BreadcrumbEvents.clearBreadcrumb, args);
      expect(aSimpleFilter.cmp.getSelectedCaptions().length).toEqual(0);
    });

    it('should not trigger a query when clearBreadcumb is triggered', () => {
      $$(aSimpleFilter.env.root).trigger(BreadcrumbEvents.clearBreadcrumb);
      expect(aSimpleFilter.env.queryController.executeQuery).not.toHaveBeenCalled();
    });

    it('should not log an analytics event when clearBreadcrumb is triggered', () => {
      $$(aSimpleFilter.env.root).trigger(BreadcrumbEvents.clearBreadcrumb);
      expect(aSimpleFilter.env.usageAnalytics.logSearchEvent).not.toHaveBeenCalled();
    });

    it('should redraw checkbox containers with the previously selected Values if they are present', () => {
      aSimpleFilter.cmp.options.values = undefined;
      aSimpleFilter.cmp.closeContainer();
      const results = FakeResults.createFakeResults();
      results.groupByResults = [FakeResults.createFakeGroupByResult('@field', 'foo', 5)];
      Simulate.query(aSimpleFilter.env, {
        results: results
      });
      aSimpleFilter.cmp.selectValue('foo1');
      Simulate.query(aSimpleFilter.env);
      expect(aSimpleFilter.cmp.getSelectedCaptions()[0]).toEqual('foo1');
    });

    it('should not render a clear button if enableClearButton is falsy', () => {
      expect($$(aSimpleFilter.cmp.element).findAll('.coveo-simplefilter-eraser').length).toBe(0);
    });

    describe('with more than one instance', () => {
      let anotherSimpleFilter: Mock.IBasicComponentSetup<SimpleFilter>;

      beforeEach(() => {
        anotherSimpleFilter = Mock.advancedComponentSetup<SimpleFilter>(
          SimpleFilter,
          new Mock.AdvancedComponentSetupOptions(null, aSimpleFilter.cmp.options, (builder: Mock.MockEnvironmentBuilder) => {
            return builder.withRoot(aSimpleFilter.env.root);
          })
        );
        anotherSimpleFilter.cmp.options.field = '@field';
      });

      it('should put all simple filters in the same wrapper if there is more than one', () => {
        expect(aSimpleFilter.cmp.element.parentElement).toEqual(anotherSimpleFilter.cmp.element.parentElement);
      });

      it('should not create more than one wrapper for the simple filters', () => {
        expect($$(aSimpleFilter.cmp.root).findAll('.coveo-simplefilter-header-wrapper').length).toEqual(1);
      });

      it('should link every simple filter to the same backdrop', () => {
        expect($$(aSimpleFilter.cmp.root).findAll('.coveo-dropdown-background').length).toEqual(1);
      });

      it('should not create more than one backdrop for the simple filters', () => {
        expect($$(aSimpleFilter.cmp.root).findAll('.coveo-dropdown-background').length).toEqual(1);
      });
    });

    describe('with clear button functionality', () => {
      let simpleFilterWithEraser: Mock.IBasicComponentSetup<SimpleFilter>;

      function clickOnClearButton() {
        getClearButton().trigger('click');
      }

      function selectSomeValues() {
        simpleFilterWithEraser.cmp.selectValue('foo');
        simpleFilterWithEraser.cmp.selectValue('bar');
      }

      function getClearButton() {
        return $$($$(simpleFilterWithEraser.cmp.element).find('.coveo-simplefilter-eraser'));
      }

      beforeEach(() => {
        simpleFilterWithEraser = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions>{
          ...aSimpleFilter.cmp.options,
          enableClearButton: true
        });
        simpleFilterWithEraser.cmp.toggleContainer();
      });

      it('should create a clear button if enableClearButton is true', () => {
        expect(getClearButton()).toBeDefined();
      });

      it('should display the clear button if there are selected values', () => {
        selectSomeValues();

        expect(getClearButton().isVisible()).toBe(true);
      });

      it('should hide the clear button after deselecting all values', () => {
        selectSomeValues();
        simpleFilterWithEraser.cmp.deselectValue('foo');
        simpleFilterWithEraser.cmp.deselectValue('bar');

        expect(getClearButton().isVisible()).toBe(false);
      });

      it('should deselect all values after clicking on the clear button', () => {
        selectSomeValues();
        clickOnClearButton();

        expect(simpleFilterWithEraser.cmp.getSelectedValues().length).toBe(0);
      });

      it('should execute only one query after clicking on the clear button', () => {
        selectSomeValues();
        (simpleFilterWithEraser.cmp.queryController.executeQuery as jasmine.Spy).calls.reset();
        clickOnClearButton();

        expect(simpleFilterWithEraser.cmp.queryController.executeQuery).toHaveBeenCalledTimes(1);
      });

      it('should log search event when a clear button is clicked', () => {
        selectSomeValues();
        (simpleFilterWithEraser.env.usageAnalytics.logSearchEvent as jasmine.Spy).calls.reset();

        clickOnClearButton();

        expect(simpleFilterWithEraser.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'clearAll',
            type: 'simpleFilter'
          }),
          jasmine.objectContaining({
            simpleFilterTitle: simpleFilterWithEraser.cmp.options.title,
            simpleFilterField: simpleFilterWithEraser.cmp.options.field
          })
        );
      });

      it('should log only one search event after clicking on clear button', () => {
        selectSomeValues();
        (simpleFilterWithEraser.env.usageAnalytics.logSearchEvent as jasmine.Spy).calls.reset();
        clickOnClearButton();

        expect(simpleFilterWithEraser.env.usageAnalytics.logSearchEvent).toHaveBeenCalledTimes(1);
      });
    });
  });
}
