import 'styling/DynamicFacet/_DynamicFacetBreadcrumbs';
import { $$ } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { IDynamicHierarchicalFacet } from './IDynamicHierarchicalFacet';
import { l } from '../../strings/Strings';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { getHeadingTag } from '../../utils/AccessibilityUtils';

export interface IDynamicHierarchicalFacetBreadcrumbsOptions {
  headingLevel?: number;
}

export class DynamicHierarchicalFacetBreadcrumb {
  public element: HTMLElement;

  constructor(private facet: IDynamicHierarchicalFacet, private readonly options?: IDynamicHierarchicalFacetBreadcrumbsOptions) {
    this.create();
  }

  private create() {
    this.element = $$('div', { className: 'coveo-dynamic-facet-breadcrumb coveo-breadcrumb-item' }).el;

    const pathToRender = this.facet.values.selectedPath;
    const captionLabel = pathToRender.map(pathPart => this.facet.getCaption(pathPart)).join(' / ');

    this.createAndAppendTitle();
    this.createAndAppendCaption(captionLabel);
  }

  private createAndAppendTitle() {
    const titleElement = $$(
      getHeadingTag(this.options && this.options.headingLevel, 'h3'),
      { className: 'coveo-dynamic-facet-breadcrumb-title' },
      `${this.facet.options.title}:`
    ).el;
    this.element.appendChild(titleElement);
  }

  private createAndAppendCaption(caption: string) {
    const valueElement = $$(
      'button',
      {
        type: 'button',
        className: 'coveo-dynamic-facet-breadcrumb-value',
        ariaLabel: l('RemoveFilterOn', caption)
      },
      caption
    ).el;
    const clearElement = $$('span', { className: 'coveo-dynamic-facet-breadcrumb-value-clear' }, SVGIcons.icons.mainClear).el;
    valueElement.appendChild(clearElement);

    $$(valueElement).on('click', () => this.valueSelectAction());

    this.element.appendChild(valueElement);
  }

  private valueSelectAction() {
    this.facet.reset();
    this.facet.triggerNewQuery(() => this.facet.logAnalyticsEvent(analyticsActionCauseList.breadcrumbFacet));
  }
}
