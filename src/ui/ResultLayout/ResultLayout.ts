import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents } from '../../events/QueryEvents';
import { Initialization } from '../Base/Initialization';
import { InitializationEvents } from '../../events/InitializationEvents';
import { Assert } from '../../misc/Assert';
import { ResultListEvents, IChangeLayoutEventArgs } from '../../events/ResultListEvents';
import { ResultLayoutEvents, IResultLayoutPopulateArgs } from '../../events/ResultLayoutEvents';
import { $$ } from '../../utils/Dom';
import { IQueryErrorEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { MODEL_EVENTS, IAttributesChangedEventArg } from '../../models/Model';
import { analyticsActionCauseList, IAnalyticsResultsLayoutChange } from '../Analytics/AnalyticsActionListMeta';
import { IQueryResults } from '../../rest/QueryResults';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { ResponsiveResultLayout } from '../ResponsiveComponents/ResponsiveResultLayout';
import { Utils } from '../../utils/Utils';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';

import 'styling/_ResultLayout';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IActiveLayouts {
  button: {
    el: HTMLElement;
    visible: boolean;
  };
  enabled: boolean;
}

export interface IResultLayoutOptions {
  mobileLayouts: string[];
  tabletLayouts: string[];
  desktopLayouts: string[];
}

/**
 * The possible valid and supported layouts.
 *
 * See the [Result Layouts](https://developers.coveo.com/x/yQUvAg) documentation.
 */
export type ValidLayout = 'list' | 'card' | 'table';
export const defaultLayout: ValidLayout = 'list';

/**
 * The ResultLayout component allows the end user to switch between multiple {@link ResultList} components that have
 * different {@link ResultList.options.layout} values.
 *
 * This component automatically populates itself with buttons to switch between the ResultList components that have a
 * valid layout value (see the {@link ValidLayout} type).
 *
 * See also the [Result Layouts](https://developers.coveo.com/x/yQUvAg) documentation.
 */
export class ResultLayout extends Component {
  static ID = 'ResultLayout';

  static doExport = () => {
    exportGlobally({
      ResultLayout: ResultLayout
    });
  };

  public static validLayouts: ValidLayout[] = ['list', 'card', 'table'];

  public currentLayout: string;

  private currentActiveLayouts: { [key: string]: IActiveLayouts };

  private resultLayoutSection: HTMLElement;
  private hasNoResults: boolean;

  static options: IResultLayoutOptions = {
    /**
     * Specifies the layouts that should be available when the search page is displayed in mobile mode.
     *
     * By default, the mobile mode breakpoint is at 480 px screen width.
     *
     * When the breakpoint is reached, layouts that are not specified becomes inactive and the linked result list will be disabled.
     *
     * The possible values for layouts are `list`, `card`, `table`.
     *
     * The default value is `card`, `table`.
     */
    mobileLayouts: ComponentOptions.buildListOption<ValidLayout>({ defaultValue: ['card', 'table'] }),
    /**
     * Specifies the layouts that should be available when the search page is displayed in tablet mode.
     *
     * By default, the tablet mode breakpoint is at 800 px screen width.
     *
     *  When the breakpoint is reached, layouts that are not specified becomes inactive and the linked result list will be disabled.
     *
     * The possible values for layouts are `list`, `card`, `table`.
     *
     * The default value is `list`, `card`, `table`.
     */
    tabletLayouts: ComponentOptions.buildListOption<ValidLayout>({ defaultValue: ['list', 'card', 'table'] }),
    /**
     * Specifies the layouts that should be available when the search page is displayed in desktop mode.
     *
     * By default, the desktop mode breakpoint is any screen size over 800 px.
     *
     *  When the breakpoint is reached, layouts that are not specified becomes inactive and the linked result list will be disabled.
     *
     * The possible values for layouts are `list`, `card`, `table`.
     *
     * The default value is `list`, `card`, `table`.
     */
    desktopLayouts: ComponentOptions.buildListOption<ValidLayout>({ defaultValue: ['list', 'card', 'table'] })
  };

  /**
   * Creates a new ResultLayout component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ResultLayout component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IResultLayoutOptions, bindings?: IComponentBindings) {
    super(element, ResultLayout.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultLayout, options);

    this.currentActiveLayouts = {};

    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.LAYOUT, this.handleQueryStateChanged.bind(this));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, (args: IQueryErrorEventArgs) => this.handleQueryError(args));

    this.resultLayoutSection = $$(this.element).closest('.coveo-result-layout-section');

    this.bind.oneRootElement(InitializationEvents.afterComponentsInitialization, () => this.populate());
    this.bind.oneRootElement(InitializationEvents.afterInitialization, () => this.handleQueryStateChanged());

    ResponsiveResultLayout.init(this.root, this, {});
  }

  public get activeLayouts(): { [key: string]: IActiveLayouts } {
    return this.currentActiveLayouts;
  }

  /**
   * Changes the current layout.
   *
   * Also logs a `resultLayoutChange` event in the usage analytics with the new layout as metadeta.
   *
   * Triggers a new query.
   *
   * @param layout The new layout. The page must contain a valid {@link ResultList} component with a matching
   * {@link ResultList.options.layout} value for this method to work.
   */
  public changeLayout(layout: ValidLayout) {
    Assert.check(this.isLayoutDisplayedByButton(layout), 'Layout not available or invalid');

    if (layout !== this.currentLayout || this.getModelValue() === '') {
      this.setModelValue(layout);
      const lastResults = this.queryController.getLastResults();
      this.setLayout(layout, lastResults);
      if (lastResults) {
        this.usageAnalytics.logCustomEvent<IAnalyticsResultsLayoutChange>(
          analyticsActionCauseList.resultsLayoutChange,
          {
            resultsLayoutChangeTo: layout
          },
          this.element
        );
      } else {
        this.usageAnalytics.logSearchEvent<IAnalyticsResultsLayoutChange>(analyticsActionCauseList.resultsLayoutChange, {
          resultsLayoutChangeTo: layout
        });
        this.queryController.executeQuery();
      }
    }
  }

  /**
   * Gets the current layout (`list`, `card` or `table`).
   * @returns {string} The current current layout.
   */
  public getCurrentLayout() {
    return this.currentLayout;
  }

  public disableLayouts(layouts: ValidLayout[]) {
    if (Utils.isNonEmptyArray(layouts)) {
      _.each(layouts, layout => this.disableLayout(layout));

      let remainingValidLayouts = _.difference(_.keys(this.currentActiveLayouts), layouts);
      if (!_.isEmpty(remainingValidLayouts)) {
        const newLayout = _.contains(remainingValidLayouts, this.currentLayout) ? this.currentLayout : remainingValidLayouts[0];
        this.changeLayout(<ValidLayout>newLayout);
      } else {
        this.logger.error('Cannot disable the last valid layout ... Re-enabling the first one possible');
        let firstPossibleValidLayout = <ValidLayout>_.keys(this.currentActiveLayouts)[0];
        this.enableLayout(firstPossibleValidLayout);
        this.setLayout(firstPossibleValidLayout);
      }
    }
  }

  public enableLayouts(layouts: ValidLayout[]) {
    _.each(layouts, layout => {
      this.enableLayout(layout);
    });
  }

  private disableLayout(layout: ValidLayout) {
    if (this.isLayoutDisplayedByButton(layout)) {
      this.hideButton(layout);
    }
  }

  private enableLayout(layout: ValidLayout) {
    if (this.isLayoutDisplayedByButton(layout)) {
      this.showButton(layout);
      this.updateSelectorAppearance();
    }
  }

  private hideButton(layout: ValidLayout) {
    if (this.isLayoutDisplayedByButton(layout)) {
      let btn = this.currentActiveLayouts[<string>layout].button;
      $$(btn.el).addClass('coveo-hidden');
      btn.visible = false;
      this.updateSelectorAppearance();
    }
  }

  private showButton(layout: ValidLayout) {
    if (this.isLayoutDisplayedByButton(layout)) {
      let btn = this.currentActiveLayouts[<string>layout].button;
      $$(btn.el).removeClass('coveo-hidden');
      btn.visible = true;
    }
  }

  private setLayout(layout: ValidLayout, results?: IQueryResults) {
    if (layout) {
      this.isLayoutDisplayedByButton(layout);
      if (this.currentLayout) {
        $$(this.currentActiveLayouts[this.currentLayout].button.el).removeClass('coveo-selected');
      }
      $$(this.currentActiveLayouts[layout].button.el).addClass('coveo-selected');
      this.currentLayout = layout;
      $$(this.element).trigger(ResultListEvents.changeLayout, <IChangeLayoutEventArgs>{
        layout: layout,
        results: results
      });
    }
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    this.hasNoResults = args.results.results.length == 0;
    if (this.shouldShowSelector()) {
      this.show();
    } else {
      this.hide();
    }
  }

  private handleQueryStateChanged(args?: IAttributesChangedEventArg) {
    const modelLayout = this.getModelValue();
    const newLayout = _.find(_.keys(this.currentActiveLayouts), l => l === modelLayout);
    if (newLayout !== undefined) {
      this.setLayout(<ValidLayout>newLayout);
    } else {
      this.setLayout(<ValidLayout>_.keys(this.currentActiveLayouts)[0]);
    }
  }

  private handleQueryError(args: IQueryErrorEventArgs) {
    this.hasNoResults = true;
    this.hide();
  }

  private updateSelectorAppearance() {
    if (this.shouldShowSelector()) {
      this.show();
    } else {
      this.hide();
    }
  }

  private populate() {
    let populateArgs: IResultLayoutPopulateArgs = { layouts: [] };
    $$(this.root).trigger(ResultLayoutEvents.populateResultLayout, populateArgs);
    const layouts = _.uniq(populateArgs.layouts.map(layout => layout.toLowerCase()));

    _.each(layouts, layout => Assert.check(_.contains(ResultLayout.validLayouts, layout), 'Invalid layout'));
    if (!_.isEmpty(layouts)) {
      _.each(layouts, layout => this.addButton(layout));
      if (!this.shouldShowSelector()) {
        this.hide();
      }
    }
  }

  private addButton(layout: string) {
    const btn = $$(
      'span',
      {
        className: 'coveo-result-layout-selector',
        tabindex: 0
      },
      $$('span', { className: 'coveo-result-layout-selector-caption' }, l(layout))
    );
    const icon = $$('span', { className: `coveo-icon coveo-${layout}-layout-icon` }, SVGIcons.icons[`${layout}Layout`]);
    SVGDom.addClassToSVGInContainer(icon.el, `coveo-${layout}-svg`);
    btn.prepend(icon.el);
    if (layout === this.currentLayout) {
      btn.addClass('coveo-selected');
    }
    const activateAction = () => this.changeLayout(<ValidLayout>layout);
    btn.on('click', activateAction);
    btn.on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, activateAction));
    $$(this.element).append(btn.el);
    this.currentActiveLayouts[layout] = {
      button: {
        visible: true,
        el: btn.el
      },
      enabled: true
    };
  }

  private hide() {
    const elem = this.resultLayoutSection || this.element;
    $$(elem).addClass('coveo-result-layout-hidden');
  }

  private show() {
    const elem = this.resultLayoutSection || this.element;
    $$(elem).removeClass('coveo-result-layout-hidden');
  }

  private getModelValue(): string {
    return this.queryStateModel.get(QueryStateModel.attributesEnum.layout);
  }

  private setModelValue(val: string) {
    this.queryStateModel.set(QueryStateModel.attributesEnum.layout, val);
  }

  private shouldShowSelector() {
    return (
      _.keys(this.currentActiveLayouts).length > 1 &&
      _.filter(this.currentActiveLayouts, (activeLayout: IActiveLayouts) => activeLayout.button.visible).length > 1 &&
      !this.hasNoResults
    );
  }

  private isLayoutDisplayedByButton(layout: ValidLayout) {
    return _.contains(_.keys(this.currentActiveLayouts), layout);
  }
}

Initialization.registerAutoCreateComponent(ResultLayout);
