import { Facet } from './Facet';
import { FacetValue } from './FacetValues';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { l } from '../../strings/Strings';
import { Component } from '../Base/Component';
import * as _ from 'underscore';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export class ValueElementRenderer {
  public listItem: HTMLElement;
  public label: HTMLElement;
  public checkbox: HTMLElement;
  public stylishCheckbox: HTMLElement;
  public valueCaption: HTMLElement;
  public valueCount: HTMLElement;
  public icon: HTMLElement;
  public excludeIcon: HTMLElement;
  public computedField: HTMLElement;
  private facetValueLabelWrapper: HTMLElement;

  constructor(public facet: Facet, public facetValue: FacetValue) {}

  public withNo(element: HTMLElement[]): ValueElementRenderer;
  public withNo(element: HTMLElement): ValueElementRenderer;
  public withNo(element: any): ValueElementRenderer {
    if (_.isArray(element)) {
      _.each(element, (e: HTMLElement) => {
        if (e) {
          $$(e).detach();
        }
      });
    } else {
      if (element) {
        $$(element).detach();
      }
    }
    return this;
  }

  public build(): ValueElementRenderer {
    this.buildListItem();
    this.initAndAppendLabel();
    this.initAndAppendExcludeIcon();
    this.setCssClassOnListValueElement();
    this.addAccessibilityAttributesToTargetElement();
    return this;
  }

  public setCssClassOnListValueElement(): void {
    $$(this.listItem).toggleClass('coveo-selected', this.facetValue.selected);
    $$(this.listItem).toggleClass('coveo-excluded', this.facetValue.excluded);
  }

  public get accessibleElement() {
    return this.stylishCheckbox;
  }

  protected buildExcludeIcon(): HTMLElement {
    const excludeIcon = $$('div', {
      title: l('ExcludeValueWithResultCount', this.caption, l('ResultCount', this.count)),
      className: 'coveo-facet-value-exclude',
      tabindex: 0,
      role: 'button'
    }).el;
    this.addFocusAndBlurEventListeners(excludeIcon);
    excludeIcon.innerHTML = SVGIcons.icons.checkboxHookExclusionMore;
    SVGDom.addClassToSVGInContainer(excludeIcon, 'coveo-facet-value-exclude-svg');
    return excludeIcon;
  }

  protected buildValueComputedField(): HTMLElement {
    const computedField = this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat);
    if (Utils.isNonEmptyString(computedField)) {
      const elem = $$('span', {
        className: 'coveo-facet-value-computed-field'
      }).el;
      $$(elem).text(computedField);
      return elem;
    } else {
      return undefined;
    }
  }

  protected buildValueCheckbox(): HTMLElement {
    const checkbox = $$('input', {
      type: 'checkbox',
      'aria-hidden': true,
      'aria-label': this.ariaLabel
    }).el;

    this.facetValue.selected ? checkbox.setAttribute('checked', 'checked') : checkbox.removeAttribute('checked');
    this.facetValue.excluded ? checkbox.setAttribute('disabled', 'disabled') : checkbox.removeAttribute('disabled');

    Component.pointElementsToDummyForm(checkbox);
    return checkbox;
  }

  protected buildValueStylishCheckbox(): HTMLElement {
    const checkbox = $$('div', {
      className: 'coveo-facet-value-checkbox',
      tabindex: 0
    }).el;
    checkbox.innerHTML = SVGIcons.icons.checkboxHookExclusionMore;
    SVGDom.addClassToSVGInContainer(checkbox, 'coveo-facet-value-checkbox-svg');
    this.addFocusAndBlurEventListeners(checkbox);
    return checkbox;
  }

  protected buildValueIcon(): HTMLElement {
    const icon = this.getValueIcon();
    if (Utils.exists(icon)) {
      return $$('img', {
        className: 'coveo-facet-value-icon coveo-icon',
        src: this.getValueIcon()
      }).el;
    } else {
      return this.buildValueIconFromSprite();
    }
  }

  protected getValueIcon(): string {
    if (Utils.exists(this.facet.options.valueIcon)) {
      return this.facet.options.valueIcon(this.facetValue);
    } else {
      return undefined;
    }
  }

  protected buildValueIconFromSprite(): HTMLElement {
    return $$('div', {
      className: 'coveo-facet-value-icon coveo-icon ' + this.facet.options.field.substr(1) + ' ' + this.facetValue.value
    }).el;
  }

  protected buildValueCaption(): HTMLElement {
    const valueCaption = $$('span', {
      className: 'coveo-facet-value-caption',
      title: this.caption,
      'data-original-value': this.facetValue.value
    }).el;

    $$(valueCaption).text(this.caption);
    return valueCaption;
  }

  protected buildValueCount(): HTMLElement {
    if (Utils.isNonEmptyString(this.count)) {
      const countElement = $$('span', {
        className: 'coveo-facet-value-count'
      }).el;
      $$(countElement).text(this.count);
      return countElement;
    } else {
      return undefined;
    }
  }

  private get caption() {
    return this.facet.getValueCaption(this.facetValue);
  }

  private get count() {
    return this.facetValue.getFormattedCount();
  }

  private addFocusAndBlurEventListeners(elem: HTMLElement) {
    $$(elem).on('focus', () => $$(this.listItem).addClass('coveo-focused'));
    $$(elem).on('blur', () => $$(this.listItem).removeClass('coveo-focused'));
  }

  private buildListItem() {
    this.listItem = $$('li', { className: 'coveo-facet-value coveo-facet-selectable' }).el;
    this.listItem.setAttribute('data-value', this.facetValue.value);
  }

  private initAndAppendLabel() {
    this.label = $$('label', { className: 'coveo-facet-value-label' }).el;
    this.tryToInitAndAppendComputedField();
    this.initAndAppendFacetValueLabelWrapper();
    this.listItem.appendChild(this.label);
  }

  private initAndAppendExcludeIcon() {
    this.excludeIcon = this.buildExcludeIcon();
    this.attachExcludeIconEventHandlers();
    this.listItem.appendChild(this.excludeIcon);
  }

  private attachExcludeIconEventHandlers() {
    $$(this.excludeIcon).on('mouseover', () => {
      $$(this.listItem).addClass('coveo-facet-value-will-exclude');
    });

    $$(this.excludeIcon).on('mouseout', () => {
      $$(this.listItem).removeClass('coveo-facet-value-will-exclude');
    });
  }

  private tryToInitAndAppendComputedField() {
    if (!Utils.exists(this.facetValue.computedField)) {
      return;
    }

    this.computedField = this.buildValueComputedField();

    if (!this.computedField) {
      return;
    }

    this.label.appendChild(this.computedField);
    $$(this.label).addClass('coveo-with-computed-field');
  }

  private initAndAppendFacetValueLabelWrapper() {
    this.facetValueLabelWrapper = $$('div', { className: 'coveo-facet-value-label-wrapper' }).el;

    this.initAndAppendCheckbox();
    this.initAndAppendStylishCheckbox();
    this.initAndAppendValueCount();
    this.initAndAppendValueCaption();

    this.label.appendChild(this.facetValueLabelWrapper);
  }

  private initAndAppendCheckbox() {
    this.checkbox = this.buildValueCheckbox();
    this.facetValueLabelWrapper.appendChild(this.checkbox);
  }

  private initAndAppendStylishCheckbox() {
    this.stylishCheckbox = this.buildValueStylishCheckbox();
    this.facetValueLabelWrapper.appendChild(this.stylishCheckbox);
  }

  private initAndAppendValueCount() {
    this.valueCount = this.buildValueCount();

    if (!this.valueCount) {
      return;
    }

    this.facetValueLabelWrapper.appendChild(this.valueCount);
  }

  private initAndAppendValueCaption() {
    this.valueCaption = this.buildValueCaption();
    this.facetValueLabelWrapper.appendChild(this.valueCaption);
  }

  private addAccessibilityAttributesToTargetElement() {
    const el = this.accessibleElement;
    el.setAttribute('aria-label', this.ariaLabel);
    el.setAttribute('role', 'button');
  }

  private get actionLabel() {
    if (this.facetValue.excluded) {
      return 'UnexcludeValueWithResultCount';
    }

    if (this.facetValue.selected) {
      return 'UnselectValueWithResultCount';
    }

    return 'SelectValueWithResultCount';
  }

  private get ariaLabel() {
    const resultCount = l('ResultCount', this.count);
    return `${l(this.actionLabel, this.caption, resultCount)}`;
  }
}
