/// <reference path="Facet.ts" />

import { FacetValue } from './FacetValues';
import { Facet } from './Facet';
import { Assert } from '../../misc/Assert';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { IAnalyticsFacetMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { $$, Dom } from '../../utils/Dom';
import * as _ from 'underscore';
import 'styling/_FacetBreadcrumb';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IBreadcrumbValueElementKlass {
  new (facet: Facet, facetValue: FacetValue): BreadcrumbValueElement;
}

export class BreadcrumbValueElement {
  constructor(public facet: Facet, public facetValue: FacetValue) {}

  public build(tooltip = true): Dom {
    Assert.exists(this.facetValue);

    const elem = DeviceUtils.isMobileDevice() ? $$('div') : $$('span');
    elem.addClass('coveo-facet-breadcrumb-value');
    elem.toggleClass('coveo-selected', this.facetValue.selected);
    elem.toggleClass('coveo-excluded', this.facetValue.excluded);
    elem.el.setAttribute('title', this.getBreadcrumbTooltip());

    const caption = $$('span', {
      className: 'coveo-facet-breadcrumb-caption'
    });
    caption.text(this.facet.getValueCaption(this.facetValue));
    elem.el.appendChild(caption.el);

    const clear = $$(
      'span',
      {
        className: 'coveo-facet-breadcrumb-clear'
      },
      SVGIcons.icons.checkboxHookExclusionMore
    );
    SVGDom.addClassToSVGInContainer(clear.el, 'coveo-facet-breadcrumb-clear-svg');
    elem.el.appendChild(clear.el);

    let clicked = false;
    elem.on('click', () => {
      if (!clicked) {
        clicked = true;
        if (this.facetValue.excluded) {
          this.facet.unexcludeValue(this.facetValue.value);
        } else {
          this.facet.deselectValue(this.facetValue.value);
        }
        this.facet.triggerNewQuery(() =>
          this.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.breadcrumbFacet, {
            facetId: this.facet.options.id,
            facetValue: this.facetValue.value,
            facetTitle: this.facet.options.title
          })
        );
      }
    });

    return elem;
  }

  public getBreadcrumbTooltip(): string {
    const tooltipParts = [
      this.facet.getValueCaption(this.facetValue),
      this.facetValue.getFormattedCount(),
      this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat)
    ];
    return _.compact(tooltipParts).join(' ');
  }
}
