import { ISearchDropdownNavigator, DefaultSearchDropdownNavigator, ISearchDropdownConfig } from './DefaultSearchDropdownNavigator';
import { $$, Dom } from '../../../utils/Dom';
import { IFacetSearch } from '../IFacetSearch';
import { debounce } from 'underscore';

export interface IFacetSearchDropdownConfig extends ISearchDropdownConfig {
  facetSearch: IFacetSearch;
}

export class FacetSearchDropdownNavigator implements ISearchDropdownNavigator {
  private searchDropdownNavigator: DefaultSearchDropdownNavigator;
  private debounceAnnounceCurrentResultAction = debounce(() => this.announceCurrentResultAction(), 500);

  constructor(private config: IFacetSearchDropdownConfig) {
    this.searchDropdownNavigator = new DefaultSearchDropdownNavigator(config);
  }

  public setAsCurrentResult(dom: Dom) {
    this.searchDropdownNavigator.setAsCurrentResult(dom);
    this.debounceAnnounceCurrentResultAction();
  }

  public get currentResult() {
    return this.searchDropdownNavigator.currentResult;
  }

  public nextFocusableElement() {
    if (this.canExcludeCurrentResult) {
      this.toggleCanExcludeCurrentResult();
      this.searchDropdownNavigator.moveCurrentResultDown();
      this.announceCurrentResultCanBeSelected();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeExcluded();
    }
  }

  public previousFocusableElement() {
    if (!this.canExcludeCurrentResult) {
      this.searchDropdownNavigator.moveCurrentResultUp();
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeExcluded();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeSelected();
    }
  }

  private get canExcludeCurrentResult() {
    return this.searchDropdownNavigator.currentResult.hasClass('coveo-facet-value-will-exclude');
  }

  private toggleCanExcludeCurrentResult() {
    this.searchDropdownNavigator.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.canExcludeCurrentResult);
  }

  private announceCurrentResultAction() {
    this.canExcludeCurrentResult ? this.announceCurrentResultCanBeExcluded() : this.announceCurrentResultCanBeSelected();
  }

  private announceCurrentResultCanBeExcluded() {
    const excludeIconTitle = $$(this.currentResult).find('.coveo-facet-value-exclude').title;
    this.config.facetSearch.updateAriaLive(excludeIconTitle);
  }

  private announceCurrentResultCanBeSelected() {
    const checkbox = this.currentResult.find('.coveo-facet-value-checkbox');
    const checkboxLabel = checkbox.getAttribute('aria-label');
    this.config.facetSearch.updateAriaLive(checkboxLabel);
  }
}
