import { HiddenQuery } from '../../src/ui/HiddenQuery/HiddenQuery';
import * as Mock from '../MockEnvironment';
import { $$ } from '../../src/utils/Dom';
import { BreadcrumbEvents } from '../../src/events/BreadcrumbEvents';
import { Simulate } from '../Simulate';
import { IPopulateBreadcrumbEventArgs } from '../../src/events/BreadcrumbEvents';
import _ = require('underscore');

export function HiddenQueryTest() {
  describe('HiddenQuery', function() {
    var test: Mock.IBasicComponentSetup<HiddenQuery>;

    beforeEach(function() {
      test = Mock.advancedComponentSetup<HiddenQuery>(
        HiddenQuery,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, (env: Mock.MockEnvironmentBuilder) => {
          return env.withLiveQueryStateModel();
        })
      );
    });

    afterEach(function() {
      test = null;
    });

    it('should populate breadcrumb if hd and hq is set', function() {
      var breadcrumbMatcher = jasmine.arrayContaining([jasmine.objectContaining({ element: jasmine.any(HTMLElement) })]);
      var matcher = jasmine.objectContaining({ breadcrumbs: breadcrumbMatcher });
      var spy = jasmine.createSpy('onPopulate');
      $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, spy);

      // hd hq not set : no breadcrumbs
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, { breadcrumbs: [] });
      expect(spy).not.toHaveBeenCalledWith(jasmine.anything(), matcher);

      // only hd set : no breadcrumbs
      test.env.queryStateModel.set('hd', 'test');
      test.env.queryStateModel.set('hq', '');

      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, { breadcrumbs: [] });
      expect(spy).not.toHaveBeenCalledWith(jasmine.anything(), matcher);

      // only hq set : breadcrumbs populated
      test.env.queryStateModel.set('hd', '');
      test.env.queryStateModel.set('hq', 'test');

      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, { breadcrumbs: [] });
      expect(spy).toHaveBeenCalledWith(jasmine.anything(), matcher);

      // hq and hd are set : breadcrumb populated
      test.env.queryStateModel.set('hd', 'test');
      test.env.queryStateModel.set('hq', 'test');

      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, { breadcrumbs: [] });
      expect(spy).toHaveBeenCalledWith(jasmine.anything(), matcher);
    });

    it('should push hq in the query if it is set', function() {
      test.env.queryStateModel.set('hq', 'test');
      var simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBe('test');
    });

    it('should not push hq in the query if not set', function() {
      test.env.queryStateModel.set('hq', '');
      var simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBe(undefined);
    });

    it('clear should clear the query state', function() {
      test.env.queryStateModel.set('hq', 'test');
      test.env.queryStateModel.set('hd', 'test');
      test.cmp.clear();
      expect(test.env.queryStateModel.get('hq')).toBe('');
      expect(test.env.queryStateModel.get('hd')).toBe('');
    });

    describe('exposes options', function() {
      it('maximumDescriptionLength should splice the description in the breadcrumb', function() {
        test = Mock.advancedComponentSetup<HiddenQuery>(
          HiddenQuery,
          new Mock.AdvancedComponentSetupOptions(
            undefined,
            {
              maximumDescriptionLength: 56
            },
            (env: Mock.MockEnvironmentBuilder) => {
              return env.withLiveQueryStateModel();
            }
          )
        );

        test.env.queryStateModel.set('hq', 'test');
        test.env.queryStateModel.set('hd', _.range(200).toString());
        $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, (e: Event, args: IPopulateBreadcrumbEventArgs) => {
          // Not an exact comparison, because there's comma, and (...) at the end.
          // We don't need exact number, just that it's way less than 200 that was generated
          expect($$(args.breadcrumbs[0].element).text().length).toBeLessThan(100);
        });
        $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, { breadcrumbs: [] });
      });

      it('title allows to specify a breadcrumb title', function() {
        test = Mock.advancedComponentSetup<HiddenQuery>(
          HiddenQuery,
          new Mock.AdvancedComponentSetupOptions(
            undefined,
            {
              title: 'foobar'
            },
            (env: Mock.MockEnvironmentBuilder) => {
              return env.withLiveQueryStateModel();
            }
          )
        );

        test.env.queryStateModel.set('hq', 'test');
        test.env.queryStateModel.set('hd', 'test');
        $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, (e: Event, args: IPopulateBreadcrumbEventArgs) => {
          expect($$(<HTMLElement>args.breadcrumbs[0].element.firstChild).text()).toBe('foobar');
        });
        $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, { breadcrumbs: [] });
      });
    });
  });
}
