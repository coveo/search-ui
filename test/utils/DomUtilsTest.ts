import { DomUtils } from '../../src/utils/DomUtils';
import { FakeResults } from '../Fake';
import { MockEnvironmentBuilder } from '../MockEnvironment';
import { $$, load, get } from '../Test';
import { IQueryResult } from '../../src/rest/QueryResult';
import { LazyInitialization } from '../../src/ui/Base/Initialization';

declare const Coveo;

export function DomUtilsTest() {
  describe('DomUtils', () => {
    let fakeResult: IQueryResult;
    let env: MockEnvironmentBuilder;

    beforeEach(() => {
      fakeResult = FakeResults.createFakeResult();
      env = new MockEnvironmentBuilder().withResult(fakeResult);
    });

    it('should support creating a quickview header with the passed in title', async done => {
      const header = DomUtils.getQuickviewHeader(fakeResult, { title: 'foo', showDate: true }, env.build());
      await load('ResultLink');
      const link = $$(header).find('.CoveoResultLink');
      expect($$(get(link).element).text()).toEqual('foo');
      done();
    });

    it('should display a date if requested', () => {
      const header = DomUtils.getQuickviewHeader(fakeResult, { title: 'title', showDate: true }, env.build());
      const time = $$(header).find('.coveo-quickview-time');
      expect($$(time).text()).not.toBe('');
    });

    it('should not display a date if not requested', () => {
      const header = DomUtils.getQuickviewHeader(fakeResult, { title: 'title', showDate: false }, env.build());
      const time = $$(header).find('.coveo-quickview-time');
      expect($$(time).text()).toBe('');
    });

    describe('with a salesforce namespace', () => {
      let spy: jasmine.Spy;
      beforeEach(() => {
        Coveo.Salesforce = {};
        spy = jasmine.createSpy('SalesforceResultLink');
        Coveo.SalesforceResultLink = spy;
        LazyInitialization.registerLazyComponent('SalesforceResultLink', () => Promise.resolve(spy as any));
      });

      afterEach(() => {
        delete Coveo.Salesforce;
        delete Coveo.SalesforceResultLink;
      });

      it('should try to load a salesforce result link', async done => {
        DomUtils.getQuickviewHeader(fakeResult, { title: 'foo', showDate: true }, env.build());
        await load('SalesforceResultLink');
        expect(spy).toHaveBeenCalled();
        done();
      });
    });
  });
}
