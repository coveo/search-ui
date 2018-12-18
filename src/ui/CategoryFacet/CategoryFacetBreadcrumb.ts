import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { CategoryValueDescriptor } from './CategoryFacet';
import { without } from 'underscore';

export class CategoryFacetBreadcrumb {
  constructor(
    private categoryFacetTitle: string,
    private onClickHandler: (e: MouseEvent) => void,
    private categoryValueDescriptor: CategoryValueDescriptor,
    private basePath: string[]
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
    const pathToRender = without(this.categoryValueDescriptor.path, ...this.basePath);

    const title = `${this.categoryValueDescriptor.value} ${this.categoryValueDescriptor.count}`;
    const breadcrumbTitle = $$('span', { className: 'coveo-category-facet-breadcrumb-title' }, `${this.categoryFacetTitle}: `);
    const values = $$('span', { className: 'coveo-category-facet-breadcrumb-values' }, pathToRender.join('/'), clear);
    const breadcrumb = $$('span', { className: 'coveo-category-facet-breadcrumb', title }, breadcrumbTitle, values);
    breadcrumb.on('click', this.onClickHandler);
    return breadcrumb.el;
  }
}
