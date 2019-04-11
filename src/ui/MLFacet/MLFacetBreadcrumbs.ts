import 'styling/MLFacet/_MLFacetBreadcrumbs';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { MLFacet } from './MLFacet';
import { SVGIcons } from '../../utils/SVGIcons';
import { MLFacetValue } from './MLFacetValues/MLFacetValue';

export class MLFacetBreadcrumbs {
  public element: HTMLElement;

  constructor(private facet: MLFacet) {
    this.create();
  }

  private create() {
    this.element = $$('div', { className: 'coveo-ml-facet-breadcrumb coveo-breadcrumb-item' }).el;
    this.createAndAppendTitle();
    this.facet.values.nonIdleFacetValues.forEach(facetValue => this.createAndAppendBreadcrumbValue(facetValue));
  }

  private createAndAppendTitle() {
    const titleElement = $$('h2', { className: 'coveo-ml-facet-breadcrumb-title' }, `${this.facet.options.title}:`).el;
    this.element.appendChild(titleElement);
  }

  private createAndAppendBreadcrumbValue(facetValue: MLFacetValue) {
    const valueElement = $$(
      'button',
      {
        className: 'coveo-ml-facet-breadcrumb-value',
        ariaLabel: l('RemoveFilterOn', facetValue.valueCaption)
      },
      facetValue.valueCaption
    ).el;
    const clearElement = $$('span', { className: 'coveo-ml-facet-breadcrumb-value-clear' }, SVGIcons.icons.mainClear).el;
    valueElement.appendChild(clearElement);

    $$(valueElement).on('click', () => this.selectAction(facetValue));

    this.element.appendChild(valueElement);
  }

  private selectAction(facetValue: MLFacetValue) {
    this.facet.deselectValue(facetValue.value);
    this.facet.triggerNewQuery();
  }
}
