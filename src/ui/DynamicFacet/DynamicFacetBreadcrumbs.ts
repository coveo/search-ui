import 'styling/DynamicFacet/_DynamicFacetBreadcrumbs';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { DynamicFacet } from './DynamicFacet';
import { SVGIcons } from '../../utils/SVGIcons';
import { DynamicFacetValue } from './DynamicFacetValues/DynamicFacetValue';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';

export class DynamicFacetBreadcrumbs {
  public element: HTMLElement;

  constructor(private facet: DynamicFacet) {
    this.create();
  }

  private create() {
    this.element = $$('div', { className: 'coveo-dynamic-facet-breadcrumb coveo-breadcrumb-item' }).el;
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
    const titleElement = $$('h3', { className: 'coveo-dynamic-facet-breadcrumb-title' }, `${this.facet.options.title}:`).el;
    this.element.appendChild(titleElement);
  }

  private createAndAppendBreadcrumbValues(facetValues: DynamicFacetValue[]) {
    facetValues.forEach(facetValue => this.createAndAppendBreadcrumbValue(facetValue));
  }

  private createAndAppendBreadcrumbValue(facetValue: DynamicFacetValue) {
    const valueElement = $$(
      'button',
      {
        className: 'coveo-dynamic-facet-breadcrumb-value',
        ariaLabel: l('RemoveFilterOn', facetValue.displayValue)
      },
      facetValue.displayValue
    ).el;
    const clearElement = $$('span', { className: 'coveo-dynamic-facet-breadcrumb-value-clear' }, SVGIcons.icons.mainClear).el;
    valueElement.appendChild(clearElement);

    $$(valueElement).on('click', () => this.valueSelectAction(facetValue));

    this.element.appendChild(valueElement);
  }

  private valueSelectAction(facetValue: DynamicFacetValue) {
    this.facet.deselectValue(facetValue.value);
    this.facet.triggerNewQuery(() => this.logActionToAnalytics());
  }

  private logActionToAnalytics() {
    this.facet.logAnalyticsEvent(analyticsActionCauseList.breadcrumbFacet, this.facet.basicAnalyticsFacetMeta);
  }

  private createAndAppendCollapsedBreadcrumbs(facetValues: DynamicFacetValue[]) {
    const label = l('NMore', `${facetValues.length}`);
    const title = facetValues.map(({ value }) => value).join('\n');
    const collapsedElement = $$(
      'button',
      {
        className: 'coveo-dynamic-facet-breadcrumb-collapse',
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
