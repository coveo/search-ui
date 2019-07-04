import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Utils } from '../../utils/Utils';
import { DynamicFacetSearchInput } from './DynamicFacetSearchInput';
import { DynamicFacetSearchResults } from './DynamicFacetSearchResults';
import { debounce, uniqueId } from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';

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
    this.onDocumentClick = this.onDocumentClick.bind(this);

    $$(this.facet.root).on(InitializationEvents.nuke, this.removeDocumentClickListener.bind(this));

    this.facetSearchController = new FacetSearchController(this.facet);
    this.createAndAppendInput();
    this.createAndAppendResults();
  }

  public clear() {
    this.input.reset();
    this.results.empty();
  }

  private createAndAppendInput() {
    this.input = new DynamicFacetSearchInput(this.facet, this);
    this.element.appendChild(this.input.element);
  }

  private createAndAppendResults() {
    this.results = new DynamicFacetSearchResults(this.facet, this);
    this.element.appendChild(this.results.element);
  }

  public onInputChange(value: string) {
    this.removeDocumentClickListener();
    this.debouncedTriggerNewFacetSearch.cancel();

    if (Utils.isEmptyString(value)) {
      this.input.toggleExpanded(false);
      this.results.empty();
      return;
    }

    this.addDocumentClickListener();
    this.debouncedTriggerNewFacetSearch(value);
  }

  private onDocumentClick(e: MouseEvent) {
    if (!this.isTargetInSearch(<HTMLElement>e.target)) {
      this.clear();
    }
  }

  private isTargetInSearch(target: HTMLElement) {
    const parent = $$(target).parent('coveo-dynamic-facet-search');
    return parent && parent === this.element;
  }

  private addDocumentClickListener() {
    document.addEventListener('click', this.onDocumentClick);
  }

  private removeDocumentClickListener() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  private debouncedTriggerNewFacetSearch = debounce(this.triggerNewFacetSearch, DynamicFacetSearch.delay);

  private async triggerNewFacetSearch(terms: string) {
    console.log('triggering');
    const response = await this.facetSearchController.search(terms);
    this.results.createFromResponse(response);
    this.results.render();
    this.input.toggleExpanded(this.results.hasValues());
  }
}
