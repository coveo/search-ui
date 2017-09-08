/// <reference path="Facet.ts" />
import { Facet } from './Facet';
import { FacetValue } from './FacetValues';
import { IPopulateOmniboxObject } from '../Omnibox/OmniboxInterface';
import { IOmniboxValueElementKlass } from './OmniboxValueElement';
import { ValueElement } from './ValueElement';
import { IAnalyticsActionCause, IAnalyticsOmniboxFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { FacetUtils } from './FacetUtils';
import * as _ from 'underscore';

export class OmniboxValuesList {
  constructor(
    public facet: Facet,
    public facetValues: FacetValue[],
    public omniboxObject: IPopulateOmniboxObject,
    public omniboxValueElementKlass: IOmniboxValueElementKlass
  ) {}

  public build() {
    var rows: HTMLElement[] = [];
    _.each(this.facetValues, (facetValue: FacetValue) => {
      rows.push(this.buildOmniboxForOneRow(facetValue, this.omniboxObject));
    });
    return this.buildFinalOmniboxElement(rows);
  }

  private buildOmniboxForOneRow(facetValue: FacetValue, omniboxObject: IPopulateOmniboxObject): HTMLElement {
    var selectCallback = (elem: ValueElement, cause: IAnalyticsActionCause) => this.logAnalyticsEvent(elem, cause);
    var excludeCallback = (elem: ValueElement, cause: IAnalyticsActionCause) => this.logAnalyticsEvent(elem, cause);
    var omniboxValueElement = new this.omniboxValueElementKlass(this.facet, facetValue, omniboxObject, selectCallback, excludeCallback);
    var omniboxRowContent = omniboxValueElement.build().renderer.listItem;

    var regex = omniboxObject.completeQueryExpression.regex;
    var valueToSearch = omniboxObject.completeQueryExpression.word;
    var caption = $$(omniboxRowContent).find('.coveo-facet-value-caption');
    caption.innerHTML = this.highlightOmniboxMatch(this.facet.getValueCaption(facetValue), regex, valueToSearch);

    var omniboxRow = $$('div', {
      className: 'coveo-omnibox-selectable coveo-facet-value coveo-omnibox-facet-value'
    }).el;
    omniboxRow.appendChild(omniboxRowContent);
    $$(omniboxRow).on('keyboardSelect', () => {
      var input = $$(omniboxRowContent).find('input[type=checkbox]');
      $$(input).trigger('change');
    });
    omniboxRow['no-text-suggestion'] = true;
    return omniboxRow;
  }

  private buildFinalOmniboxElement(rows: HTMLElement[]) {
    var header = this.buildOmniboxHeader();
    if (Utils.isEmptyArray(rows)) {
      return undefined;
    } else {
      var ret = $$('div', {
        className: 'coveo-omnibox-facet-value'
      }).el;
      ret.appendChild(header);
      _.each(rows, r => {
        ret.appendChild(r);
      });
      FacetUtils.addNoStateCssClassToFacetValues(this.facet, ret);
      return ret;
    }
  }

  private buildOmniboxHeader(): HTMLElement {
    var title = this.facet.options.title;
    var header = $$('div', {
      className: 'coveo-omnibox-facet-header'
    }).el;
    $$(header).text(title);
    return header;
  }

  private highlightOmniboxMatch(orignalStr: string, regex: RegExp, valueToSearch: string) {
    var firstChar = orignalStr.search(regex);
    var lastChar = firstChar + valueToSearch.length;
    return (
      orignalStr.slice(0, firstChar) +
      '<span class="coveo-highlight">' +
      orignalStr.slice(firstChar, lastChar) +
      '</span>' +
      orignalStr.slice(lastChar)
    );
  }

  private logAnalyticsEvent(elem: ValueElement, cause: IAnalyticsActionCause) {
    var strippedFacetValues = _.pluck(this.facetValues, 'value');
    elem.facet.usageAnalytics.logSearchEvent<IAnalyticsOmniboxFacetMeta>(cause, {
      query: this.omniboxObject.completeQueryExpression.word,
      facetId: elem.facet.options.id,
      facetTitle: elem.facet.options.title,
      facetValue: elem.facetValue.value,
      suggestions: strippedFacetValues.join(';'),
      suggestionRanking: _.indexOf(strippedFacetValues, elem.facetValue.value)
    });
  }
}
