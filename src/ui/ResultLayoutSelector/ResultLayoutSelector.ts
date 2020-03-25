import 'styling/_ResultLayoutSelector';
import { contains, difference, each, filter, find, isEmpty, keys, uniq } from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';
import { IQueryErrorEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { IResultLayoutPopulateArgs, ResultLayoutEvents } from '../../events/ResultLayoutEvents';
import { IChangeLayoutEventArgs, ResultListEvents } from '../../events/ResultListEvents';
import { Assert } from '../../misc/Assert';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { IQueryResults } from '../../rest/QueryResults';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { analyticsActionCauseList, IAnalyticsResultsLayoutChange } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveResultLayout } from '../ResponsiveComponents/ResponsiveResultLayout';
import { ValidLayout } from './ValidLayout';
import ResultListModule = require('../ResultList/ResultList');
import { AccessibleButton } from '../../utils/AccessibleButton';

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

export const defaultLayout: ValidLayout = 'list';

/**
 * The ResultLayoutSelector component allows the end user to switch between multiple {@link ResultList} components that have
 * different {@link ResultList.options.layout} values.
 *
 * This component automatically populates itself with buttons to switch between the ResultList components that have a
 * valid layout value (see the {@link ValidLayout} type).
 *
 * See also the [Result Layouts](https://docs.coveo.com/en/360/) documentation.
 *
 * @availablesince [February 2018 Release (v2.3826.10)](https://docs.coveo.com/en/410/#february-2018-release-v2382610)
 */
export class ResultLayoutSelector extends Component {
  static ID = 'ResultLayoutSelector';
  static aliases = ['ResultLayout'];

  static doExport = () => {
    exportGlobally({
      ResultLayoutSelector: ResultLayoutSelector,
      ResultLayout: ResultLayoutSelector
    });
  };

  public static validLayouts: ValidLayout[] = ['list', 'card', 'table'];

  public currentLayout: string;

  private currentActiveLayouts: { [key: string]: IActiveLayouts };

  private resultLayoutSection: HTMLElement;
  private hasNoResults: boolean;

  /**
   * The component options
   * @componentOptions
   */
  static options: IResultLayoutOptions = {
    /**
     * Specifies the layouts that should be available when the search page is displayed in mobile mode.
     *
     * By default, the mobile mode breakpoint is at 480 px screen width.
     *
     * To change this default value, use the [responsiveSmallBreakpoint]{@link SearchInterface.options.responsiveSmallBreakpoint} option.
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
     * To change this default value, use the [responsiveMediumBreakpoint]{@link SearchInterface.options.responsiveMediumBreakpoint} option.
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
     * To change this default value, use the [responsiveMediumBreakpoint]{@link SearchInterface.options.responsiveMediumBreakpoint} option.
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
   * Creates a new ResultLayoutSelector component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ResultLayout component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IResultLayoutOptions, bindings?: IComponentBindings) {
    super(element, ResultLayoutSelector.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultLayoutSelector, options);

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
        if (!this.queryController.firstQuery) {
          this.queryController.executeQuery();
        }
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
      each(layouts, layout => this.disableLayout(layout));

      let remainingValidLayouts = difference(keys(this.currentActiveLayouts), layouts);
      if (!isEmpty(remainingValidLayouts)) {
        const newLayout = contains(remainingValidLayouts, this.currentLayout) ? this.currentLayout : remainingValidLayouts[0];
        this.changeLayout(<ValidLayout>newLayout);
      } else {
        this.logger.error('Cannot disable the last valid layout ... Re-enabling the first one possible');
        let firstPossibleValidLayout = <ValidLayout>keys(this.currentActiveLayouts)[0];
        this.enableLayout(firstPossibleValidLayout);
        this.setLayout(firstPossibleValidLayout);
      }
    }
  }

  public enableLayouts(layouts: ValidLayout[]) {
    each(layouts, layout => {
      this.enableLayout(layout);
    });
  }

  private disableLayout(layout: ValidLayout) {
    if (this.isLayoutDisplayedByButton(layout)) {
      this.hideButton(layout);
    }
  }

  private enableLayout(layout: ValidLayout) {
    const allResultLists = this.resultLists;
    const atLeastOneResultListCanShowLayout = find(allResultLists, resultList => resultList.options.layout == layout);
    if (atLeastOneResultListCanShowLayout && this.isLayoutDisplayedByButton(layout)) {
      this.showButton(layout);
      this.updateSelectorAppearance();
    }
  }

  private get resultLists(): ResultListModule.ResultList[] {
    return this.searchInterface.getComponents('ResultList');
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
      if (this.currentLayout) {
        $$(this.currentActiveLayouts[this.currentLayout].button.el).removeClass('coveo-selected');
        $$(this.currentActiveLayouts[this.currentLayout].button.el).setAttribute('aria-pressed', false.toString());
      }
      $$(this.currentActiveLayouts[layout].button.el).addClass('coveo-selected');
      $$(this.currentActiveLayouts[layout].button.el).setAttribute('aria-pressed', true.toString());
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
    const newLayout = find(keys(this.currentActiveLayouts), l => l === modelLayout);
    if (newLayout !== undefined) {
      this.setLayout(<ValidLayout>newLayout);
    } else {
      this.setLayout(<ValidLayout>keys(this.currentActiveLayouts)[0]);
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
    const layouts = uniq(populateArgs.layouts.map(layout => layout.toLowerCase()));

    each(layouts, layout => Assert.check(contains(ResultLayoutSelector.validLayouts, layout), 'Invalid layout'));
    if (!isEmpty(layouts)) {
      each(layouts, layout => this.addButton(layout));
      if (!this.shouldShowSelector()) {
        this.hide();
      }
    }
  }

  private addButton(layout: string) {
    const btn = $$('span', {
      className: 'coveo-result-layout-selector'
    });
    const caption = $$('span', { className: 'coveo-result-layout-selector-caption' }, l(layout));
    btn.append(caption.el);

    const icon = $$('span', { className: `coveo-icon coveo-${layout}-layout-icon` }, SVGIcons.icons[`${layout}Layout`]);
    SVGDom.addClassToSVGInContainer(icon.el, `coveo-${layout}-svg`);
    btn.prepend(icon.el);

    const selectAction = () => this.changeLayout(<ValidLayout>layout);

    new AccessibleButton()
      .withElement(btn)
      .withLabel(l('DisplayResultsAs', l(layout)))
      .withSelectAction(selectAction)
      .withOwner(this.bind)
      .build();

    const isCurrentLayout = layout === this.currentLayout;
    btn.toggleClass('coveo-selected', isCurrentLayout);
    btn.setAttribute('aria-pressed', isCurrentLayout.toString());

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
      keys(this.currentActiveLayouts).length > 1 &&
      filter(this.currentActiveLayouts, (activeLayout: IActiveLayouts) => activeLayout.button.visible).length > 1 &&
      !this.hasNoResults
    );
  }

  private isLayoutDisplayedByButton(layout: ValidLayout) {
    return contains(keys(this.currentActiveLayouts), layout);
  }
}

Initialization.registerAutoCreateComponent(ResultLayoutSelector);
