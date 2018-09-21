import { $$ } from './Dom';
import { l } from '../strings/Strings';

export enum LandmarkRoles {
  Navigation = 'navigation',
  Search = 'search',
  Main = 'main'
}

export class AccessibilityLandmarks {
  constructor(private element: HTMLElement) {
    this.tryToSetTabSectionLandmark();
    this.tryToSetFacetColumnLandmark();
    this.tryToSetSearchBoxLandmark();
    this.tryToSetResultsColumnLandmark();
    this.tryToSetPagerLandmark();
  }

  private tryToSetTabSectionLandmark() {
    const tabSection = $$(this.element).find('.coveo-tab-section');

    if (!tabSection) {
      return;
    }

    tabSection.setAttribute('role', LandmarkRoles.Navigation);
    tabSection.setAttribute('aria-label', l('Tabs'));
  }

  private tryToSetFacetColumnLandmark() {
    const facetColumn = $$(this.element).find('.coveo-facet-column');

    if (!facetColumn) {
      return;
    }

    facetColumn.setAttribute('role', LandmarkRoles.Search);
    facetColumn.setAttribute('aria-label', l('Facets'));
  }

  private tryToSetSearchBoxLandmark() {
    const searchBox = $$(this.element).find('.CoveoSearchbox');

    if (!searchBox) {
      return;
    }

    searchBox.setAttribute('role', LandmarkRoles.Search);
    searchBox.setAttribute('aria-label', l('SearchBox'));
  }

  private tryToSetResultsColumnLandmark() {
    const resultsColumn = $$(this.element).find('.coveo-results-column');

    if (!resultsColumn) {
      return;
    }

    resultsColumn.setAttribute('role', LandmarkRoles.Main);
    resultsColumn.setAttribute('aria-label', l('ResultsColumn'));
  }

  private tryToSetPagerLandmark() {
    const pager = $$(this.element).find('.CoveoPager');

    if (!pager) {
      return;
    }

    pager.setAttribute('role', LandmarkRoles.Navigation);
    pager.setAttribute('aria-label', l('ResultsPager'));
  }
}
