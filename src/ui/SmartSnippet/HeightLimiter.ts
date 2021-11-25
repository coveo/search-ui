import { $$ } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { l } from '../../strings/Strings';

const BASE_CLASSNAME = 'coveo-height-limiter';
const CONTAINER_ACTIVE_CLASSNAME = `${BASE_CLASSNAME}-container-active`;
const CONTAINER_EXPANDED_CLASSNAME = `${BASE_CLASSNAME}-container-expanded`;
const BUTTON_CLASSNAME = `${BASE_CLASSNAME}-button`;
const BUTTON_LABEL_CLASSNAME = `${BUTTON_CLASSNAME}-label`;
const BUTTON_ICON_CLASSNAME = `${BUTTON_CLASSNAME}-icon`;
const BUTTON_ACTIVE_CLASSNAME = `${BUTTON_CLASSNAME}-active`;

export const HeightLimiterClassNames = {
  CONTAINER_ACTIVE_CLASSNAME,
  CONTAINER_EXPANDED_CLASSNAME,
  BUTTON_CLASSNAME,
  BUTTON_LABEL_CLASSNAME,
  BUTTON_ICON_CLASSNAME,
  BUTTON_ACTIVE_CLASSNAME
};

export class HeightLimiter {
  private isExpanded = false;
  private button: HTMLElement;
  private buttonLabel: HTMLElement;
  private buttonIcon: HTMLElement;

  public get toggleButton() {
    return this.button;
  }

  private set height(height: number) {
    this.containerElement.style.height = `${height}px`;
  }

  private get contentHeight() {
    return this.contentElement.clientHeight;
  }

  constructor(
    private containerElement: HTMLElement,
    private contentElement: HTMLElement,
    private heightLimit: number,
    private onToggle?: (isExpanded: boolean) => void
  ) {
    this.buildButton();
    this.updateActiveAppearance();
  }

  public onContentHeightChanged() {
    this.updateActiveAppearance();
  }

  private buildButton() {
    this.button = $$(
      'button',
      { className: BUTTON_CLASSNAME, type: 'button', ariaLabel: l('ShowMore'), ariaPressed: 'false', ariaHidden: 'true' },
      (this.buttonLabel = $$('span', { className: BUTTON_LABEL_CLASSNAME }).el),
      (this.buttonIcon = $$('span', { className: BUTTON_ICON_CLASSNAME }).el)
    ).el;
    this.button.addEventListener('click', () => this.toggle());
    this.updateButton();
    return this.button;
  }

  private updateActiveAppearance() {
    const shouldBeActive = this.contentHeight > this.heightLimit;
    $$(this.containerElement).toggleClass(CONTAINER_ACTIVE_CLASSNAME, shouldBeActive);
    $$(this.button).toggleClass(BUTTON_ACTIVE_CLASSNAME, shouldBeActive);
    if (shouldBeActive) {
      this.updateExpandedAppearance();
    } else {
      this.isExpanded = false;
      this.updateExpandedAppearance();
      this.containerElement.style.height = '';
    }
  }

  private updateButton() {
    this.buttonLabel.innerText = this.isExpanded ? l('ShowLess') : l('ShowMore');
    this.button.setAttribute('aria-pressed', `${this.isExpanded}`);
    this.buttonIcon.innerHTML = this.isExpanded ? SVGIcons.icons.arrowUp : SVGIcons.icons.arrowDown;
  }

  private updateExpandedAppearance() {
    this.updateButton();
    $$(this.containerElement).toggleClass(CONTAINER_EXPANDED_CLASSNAME, this.isExpanded);
    this.height = this.isExpanded ? this.contentHeight : this.heightLimit;
  }

  private toggle() {
    this.isExpanded = !this.isExpanded;
    this.updateExpandedAppearance();
    if (this.onToggle) {
      this.onToggle(this.isExpanded);
    }
  }
}
