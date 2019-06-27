import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { Utils } from '../../utils/Utils';
import { DynamicFacetSearchInput } from './DynamicFacetSearchInput';

export class DynamicFacetSearch {
  public element: HTMLElement;
  private input: DynamicFacetSearchInput;
  private facetSearchController: FacetSearchController;
  private facetSearchTimeout: number;
  private facetSearchPromise: Promise<IFacetSearchResponse>;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-search' }).el;
    this.createAndAppendInput();
    this.facetSearchController = new FacetSearchController(this.facet);
  }

  private createAndAppendInput() {
    this.input = new DynamicFacetSearchInput(this.facet, this.onInputChange.bind(this));
    this.element.appendChild(this.input.element);
  }

  private onInputChange(value: string) {
    this.cancelAnyPendingSearchOperation();

    if (Utils.isEmptyString(value)) {
      return;
    }

    this.facetSearchTimeout = window.setTimeout(() => {
      this.triggerNewFacetSearch(value);
    }, this.facet.options.facetSearchDelay);
  }

  private async triggerNewFacetSearch(terms: string) {
    this.facetSearchPromise = this.facetSearchController.search(terms);

    if (this.facetSearchPromise) {
      // TODO: display search results
      await this.facetSearchPromise;
    }
  }

  private cancelAnyPendingSearchOperation() {
    if (Utils.exists(this.facetSearchTimeout)) {
      clearTimeout(this.facetSearchTimeout);
      this.facetSearchTimeout = undefined;
    }
    if (Utils.exists(this.facetSearchPromise)) {
      Promise.reject(this.facetSearchPromise).catch(() => {});
      this.facetSearchPromise = undefined;
    }
  }
}
