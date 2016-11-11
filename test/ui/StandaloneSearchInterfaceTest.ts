import * as Mock from '../MockEnvironment';
import {StandaloneSearchInterface} from '../../src/ui/SearchInterface/SearchInterface';
import {analyticsActionCauseList} from '../../src/ui/Analytics/AnalyticsActionListMeta';
export function StandaloneSearchInterfaceTest() {
  describe('StandaloneSearchInterface', () => {

    let cmp: StandaloneSearchInterface;
    let windoh = window;

    beforeEach(function () {
      windoh = Mock.mockWindow();
      cmp = new StandaloneSearchInterface(document.createElement('div'), { searchPageUri: 'foo' }, undefined, windoh);
    });

    afterEach(function () {
      windoh = null;
      cmp = null;
    });

    it('should redirect on new query', () => {
      expect(windoh.location.href).not.toContain('foo');
      cmp.queryController.executeQuery();
      expect(windoh.location.href).toContain('foo');
    });

    it('should set the state in the new location', () => {
      expect(windoh.location.href).not.toContain('key=value');
      let spy = jasmine.createSpy('foo');
      spy.and.returnValue({
        key: 'value'
      });
      cmp.queryStateModel.getAttributes = spy;

      cmp.queryController.executeQuery();
      expect(spy).toHaveBeenCalled();
      expect(windoh.location.href).toContain('key=value');
    });

    it('should get the meta from the analytics client', () => {
      cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { 'foo': 'bar' });
      cmp.queryController.executeQuery();
      expect(windoh.location.href).toContain('firstQueryMeta={"foo":"bar"}');
    });

    it('should get the cause from the analytics client', () => {
      cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { 'foo': 'bar' });
      cmp.queryController.executeQuery();
      expect(windoh.location.href).toContain('firstQueryCause=omniboxAnalytics');
    });
  });
}
