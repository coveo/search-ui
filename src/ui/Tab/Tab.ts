import {ResponsiveTabs} from '../ResponsiveComponents/ResponsiveTabs.ts';
import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {MODEL_EVENTS, IAttributeChangedEventArg} from '../../models/Model';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {QueryStateModel, QUERY_STATE_ATTRIBUTES} from '../../models/QueryStateModel';
import {analyticsActionCauseList, IAnalyticsInterfaceChange} from '../Analytics/AnalyticsActionListMeta';
import {SearchEndpoint} from '../../rest/SearchEndpoint';
import {Initialization} from '../Base/Initialization';
import {Utils} from '../../utils/Utils';
import {Assert} from '../../misc/Assert';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {$$} from '../../utils/Dom';

export interface ITabOptions {
  expression?: string;
  constant?: boolean;
  id?: string;
  icon?: string;
  caption?: string;
  sort?: string;
  endpoint?: SearchEndpoint;
  enableDuplicateFiltering?: boolean;
  pipeline?: string;
  maximumAge?: number;
}

/**
 * This component is a bar allowing users to select a search interface.<br/>
 * The component attaches itself to an div element and is in charge of adding an advanced expression to the query and thus, modify the outgoing query in order to refine the results in relation to the selected tab.<br/>
 * It also allows to hide and show different parts of the UI. In order to do so, each component of the UI can specify whether or not it wishes to be included or excluded from a specific tab.<br/>
 * Eg : <br/>
 * * &lt;div data-tab="foobar"&gt; -> Include this element only in the tab with the id 'foobar'.<br/>
 * * &lt;div data-tab-not="foobar"&gt; -> DO NOT include this element in the tab id 'foobar'.<br/>
 * * &lt;div data-tab="foobar,somethingelse"&gt; -> Include this element only in the tab with the id 'foobar' or 'somethingelse'.
 */
export class Tab extends Component {
  static ID = 'Tab';

  /**
   * The options for a Tab
   * @componentOptions
   */
  static options: ITabOptions = {
    /**
     * The unique ID for a tab.<br/>
     * This is mandatory and required for the tab to function properly
     */
    id: ComponentOptions.buildStringOption({ required: true }),
    /**
     * The caption for the tab.<br/>
     * This is mandatory and required for the tab to function properly
     */
    caption: ComponentOptions.buildLocalizedStringOption({ required: true }),
    /**
     * Specify an icon for the tab.<br/>
     * This options is mostly kept for legacy reason. Do not use one if not needed.
     */
    icon: ComponentOptions.buildIconOption(),
    /**
     * Specifies an advanced expression / filter that this tab adds to any outgoing query.<br/>
     * eg : @objecttype==Message.<br/>
     * This is optional, normally a "All Content" tab would not set any filter on the query.
     */
    expression: ComponentOptions.buildStringOption(),
    /**
     * Specifies the endpoint that a tab should point to when performing query inside that tab.<br/>
     * This is optional, by default the tab will use the "default" endpoint
     */
    endpoint: ComponentOptions.buildCustomOption((endpoint) => endpoint != null ? SearchEndpoint.endpoints[endpoint] : null),
    /**
     * Specifies the default sort when this tab is selected. A {@link Sort} Component configured with the same specified parameter needs to be in the interface in order for this this option to function properly.<br/>
     * eg : relevancy / date descending<br/>
     * Optional, by default the normal {@link Sort} component behavior will operate
     */
    sort: ComponentOptions.buildStringOption(),
    /**
     * Specifies whether the filter expression should be included in the constant part of the query.<br/>
     * The constant part of the query is specially optimized by the index to execute faster, but you must be careful not to include dynamic query expressions otherwise the cache would lose its efficiency.<br/>
     * By default, this option is set to true.
     */
    constant: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies whether to filter duplicates on the search results.<br/>
     * The default value is false.
     */
    enableDuplicateFiltering: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the name of the query pipeline to use for the queries, in the Coveo platform ( Query Pipeline in the cloud admin).<br/>
     * If not specified, the default value is null, in which case pipeline selection conditions defined in a Coveo Cloud organization apply.
     */
    pipeline: ComponentOptions.buildStringOption(),
    /**
     * Specifies the maximum age in milliseconds that cached query results can have in order to be used (instead of performing a new query on the index).<br/>
     * The cache is located in the Coveo Search API (which resides between the index and search interface).<br/>
     * If cached results are available but are older than the specified age, a new query will be performed on the index.<br/>
     * By default, this is left undefined and the Coveo Search API will decide the cache duration.
     */
    maximumAge: ComponentOptions.buildNumberOption()
  };

  private isFirstQuery = true;

  /**
   * Create a new Tab. Bind on buildingQuery event as well as on click of the element
   * @param element The HTMLElement on which to create a new tab. Normally a div
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: ITabOptions, bindings?: IComponentBindings) {
    super(element, Tab.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Tab, options);

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.T, (args: IAttributeChangedEventArg) => this.handleQueryStateChanged(args));
    this.bind.on(element, 'click', (e: Event) => this.handleClick());
    this.render();
    ResponsiveTabs.init(this.root, Tab.ID, this);
  }

  /**
   * Select the current tab.<br/>
   * Trigger a query and log an analytics event.
   */
  public select() {
    if (!this.disabled) {
      this.queryStateModel.setMultiple({
        t: this.options.id,
        sort: this.options.sort || QueryStateModel.defaultAttributes.sort
      });
      this.usageAnalytics.logSearchEvent<IAnalyticsInterfaceChange>(analyticsActionCauseList.interfaceChange, { interfaceChangeTo: this.options.id });
      this.queryController.executeQuery();
    }
  }

  /**
   * Check if the given HTMLElement is included or not in this tab
   * @param element The element to verify
   * @returns {boolean}
   */
  public isElementIncludedInTab(element: HTMLElement): boolean {
    Assert.exists(element);

    var includedTabs = this.splitListOfTabs(element.getAttribute('data-tab'));
    var excludedTabs = this.splitListOfTabs(element.getAttribute('data-tab-not'));
    Assert.check(!(includedTabs.length != 0 && excludedTabs.length != 0), 'You cannot both explicity include and exclude an element from tabs');

    return (includedTabs.length != 0 && _.indexOf(includedTabs, this.options.id) != -1) ||
      (excludedTabs.length != 0 && _.indexOf(excludedTabs, this.options.id) == -1) ||
      (includedTabs.length == 0 && excludedTabs.length == 0);
  }

  private handleClick() {
    this.select();
  }

  private render() {
    var icon = this.options.icon;
    if (Utils.isNonEmptyString(icon)) {
      var icnSpan = document.createElement('span');
      $$(icnSpan).addClass(['coveo-icon', icon]);
      this.element.insertBefore(icnSpan, this.element.firstChild);
    }

    var caption = this.options.caption;
    if (Utils.isNonEmptyString(caption)) {
      var captionP = document.createElement('p');
      $$(captionP).text(caption);
      this.element.appendChild(captionP);
    }
  }

  protected handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    this.isFirstQuery = false;
    if (!this.disabled && this.isSelected()) {
      data.queryBuilder.tab = this.options.id;

      if (Utils.isNonEmptyString(this.options.expression)) {
        if (this.options.constant) {
          data.queryBuilder.constantExpression.add(this.options.expression);
        } else {
          data.queryBuilder.advancedExpression.add(this.options.expression);
        }
      }

      if (this.options.enableDuplicateFiltering) {
        data.queryBuilder.enableDuplicateFiltering = true;
      }

      if (this.options.pipeline != null) {
        data.queryBuilder.pipeline = this.options.pipeline;
      }

      if (this.options.maximumAge != null) {
        data.queryBuilder.maximumAge = this.options.maximumAge;
      }
    }
  }

  private handleQueryStateChanged(data: IAttributeChangedEventArg) {
    Assert.exists(data);
    if (!this.disabled && this.isSelected()) {
      $$(this.element).addClass('coveo-selected')
      this.queryController.setEndpoint(this.options.endpoint);
      this.showAndHideAppropriateElements();
    } else {
      $$(this.element).removeClass('coveo-selected');
    }
  }

  protected isSelected(): boolean {
    var activeTab = this.queryStateModel.get(QueryStateModel.attributesEnum.t);
    return activeTab == this.options.id;
  }

  private showAndHideAppropriateElements() {
    var showElements = [];
    var hideElements = [];

    _.each($$(this.root).findAll('[data-tab],[data-tab-not]'), (element) => {
      if (this.isElementIncludedInTab(element)) {
        this.toggleAllComponentsUnder(element, true);
        showElements.push(element);
      } else {
        this.toggleAllComponentsUnder(element, false);
        hideElements.push(element);
      }
    });

    $$(this.root).one(QueryEvents.querySuccess, () => {
      _.each(showElements, (elem) => $$(elem).removeClass('coveo-tab-disabled'));
      _.each(hideElements, (elem) => $$(elem).addClass('coveo-tab-disabled'));
    })
  }

  private splitListOfTabs(value: string): string[] {
    if (Utils.exists(value)) {
      return _.map(value.split(','), (tab) => Utils.trim(tab));
    } else {
      return [];
    }
  }

  private toggleAllComponentsUnder(element: HTMLElement, enable: boolean) {
    Assert.exists(element);

    var togglePossibleComponent = (possibleComponent: HTMLElement) => {
      var possibleCmp = Component.get(possibleComponent, undefined, true);
      if (possibleCmp) {
        if (enable) {
          possibleCmp.enable();
        } else {
          possibleCmp.disable();
        }
      }
    }

    togglePossibleComponent(element);
    _.each($$(element).findAll('*'), (el) => {
      togglePossibleComponent(el);
    })
  }

  public enable() {
    super.enable();
    this.element.style.display = '';
  }

  public disable() {
    super.disable();
    this.element.style.display = 'none';
  }
}

Initialization.registerAutoCreateComponent(Tab);
