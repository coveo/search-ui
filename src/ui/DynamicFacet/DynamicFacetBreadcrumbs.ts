import 'styling/DynamicFacet/_DynamicFacetBreadcrumbs';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { SVGIcons } from '../../utils/SVGIcons';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IDynamicFacet, IDynamicFacetValue } from './IDynamicFacet';
import { escape } from 'underscore';
import { getHeadingTag } from '../../utils/AccessibilityUtils';

export interface IDynamicFacetBreadcrumbsOptions {
  headingLevel?: number;
}

export class DynamicFacetBreadcrumbs {
  public element: HTMLElement;

  constructor(private facet: IDynamicFacet, private readonly options?: IDynamicFacetBreadcrumbsOptions) {
    this.create();
  }

  private create() {
    this.element = $$('ul', { className: 'coveo-dynamic-facet-breadcrumb coveo-breadcrumb-item', ariaLabel: this.facet.options.title }).el;
    this.createAndAppendTitle();

    const activeFacetValues = this.facet.values.activeValues;
    const breadcrumbFacetValues = activeFacetValues.slice(0, this.facet.options.numberOfValuesInBreadcrumb);
    const collapsedFacetValues = activeFacetValues.slice(this.facet.options.numberOfValuesInBreadcrumb);

    this.createAndAppendBreadcrumbValues(breadcrumbFacetValues);

    if (collapsedFacetValues.length) {
      this.createAndAppendCollapsedBreadcrumbs(collapsedFacetValues);
    }
  }

  private createAndAppendTitle() {
    const titleElement = $$(
      getHeadingTag(this.options && this.options.headingLevel, 'h3'),
      { className: 'coveo-dynamic-facet-breadcrumb-title', ariaHidden: 'true' },
      `${this.facet.options.title}:`
    ).el;
    this.element.appendChild(titleElement);
  }

  private createAndAppendBreadcrumbValues(facetValues: IDynamicFacetValue[]) {
    facetValues.forEach(facetValue => this.createAndAppendBreadcrumbValue(facetValue));
  }

  private createAndAppendBreadcrumbValue(facetValue: IDynamicFacetValue) {
    const listContainer = $$('li', { className: 'coveo-dynamic-facet-breadcrumb-value-list-item' }).el;
    const valueElement = $$(
      'button',
      {
        type: 'button',
        className: 'coveo-dynamic-facet-breadcrumb-value',
        ariaLabel: l('RemoveFilterOn', facetValue.displayValue)
      },
      escape(facetValue.displayValue)
    ).el;
    const clearElement = $$('span', { className: 'coveo-dynamic-facet-breadcrumb-value-clear' }, SVGIcons.icons.mainClear).el;
    valueElement.appendChild(clearElement);

    $$(valueElement).on('click', () => this.valueSelectAction(facetValue));
    listContainer.appendChild(valueElement);
    this.element.appendChild(listContainer);
  }

  private valueSelectAction(facetValue: IDynamicFacetValue) {
    this.facet.deselectValue(facetValue.value);
    this.facet.enablePreventAutoSelectionFlag();
    this.facet.triggerNewQuery(() => this.logActionToAnalytics());
  }

  private logActionToAnalytics() {
    this.facet.logAnalyticsEvent(analyticsActionCauseList.breadcrumbFacet, this.facet.basicAnalyticsFacetMeta);
  }

  private createAndAppendCollapsedBreadcrumbs(facetValues: IDynamicFacetValue[]) {
    const label = l('NMore', `${facetValues.length}`);
    const title = facetValues.map(({ value }) => value).join('\n');
    const collapsedElement = $$(
      'button',
      {
        className: 'coveo-dynamic-facet-breadcrumb-collapse',
        type: 'button',
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
