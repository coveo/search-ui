import * as Mock from '../MockEnvironment';
import { StandaloneSearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
export function StandaloneSearchInterfaceTest() {
  describe('StandaloneSearchInterface', () => {
    let cmp: StandaloneSearchInterface;
    let windoh = window;

    beforeEach(() => {
      windoh = Mock.mockWindow();
    });

    afterEach(() => {
      windoh = null;
      cmp = null;
    });

    describe('with a complex search page uri', () => {
      it('should merge the url fragments with the state', done => {
        cmp = new StandaloneSearchInterface(document.createElement('div'), { searchPageUri: '/mypage#t=MyTab' }, undefined, windoh);
        expect(windoh.location.href).not.toContain('key=value');
        expect(windoh.location.href).not.toContain('t=MyTab');

        let spy = jasmine.createSpy('foo');
        spy.and.returnValue({
          key: 'value'
        });

        cmp.queryStateModel.getAttributes = spy;
        cmp.queryController.executeQuery();

        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          expect(windoh.location.href).toContain('#t=MyTab&key=value');
          done();
        }, 0);
      });

      it('should merge the url query string correctly', done => {
        cmp = new StandaloneSearchInterface(document.createElement('div'), { searchPageUri: '/mypage?debug=true' }, undefined, windoh);
        expect(windoh.location.href).not.toContain('debug=true');

        let spy = jasmine.createSpy('foo');
        spy.and.returnValue({
          key: 'value'
        });

        cmp.queryStateModel.getAttributes = spy;
        cmp.queryController.executeQuery();

        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          expect(windoh.location.href).toContain('?debug=true#key=value');
          done();
        }, 0);
      });

      it('should merge the fragment and query string parameter correctly', done => {
        cmp = new StandaloneSearchInterface(
          document.createElement('div'),
          { searchPageUri: '/mypage?debug=true#t=MyTab' },
          undefined,
          windoh
        );
        expect(windoh.location.href).not.toContain('debug=true');

        let spy = jasmine.createSpy('foo');
        spy.and.returnValue({
          key: 'value'
        });

        cmp.queryStateModel.getAttributes = spy;
        cmp.queryController.executeQuery();

        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          expect(windoh.location.href).toContain('?debug=true#t=MyTab&key=value');
          done();
        }, 0);
      });
    });

    describe('with a standard searchPageUri', () => {
      beforeEach(() => {
        cmp = new StandaloneSearchInterface(document.createElement('div'), { searchPageUri: 'foo' }, undefined, windoh);
      });

      it('should redirect on new query', done => {
        expect(windoh.location.href).not.toContain('foo');
        cmp.queryController.executeQuery();
        setTimeout(() => {
          expect(windoh.location.href).toContain('foo');
          done();
        }, 0);
      });

      it('should set the state in the new location', done => {
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

      it('should get the meta from the analytics client', done => {
        cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { foo: 'bar' });
        cmp.queryController.executeQuery();
        setTimeout(() => {
          expect(windoh.location.href).toContain('firstQueryMeta={"foo":"bar"}');
          done();
        }, 0);
      });

      it('should get the cause from the analytics client', done => {
        cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { foo: 'bar' });
        cmp.queryController.executeQuery();
        setTimeout(() => {
          expect(windoh.location.href).toContain('firstQueryCause=omniboxAnalytics');
          done();
        }, 0);
      });

      it('should transform search box submit to search from link', done => {
        // for legacy reason, searchbox submit were always logged a search from link in an external search box.
        cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.searchboxSubmit, { foo: 'bar' });
        cmp.queryController.executeQuery();
        setTimeout(() => {
          expect(windoh.location.href).toContain('firstQueryCause=searchFromLink');
          done();
        }, 0);
      });
    });
  });
}
