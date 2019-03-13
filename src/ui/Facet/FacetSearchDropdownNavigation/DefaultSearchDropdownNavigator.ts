import { first, last } from 'underscore';
import { $$, Dom } from '../../../utils/Dom';

export interface ISearchDropdownNavigator {
  focusNextElement: () => void;
  focusPreviousElement: () => void;
  currentResult: Dom;
  setAsCurrentResult: (el: Dom) => void;
}

export interface ISearchDropdownConfig {
  input: HTMLInputElement;
  searchResults: HTMLElement;
  setScrollTrigger: (value: boolean) => void;
}

export class DefaultSearchDropdownNavigator implements ISearchDropdownNavigator {
  public currentResult: Dom;

  constructor(private config: ISearchDropdownConfig) {}

  public setAsCurrentResult(toSet: Dom) {
    this.currentResult && this.currentResult.removeClass('coveo-facet-search-current-result');
    this.currentResult = toSet;
    toSet.addClass('coveo-facet-search-current-result');
    this.updateSelectedOption(toSet);
  }

  public focusNextElement() {
    this.moveCurrentResultDown();
  }

  public focusPreviousElement() {
    this.moveCurrentResultUp();
  }

  public moveCurrentResultDown() {
    let nextResult = this.currentResult.el.nextElementSibling;
    if (!nextResult) {
      nextResult = first(this.searchResults.children);
    }
    this.setAsCurrentResult($$(<HTMLElement>nextResult));
    this.highlightAndShowCurrentResultWithKeyboard();
  }

  public moveCurrentResultUp() {
    let previousResult = this.currentResult.el.previousElementSibling;
    if (!previousResult) {
      previousResult = last(this.searchResults.children);
    }
    this.setAsCurrentResult($$(<HTMLElement>previousResult));
    this.highlightAndShowCurrentResultWithKeyboard();
  }

  private highlightAndShowCurrentResultWithKeyboard() {
    this.currentResult.addClass('coveo-facet-search-current-result');
    this.config.setScrollTrigger(true);
    this.searchResults.scrollTop = this.currentResult.el.offsetTop;
  }

  private get searchResults() {
    return this.config.searchResults;
  }

  private updateSelectedOption(option: Dom) {
    this.config.input.setAttribute('aria-activedescendant', option.getAttribute('id'));

    const previouslySelectedOption = $$(this.searchResults).find('[aria-selected^="true"]');
    previouslySelectedOption && previouslySelectedOption.setAttribute('aria-selected', 'false');

    option.setAttribute('aria-selected', 'true');
  }
}
