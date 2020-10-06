import { ISearchDropdownNavigator, DefaultSearchDropdownNavigator, ISearchDropdownConfig } from './DefaultSearchDropdownNavigator';
import { $$, Dom } from '../../../utils/Dom';
import { IFacetSearch } from '../IFacetSearch';

export interface IFacetSearchDropdownConfig extends ISearchDropdownConfig {
  facetSearch: IFacetSearch;
}

export class FacetSearchDropdownNavigator implements ISearchDropdownNavigator {
  private defaultDropdownNavigator: DefaultSearchDropdownNavigator;

  constructor(private config: IFacetSearchDropdownConfig) {
    this.defaultDropdownNavigator = new DefaultSearchDropdownNavigator(config);
  }

  public setAsCurrentResult(dom: Dom) {
    this.defaultDropdownNavigator.setAsCurrentResult(dom);
  }

  public get currentResult() {
    return this.defaultDropdownNavigator.currentResult;
  }

  public focusNextElement() {
    this.toggleCanExcludeCurrentResult();

    if (this.willExcludeCurrentResult) {
      this.announceCurrentResultCanBeExcluded();
      return;
    }

    this.defaultDropdownNavigator.moveCurrentResultDown();
  }

  public focusPreviousElement() {
    if (this.willExcludeCurrentResult) {
      this.toggleCanExcludeCurrentResult();
      return;
    }

    this.moveResultUp();
    this.toggleCanExcludeCurrentResult();
  }

  private moveResultUp() {
    if (this.willExcludeCurrentResult) {
      this.toggleCanExcludeCurrentResult();
      return;
    }

    this.defaultDropdownNavigator.moveCurrentResultUp();
    this.toggleCanExcludeCurrentResult();
  }

  private get isCurrentResultNotAFacetValue() {
    return this.currentResult.hasClass('coveo-facet-search-select-all') || this.currentResult.hasClass('coveo-facet-value-not-found');
  }

  private get willExcludeCurrentResult() {
    return this.currentResult.hasClass('coveo-facet-value-will-exclude');
  }

  private toggleCanExcludeCurrentResult() {
    if (this.isCurrentResultNotAFacetValue) {
      return;
    }

    this.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.willExcludeCurrentResult);
  }

  private announceCurrentResultCanBeExcluded() {
    if (this.isCurrentResultNotAFacetValue) {
      return;
    }

    const excludeIcon = $$(this.currentResult).find('.coveo-facet-value-exclude');
    this.config.facetSearch.updateAriaLive(excludeIcon.getAttribute('aria-label'));
  }
}
