import 'styling/DynamicFacet/_DynamicFacetBreadcrumbs';
import { $$ } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { ICategoryFacet } from './ICategoryFacet';
import { l } from '../../strings/Strings';
import { without } from 'underscore';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';

export class CategoryFacetBreadcrumb {
  public element: HTMLElement;

  constructor(private facet: ICategoryFacet) {
    this.create();
  }

  private create() {
    this.element = $$('div', { className: 'coveo-dynamic-facet-breadcrumb coveo-breadcrumb-item' }).el;

    const pathToRender = without(this.facet.activePath, ...this.facet.options.basePath);
    const captionLabel = pathToRender.map(pathPart => this.facet.getCaption(pathPart)).join(' / ');

    this.createAndAppendTitle();
    this.createAndAppendCaption(captionLabel);
  }

  private createAndAppendTitle() {
    const titleElement = $$('h3', { className: 'coveo-dynamic-facet-breadcrumb-title' }, `${this.facet.options.title}:`).el;
    this.element.appendChild(titleElement);
  }

  private createAndAppendCaption(caption: string) {
    const valueElement = $$(
      'button',
      {
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
    this.facet.clear();
    this.facet.triggerNewQuery(() => this.facet.logAnalyticsEvent(analyticsActionCauseList.categoryFacetBreadcrumb));
  }
}
