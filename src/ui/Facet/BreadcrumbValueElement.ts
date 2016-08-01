/// <reference path="Facet.ts" />

import {FacetValue} from './FacetValues';
import {Facet} from './Facet';
import {Assert} from '../../misc/Assert';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {IAnalyticsFacetMeta, analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta';
import {$$, Dom} from '../../utils/Dom';

export interface IBreadcrumbValueElementKlass {
  new (facet: Facet, facetValue: FacetValue): BreadcrumbValueElement;
}

export class BreadcrumbValueElement {
  constructor(public facet: Facet, public facetValue: FacetValue) {
  }

  public build(tooltip = true): Dom {
    Assert.exists(this.facetValue);

    var elem = DeviceUtils.isMobileDevice() ? $$('div') : $$('span');
    elem.addClass('coveo-facet-breadcrumb-value');
    elem.toggleClass('coveo-selected', this.facetValue.selected);
    elem.toggleClass('coveo-excluded', this.facetValue.excluded);
    elem.el.setAttribute('title', this.getBreadcrumbTooltip());

    var caption = $$('span', {
      className: 'coveo-facet-breadcrumb-caption'
    });
    caption.text(this.facet.getValueCaption(this.facetValue));
    elem.el.appendChild(caption.el);

    var clear = $$('span', {
      className: 'coveo-facet-breadcrumb-clear'
    });
    elem.el.appendChild(clear.el);

    var clicked = false;
    elem.on('click', () => {
      if (!clicked) {
        clicked = true;
        if (this.facetValue.excluded) {
          this.facet.unexcludeValue(this.facetValue.value);
        } else {
          this.facet.deselectValue(this.facetValue.value);
        }
        this.facet.triggerNewQuery(() => this.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.breadcrumbFacet, {
          facetId: this.facet.options.id,
          facetValue: this.facetValue.value,
          facetTitle: this.facet.options.title
        }));
      }
    })

    return elem;
  }

  public getBreadcrumbTooltip(): string {
    var tooltipParts = [this.facet.getValueCaption(this.facetValue), this.facetValue.getFormattedCount(), this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat)];
    return _.compact(tooltipParts).join(' ');
  }
}
