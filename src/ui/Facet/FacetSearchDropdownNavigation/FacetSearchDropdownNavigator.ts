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
    if (this.isCurrentResultNotAFacetValue) {
      this.moveResultDownAndAnnounce();
      return;
    }

    this.toggleCanExcludeCurrentResult();

    if (this.canExcludeCurrentResult) {
      this.announceCurrentResultCanBeExcluded();
      return;
    }

    this.moveResultDownAndAnnounce();
  }

  public focusPreviousElement() {
    if (this.canExcludeCurrentResult) {
      this.toggleCanExcludeCurrentResult();
      return;
    }

    this.moveResultUpAndAnnounce();
  }

  private moveResultDownAndAnnounce() {
    this.defaultDropdownNavigator.moveCurrentResultDown();
  }

  private moveResultUpAndAnnounce() {
    this.defaultDropdownNavigator.moveCurrentResultUp();

    if (!this.canExcludeCurrentResult) {
      return;
    }
    this.toggleCanExcludeCurrentResult();
    this.announceCurrentResultCanBeExcluded();
  }

  private get isCurrentResultNotAFacetValue() {
    return this.currentResult.hasClass('coveo-facet-search-select-all') || this.currentResult.hasClass('coveo-facet-value-not-found');
  }

  private get canExcludeCurrentResult() {
    return this.currentResult.hasClass('coveo-facet-value-will-exclude');
  }

  private toggleCanExcludeCurrentResult() {
    this.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.canExcludeCurrentResult);
  }

  private announceCurrentResultCanBeExcluded() {
    const excludeIconTitle = $$(this.currentResult)
      .find('.coveo-facet-value-exclude')
      .getAttribute('aria-label');
    this.config.facetSearch.updateAriaLive(excludeIconTitle);
  }
}
