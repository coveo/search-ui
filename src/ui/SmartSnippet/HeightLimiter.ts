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
  private scrollHeight = 0;
  private button: HTMLElement;
  private buttonLabel: HTMLElement;
  private buttonIcon: HTMLElement;

  public get toggleButton() {
    return this.button;
  }

  private set height(height: number) {
    this.element.style.height = `${Math.round(height)}px`;
  }

  constructor(private element: HTMLElement, private heightLimit: number) {
    this.buildButton();
    this.onScrollHeightChanged();
  }

  public onScrollHeightChanged() {
    this.scrollHeight = this.element.scrollHeight;
    this.updateActiveAppearance();
  }

  private buildButton() {
    this.button = $$(
      'button',
      { className: BUTTON_CLASSNAME },
      (this.buttonLabel = $$('span', { className: BUTTON_LABEL_CLASSNAME }).el),
      (this.buttonIcon = $$('span', { className: BUTTON_ICON_CLASSNAME }).el)
    ).el;
    this.button.addEventListener('click', () => this.toggle());
    this.updateButton();
    return this.button;
  }

  private updateActiveAppearance() {
    const shouldBeActive = this.scrollHeight > this.heightLimit;
    this.element.classList.toggle(CONTAINER_ACTIVE_CLASSNAME, shouldBeActive);
    this.button.classList.toggle(BUTTON_ACTIVE_CLASSNAME, shouldBeActive);
    if (shouldBeActive) {
      this.updateExpandedAppearance();
    } else {
      this.isExpanded = false;
      delete this.element.style.height;
    }
  }

  private updateButton() {
    this.buttonLabel.innerText = this.isExpanded ? l('ShowLess') : l('ShowMore');
    this.buttonIcon.innerHTML = this.isExpanded ? SVGIcons.icons.arrowUp : SVGIcons.icons.arrowDown;
  }

  private updateExpandedAppearance() {
    this.updateButton();
    this.element.classList.toggle(CONTAINER_EXPANDED_CLASSNAME, this.isExpanded);
    this.height = this.isExpanded ? this.scrollHeight : this.heightLimit;
  }

  private toggle() {
    this.isExpanded = !this.isExpanded;
    this.updateExpandedAppearance();
  }
}
