import { $$, Dom } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { escape } from 'underscore';
import { l } from '../../strings/Strings';
import * as Globalize from 'globalize';

export interface CategoryFacetData {
  value: string;
  count: number;
}

export class CategoryFacetTemplates {
  private listRoot: Dom;
  private collapseArrow: Dom;

  constructor() {
    this.listRoot = $$('ul', { className: 'coveo-category-facet-values' });
    this.collapseArrow = $$('span', { className: 'coveo-category-facet-collapse-children' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(this.collapseArrow.el, 'coveo-category-facet-collapse-children-svg');
  }

  public buildListRoot() {
    return this.listRoot.clone(true);
  }

  public buildListElement(data: CategoryFacetData) {
    const div = $$('div', {}, this.createListElement(data));
    return $$(div.el.firstChild as HTMLElement);
  }

  public buildAllCategoriesButton() {
    const allCategoriesCaption = $$('span', { className: 'coveo-category-facet-all-categories-caption' }, l('AllCategories'));
    const allCategories = $$(
      'li',
      { className: 'coveo-category-facet-value coveo-category-facet-all-categories' },
      this.buildCollapseArrow(),
      allCategoriesCaption
    );
    return allCategories;
  }

  public buildEllipsis() {
    const ellipsisCaption = $$('span', { className: 'coveo-category-facet-ellipsis-caption' }, '[ ... ]');
    const ellipsis = $$('li', { className: 'coveo-category-facet-ellipsis' }, ellipsisCaption);
    return ellipsis;
  }

  public buildCollapseArrow() {
    return this.collapseArrow.clone(true);
  }

  private getFormattedCount(count: number) {
    return Globalize.format(count, 'n0');
  }

  private createListElement(data: CategoryFacetData) {
    return `<li class="coveo-category-facet-value">
        <label class="coveo-category-facet-value-label">
          <span title="${escape(data.value)}" class="coveo-category-facet-value-caption">${escape(data.value)}</span>
          <span class="coveo-category-facet-value-count">${this.getFormattedCount(data.count)}</span>
        </label>
      </li>`;
  }
}
