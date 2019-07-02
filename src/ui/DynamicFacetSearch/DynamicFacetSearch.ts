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
  private input: DynamicFacetSearchInput;
  private results: DynamicFacetSearchResults;
  private facetSearchController: FacetSearchController;
  private id: string;
  static delay = 200;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-search' }).el;
    this.id = uniqueId('coveo-dynamic-facet-search-');
    this.createAndAppendInput();
    this.createAndAppendResults();
    this.facetSearchController = new FacetSearchController(this.facet);
  }

  private createAndAppendInput() {
    this.input = new DynamicFacetSearchInput(this.facet, this.onInputChange.bind(this), this.id);
    this.element.appendChild(this.input.element);
  }

  private createAndAppendResults() {
    this.results = new DynamicFacetSearchResults(this.facet, this.id);
    this.element.appendChild(this.results.element);
  }

  private onInputChange(value: string) {
    this.debouncedTriggerNewFacetSearch.cancel();

    if (Utils.isEmptyString(value)) {
      return this.results.empty();
    }

    this.debouncedTriggerNewFacetSearch(value);
  }

  private debouncedTriggerNewFacetSearch = debounce(this.triggerNewFacetSearch, DynamicFacetSearch.delay);

  private async triggerNewFacetSearch(terms: string) {
    const response = await this.facetSearchController.search(terms);
    this.results.createFromResponse(response);
    this.results.render();
  }
}
