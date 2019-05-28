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
        let structHTMLElement;
        beforeEach(() => {
          test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
            enableOmnibox: true
          });
          structHTMLElement = findHtmlElement(test.cmp.element);
        });
        it('the Omnibox should not be resize', () => {
          each(structHTMLElement, (element: HTMLElement) => {
            expect(element.style.height).toBe('');
          });
        });
      });

      describe('with the heigth set to 25.', () => {
        let structHTMLElement;
        let height: number;
        let heightForInput: number;
        beforeEach(() => {
          height = 25;
          heightForInput = height - 2;
          test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
            enableOmnibox: true,
            height: height
          });
          structHTMLElement = findHtmlElement(test.cmp.element);
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
      describe('with the heigth option not set, ', () => {
        let structHTMLElement;
        beforeEach(() => {
          test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
            enableOmnibox: false
          });
          structHTMLElement = findHtmlElement(test.cmp.element);
        });
        it('the Querybox should not be resize', () => {
          each(structHTMLElement, (element: HTMLElement) => {
            expect(element.style.height).toBe('');
          });
        });
      });

      describe('with the heigth set to 60.', () => {
        let structHTMLElement;
        let height: number;
        let heightForInput: number;
        beforeEach(() => {
          height = 60;
          heightForInput = height - 2;
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
