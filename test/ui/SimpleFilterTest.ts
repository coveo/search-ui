import * as Mock from '../MockEnvironment';
import { ISimpleFilterOptions, SimpleFilter } from '../../src/ui/SimpleFilter/SimpleFilter';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../src/events/BreadcrumbEvents';

export function SimpleFilterTest() {
  describe('SimpleFilter', () => {
    let test: Mock.IBasicComponentSetup<SimpleFilter>;
    let test2: Mock.IBasicComponentSetup<SimpleFilter>;
    let test3: Mock.IBasicComponentSetup<SimpleFilter>;

    beforeEach(() => {
      test = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions>{
        field: '@field',
        maximumNumberOfValues: 5,
        title: 'FooTitleBar',
        values: ['foo', 'bar'],
        allowedValues: [],
        valueCaption: {
          'gmailmessage': 'Gmail Message',
          'lithiummessage': 'Lithium Message',
          'youtubevideo': 'Youtube Video',
          'message': 'Message'
        }
      });

      test2 = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions>{
        field: '@field',
        maximumNumberOfValues: 5,
        title: 'FooTitleBar',
        values: ['foo', 'bar'],
        allowedValues: [],
        valueCaption: {
          'gmailmessage': 'Gmail Message',
          'lithiummessage': 'Lithium Message',
          'youtubevideo': 'Youtube Video',
          'message': 'Message'
        }
      });

      test3 = Mock.optionsComponentSetup<SimpleFilter, ISimpleFilterOptions>(SimpleFilter, <ISimpleFilterOptions>{
        field: '@field',
        maximumNumberOfValues: 5,
        title: 'FooTitleBar',
        values: undefined,
        allowedValues: [],
        valueCaption: {
          'gmailmessage': 'Gmail Message',
          'lithiummessage': 'Lithium Message',
          'youtubevideo': 'Youtube Video',
          'message': 'Message'
        }
      });

      test.cmp.toggle();
      test2.cmp.toggle();
    });

    afterEach(() => {
      test = null;
    });

    it('should set the title correctly', () => {
      expect(test.cmp.options.title).toBe('FooTitleBar');
    });

    it('should set the field correctly', () => {
      expect(test.cmp.options.field).toBe('@field');
    });

    it('should allow to getValueCaption', () => {
      test.cmp.options.field = '@filetype';
      expect(test.cmp.getValueCaption('gmailmessage')).toBe('Gmail Message');

    });

    it('should set the values correctly', () => {
      expect(test.cmp.options.values).toEqual(['foo', 'bar']);

    });

    it('should expand the component correctly', () => {
      test.cmp.openContainer();
      expect($$(test.cmp.checkboxContainer).hasClass('coveo-simplefilter-checkbox-container-expanded')).toBe(true);

    });

    it('should collapse the component correctly', () => {
      test.cmp.closeContainer();
      expect($$(test.cmp.checkboxContainer).hasClass('coveo-simplefilter-checkbox-container-expanded')).toBe(false);
    });

    it('should use the correct selected values', () => {
      test.cmp.checkboxes[0].checkbox.select();
      expect(test.cmp.getSelectedCaptions()).toEqual(['foo']);
    });

    it('should trigger a query when a checkbox is checked', () => {
      test.cmp.checkboxes[0].checkbox.toggle();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('should set the field in the query', () => {
      let simulation = Simulate.query(test3.env);
      expect(simulation.queryBuilder.groupByRequests).toEqual(jasmine.arrayContaining([
        jasmine.objectContaining({
          field: '@field'
        })
      ]));
    });

    it('should set the selected values in the query', () => {
      test.cmp.checkboxes[0].checkbox.select();
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.advancedExpression.build()).toEqual('@field==foo');
    });

    it('getDisplayedTitle should return the right title depending on values selected', () => {
      test.cmp.checkboxes[0].checkbox.select();
      expect($$($$(test.cmp.root).find('.coveo-simplefilter-selecttext')).text()).toEqual('foo');
      test.cmp.checkboxes[1].checkbox.select();
      expect($$($$(test.cmp.root).find('.coveo-simplefilter-selecttext')).text()).toEqual(('FooTitleBar'));
    });

    it('should handle the backdrop correctly', () => {
      expect($$(test.cmp.root).find('.coveo-dropdown-background')).not.toBe(undefined);
      test.cmp.openContainer();
      expect($$($$(test.cmp.root).find('.coveo-dropdown-background')).hasClass('coveo-dropdown-background-active')).toBe(true);
      test.cmp.closeContainer();
      expect($$($$(test.cmp.root).find('.coveo-dropdown-background')).hasClass('coveo-dropdown-background-active')).toBe(false);
    });

    it('should put all simple filters in the same wrapper if there is more than one', () => {
      expect(test.cmp.element.parentElement).toEqual(test2.cmp.element.parentElement);
    });

    it('should not create more than one wrapper for the simple filters', () => {
      expect($$(test.cmp.root).findAll('.coveo-simplefilter-header-wrapper').length).toEqual(1);
    });

    it('should link every simple filter to the same backdrop', () => {
      expect($$(test.cmp.root).findAll('.coveo-dropdown-background').length).toEqual(1);
    });

    it('should not create more than one backdrop for the simple filters', () => {
      expect($$(test.cmp.root).findAll('.coveo-dropdown-background').length).toEqual(1);
    });

    it('should populate the breadcrumb when values are selected', () => {
      test.cmp.checkboxes[1].checkbox.select();

      let args: IPopulateBreadcrumbEventArgs = {
        breadcrumbs: []
      };
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
      expect(args.breadcrumbs.length).toBe(1);
    });

    it('should reset checkboxes when clearBreadcrumb is triggered', () => {
      test.cmp.checkboxes[0].checkbox.select();
      test.cmp.checkboxes[1].checkbox.select();

      let args: IPopulateBreadcrumbEventArgs = {
        breadcrumbs: []
      };
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
      expect(test.cmp.getSelectedCaptions().length).toBe(2);
      $$(test.env.root).trigger(BreadcrumbEvents.clearBreadcrumb, args);
      expect(test.cmp.getSelectedCaptions().length).toEqual(0);


    });
  });
}
