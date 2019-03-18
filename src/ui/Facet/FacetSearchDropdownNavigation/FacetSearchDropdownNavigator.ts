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
    if (this.isCurrentResultSelectAllButton) {
      this.moveResultDownAndAnnounce();
    } else if (this.canExcludeCurrentResult) {
      this.toggleCanExcludeCurrentResult();
      this.moveResultDownAndAnnounce();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeExcluded();
    }
  }

  public focusPreviousElement() {
    if (!this.canExcludeCurrentResult) {
      this.moveResultUpAndAnnounce();
    } else {
      this.toggleCanExcludeCurrentResult();
      this.announceCurrentResultCanBeSelected();
    }
  }

  private moveResultDownAndAnnounce() {
    this.defaultDropdownNavigator.moveCurrentResultDown();
    this.announceCurrentResultCanBeSelected();
  }

  private moveResultUpAndAnnounce() {
    this.defaultDropdownNavigator.moveCurrentResultUp();

    if (this.isCurrentResultSelectAllButton) {
      return;
    }

    this.toggleCanExcludeCurrentResult();
    this.announceCurrentResultCanBeExcluded();
  }

  private get isCurrentResultSelectAllButton() {
    return this.currentResult.hasClass('coveo-facet-search-select-all');
  }

  private get canExcludeCurrentResult() {
    return this.currentResult.hasClass('coveo-facet-value-will-exclude');
  }

  private toggleCanExcludeCurrentResult() {
    this.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.canExcludeCurrentResult);
  }

  private announceCurrentResultAction() {
    this.canExcludeCurrentResult ? this.announceCurrentResultCanBeExcluded() : this.announceCurrentResultCanBeSelected();
  }

  private announceCurrentResultCanBeExcluded() {
    const excludeIconTitle = $$(this.currentResult).find('.coveo-facet-value-exclude').title;
    this.config.facetSearch.updateAriaLive(excludeIconTitle);
  }

  private announceCurrentResultCanBeSelected() {
    if (this.isCurrentResultSelectAllButton) {
      return;
    }

    const checkbox = this.currentResult.find('.coveo-facet-value-checkbox');
    const checkboxLabel = checkbox.getAttribute('aria-label');
    this.config.facetSearch.updateAriaLive(checkboxLabel);
  }
}
