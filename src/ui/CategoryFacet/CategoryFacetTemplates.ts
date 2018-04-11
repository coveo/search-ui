import { $$, Dom } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import _ = require('underscore');

export interface CategoryFacetData {
  value: string;
  count: number;
}

export class CategoryFacetTemplates {
  private listRoot: Dom;
  private collapseArrow: Dom;

  constructor() {
    this.listRoot = $$('ul', { className: 'coveo-facet-values' });
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

  public buildCollapseArrow() {
    return this.collapseArrow.clone(true);
  }

  private createListElement(data: CategoryFacetData) {
    return `<li class="coveo-category-facet-value">
        <label class="coveo-category-facet-value-label">
          <span title="${_.escape(data.value)}" class="coveo-category-facet-value-caption">${_.escape(data.value)}</span>
          <span class="coveo-category-facet-value-count">${data.count}</span>
        </label>
      </li>`;
  }
}
