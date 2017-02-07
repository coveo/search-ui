import { Facet } from './Facet';
import { FacetValue } from './FacetValues';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { l } from '../../strings/Strings';
import { Component } from '../Base/Component';
import _ = require('underscore');

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

  constructor(public facet: Facet, public facetValue: FacetValue) {
  }

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
    if (!this.facet.searchInterface.isNewDesign()) {
      this.excludeIcon = this.buildExcludeIcon();
      this.listItem.appendChild(this.excludeIcon);
    }
    this.label = $$('label', {
      className: 'coveo-facet-value-label'
    }).el;
    this.listItem.appendChild(this.label);

    if (this.facet.searchInterface.isNewDesign()) {
      this.excludeIcon = this.buildExcludeIcon();
      this.listItem.appendChild(this.excludeIcon);

      $$(this.excludeIcon).on('mouseover', () => {
        $$(this.listItem).addClass('coveo-facet-value-will-exclude');
      });

      $$(this.excludeIcon).on('mouseout', () => {
        $$(this.listItem).removeClass('coveo-facet-value-will-exclude');
      });
    }
    if (Utils.exists(this.facetValue.computedField)) {
      this.computedField = this.buildValueComputedField();
      if (this.computedField) {
        this.label.appendChild(this.computedField);
      }
      $$(this.label).addClass('coveo-with-computed-field');
    }
    var labelDiv = $$('div', {
      className: 'coveo-facet-value-label-wrapper'
    }).el;
    this.label.appendChild(labelDiv);
    this.checkbox = this.buildValueCheckbox();
    labelDiv.appendChild(this.checkbox);

    this.stylishCheckbox = this.buildValueStylishCheckbox();
    labelDiv.appendChild(this.stylishCheckbox);

    if (this.facet.options.showIcon && !this.facet.searchInterface.isNewDesign()) {
      this.icon = this.buildValueIcon();
      labelDiv.appendChild(this.icon);
    }
    if (this.facet.searchInterface.isNewDesign()) {
      this.valueCount = this.buildValueCount();
      if (this.valueCount) {
        labelDiv.appendChild(this.valueCount);
      }
      this.valueCaption = this.buildValueCaption();
      labelDiv.appendChild(this.valueCaption);
    } else {
      this.valueCaption = this.buildValueCaption();
      labelDiv.appendChild(this.valueCaption);
      this.valueCount = this.buildValueCount();
      if (this.valueCount) {
        labelDiv.appendChild(this.valueCount);
      }
    }

    this.setCssClassOnListValueElement();
    return this;
  }

  public setCssClassOnListValueElement(): void {
    $$(this.listItem).toggleClass('coveo-selected', this.facetValue.selected);
    $$(this.listItem).toggleClass('coveo-excluded', this.facetValue.excluded);
  }

  protected buildExcludeIcon(): HTMLElement {
    let excludeIcon = $$('div', {
      title: l('Exclude', this.facet.getValueCaption(this.facetValue)),
      className: 'coveo-facet-value-exclude',
      tabindex: 0
    }).el;
    this.addFocusAndBlurEventListeners(excludeIcon);

    if (this.facet.searchInterface.isNewDesign()) {
      excludeIcon.appendChild($$('span', {
        className: 'coveo-icon'
      }).el);
    }
    if (Utils.exists(this.facetValue.computedField)) {
      $$(excludeIcon).addClass('coveo-facet-value-exclude-with-computed-field');
    }
    return excludeIcon;
  }

  protected buildValueComputedField(): HTMLElement {
    var computedField = this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat);
    if (Utils.isNonEmptyString(computedField)) {
      var elem = $$('span', {
        className: 'coveo-facet-value-computed-field'
      }).el;
      $$(elem).text(computedField);
      return elem;
    } else {
      return undefined;
    }
  }

  protected buildValueCheckbox(): HTMLElement {
    var checkbox = $$('input', {
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
    let checkbox = $$('div', {
      className: 'coveo-facet-value-checkbox',
      tabindex: 0
    }, $$('span')).el;
    this.addFocusAndBlurEventListeners(checkbox);
    return checkbox;
  }

  protected buildValueIcon(): HTMLElement {
    var icon = this.getValueIcon();
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
    var caption = this.facet.getValueCaption(this.facetValue);
    var valueCaption = $$('span', {
      className: 'coveo-facet-value-caption',
      title: caption
    }).el;

    $$(valueCaption).text(caption);
    return valueCaption;
  }

  protected buildValueCount(): HTMLElement {
    var count = this.facetValue.getFormattedCount();
    if (Utils.isNonEmptyString(count)) {
      var countElement = $$('span', {
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
