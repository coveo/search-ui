/// <reference path="Facet.ts" />
import { Facet } from './Facet';
import { FacetValue } from './FacetValues';
import { IPopulateOmniboxObject } from '../Omnibox/OmniboxInterface';
import { ValueElementRenderer } from './ValueElementRenderer';
import { Utils } from '../../utils/Utils';
import { IAnalyticsActionCause, analyticsActionCauseList, IAnalyticsFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { $$ } from '../../utils/Dom';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';

export interface IValueElementKlass {
  new (facet: Facet, facetValue: FacetValue): ValueElement;
}

export interface IValueElementEventsBinding {
  displayNextTime: boolean;
  pinFacet: boolean;
  omniboxObject?: IPopulateOmniboxObject;
}

export class ValueElement {
  public renderer: ValueElementRenderer;
  private isOmnibox: boolean;

  constructor(
    public facet: Facet,
    public facetValue: FacetValue,
    public onSelect?: (elem: ValueElement, cause: IAnalyticsActionCause) => void,
    public onExclude?: (elem: ValueElement, cause: IAnalyticsActionCause) => void
  ) {}

  public build(): ValueElement {
    this.renderer = new ValueElementRenderer(this.facet, this.facetValue).build();
    this.bindEvent({ displayNextTime: true, pinFacet: this.facet.options.preservePosition });
    return this;
  }

  public bindEvent(eventBindings: IValueElementEventsBinding) {
    if (!Utils.isNullOrUndefined(eventBindings.omniboxObject)) {
      this.isOmnibox = true;
    } else {
      this.isOmnibox = false;
    }
    this.handleEventForCheckboxChange(eventBindings);
    if (this.facetValue.excluded) {
      this.handleEventForExcludedValueElement(eventBindings);
    } else {
      this.handleEventForValueElement(eventBindings);
    }
  }

  public select() {
    this.facetValue.selected = true;
    this.facetValue.excluded = false;
    this.renderer.setCssClassOnListValueElement();
  }

  public unselect() {
    this.facetValue.selected = false;
    this.facetValue.excluded = false;
    this.renderer.setCssClassOnListValueElement();
  }

  public exclude() {
    this.facetValue.selected = false;
    this.facetValue.excluded = true;
    this.renderer.setCssClassOnListValueElement();
  }

  public unexclude() {
    this.facetValue.selected = false;
    this.facetValue.excluded = false;
    this.renderer.setCssClassOnListValueElement();
  }

  public toggleExcludeWithUA() {
    let actionCause: IAnalyticsActionCause;
    if (this.facetValue.excluded) {
      actionCause = this.isOmnibox ? analyticsActionCauseList.omniboxFacetUnexclude : analyticsActionCauseList.facetUnexclude;
    } else {
      actionCause = this.isOmnibox ? analyticsActionCauseList.omniboxFacetExclude : analyticsActionCauseList.facetExclude;
    }

    this.facet.toggleExcludeValue(this.facetValue);

    if (this.onExclude) {
      this.facet.triggerNewQuery(() => this.onExclude(this, actionCause));
    } else {
      this.facet.triggerNewQuery(() =>
        this.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(actionCause, this.getAnalyticsFacetMeta())
      );
    }
  }

  protected handleSelectValue(eventBindings: IValueElementEventsBinding) {
    this.facet.keepDisplayedValuesNextTime = eventBindings.displayNextTime && !this.facet.options.useAnd;
    var actionCause: IAnalyticsActionCause;
    if (this.facetValue.excluded) {
      actionCause = this.isOmnibox ? analyticsActionCauseList.omniboxFacetUnexclude : analyticsActionCauseList.facetUnexclude;
      this.facet.unexcludeValue(this.facetValue);
    } else {
      if (this.facetValue.selected) {
        actionCause = this.isOmnibox ? analyticsActionCauseList.omniboxFacetDeselect : analyticsActionCauseList.facetDeselect;
      } else {
        actionCause = this.isOmnibox ? analyticsActionCauseList.omniboxFacetSelect : analyticsActionCauseList.facetSelect;
      }
      this.facet.toggleSelectValue(this.facetValue);
    }
    if (this.onSelect) {
      this.facet.triggerNewQuery(() => this.onSelect(this, actionCause));
    } else {
      this.facet.triggerNewQuery(() =>
        this.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(actionCause, this.getAnalyticsFacetMeta())
      );
    }
  }

  protected handleExcludeClick(eventBindings: IValueElementEventsBinding) {
    this.facet.keepDisplayedValuesNextTime = eventBindings.displayNextTime && !this.facet.options.useAnd;
    this.toggleExcludeWithUA();
  }

  protected handleEventForExcludedValueElement(eventBindings: IValueElementEventsBinding) {
    let clickEvent = (event: Event) => {
      if (eventBindings.pinFacet) {
        this.facet.pinFacetPosition();
      }
      if (eventBindings.omniboxObject) {
        this.omniboxCloseEvent(eventBindings.omniboxObject);
      }
      this.handleSelectValue(eventBindings);
      return false;
    };

    $$(this.renderer.label).on('click', e => {
      e.stopPropagation();
      clickEvent(e);
    });

    $$(this.renderer.stylishCheckbox).on('keydown', KeyboardUtils.keypressAction([KEYBOARD.SPACEBAR, KEYBOARD.ENTER], clickEvent));
  }

  protected handleEventForValueElement(eventBindings: IValueElementEventsBinding) {
    let excludeAction = (event: Event) => {
      if (eventBindings.omniboxObject) {
        this.omniboxCloseEvent(eventBindings.omniboxObject);
      }

      this.handleExcludeClick(eventBindings);

      if (this.facet && this.facet.facetSearch && this.facet.facetSearch.completelyDismissSearch) {
        this.facet.facetSearch.completelyDismissSearch();
      }
      event.stopPropagation();
      event.preventDefault();
    };
    $$(this.renderer.excludeIcon).on('click', excludeAction);

    $$(this.renderer.excludeIcon).on('keydown', KeyboardUtils.keypressAction([KEYBOARD.SPACEBAR, KEYBOARD.ENTER], excludeAction));

    let selectAction = (event: Event) => {
      if (eventBindings.pinFacet) {
        this.facet.pinFacetPosition();
      }

      $$(this.renderer.checkbox).trigger('change');
      event.preventDefault();
    };

    $$(this.renderer.label).on('click', selectAction);

    $$(this.renderer.stylishCheckbox).on('keydown', KeyboardUtils.keypressAction([KEYBOARD.SPACEBAR, KEYBOARD.ENTER], selectAction));
  }

  protected handleEventForCheckboxChange(eventBindings: IValueElementEventsBinding) {
    $$(this.renderer.checkbox).on('change', () => {
      if (eventBindings.omniboxObject) {
        this.omniboxCloseEvent(eventBindings.omniboxObject);
      }
      this.handleSelectValue(eventBindings);
    });
  }

  protected omniboxCloseEvent(eventArg: IPopulateOmniboxObject) {
    eventArg.closeOmnibox();
    eventArg.clear();
  }

  private getAnalyticsFacetMeta(): IAnalyticsFacetMeta {
    return {
      facetId: this.facet.options.id,
      facetValue: this.facetValue.value,
      facetTitle: this.facet.options.title
    };
  }
}
