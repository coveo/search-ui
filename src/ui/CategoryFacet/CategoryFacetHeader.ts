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

  constructor(private options: ICategoryFacetHeaderOptions) {
    this.element = document.createElement('div');
    $$(this.element).addClass('coveo-facet-header');
  }

  public build(): HTMLElement {
    const waitElement = this.buildWaitAnimation();

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
    $$(this.element).append(waitElement);

    const eraserElement = this.buildEraser();
    $$(this.element).append(eraserElement);
    return this.element;
  }

  private buildWaitAnimation(): HTMLElement {
    const waitElement = $$('div', { className: CategoryFacet.WAIT_ELEMENT_CLASS }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(waitElement, 'coveo-category-facet-header-wait-animation-svg');
    waitElement.style.visibility = 'hidden';
    return waitElement;
  }

  private buildEraser() {
    const eraserElement = $$('div', { className: 'coveo-category-facet-header-eraser coveo-facet-header-eraser' }, SVGIcons.icons.mainClear)
      .el;

    SVGDom.addClassToSVGInContainer(eraserElement, 'coveo-facet-header-eraser-svg');

    const onClearClick = () => {
      this.options.categoryFacet.reset();
      this.options.categoryFacet.scrollToTop();
    };

    new AccessibleButton()
      .withElement(eraserElement)
      .withLabel(l('Clear', this.options.title))
      .withClickAction(onClearClick)
      .withEnterKeyboardAction(onClearClick)
      .build();

    return eraserElement;
  }
}
