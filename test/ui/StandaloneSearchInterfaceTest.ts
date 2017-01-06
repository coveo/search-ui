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

    it('should redirect on new query', (done) => {
      expect(windoh.location.href).not.toContain('foo');
      cmp.queryController.executeQuery();
      setTimeout(() => {
        expect(windoh.location.href).toContain('foo');
        done();
      }, 0);

    });

    it('should set the state in the new location', (done) => {
      expect(windoh.location.href).not.toContain('key=value');
      let spy = jasmine.createSpy('foo');
      spy.and.returnValue({
        key: 'value'
      });
      cmp.queryStateModel.getAttributes = spy;
      cmp.queryController.executeQuery();
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        expect(windoh.location.href).toContain('key=value');
        done();
      }, 0);
    });

    it('should get the meta from the analytics client', (done) => {
      cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { 'foo': 'bar' });
      cmp.queryController.executeQuery();
      setTimeout(() => {
        expect(windoh.location.href).toContain('firstQueryMeta={"foo":"bar"}');
        done();
      }, 0);
    });

    it('should get the cause from the analytics client', (done) => {
      cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { 'foo': 'bar' });
      cmp.queryController.executeQuery();
      setTimeout(() => {
        expect(windoh.location.href).toContain('firstQueryCause=omniboxAnalytics');
        done();
      }, 0);
    });

    it('should transform search box submit to search from link', (done) => {
      // for legacy reason, searchbox submit were always logged a search from link in an external search box.
      cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.searchboxSubmit, { 'foo': 'bar' });
      cmp.queryController.executeQuery();
      setTimeout(() => {
        expect(windoh.location.href).toContain('firstQueryCause=searchFromLink');
        done();
      }, 0);
    });
  });
}
