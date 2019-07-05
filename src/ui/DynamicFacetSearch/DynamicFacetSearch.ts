import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Utils } from '../../utils/Utils';
import { DynamicFacetSearchInput, IAccessibilityAttributes } from './DynamicFacetSearchInput';
import { DynamicFacetSearchValues } from './DynamicFacetSearchValues';
import { debounce, uniqueId } from 'underscore';
import { l } from '../../strings/Strings';

export class DynamicFacetSearch {
  public id: string;
  public element: HTMLElement;
  private input: DynamicFacetSearchInput;
  public values: DynamicFacetSearchValues;
  private facetSearchController: FacetSearchController;
  static delay = 400;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-search' }).el;
    this.id = uniqueId('coveo-dynamic-facet-search');

    this.facetSearchController = new FacetSearchController(this.facet);
    this.createAndAppendLabel();
    this.createAndAppendInput();
    this.createAndAppendValues();
  }

  private createAndAppendLabel() {
    const label = l('SearchFacetResults', this.facet.options.title);
    const labelElement = $$(
      'label',
      {
        id: `${this.id}-label`,
        className: 'coveo-dynamic-facet-search-label',
        for: `${this.id}-input`,
        ariaHidden: 'false'
      },
      label
    ).el;

    this.element.appendChild(labelElement);
  }

  private createAndAppendInput() {
    this.input = new DynamicFacetSearchInput(this);
    this.element.appendChild(this.input.element);
  }

  private createAndAppendValues() {
    this.values = new DynamicFacetSearchValues(this.facet, this);
    this.element.appendChild(this.values.element);
  }

  public clearAll() {
    this.debouncedTriggerNewFacetSearch.cancel();
    this.input.clearInput();
    this.values.clearValues();
  }

  public onInputChange(value: string) {
    this.debouncedTriggerNewFacetSearch.cancel();

    if (Utils.isEmptyString(value)) {
      return this.values.clearValues();
    }

    this.debouncedTriggerNewFacetSearch(value);
  }

  public onInputBlur() {
    if (!this.values.isMouseOnValue()) {
      this.clearAll();
    }
  }

  public updateAccessibilityAttributes(attributes: IAccessibilityAttributes) {
    this.input.updateAccessibilityAttributes(attributes);
  }

  public updateAriaLive(text: string) {
    this.facet.searchInterface.ariaLive.updateText(text);
  }

  private debouncedTriggerNewFacetSearch = debounce(this.triggerNewFacetSearch, DynamicFacetSearch.delay);

  private async triggerNewFacetSearch(terms: string) {
    const response = await this.facetSearchController.search(terms);
    this.values.renderFromResponse(response);
  }
}
