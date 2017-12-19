import { IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { DomUtils } from '../../utils/DomUtils';
import { $$, Dom } from '../../utils/Dom';
import * as _ from 'underscore';
import { HtmlTemplate } from '../Templates/HtmlTemplate';
import { Component } from '../Base/Component';
import { IAnalyticsNoMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { QueryStateModel } from '../../ModelsModules';

export type IOnSelectSuggestion<TRow> = (args: TRow, omniboxArgs: IPopulateOmniboxEventArgs) => void;

export function onSelectionUpdateOmnibox(component: Component, value: string, args: IPopulateOmniboxEventArgs): void {
  args.clear();
  args.closeOmnibox();
  component.queryStateModel.set(QueryStateModel.attributesEnum.q, value);
  component.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {});
  component.queryController.executeQuery();
}

export function onSelectionUpdateOmniboxWithoutQuery(component: Component, value: string, args: IPopulateOmniboxEventArgs): void {
  args.clear();
  args.closeOmnibox();
  component.queryStateModel.set(QueryStateModel.attributesEnum.q, `${value}`);
  component.usageAnalytics.logCustomEvent(analyticsActionCauseList.omniboxField, {}, this.element);
}

export interface IOmniboxSuggestionsOptions {
  omniboxZIndex?: number;
  headerTitle?: string;
  numberOfSuggestions?: number;
}

export interface IOmniboxSuggestionBuilder<TRow> {
  createHeader(title?: string): HTMLElement;
  createResultRow(
    row: TRow,
    displayText: string,
    args: IPopulateOmniboxEventArgs,
    onSelect?: IOnSelectSuggestion<TRow>,
    onTabPress?: IOnSelectSuggestion<TRow>
  ): HTMLElement;
}

export class OmniboxSuggestionBuilder<TRow> implements IOmniboxSuggestionBuilder<TRow> {
  createHeader(title?: string): HTMLElement {
    const headerElement = $$('div', {
      className: 'coveo-top-field-suggestion-header'
    });

    const iconElement = $$('span', {
      className: 'coveo-icon-top-field'
    });

    const captionElement = $$('span', {
      className: 'coveo-caption'
    });

    if (title) {
      captionElement.text(title);
    }

    headerElement.append(iconElement.el);
    headerElement.append(captionElement.el);

    return headerElement.el;
  }

  createResultRow(
    row: TRow,
    displayText: string,
    args: IPopulateOmniboxEventArgs,
    onSelect?: IOnSelectSuggestion<TRow>,
    onTabPress?: IOnSelectSuggestion<TRow>
  ): HTMLElement {
    const rowElement = $$('div', {
      className: 'magic-box-suggestion coveo-omnibox-selectable coveo-top-field-suggestion-row'
    });
    rowElement.el.innerHTML = displayText;

    if (onSelect) {
      rowElement.on('click', () => onSelect(row, args));
      rowElement.on('keyboardSelect', () => onSelect(row, args));
    }

    const onTabPressFunction = onTabPress || onSelect;
    if (onTabPressFunction) {
      rowElement.on('tabSelect', () => onTabPressFunction(row, args));
    }

    return rowElement.el;
  }
}
