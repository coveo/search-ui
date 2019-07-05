import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Utils } from '../../utils/Utils';
import { DynamicFacetSearchInput } from './DynamicFacetSearchInput';
import { DynamicFacetSearchValues } from './DynamicFacetSearchValues';
import { debounce, uniqueId } from 'underscore';

export class DynamicFacetSearch {
  public id: string;
  public element: HTMLElement;
  private input: DynamicFacetSearchInput;
  private values: DynamicFacetSearchValues;
  private facetSearchController: FacetSearchController;
  static delay = 400;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-search' }).el;
    this.id = uniqueId('coveo-dynamic-facet-search-');

    this.facetSearchController = new FacetSearchController(this.facet);
    this.createAndAppendInput();
    this.createAndAppendValues();
  }

  private createAndAppendInput() {
    this.input = new DynamicFacetSearchInput(this.facet, this);
    this.element.appendChild(this.input.element);
  }

  private createAndAppendValues() {
    this.values = new DynamicFacetSearchValues(this.facet, this);
    this.element.appendChild(this.values.element);
  }

  public clear() {
    this.debouncedTriggerNewFacetSearch.cancel();
    this.input.reset();
    this.values.empty();
  }

  public onInputChange(value: string) {
    this.debouncedTriggerNewFacetSearch.cancel();

    if (Utils.isEmptyString(value)) {
      this.input.toggleExpanded(false);
      this.values.empty();
      return;
    }

    this.debouncedTriggerNewFacetSearch(value);
  }

  public onInputBlur() {
    if (!this.values.isMouseOnValue()) {
      this.clear();
    }
  }

  public updateActiveDescendant(valueId?: string) {
    this.input.updateActiveDescendant(valueId);
  }

  public moveActiveValueDown() {
    this.values.moveActiveValueDown();
  }

  public moveActiveValueUp() {
    this.values.moveActiveValueUp();
  }

  private debouncedTriggerNewFacetSearch = debounce(this.triggerNewFacetSearch, DynamicFacetSearch.delay);

  private async triggerNewFacetSearch(terms: string) {
    const response = await this.facetSearchController.search(terms);
    this.values.renderFromResponse(response);
    this.input.toggleExpanded(this.values.hasValues());
  }
}
