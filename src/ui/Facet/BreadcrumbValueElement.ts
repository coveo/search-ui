/// <reference path="Facet.ts" />

import 'styling/_FacetBreadcrumb';
import { compact } from 'underscore';
import { Assert } from '../../misc/Assert';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { $$, Dom } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { analyticsActionCauseList, IAnalyticsFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { Facet } from './Facet';
import { FacetValue } from './FacetValue';
import { l } from '../../strings/Strings';

export interface IBreadcrumbValueElementKlass {
  new (facet: Facet, facetValue: FacetValue): BreadcrumbValueElement;
}

export class BreadcrumbValueElement {
  constructor(public facet: Facet, public facetValue: FacetValue) {}

  public build(): Dom {
    Assert.exists(this.facetValue);

    const { container, caption, clear } = this.buildElements();

    container.append(caption.el);
    container.append(clear.el);

    return container;
  }

  public getBreadcrumbTooltip(): string {
    const tooltipParts = [
      this.facet.getValueCaption(this.facetValue),
      this.facetValue.getFormattedCount(),
      this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat)
    ];
    return compact(tooltipParts).join(' ');
  }

  private buildElements() {
    return {
      container: this.buildContainer(),
      clear: this.buildClear(),
      caption: this.buildCaption()
    };
  }

  private buildContainer() {
    const container = $$('div', {
      className: 'coveo-facet-breadcrumb-value'
    });

    container.toggleClass('coveo-selected', this.facetValue.selected);
    container.toggleClass('coveo-excluded', this.facetValue.excluded);

    const labelString = this.facetValue.excluded ? 'Unexclude' : 'RemoveFilterOn';
    const label = l(labelString, this.facet.getValueCaption(this.facetValue));

    new AccessibleButton()
      .withElement(container)
      .withLabel(label)
      .withSelectAction(() => this.selectAction())
      .build();

    return container;
  }

  private buildClear() {
    const clear = $$(
      'span',
      {
        className: 'coveo-facet-breadcrumb-clear'
      },
      SVGIcons.icons.mainClear
    );

    return clear;
  }

  private buildCaption() {
    const caption = $$('span', {
      className: 'coveo-facet-breadcrumb-caption'
    });
    caption.text(this.facet.getValueCaption(this.facetValue));
    return caption;
  }

  private selectAction() {
    if (this.facetValue.excluded) {
      this.facet.unexcludeValue(this.facetValue.value);
    } else {
      this.facet.deselectValue(this.facetValue.value);
    }
    this.facet.triggerNewQuery(() =>
      this.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.breadcrumbFacet, {
        facetId: this.facet.options.id,
        facetField: this.facet.options.field.toString(),
        facetValue: this.facetValue.value,
        facetTitle: this.facet.options.title
      })
    );
  }
}
