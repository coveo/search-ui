/// <reference path="Facet.ts" />
import { each, indexOf, pluck } from 'underscore';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { IAnalyticsActionCause, IAnalyticsOmniboxFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { IPopulateOmniboxObject } from '../Omnibox/OmniboxInterface';
import { Facet } from './Facet';
import { FacetUtils } from './FacetUtils';
import { FacetValue } from './FacetValue';
import { IOmniboxValueElementKlass } from './OmniboxValueElement';
import { ValueElement } from './ValueElement';

export class OmniboxValuesList {
  constructor(
    public facet: Facet,
    public facetValues: FacetValue[],
    public omniboxObject: IPopulateOmniboxObject,
    public omniboxValueElementKlass: IOmniboxValueElementKlass
  ) {}

  public build() {
    const rows: HTMLElement[] = [];
    each(this.facetValues, (facetValue: FacetValue) => {
      rows.push(this.buildOmniboxForOneRow(facetValue, this.omniboxObject));
    });
    return this.buildFinalOmniboxElement(rows);
  }

  private buildOmniboxForOneRow(facetValue: FacetValue, omniboxObject: IPopulateOmniboxObject): HTMLElement {
    const selectCallback = (elem: ValueElement, cause: IAnalyticsActionCause) => this.logAnalyticsEvent(elem, cause);
    const excludeCallback = (elem: ValueElement, cause: IAnalyticsActionCause) => this.logAnalyticsEvent(elem, cause);
    const omniboxValueElement = new this.omniboxValueElementKlass(this.facet, facetValue, omniboxObject, selectCallback, excludeCallback);
    const omniboxRowContent = omniboxValueElement.build().renderer.listItem;

    const regex = omniboxObject.completeQueryExpression.regex;
    const valueToSearch = omniboxObject.completeQueryExpression.word;
    const caption = $$(omniboxRowContent).find('.coveo-facet-value-caption');
    caption.innerHTML = this.highlightOmniboxMatch(this.facet.getValueCaption(facetValue), regex, valueToSearch);

    const omniboxRow = $$('ul', {
      className: 'coveo-omnibox-selectable coveo-facet-value coveo-omnibox-facet-value'
    }).el;
    omniboxRow.appendChild(omniboxRowContent);
    $$(omniboxRow).on('keyboardSelect', () => {
      const input = $$(omniboxRowContent).find('input[type=checkbox]');
      $$(input).trigger('change');
    });
    omniboxRow['no-text-suggestion'] = true;
    return omniboxRow;
  }

  private buildFinalOmniboxElement(rows: HTMLElement[]) {
    const header = this.buildOmniboxHeader();
    if (Utils.isEmptyArray(rows)) {
      return undefined;
    } else {
      const ret = $$('div', {
        className: 'coveo-omnibox-facet-value'
      }).el;
      ret.appendChild(header);
      each(rows, r => {
        ret.appendChild(r);
      });
      FacetUtils.addNoStateCssClassToFacetValues(this.facet, ret);
      return ret;
    }
  }

  private buildOmniboxHeader(): HTMLElement {
    const title = this.facet.options.title;
    const header = $$('div', {
      className: 'coveo-omnibox-facet-header'
    }).el;
    $$(header).text(title);
    return header;
  }

  private highlightOmniboxMatch(orignalStr: string, regex: RegExp, valueToSearch: string) {
    const firstChar = orignalStr.search(regex);
    const lastChar = firstChar + valueToSearch.length;
    return (
      orignalStr.slice(0, firstChar) +
      '<span class="coveo-highlight">' +
      orignalStr.slice(firstChar, lastChar) +
      '</span>' +
      orignalStr.slice(lastChar)
    );
  }

  private logAnalyticsEvent(elem: ValueElement, cause: IAnalyticsActionCause) {
    const strippedFacetValues = pluck(this.facetValues, 'value');
    elem.facet.usageAnalytics.logSearchEvent<IAnalyticsOmniboxFacetMeta>(cause, {
      query: this.omniboxObject.completeQueryExpression.word,
      facetId: elem.facet.options.id,
      facetField: elem.facet.options.field.toString(),
      facetTitle: elem.facet.options.title,
      facetValue: elem.facetValue.value,
      suggestions: strippedFacetValues.join(';'),
      suggestionRanking: indexOf(strippedFacetValues, elem.facetValue.value)
    });
  }
}
