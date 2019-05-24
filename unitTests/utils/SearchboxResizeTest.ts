import * as Mock from '../MockEnvironment';
import { Searchbox } from '../../src/ui/Searchbox/Searchbox';
import { ISearchboxOptions } from '../../src/ui/Searchbox/Searchbox';
import { $$ } from '../../src/utils/Dom';

interface HTMLElements {
  CoveoOmniboxOrQuery: HTMLElement;
  CoveoSearchButton: HTMLElement;
  input: HTMLElement;
  magicBoxIcon: HTMLElement;
  magicBoxClear: HTMLElement;
  magicBoxInput: HTMLElement;
}

function findHtmlElement(element: HTMLElement): HTMLElements {
  return {
    CoveoOmniboxOrQuery: $$(element).find('.CoveoOmnibox') || $$(element).find('.CoveoQuerybox'),
    CoveoSearchButton: $$(element).find('.CoveoSearchButton'),
    input: $$($$(element).find('.magic-box-input')).find('input'),
    magicBoxIcon: $$(element).find('.magic-box-icon'),
    magicBoxClear: $$(element).find('.magic-box-clear'),
    magicBoxInput: $$(element).find('.magic-box-input')
  };
}

export function SearchboxResizeTest() {
  describe('SearchboxResize', () => {
    var test: Mock.IBasicComponentSetup<Searchbox>;
    describe('with an Omnibox as the Searchbox', () => {
      it('should not be resize', () => {
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: true
        });
        var structHTMLElement: HTMLElements = findHtmlElement(test.cmp.element);
        for (let element in structHTMLElement) {
          expect(structHTMLElement[element].style.height).toBe('');
        }
      });

      it('should be resize', () => {
        let height = 25;
        let heightForInput = height - 2;
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: true,
          height: height
        });
        var structHTMLElement: HTMLElements = findHtmlElement(test.cmp.element);
        for (let element in structHTMLElement) {
          if (structHTMLElement[element] === structHTMLElement.magicBoxInput) {
            expect(structHTMLElement[element].style.height).toBe(`${heightForInput}px`);
          } else {
            expect(structHTMLElement[element].style.height).toBe(`${height}px`);
          }
        }
      });
    });

    describe('with a QueryBox as the Searchbox', () => {
      it('should not be resize', () => {
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: false
        });
        var structHTMLElement: HTMLElements = findHtmlElement(test.cmp.element);
        for (let element in structHTMLElement) {
          expect(structHTMLElement[element].style.height).toBe('');
        }
      });

      it('should be resize', () => {
        let height = 60;
        let heightForInput = height - 2;
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: false,
          height: height
        });
        var structHTMLElement: HTMLElements = findHtmlElement(test.cmp.element);
        for (let element in structHTMLElement) {
          if (structHTMLElement[element] === structHTMLElement.magicBoxInput) {
            expect(structHTMLElement[element].style.height).toBe(`${heightForInput}px`);
          } else {
            expect(structHTMLElement[element].style.height).toBe(`${height}px`);
          }
        }
      });
    });
  });
}
