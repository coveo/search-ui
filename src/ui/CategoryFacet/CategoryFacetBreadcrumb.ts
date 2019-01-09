import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { CategoryValueDescriptor } from './CategoryFacet';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { l } from '../../strings/Strings';
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
    const captionLabel = pathToRender.join('/');

    const breadcrumbTitle = $$('span', { className: 'coveo-category-facet-breadcrumb-title' }, `${this.categoryFacetTitle}: `);
    const valuesContainer = $$('span', { className: 'coveo-category-facet-breadcrumb-values' }, captionLabel, clear);

    new AccessibleButton()
      .withElement(valuesContainer)
      .withLabel(l('RemoveFilterOn', captionLabel))
      .withSelectAction(this.onClickHandler)
      .build();

    const breadcrumb = $$('span', { className: 'coveo-category-facet-breadcrumb' }, breadcrumbTitle, valuesContainer);
    return breadcrumb.el;
  }
}
