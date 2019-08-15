import * as Mock from '../MockEnvironment';
import { Searchbox } from '../../src/ui/Searchbox/Searchbox';
import { ISearchboxOptions } from '../../src/ui/Searchbox/Searchbox';
import { $$ } from '../../src/utils/Dom';
import { each } from 'underscore';

export function SearchboxResizeTest() {
  describe('SearchboxResize', () => {
    let test: Mock.IBasicComponentSetup<Searchbox>;
    const findHtmlElement = (element: HTMLElement) => {
      return {
        coveoOmniboxOrQuery: $$(element).find('.CoveoOmnibox') || $$(element).find('.CoveoQuerybox'),
        coveoSearchButton: $$(element).find('.CoveoSearchButton'),
        input: $$($$(element).find('.magic-box-input')).find('input'),
        magicboxIcon: $$(element).find('.magic-box-icon'),
        magicboxClear: $$(element).find('.magic-box-clear'),
        magicboxInput: $$(element).find('.magic-box-input')
      };
    };

    describe('with an Omnibox as the Searchbox,', () => {
      describe('with the heigth option not set,', () => {
        beforeEach(() => {
          test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
            enableOmnibox: true
          });
        });
        it('the Omnibox should not be resize', () => {
          each(findHtmlElement(test.cmp.element), (element: HTMLElement) => {
            expect(element.style.height).toBe('');
          });
        });
      });

      describe('with the heigth set to 25.', () => {
        let structHTMLElement;
        const height = 25;
        const heightForInput = height - 2;
        beforeEach(() => {
          test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
            enableOmnibox: true,
            height: height
          });
        });
        it('the Omnibox should resize to 25px', () => {
          each(structHTMLElement, (element: HTMLElement) => {
            if (element === structHTMLElement.magicboxInput) {
              expect(element.style.height).toBe(`${heightForInput}px`);
            } else {
              expect(element.style.height).toBe(`${height}px`);
            }
          });
        });
      });
    });

    describe('with a Querybox as the Searchbox, ', () => {
      describe('with the height option not set, ', () => {
        beforeEach(() => {
          test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
            enableOmnibox: false
          });
        });
        it('the Querybox should not be resize', () => {
          each(findHtmlElement(test.cmp.element), (element: HTMLElement) => {
            expect(element.style.height).toBe('');
          });
        });
      });

      describe('with the height set to 60.', () => {
        let structHTMLElement;
        const height = 60;
        const heightForInput = height - 2;
        beforeEach(() => {
          test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
            enableOmnibox: false,
            height: height
          });
          structHTMLElement = findHtmlElement(test.cmp.element);
        });
        it('the Querybox should resize to 60px', () => {
          each(structHTMLElement, (element: HTMLElement) => {
            if (element === structHTMLElement.magicboxInput) {
              expect(element.style.height).toBe(`${heightForInput}px`);
            } else {
              expect(element.style.height).toBe(`${height}px`);
            }
          });
        });
      });
    });
  });
}
