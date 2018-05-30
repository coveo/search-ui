import { BreadcrumbEvents } from '../../src/events/BreadcrumbEvents';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { Breadcrumb } from '../../src/ui/Breadcrumb/Breadcrumb';
import { $$ } from '../../src/utils/Dom';
import { Mock, Simulate } from '../../testsFramework/TestsFramework';

export function BreadcrumbTest() {
  describe('Breadcrumb', () => {
    var test: Mock.IBasicComponentSetup<Breadcrumb>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<Breadcrumb>(Breadcrumb);
    });

    afterEach(() => {
      test = null;
    });

    it('is hidden by default', () => {
      expect(test.cmp.element.style.display).toBe('none');
    });

    it('is hidden if there is no breadcrumb items', () => {
      test.cmp.drawBreadcrumb([]);
      expect(test.cmp.element.style.display).toBe('none');
    });

    it('is displayed if there is at least one breadcrumb item', () => {
      test.cmp.drawBreadcrumb([{ element: document.createElement('div') }]);
      expect(test.cmp.element.style.display).not.toBe('none');
      expect($$(test.cmp.element).findAll('.coveo-breadcrumb-item').length).toBe(1);
    });

    it('should trigger clear all event', () => {
      var onClear = jasmine.createSpy('onPopulate');
      $$(test.env.root).on(BreadcrumbEvents.clearBreadcrumb, onClear);
      test.cmp.clearBreadcrumbs();
      expect(onClear).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({}));
    });

    it('should trigger populate breadcrumb when getting breadcrumb', () => {
      var onPopulate = jasmine.createSpy('onPopulate');
      $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, onPopulate);
      test.cmp.getBreadcrumbs();
      expect(onPopulate).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({ breadcrumbs: [] }));
    });

    it('should execute a query after clear', () => {
      test.cmp.clearBreadcrumbs();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('should log analytics event after clear', () => {
      test.cmp.clearBreadcrumbs();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.breadcrumbResetAll, {});
    });

    describe('when there is a query', () => {
      beforeEach(() => {
        // breadcrumb component is bound after init so as to pass after all other component
        $$(test.env.root).trigger(InitializationEvents.afterInitialization);
      });

      it('should trigger populate breadcrumb', () => {
        var onPopulate = jasmine.createSpy('onPopulate');
        $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, onPopulate);
        Simulate.query(test.env);
        expect(onPopulate).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({ breadcrumbs: [] }));
      });

      it('should trigger populate breadcrumb on an error', () => {
        var onPopulate = jasmine.createSpy('onPopulate');
        $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, onPopulate);
        Simulate.queryError(test.env);
        expect(onPopulate).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({ breadcrumbs: [] }));
      });
    });
  });
}
