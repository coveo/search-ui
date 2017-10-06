import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { l } from '../../strings/Strings';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { analyticsActionCauseList, IAnalyticsContextRemoveMeta } from '../Analytics/AnalyticsActionListMeta';
import { QUERY_STATE_ATTRIBUTES, QueryStateModel } from '../../models/QueryStateModel';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { Initialization } from '../Base/Initialization';
import { Assert } from '../../misc/Assert';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_HiddenQuery';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IHiddenQueryOptions {
  maximumDescriptionLength: number;
  title: string;
}

/**
 * The HiddenQuery component handles a "hidden" query parameter (`hq`) and its description (`hd`).
 *
 * Concretely, this means that if a HiddenQuery component is present in your page and you load your search interface
 * with `hq=foo&hd=bar` in the URL hash, the component adds `foo` as an expression to the query (`hq` is the hidden
 * query) and renders `bar` in the {@link Breadcrumb} (`hd` is the hidden query description).
 */
export class HiddenQuery extends Component {
  static ID = 'HiddenQuery';

  static doExport = () => {
    exportGlobally({
      HiddenQuery: HiddenQuery
    });
  };

  /**
   * Possible options for the `HiddenQuery` component
   * @componentOptions
   */
  static options: IHiddenQueryOptions = {
    /**
     * Specifies the maximum number of characters from the hidden query description (`hd`) to display in the
     * {@link Breadcrumb}.
     *
     * Beyond this length, the HiddenQuery component slices the rest of the description and replaces it by `...`.
     *
     * Default value is `100`. Minimum value is `0`.
     */
    maximumDescriptionLength: ComponentOptions.buildNumberOption({ min: 0, defaultValue: 100 }),

    /**
     * Specifies the title that should appear in the {@link Breadcrumb} when the HiddenQuery populates it.
     *
     * Default value is the localized string f
     * or `"Additional filters:"`
     */
    title: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('AdditionalFilters') + ': ' })
  };

  /**
   * Creates a new HiddenQuery component, which binds multiple events ({@link QueryEvents.buildingQuery},
   * {@link BreadcrumbEvents.populateBreadcrumb} and {@link BreadcrumbEvents.clearBreadcrumb}).
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the HiddenQuery component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IHiddenQueryOptions, bindings?: IComponentBindings) {
    super(element, HiddenQuery.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, HiddenQuery, options);

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
      this.handlePopulateBreadcrumb(args)
    );
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.setStateEmpty());
  }

  /**
   * Clears any `hd` or `hq` set in the {@link QueryStateModel}.
   * Also logs the `contextRemove` event in the usage analytics and triggers a new query.
   */
  public clear() {
    this.setStateEmpty();
    const hiddenDescriptionRemoved = this.getDescription();
    this.usageAnalytics.logSearchEvent<IAnalyticsContextRemoveMeta>(analyticsActionCauseList.contextRemove, {
      contextName: hiddenDescriptionRemoved
    });
    this.queryController.executeQuery();
  }

  private setStateEmpty() {
    this.queryStateModel.set(QUERY_STATE_ATTRIBUTES.HD, '');
    this.queryStateModel.set(QUERY_STATE_ATTRIBUTES.HQ, '');
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    const hiddenQuery = this.queryStateModel.get(QUERY_STATE_ATTRIBUTES.HQ);
    if (Utils.isNonEmptyString(hiddenQuery)) {
      data.queryBuilder.advancedExpression.add(hiddenQuery);
    }
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    const description = this.getDescription();
    if (!_.isEmpty(description) && !_.isEmpty(this.queryStateModel.get(QUERY_STATE_ATTRIBUTES.HQ))) {
      const elem = document.createElement('div');
      $$(elem).addClass('coveo-hidden-query-breadcrumb');

      const title = document.createElement('span');
      $$(title).addClass('coveo-hidden-query-breadcrumb-title');
      $$(title).text(this.options.title);
      elem.appendChild(title);

      const values = document.createElement('span');
      $$(values).addClass('coveo-hidden-query-breadcrumb-values');
      elem.appendChild(values);

      const value = $$('span', { className: 'coveo-hidden-query-breadcrumb-value' }, description);
      values.appendChild(value.el);

      const svgContainer = $$('span', { className: 'coveo-hidden-query-breadcrum-clear-icon' }, SVGIcons.icons.checkboxHookExclusionMore);
      SVGDom.addClassToSVGInContainer(svgContainer.el, 'coveo-hidden-query-breadcrumb-clear-svg');
      const clear = $$('span', { className: 'coveo-hidden-query-breadcrumb-clear' });
      clear.append(svgContainer.el);
      elem.appendChild(clear.el);

      $$(elem).on('click', () => this.clear());

      args.breadcrumbs.push({
        element: elem
      });
    }
  }

  private getDescription() {
    let description = this.queryStateModel.get(QueryStateModel.attributesEnum.hd);
    if (_.isEmpty(description)) {
      description = this.queryStateModel.get(QueryStateModel.attributesEnum.hq);
    }
    if (!_.isEmpty(description)) {
      if (description.length > this.options.maximumDescriptionLength) {
        description = description.slice(0, this.options.maximumDescriptionLength) + ' ...';
      }
    }
    return description;
  }
}
Initialization.registerAutoCreateComponent(HiddenQuery);
