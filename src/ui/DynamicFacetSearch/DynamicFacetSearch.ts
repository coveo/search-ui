import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Utils } from '../../utils/Utils';
import { DynamicFacetSearchInput, IAccessibilityAttributes } from './DynamicFacetSearchInput';
import { DynamicFacetSearchValues } from './DynamicFacetSearchValues';
import { debounce, uniqueId } from 'underscore';
import { l } from '../../strings/Strings';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';

export class DynamicFacetSearch {
  public id: string;
  public element: HTMLElement;
  private input: DynamicFacetSearchInput;
  public values: DynamicFacetSearchValues;
  private waitAnimationElement: HTMLElement;
  private facetSearchController: FacetSearchController;
  static delay = 400;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-search' }).el;
    this.id = uniqueId('coveo-dynamic-facet-search');

    this.facetSearchController = new FacetSearchController(this.facet);
    this.createAndAppendLabel();
    this.createAndAppendInput();
    this.createAndAppendWaitAnimation();
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

  private createAndAppendWaitAnimation() {
    this.waitAnimationElement = $$('div', { className: 'coveo-dynamic-facet-search-wait-animation' }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(this.waitAnimationElement, 'coveo-dynamic-facet-header-wait-animation-svg');
    this.toggleWaitAnimation(false);
    this.element.appendChild(this.waitAnimationElement);
  }

  private toggleWaitAnimation(show: boolean) {
    $$(this.waitAnimationElement).toggle(show);
  }

  private createAndAppendValues() {
    this.values = new DynamicFacetSearchValues(this.facet, this);
    this.element.appendChild(this.values.element);
  }

  public clearAll() {
    this.cancelFacetSearch();
    this.input.clearInput();
    this.values.clearValues();
  }

  public onInputChange(value: string) {
    this.cancelFacetSearch();

    if (Utils.isEmptyString(value)) {
      return this.values.clearValues();
    }

    this.toggleWaitAnimation(true);
    this.debouncedTriggerNewFacetSearch(value);
  }

  public onInputBlur() {
    if (!this.values.mouseIsOverValue) {
      this.clearAll();
    }
  }

  public updateAccessibilityAttributes(attributes: IAccessibilityAttributes) {
    this.input.updateAccessibilityAttributes(attributes);
  }

  public updateAriaLive(text: string) {
    this.facet.searchInterface.ariaLive.updateText(text);
  }

  private cancelFacetSearch() {
    this.toggleWaitAnimation(false);
    this.debouncedTriggerNewFacetSearch.cancel();
  }

  private debouncedTriggerNewFacetSearch = debounce(this.triggerNewFacetSearch, DynamicFacetSearch.delay);

  private async triggerNewFacetSearch(terms: string) {
    const response = await this.facetSearchController.search(terms);
    this.toggleWaitAnimation(false);
    this.values.renderFromResponse(response);
  }
}
