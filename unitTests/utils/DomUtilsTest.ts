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

          setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
          }, 0);
        });
      });
    });

    describe('highlight', () => {
      const content = 'This is some text content';

      it('should highlight the entire content with coveo-highlight by default', () => {
        expect(DomUtils.highlight(content)).toBe(`<span class='coveo-highlight'>${content}</span>`);
      });

      it('should highlight the entire content with whatever parameter is given', () => {
        const classToApply = 'my-odd-class';
        expect(DomUtils.highlight(content, classToApply)).toBe(`<span class='${classToApply}'>${content}</span>`);
      });

      const parseStringToHTMLElement = (str: string) => {
        const parent = document.createElement('div');
        parent.innerHTML = str;
        return parent.children[0];
      };

      it('should still return valid HTML if the class or content are empty', () => {
        expect(parseStringToHTMLElement(DomUtils.highlight('', '')) instanceof HTMLSpanElement).toBe(
          true,
          'an instance of HTMLSpanElement'
        );

        expect(parseStringToHTMLElement(DomUtils.highlight('', '', false)) instanceof HTMLSpanElement).toBe(
          true,
          'an instance of HTMLSpanElement'
        );
      });

      it('should not escape spaces in classToApply', () => {
        const classes = ['hello', 'world'];
        const resultingElementClassList = parseStringToHTMLElement(DomUtils.highlight(content, `${classes[0]} ${classes[1]}`)).classList;
        expect(resultingElementClassList.length).toBe(2);
        classes.forEach(className => expect(resultingElementClassList.contains(className)).toBe(true, "in the element's class list"));
      });

      it('should throw an exception when the content is null', () => {
        expect(() => DomUtils.highlight(null, 'hello')).toThrow();
      });

      it('should return an element with no class when the classToApply is null', () => {
        expect(parseStringToHTMLElement(DomUtils.highlight('hello', null)).classList.length).toBe(0);
      });

      it('should ignore trailing spaces in classToApply', () => {
        expect(parseStringToHTMLElement(DomUtils.highlight('hello', '   hello world   ')).classList.length).toBe(2);
        expect(parseStringToHTMLElement(DomUtils.highlight('hello', '   ')).classList.length).toBe(0);
      });

      const contentWithSymbols = `-\`!@#$%^&*()=[]{}<>“‘.,~:;'"|\\?📀`;

      it('should throw an exception when the classToApply contains symbols', () => {
        const prefix = 'hello';
        const suffix = 'world';
        contentWithSymbols
          .split('')
          .slice(1)
          .forEach(char => expect(() => DomUtils.highlight(content, prefix + char + suffix)).toThrow());
      });

      it('should still return valid HTML if the content contains symbols and is HTML encoded', () => {
        const element = parseStringToHTMLElement(DomUtils.highlight(contentWithSymbols));
        expect(element instanceof HTMLSpanElement).toBe(true, 'an instance of HTMLSpanElement');
        expect(element.children.length).toBe(0);
        expect(element.textContent).toBe(contentWithSymbols);
      });

      const testHighlightedElementText = '<input type="text"/>';

      it('should HTML encode the string content by default', () => {
        const element = parseStringToHTMLElement(DomUtils.highlight(testHighlightedElementText));
        expect(element.children.length).toBe(0);
        expect(element.textContent).toBe(testHighlightedElementText);
      });

      it('should not HTML encode the string content when asked not to', () => {
        const element = parseStringToHTMLElement(DomUtils.highlight(testHighlightedElementText, undefined, false));
        expect(element.children.length).toBe(1);
        expect(element.children[0] instanceof HTMLInputElement).toBe(true, 'expected to contain an instance of HTMLInputElement');
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
