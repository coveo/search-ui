/// <reference path="../../Base.ts" />
/// <reference path="BreadcrumbValueElement.ts" />
module Coveo {
  export class BreadcrumbValueList {
    private expanded: FacetValue[];
    private collapsed: FacetValue[];
    private elem: JQuery;
    private valueContainer: JQuery;
    constructor(public facet: Facet, public facetValues: FacetValue[], public breadcrumbValueElementKlass: BreadcrumbValueElementKlass) {
      this.setExpandedAndCollapsed();
      this.elem = $('<div/>').addClass('coveo-facet-breadcrumb');
      var title = DeviceUtils.isMobileDevice() ? $("<div/>") : $("<span/>");
      title.addClass('coveo-facet-breadcrumb-title').text(this.facet.options.title + (DeviceUtils.isMobileDevice() ? '' : ':')).appendTo(this.elem);
      this.valueContainer = $('<span/>').addClass('coveo-facet-breadcrumb-values').appendTo(this.elem);
    }

    public build(): JQuery {
      this.buildExpanded();
      if (this.collapsed.length != 0) {
        this.buildCollapsed();
      }
      return this.elem;
    }

    private buildExpanded() {
      _.each(this.expanded, (value: FacetValue, index?: number, list?) => {
        if (index != 0 && !DeviceUtils.isMobileDevice() && !this.facet.searchInterface.isNewDesign()) {
          $('<span/>').addClass('coveo-facet-breadcrumb-separator').text(', ').appendTo(this.valueContainer);
        }
        new this.breadcrumbValueElementKlass(this.facet, value).build().appendTo(this.valueContainer);
      });
    }

    private buildCollapsed() {
      var numberOfSelected = _.filter(this.collapsed, (value: FacetValue) => value.selected).length;
      var numberOfExcluded = _.filter(this.collapsed, (value: FacetValue) => value.excluded).length;
      Assert.check(numberOfSelected + numberOfExcluded == this.collapsed.length);

      var elem = $('<div/>').addClass('coveo-facet-breadcrumb-value');
      if (!DeviceUtils.isMobileDevice()) {
        $('<span/>').addClass('coveo-separator').text(', ').appendTo(elem);
      }
      if (numberOfSelected > 0) {
        $('<span/>').addClass('coveo-facet-breadcrumb-multi-count').text(Globalize.format(numberOfSelected, 'n0')).appendTo(elem);
        $('<div/>').addClass('coveo-selected').addClass('coveo-facet-breadcrumb-multi-icon').appendTo(elem);
      }
      if (numberOfExcluded > 0) {
        $('<span/>').addClass('coveo-facet-breadcrumb-multi-count').text(Globalize.format(numberOfExcluded, 'n0')).appendTo(elem);
        $('<div />').addClass('coveo-excluded').addClass('coveo-facet-breadcrumb-multi-icon').appendTo(elem);
      }

      var valueElements = _.map(this.collapsed, (facetValue) => {
        return new this.breadcrumbValueElementKlass(this.facet, facetValue);
      })
      var toolTips = _.map(valueElements, (valueElement) => {
        return valueElement.getBreadcrumbTooltip();
      })

      elem.attr('title', toolTips.join('\n'));

      elem.click(() => {
        var elements = [];
        _.forEach(valueElements, (valueElement) => {
          if (!DeviceUtils.isMobileDevice()) {
            elements.push($('<span/>').addClass('coveo-facet-breadcrumb-separator').text(', ')[0]);
          }
          elements.push(valueElement.build(false).get(0));
        });
        $(elements).insertBefore(elem);
        elem.detach();
      });

      this.valueContainer.append(elem);
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
}