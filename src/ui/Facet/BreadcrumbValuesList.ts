import { FacetValue } from './FacetValues';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { Facet } from './Facet';
import { IBreadcrumbValueElementKlass } from './BreadcrumbValueElement';
import { Assert } from '../../misc/Assert';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import * as Globalize from 'globalize';
import _ = require('underscore');

export class BreadcrumbValueList {
  private expanded: FacetValue[];
  private collapsed: FacetValue[];
  protected elem: HTMLElement;
  private valueContainer: HTMLElement;

  constructor(public facet: Facet, public facetValues: FacetValue[], public breadcrumbValueElementKlass: IBreadcrumbValueElementKlass) {
    this.setExpandedAndCollapsed();
    this.elem = $$('div', {
      className: 'coveo-facet-breadcrumb'
    }).el;

    let title = $$('span');
    title.addClass('coveo-facet-breadcrumb-title');
    title.text(this.facet.options.title + ':');
    this.elem.appendChild(title.el);

    this.valueContainer = $$('span', {
      className: 'coveo-facet-breadcrumb-values'
    }).el;
    this.elem.appendChild(this.valueContainer);
  }

  public build(): HTMLElement {
    this.buildExpanded();
    if (this.collapsed.length != 0) {
      this.buildCollapsed();
    }
    return this.elem;
  }

  public buildAsString(): string {
    this.build();
    if (this.elem) {
      return `${this.facet.options.title}: ` + _.map($$(this.elem).findAll('.coveo-facet-breadcrumb-value'), (value: HTMLElement) => {
        return $$(value).text();
      }).join(', ');
    }
    return '';
  }

  private buildExpanded() {
    _.each(this.expanded, (value: FacetValue, index?: number) => {
      if (index != 0 && !DeviceUtils.isMobileDevice() && !this.facet.searchInterface.isNewDesign()) {
        let separator = $$('span', {
          className: 'coveo-facet-breadcrumb-separator'
        });
        separator.text(', ');
        this.valueContainer.appendChild(separator.el);
      }
      var elementBreadcrumb = new this.breadcrumbValueElementKlass(this.facet, value).build();
      this.valueContainer.appendChild(elementBreadcrumb.el);
    });
  }

  private buildCollapsed() {
    let numberOfSelected = _.filter(this.collapsed, (value: FacetValue) => value.selected).length;
    let numberOfExcluded = _.filter(this.collapsed, (value: FacetValue) => value.excluded).length;
    Assert.check(numberOfSelected + numberOfExcluded == this.collapsed.length);

    var elem = $$('div', {
      className: 'coveo-facet-breadcrumb-value'
    });
    if (!DeviceUtils.isMobileDevice() && !this.facet.searchInterface.isNewDesign()) {
      let sep = $$('span', {
        className: 'coveo-separator'
      });
      sep.text(', ');
      elem.el.appendChild(sep.el);
    }
    if (numberOfSelected > 0) {
      let multi = $$('span', {
        className: 'coveo-facet-breadcrumb-multi-count'
      });
      multi.text(l('NMore', Globalize.format(numberOfSelected, 'n0')));
      elem.el.appendChild(multi.el);

      let multiIcon = $$('div', {
        className: 'coveo-selected coveo-facet-breadcrumb-multi-icon'
      });
      elem.el.appendChild(multiIcon.el);
    }
    if (numberOfExcluded > 0) {
      let multiExcluded = $$('span', {
        className: 'coveo-facet-breadcrumb-multi-count'
      });
      multiExcluded.text(l('NMore', Globalize.format(numberOfExcluded, 'n0')));
      elem.el.appendChild(multiExcluded.el);

      let multiExcludedIcon = $$('div', {
        className: 'coveo-excluded coveo-facet-breadcrumb-multi-icon'
      });
      elem.el.appendChild(multiExcludedIcon.el);
    }

    let valueElements = _.map(this.collapsed, (facetValue) => {
      return new this.breadcrumbValueElementKlass(this.facet, facetValue);
    });

    let toolTips = _.map(valueElements, (valueElement) => {
      return valueElement.getBreadcrumbTooltip();
    });

    elem.el.setAttribute('title', toolTips.join('\n'));
    elem.on('click', () => {
      var elements: HTMLElement[] = [];
      _.forEach(valueElements, (valueElement) => {
        if (!DeviceUtils.isMobileDevice() && !this.facet.searchInterface.isNewDesign()) {
          let separatorsClicked = $$('span', {
            className: 'coveo-facet-breadcrumb-separator'
          });
          separatorsClicked.text(', ');
          elements.push(separatorsClicked.el);
        }
        elements.push(valueElement.build(false).el);
      });
      _.each(elements, (el) => {
        $$(el).insertBefore(elem.el);
      });
      elem.detach();
    });

    this.valueContainer.appendChild(elem.el);
  }

  private setExpandedAndCollapsed() {
    if (this.facetValues.length > this.facet.options.numberOfValuesInBreadcrumb) {
      this.collapsed = _.rest(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb - 1);
      this.expanded = _.first(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb - 1);
    } else {
      this.collapsed = [];
      this.expanded = this.facetValues;
    }
  }
}
