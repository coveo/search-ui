import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Utils } from '../../utils/Utils';
import { DynamicFacetSearchInput } from './DynamicFacetSearchInput';
import { DynamicFacetSearchResults } from './DynamicFacetSearchResults';
import { debounce, uniqueId } from 'underscore';

export class DynamicFacetSearch {
  public element: HTMLElement;
  public input: DynamicFacetSearchInput;
  public id: string;
  private results: DynamicFacetSearchResults;
  private facetSearchController: FacetSearchController;
  static delay = 400;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-search' }).el;
    this.id = uniqueId('coveo-dynamic-facet-search-');

    this.facetSearchController = new FacetSearchController(this.facet);
    this.createAndAppendInput();
    this.createAndAppendResults();
  }

  private createAndAppendInput() {
    this.input = new DynamicFacetSearchInput(this.facet, this);
    this.element.appendChild(this.input.element);
  }

  private createAndAppendResults() {
    this.results = new DynamicFacetSearchResults(this.facet, this);
    this.element.appendChild(this.results.element);
  }

  public clear() {
    this.debouncedTriggerNewFacetSearch.cancel();
    this.input.reset();
    this.results.empty();
  }

  public onInputChange(value: string) {
    this.debouncedTriggerNewFacetSearch.cancel();

    if (Utils.isEmptyString(value)) {
      this.input.toggleExpanded(false);
      this.results.empty();
      return;
    }

    this.debouncedTriggerNewFacetSearch(value);
  }

  public onInputBlur() {
    if (!this.results.hasActiveResult()) {
      this.clear();
    }
  }

  public updateActiveResult(resultId?: string) {
    this.input.updateActiveDescendant(resultId);
    this.results.updateActiveResult(resultId);
  }

  private debouncedTriggerNewFacetSearch = debounce(this.triggerNewFacetSearch, DynamicFacetSearch.delay);

  private async triggerNewFacetSearch(terms: string) {
    const response = await this.facetSearchController.search(terms);
    this.results.createFromResponse(response);
    this.results.render();
    this.input.toggleExpanded(this.results.hasValues());
  }
}
