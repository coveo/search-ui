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

    const activeFacetValues = this.facet.values.activeFacetValues;
    const breadcrumbFacetValues = activeFacetValues.slice(0, this.facet.options.numberOfValuesInBreadcrumb);
    const collapsedFacetValues = activeFacetValues.slice(this.facet.options.numberOfValuesInBreadcrumb);

    this.createAndAppendBreadcrumbValues(breadcrumbFacetValues);

    if (collapsedFacetValues.length) {
      this.createAndAppendCollapsedBreadcrumbs(collapsedFacetValues);
    }
  }

  private createAndAppendTitle() {
    const titleElement = $$('h3', { className: 'coveo-ml-facet-breadcrumb-title' }, `${this.facet.options.title}:`).el;
    this.element.appendChild(titleElement);
  }

  private createAndAppendBreadcrumbValues(facetValues: MLFacetValue[]) {
    facetValues.forEach(facetValue => this.createAndAppendBreadcrumbValue(facetValue));
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

    $$(valueElement).on('click', () => this.valueSelectAction(facetValue));

    this.element.appendChild(valueElement);
  }

  private valueSelectAction(facetValue: MLFacetValue) {
    this.facet.deselectValue(facetValue.value);
    this.facet.triggerNewQuery();
  }

  private createAndAppendCollapsedBreadcrumbs(facetValues: MLFacetValue[]) {
    const label = l('NMore', `${facetValues.length}`);
    const title = facetValues.map(({ value }) => value).join('\n');
    const collapsedElement = $$(
      'button',
      {
        className: 'coveo-ml-facet-breadcrumb-collapse',
        title
      },
      label
    ).el;

    $$(collapsedElement).on('click', () => {
      $$(collapsedElement).remove();
      this.createAndAppendBreadcrumbValues(facetValues);
    });

    this.element.appendChild(collapsedElement);
  }
}
