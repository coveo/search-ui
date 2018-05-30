import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';

export class CategoryFacetBreadcrumbBuilder {
  constructor(
    private categoryFacetTitle: string,
    private path: string[],
    private onClickHandler: (e: MouseEvent) => void,
    private valueCaption: string,
    private valueCount: string
  ) {}

  public build(): HTMLElement {
    const clear = $$(
      'span',
      {
        className: 'coveo-facet-breadcrumb-clear'
      },
      SVGIcons.icons.checkboxHookExclusionMore
    );
    SVGDom.addClassToSVGInContainer(clear.el, 'coveo-facet-breadcrumb-clear-svg');

    const title = `${this.valueCaption} ${this.valueCount}`;
    const breadcrumbTitle = $$('span', { className: 'coveo-category-facet-breadcrumb-title' }, `${this.categoryFacetTitle}: `);
    const values = $$('span', { className: 'coveo-category-facet-breadcrumb-values' }, this.path.join('/'), clear);
    const breadcrumb = $$('span', { className: 'coveo-category-facet-breadcrumb', title }, breadcrumbTitle, values);
    breadcrumb.on('click', this.onClickHandler);
    return breadcrumb.el;
  }
}
