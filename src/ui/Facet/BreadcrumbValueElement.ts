/// <reference path="../../Base.ts" />

module Coveo {
  export interface BreadcrumbValueElementKlass {
    new (facet: Facet, facetValue: FacetValue): BreadcrumbValueElement;
  }

  export class BreadcrumbValueElement {
    constructor(public facet: Facet, public facetValue: FacetValue) {
    }

    public build(tooltip = true) {
      Assert.exists(this.facetValue);

      var elem = DeviceUtils.isMobileDevice() ? $("<div/>") : $("<span/>")
      elem.addClass('coveo-facet-breadcrumb-value');
      elem.toggleClass('coveo-selected', this.facetValue.selected);
      elem.toggleClass('coveo-excluded', this.facetValue.excluded);
      elem.attr('title', this.getBreadcrumbTooltip());

      $('<span/>').addClass('coveo-facet-breadcrumb-caption').text(this.facet.getValueCaption(this.facetValue)).appendTo(elem);
      $('<span/>').addClass('coveo-facet-breadcrumb-clear').appendTo(elem);

      var clicked = false;

      elem.click(() => {
        if (!clicked) {
          clicked = true;
          if (this.facetValue.excluded) {
            this.facet.unexcludeValue(this.facetValue.value);
          } else {
            this.facet.deselectValue(this.facetValue.value);
          }
          this.facet.triggerNewQuery(() => this.facet.usageAnalytics.logSearchEvent < IAnalyticsFacetMeta > (AnalyticsActionCauseList.breadcrumbFacet, {facetId: this.facet.options.id, facetValue: this.facetValue.value, facetTitle: this.facet.options.title}));
        }
      });

      return elem;
    }

    public getBreadcrumbTooltip(): string {
      var tooltipParts = [this.facet.getValueCaption(this.facetValue), this.facetValue.getFormattedCount(), this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat)];
      return _.compact(tooltipParts).join(' ');
    }
  }
} 