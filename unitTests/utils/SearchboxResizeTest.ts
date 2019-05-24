import * as Mock from '../MockEnvironment';
import { Searchbox } from '../../src/ui/Searchbox/Searchbox';
import { ISearchboxOptions } from '../../src/ui/Searchbox/Searchbox';
import { $$ } from '../../src/utils/Dom';
import _ = require('underscore');

function findHtmlElement(element: HTMLElement, HTMLElements) {
  HTMLElements.CoveoOmniboxOrQuery = $$(element).find('.CoveoOmnibox') || $$(element).find('.CoveoQuerybox');
  HTMLElements.CoveoSearchButton = $$(element).find('.CoveoSearchButton');
  HTMLElements.input = $$($$(element).find('.magic-box-input')).find('input');
  HTMLElements.magicBoxIcon = $$(element).find('.magic-box-icon');
  HTMLElements.magicBoxClear = $$(element).find('.magic-box-clear');
  HTMLElements.magicBoxInput = $$(element).find('.magic-box-input');
}

export function SearchboxResizeTest() {
  describe('SearchboxResize', () => {
    var test: Mock.IBasicComponentSetup<Searchbox>;
    var structHTMLElement = {
      CoveoOmniboxOrQuery: document.createElement('div'),
      CoveoSearchButton: document.createElement('div'),
      input: document.createElement('input'),
      magicBoxIcon: document.createElement('div'),
      magicBoxClear: document.createElement('div'),
      magicBoxInput: document.createElement('div')
    };
    describe('with an Omnibox as the Searchbox', () => {
      it('should not be resize', () => {
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: true
        });
        findHtmlElement(test.cmp.element, structHTMLElement);
        _.forEach(structHTMLElement, element => {
          expect(element.style.height).toBe('');
        });
      });

      it('should be resize', () => {
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: true,
          height: 25
        });
        findHtmlElement(test.cmp.element, structHTMLElement);
        _.forEach(structHTMLElement, element => {
          if (element === structHTMLElement.magicBoxInput) {
            expect(element.style.height).toBe('23px');
          } else {
            expect(element.style.height).toBe('25px');
          }
        });
      });
    });

    describe('with a QueryBox as the Searchbox', () => {
      it('should not be resize', () => {
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: false
        });
        findHtmlElement(test.cmp.element, structHTMLElement);
        _.forEach(structHTMLElement, element => {
          expect(element.style.height).toBe('');
        });
      });

      it('should be resize', () => {
        test = Mock.optionsComponentSetup<Searchbox, ISearchboxOptions>(Searchbox, {
          enableOmnibox: false,
          height: 60
        });
        findHtmlElement(test.cmp.element, structHTMLElement);
        _.forEach(structHTMLElement, element => {
          if (element === structHTMLElement.magicBoxInput) {
            expect(element.style.height).toBe('58px');
          } else {
            expect(element.style.height).toBe('60px');
          }
        });
      });
    });
  });
}
