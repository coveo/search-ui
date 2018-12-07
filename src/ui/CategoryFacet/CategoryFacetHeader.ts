import { CategoryFacet } from './CategoryFacet';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { AccessibleButton } from '../../utils/AccessibleButton';

export interface ICategoryFacetHeaderOptions {
  categoryFacet: CategoryFacet;
  title: string;
}

export class CategoryFacetHeader {
  public element: HTMLElement;
  public eraserElement: HTMLElement;
  public waitElement: HTMLElement;

  constructor(public options: ICategoryFacetHeaderOptions) {
    this.element = document.createElement('div');
    $$(this.element).addClass('coveo-facet-header');
  }

  public build(): HTMLElement {
    this.waitElement = this.buildWaitAnimation();

    const titleSection = $$(
      'div',
      {
        className: 'coveo-category-facet-title',
        role: 'heading',
        'aria-level': '2',
        'aria-label': `${l('FacetTitle', this.options.title)}.`
      },
      this.options.title
    );
    this.element = $$('div', { className: 'coveo-category-facet-header' }, titleSection).el;
    $$(this.element).append(this.waitElement);

    this.buildClearIcon();
    $$(this.element).append(this.eraserElement);
    return this.element;
  }

  private buildWaitAnimation(): HTMLElement {
    this.waitElement = $$('div', { className: CategoryFacet.WAIT_ELEMENT_CLASS }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(this.waitElement, 'coveo-category-facet-header-wait-animation-svg');
    this.waitElement.style.visibility = 'hidden';
    return this.waitElement;
  }

  private buildClearIcon() {
    const title = l('Clear', this.options.title);
    this.eraserElement = $$(
      'div',
      { className: 'coveo-category-facet-header-eraser coveo-facet-header-eraser' },
      SVGIcons.icons.mainClear
    ).el;

    SVGDom.addClassToSVGInContainer(this.eraserElement, 'coveo-facet-header-eraser-svg');

    const onClearClick = () => {
      this.options.categoryFacet.reset();
    };

    new AccessibleButton()
      .withElement(this.eraserElement)
      .withTitle(title)
      .withLabel(title)
      .withClickAction(onClearClick)
      .withEnterKeyboardAction(onClearClick)
      .build();
  }
}
