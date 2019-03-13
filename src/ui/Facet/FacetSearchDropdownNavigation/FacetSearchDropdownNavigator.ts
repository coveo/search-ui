import { ISearchDropdownNavigator, DefaultSearchDropdownNavigator, ISearchDropdownConfig } from './DefaultSearchDropdownNavigator';
import { $$, Dom } from '../../../utils/Dom';
import { IFacetSearch } from '../IFacetSearch';
import { debounce } from 'underscore';

export interface IFacetSearchDropdownConfig extends ISearchDropdownConfig {
  facetSearch: IFacetSearch;
}

export class FacetSearchDropdownNavigator implements ISearchDropdownNavigator {
  private defaultDropdownNavigator: DefaultSearchDropdownNavigator;
  private debounceAnnounceCurrentResultAction = debounce(() => this.announceCurrentResultAction(), 500);

  constructor(private config: IFacetSearchDropdownConfig) {
    this.defaultDropdownNavigator = new DefaultSearchDropdownNavigator(config);
  }

  public setAsCurrentResult(dom: Dom) {
    this.defaultDropdownNavigator.setAsCurrentResult(dom);
    this.debounceAnnounceCurrentResultAction();
  }

  public get currentResult() {
    return this.defaultDropdownNavigator.currentResult;
  }

  public focusNextElement() {
    if (this.canExcludeCurrentResult) {
      this.toggleCanExcludeCurrentResult();
      this.defaultDropdownNavigator.moveCurrentResultDown();
      this.announceCurrentResultCanBeSelected();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeExcluded();
    }
  }

  public focusPreviousElement() {
    if (!this.canExcludeCurrentResult) {
      this.defaultDropdownNavigator.moveCurrentResultUp();
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeExcluded();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeSelected();
    }
  }

  private get canExcludeCurrentResult() {
    return this.defaultDropdownNavigator.currentResult.hasClass('coveo-facet-value-will-exclude');
  }

  private toggleCanExcludeCurrentResult() {
    this.defaultDropdownNavigator.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.canExcludeCurrentResult);
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
