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
    this.listItem = $$('li', {
      className: 'coveo-facet-value coveo-facet-selectable'
    }).el;
    this.listItem.setAttribute('data-value', this.facetValue.value);
    this.excludeIcon = this.buildExcludeIcon();
    this.listItem.appendChild(this.excludeIcon);

    this.label = $$('label', {
      className: 'coveo-facet-value-label'
    }).el;
    this.listItem.appendChild(this.label);

    this.excludeIcon = this.buildExcludeIcon();
    this.listItem.appendChild(this.excludeIcon);

    $$(this.excludeIcon).on('mouseover', () => {
      $$(this.listItem).addClass('coveo-facet-value-will-exclude');
    });

    $$(this.excludeIcon).on('mouseout', () => {
      $$(this.listItem).removeClass('coveo-facet-value-will-exclude');
    });

    if (Utils.exists(this.facetValue.computedField)) {
      this.computedField = this.buildValueComputedField();
      if (this.computedField) {
        this.label.appendChild(this.computedField);
      }
      $$(this.label).addClass('coveo-with-computed-field');
    }
    const labelDiv = $$('div', {
      className: 'coveo-facet-value-label-wrapper'
    }).el;
    this.label.appendChild(labelDiv);
    this.checkbox = this.buildValueCheckbox();
    labelDiv.appendChild(this.checkbox);

    this.stylishCheckbox = this.buildValueStylishCheckbox();
    labelDiv.appendChild(this.stylishCheckbox);

    this.valueCount = this.buildValueCount();
    if (this.valueCount) {
      labelDiv.appendChild(this.valueCount);
    }
    this.valueCaption = this.buildValueCaption();
    labelDiv.appendChild(this.valueCaption);

    this.setCssClassOnListValueElement();
    return this;
  }

  public setCssClassOnListValueElement(): void {
    $$(this.listItem).toggleClass('coveo-selected', this.facetValue.selected);
    $$(this.listItem).toggleClass('coveo-excluded', this.facetValue.excluded);
  }

  protected buildExcludeIcon(): HTMLElement {
    const excludeIcon = $$('div', {
      title: l('Exclude', this.facet.getValueCaption(this.facetValue)),
      className: 'coveo-facet-value-exclude',
      tabindex: 0
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
      type: 'checkbox'
    }).el;
    if (this.facetValue.selected) {
      checkbox.setAttribute('checked', 'checked');
    } else {
      checkbox.removeAttribute('checked');
    }
    if (this.facetValue.excluded) {
      checkbox.setAttribute('disabled', 'disabled');
    } else {
      checkbox.removeAttribute('disabled');
    }
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
    const caption = this.facet.getValueCaption(this.facetValue);
    const valueCaption = $$('span', {
      className: 'coveo-facet-value-caption',
      title: caption,
      'data-original-value': this.facetValue.value
    }).el;

    $$(valueCaption).text(caption);
    return valueCaption;
  }

  protected buildValueCount(): HTMLElement {
    const count = this.facetValue.getFormattedCount();
    if (Utils.isNonEmptyString(count)) {
      const countElement = $$('span', {
        className: 'coveo-facet-value-count'
      }).el;
      $$(countElement).text(count);
      return countElement;
    } else {
      return undefined;
    }
  }

  private addFocusAndBlurEventListeners(elem: HTMLElement) {
    $$(elem).on('focus', () => $$(this.listItem).addClass('coveo-focused'));
    $$(elem).on('blur', () => $$(this.listItem).removeClass('coveo-focused'));
  }
}
