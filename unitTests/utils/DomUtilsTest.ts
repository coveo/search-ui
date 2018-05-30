import { DomUtils } from '../../src/utils/DomUtils';
import { FakeResults } from '../Fake';
import { MockEnvironmentBuilder } from '../MockEnvironment';
import { load, get } from '../Test';
import { IQueryResult } from '../../src/rest/QueryResult';
import { LazyInitialization } from '../../src/ui/Base/Initialization';
import { $$ } from '../../src/utils/Dom';

declare const Coveo;

export function DomUtilsTest() {
  describe('DomUtils', () => {
    let fakeResult: IQueryResult;
    let env: MockEnvironmentBuilder;

    beforeEach(() => {
      fakeResult = FakeResults.createFakeResult();
      env = new MockEnvironmentBuilder().withResult(fakeResult);
    });

    describe('getQuickviewHeader', () => {
      it('should support creating a quickview header with the passed in title', async done => {
        const header = DomUtils.getQuickviewHeader(fakeResult, { title: 'foo', showDate: true }, env.build());
        await load('ResultLink');
        const link = $$(header).find('.CoveoResultLink');
        expect($$(get(link).element).text()).toEqual('foo');
        done();
      });

      it('should use the result title as the quickview title when no title is passed', async done => {
        const header = DomUtils.getQuickviewHeader(fakeResult, { title: undefined, showDate: true }, env.build());
        await load('ResultLink');
        const link = $$(header).find('.CoveoResultLink');
        expect($$(get(link).element).text()).toEqual(fakeResult.title);
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

      it('should not display a date if none is available', () => {
        fakeResult.raw.date = null;
        const header = DomUtils.getQuickviewHeader(fakeResult, { title: 'title', showDate: true }, env.build());
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

    describe('hightlightElement', () => {
      const startDelimiter = 'start-';
      const endDelimiter = '-end';
      const elementToHighlight = 'element';

      it('should highlight the string with the value to search', () => {
        const hightlighed = DomUtils.highlightElement(`${startDelimiter}${elementToHighlight}${endDelimiter}`, elementToHighlight);
        expect(hightlighed).toBe(`${startDelimiter}<span class='coveo-highlight'>${elementToHighlight}</span>${endDelimiter}`);
      });

      it('should return the initial string when the value to search is not found', () => {
        const hightlighed = DomUtils.highlightElement(`${startDelimiter}${elementToHighlight}${endDelimiter}`, 'somethingelse');
        expect(hightlighed).toBe(`${startDelimiter}${elementToHighlight}${endDelimiter}`);
      });

      it('should HTML encode the highlighted HTML values', () => {
        const elementWithHTMLValues = `<${elementToHighlight}>`;
        const hightlighed = DomUtils.highlightElement(`${startDelimiter}${elementWithHTMLValues}${endDelimiter}`, elementWithHTMLValues);
        expect(hightlighed).toBe(`${startDelimiter}<span class='coveo-highlight'>&lt;${elementToHighlight}&gt;</span>${endDelimiter}`);
      });

      it('should be case insensitive', () => {
        const elementInAllCaps = elementToHighlight.toUpperCase();
        const hightlighed = DomUtils.highlightElement(`${startDelimiter}${elementInAllCaps}${endDelimiter}`, elementToHighlight);
        expect(hightlighed).toBe(`${startDelimiter}<span class='coveo-highlight'>${elementInAllCaps}</span>${endDelimiter}`);
      });

      it('should set the class given in parameter', () => {
        const classToApply = `bloup`;
        const hightlighed = DomUtils.highlightElement(
          `${startDelimiter}${elementToHighlight}${endDelimiter}`,
          elementToHighlight,
          classToApply
        );
        expect(hightlighed).toBe(`${startDelimiter}<span class='${classToApply}'>${elementToHighlight}</span>${endDelimiter}`);
      });
    });
  });
}
