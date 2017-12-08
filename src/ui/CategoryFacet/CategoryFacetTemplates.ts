import { $$, Dom } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export class CategoryFacetTemplates {
  private listElementTemplate: Dom;
  private listRoot: Dom;

  constructor() {
    this.listElementTemplate = this.createListElementTemplate();
    this.listRoot = $$('ol', { className: 'coveo-facet-values' });
  }

  public buildListRoot() {
    return this.listRoot.clone();
  }

  public buildListElement(value: string) {
    const listElement = this.listElementTemplate.clone(true);
    const valueCaption = $$(listElement.find('.coveo-category-facet-value-caption'));
    valueCaption.text(value);
    valueCaption.setAttribute('title', value);
    valueCaption.setAttribute('data-title-original-value', value);
    return listElement;
  }

  public buildCollapseArrow() {
    const collapseArrow = $$('span', { className: 'coveo-category-facet-collapse-children' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(collapseArrow.el, 'coveo-category-facet-collapse-children-svg');
    return collapseArrow;
  }

  private createListElementTemplate() {
    const valueElement = $$('span', { className: 'coveo-category-facet-value-caption' });
    const valueLabel = $$('label', { className: 'coveo-category-facet-value-label' }, valueElement);
    const listElement = $$('li', { className: 'coveo-category-facet-value' }, valueLabel);
    return listElement;
  }
}
