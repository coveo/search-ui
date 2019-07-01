import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Utils } from '../../utils/Utils';
import { DynamicFacetSearchInput } from './DynamicFacetSearchInput';
import { debounce, uniqueId } from 'underscore';

export class DynamicFacetSearch {
  public element: HTMLElement;
  private input: DynamicFacetSearchInput;
  private facetSearchController: FacetSearchController;
  private listboxId: string;
  static delay = 400;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-search' }).el;
    this.listboxId = uniqueId('coveo-dynamic-facet-search-listbox-');
    this.createAndAppendInput();
    this.facetSearchController = new FacetSearchController(this.facet);
  }

  private createAndAppendInput() {
    this.input = new DynamicFacetSearchInput(this.facet, this.onInputChange.bind(this), this.listboxId);
    this.element.appendChild(this.input.element);
  }

  private onInputChange(value: string) {
    this.debouncedTriggerNewFacetSearch.cancel();

    if (Utils.isEmptyString(value)) {
      return;
    }

    this.debouncedTriggerNewFacetSearch(value);
  }

  private debouncedTriggerNewFacetSearch = debounce(this.triggerNewFacetSearch, DynamicFacetSearch.delay);

  private async triggerNewFacetSearch(terms: string) {
    // TODO: display search results
    await this.facetSearchController.search(terms);
  }
}
