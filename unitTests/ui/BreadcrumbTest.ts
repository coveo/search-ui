import * as Mock from '../MockEnvironment';
import { Breadcrumb } from '../../src/ui/Breadcrumb/Breadcrumb';
import { $$ } from '../../src/utils/Dom';
import { BreadcrumbEvents } from '../../src/events/BreadcrumbEvents';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { Simulate } from '../Simulate';
import { l } from '../../src/strings/Strings';

export function BreadcrumbTest() {
  describe('Breadcrumb', function() {
    var test: Mock.IBasicComponentSetup<Breadcrumb>;

    function initBreadcrumb(props: any = {}) {
      test = Mock.advancedComponentSetup<Breadcrumb>(Breadcrumb, {
        element: $$('div', props).el,
        cmpOptions: {},
        modifyBuilder: env => env,
        merge: options => options
      });
    }

    beforeEach(function() {
      initBreadcrumb();
    });

    afterEach(function() {
      test = null;
    });

    it('is hidden by default', function() {
      expect(test.cmp.element.style.display).toBe('none');
    });

    it('is hidden if there is no breadcrumb items', function() {
      test.cmp.drawBreadcrumb([]);
      expect(test.cmp.element.style.display).toBe('none');
    });

    it('is displayed if there is at least one breadcrumb item', function() {
      test.cmp.drawBreadcrumb([{ element: document.createElement('div') }]);
      expect(test.cmp.element.style.display).not.toBe('none');
      expect($$(test.cmp.element).findAll('.coveo-breadcrumb-item').length).toBe(1);
    });

    it('should trigger clear all event', function() {
      var onClear = jasmine.createSpy('onPopulate');
      $$(test.env.root).on(BreadcrumbEvents.clearBreadcrumb, onClear);
      test.cmp.clearBreadcrumbs();
      expect(onClear).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({}));
    });

    it('should trigger populate breadcrumb when getting breadcrumb', function() {
      var onPopulate = jasmine.createSpy('onPopulate');
      $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, onPopulate);
      test.cmp.getBreadcrumbs();
      expect(onPopulate).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({ breadcrumbs: [] }));
    });

    it('should execute a query after clear', function() {
      test.cmp.clearBreadcrumbs();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('should log analytics event after clear', function() {
      test.cmp.clearBreadcrumbs();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.breadcrumbResetAll, {});
    });

    it('should have the navigation role by default', () => {
      expect(test.cmp.element.getAttribute('role')).toEqual('navigation');
    });

    it('should have a label by default', () => {
      expect(test.cmp.element.getAttribute('aria-label')).toEqual(l('Breadcrumb'));
    });

    it('should not overwrite a custom role', () => {
      initBreadcrumb({ role: 'test' });
      expect(test.cmp.element.getAttribute('role')).toEqual('test');
      expect(test.cmp.element.getAttribute('aria-label')).toEqual(l('Breadcrumb'));
    });

    it('should not overwrite a custom label', () => {
      initBreadcrumb({ ariaLabel: 'test' });
      expect(test.cmp.element.getAttribute('role')).toEqual('navigation');
      expect(test.cmp.element.getAttribute('aria-label')).toEqual('test');
    });

    describe('when there is a query', function() {
      beforeEach(function() {
        // breadcrumb component is bound after init so as to pass after all other component
        $$(test.env.root).trigger(InitializationEvents.afterInitialization);
      });

      it('should trigger populate breadcrumb', function() {
        var onPopulate = jasmine.createSpy('onPopulate');
        $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, onPopulate);
        Simulate.query(test.env);
        expect(onPopulate).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({ breadcrumbs: [] }));
      });

      it('should trigger populate breadcrumb on an error', function() {
        var onPopulate = jasmine.createSpy('onPopulate');
        $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, onPopulate);
        Simulate.queryError(test.env);
        expect(onPopulate).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({ breadcrumbs: [] }));
      });
    });
  });
}
