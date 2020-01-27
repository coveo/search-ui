import { Component } from '../Base/Component';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryEvents, IQuerySuccessEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { exportGlobally } from '../../GlobalExports';
import { find, without, partition } from 'underscore';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Assert } from '../../misc/Assert';
import { Initialization } from '../Base/Initialization';
import { ComponentsTypes } from '../../utils/ComponentsTypes';
import { QueryBuilder } from '../Base/QueryBuilder';
import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { IQueryResults } from '../../rest/QueryResults';

export interface IDynamicFacetManagerOptions {
  enableReorder?: boolean;
  onUpdate?: IDynamicFacetManagerOnUpdate;
  compareFacets?: IDynamicFacetManagerCompareFacet;
  maximumNumberOfExpandedFacets?: number;
}

export interface IDynamicFacetManagerOnUpdate {
  (facet: IDynamicManagerCompatibleFacet, index: number): void;
}

export interface IDynamicFacetManagerCompareFacet {
  (facetA: IDynamicManagerCompatibleFacet, facetB: IDynamicManagerCompatibleFacet): number;
}

export interface IDynamicManagerCompatibleFacet extends Component, IAutoLayoutAdjustableInsideFacetColumn {
  dynamicFacetManager: DynamicFacetManager;
  hasActiveValues: boolean;
  isDynamicFacet: boolean;

  handleQueryResults(results: IQueryResults): void;
  putStateIntoQueryBuilder(queryBuilder: QueryBuilder): void;
  putStateIntoAnalytics(): void;
  expand(): void;
  collapse(): void;
}

/**
 * The `DynamicFacetManager` component is meant to be a parent for multiple [DynamicFacet]{@link DynamicFacet} & [DynamicFacetRange]{@link DynamicFacetRange} components.
 * This component allows controlling a set of [`DynamicFacet`]{@link DynamicFacet} and [`DynamicFacetRange`]{@link DynamicFacetRange} as a group.
 *
 * See [Using Dynamic Facets](https://docs.coveo.com/en/2917/).
 * @availablesince [May 2019 Release (v2.6063)](https://docs.coveo.com/en/2909/)
 */
export class DynamicFacetManager extends Component {
  static ID = 'DynamicFacetManager';
  static doExport = () => exportGlobally({ DynamicFacetManager });

  /**
   * The options for the DynamicFacetManager
   * @componentOptions
   */
  static options: IDynamicFacetManagerOptions = {
    /**
     * Whether to allow the reordering of facets based on Coveo ML and index ranking scores.
     *
     * **Default:** `true`
     */
    enableReorder: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Filtering' }),
    /**
     * A function to execute whenever facets are updated in the query response (see [Implementing Custom Dynamic Facet Behaviors](https://docs.coveo.com/en/2902/#implementing-custom-dynamic-facet-behaviors)).
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     */
    onUpdate: ComponentOptions.buildCustomOption<IDynamicFacetManagerOnUpdate>(() => {
      return null;
    }),
    /**
     * A custom sort function to execute on facets on every successful query response (see [Implementing a Custom Dynamic Facet Sort Function](https://docs.coveo.com/en/2902/#implementing-a-custom-dynamic-facet-sort-function)).
     *
     * **Note:**
     * > If specified, the function must implement the JavaScript compareFunction (see [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     */
    compareFacets: ComponentOptions.buildCustomOption<IDynamicFacetManagerCompareFacet>(() => {
      return null;
    }),
    /**
     * The maximum number of expanded facets inside the manager.
     * Remaining facets are collapsed.
     *
     * **Note:**
     * Prioritizes facets with active values, and then prioritizes first facets.
     * If the number of facets with active values exceeds the value of the `maximumNumberOfExpandedFacets` option, it overrides the option.
     *
     * Using the value `-1` disables the feature and keeps all facets expanded.
     *
     * **Default:** `4`
     *
     * @availablesince [September 2019 Release (v2.7023)](https://docs.coveo.com/en/2990/)
     */
    maximumNumberOfExpandedFacets: ComponentOptions.buildNumberOption({ defaultValue: 4, min: -1 })
  };

  private childrenFacets: IDynamicManagerCompatibleFacet[] = [];
  private containerElement: HTMLElement;

  private get enabledFacets() {
    return this.childrenFacets.filter(facet => !facet.disabled);
  }

  private get displayedFacets() {
    return this.childrenFacets.filter(facet => facet.isCurrentlyDisplayed());
  }

  /**
   * Creates a new `DynamicFacetManager` instance.
   *
   * @param element The element from which to instantiate the component.
   * @param options The component options.
   * @param bindings The component bindings. Automatically resolved by default.
   */
  constructor(element: HTMLElement, public options?: IDynamicFacetManagerOptions) {
    super(element, 'DynamicFacetManager');
    this.options = ComponentOptions.initComponentOptions(element, DynamicFacetManager, options);
    this.resetContainer();
    this.prependContainer();
    this.initEvents();
  }

  private resetContainer() {
    this.containerElement && $$(this.containerElement).remove();
    this.containerElement = $$('div', { className: 'coveo-dynamic-facet-manager-container' }).el;
  }

  private prependContainer() {
    $$(this.element).prepend(this.containerElement);
  }

  private initEvents() {
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.handleAfterComponentsInitialization());
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  private isDynamicFacet(component: Component) {
    return !!(component as IDynamicManagerCompatibleFacet).isDynamicFacet;
  }

  private get allDynamicFacets(): IDynamicManagerCompatibleFacet[] {
    const allFacetsInComponent = ComponentsTypes.getAllFacetsInstance(this.element);
    return <IDynamicManagerCompatibleFacet[]>allFacetsInComponent.filter(this.isDynamicFacet);
  }

  private handleAfterComponentsInitialization() {
    this.childrenFacets = this.allDynamicFacets;
    this.childrenFacets.forEach(dynamicFacet => {
      dynamicFacet.dynamicFacetManager = this;
      this.containerElement.appendChild(dynamicFacet.element);
    });

    if (this.element.children.length > 1) {
      this.logger.warn(`DynamicFacetManager contains incompatible elements. Those elements may be moved in the DOM.
        To prevent this warning, move those elements outside of the DynamicFacetManager.`);
    }

    if (!this.childrenFacets.length) {
      this.disable();
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);

    this.enabledFacets.forEach(dynamicFacet => {
      dynamicFacet.putStateIntoQueryBuilder(data.queryBuilder);
      dynamicFacet.putStateIntoAnalytics();
    });
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (Utils.isNullOrUndefined(data.results.facets)) {
      return this.notImplementedError();
    }

    this.enabledFacets.forEach(dynamicFacet => {
      dynamicFacet.handleQueryResults(data.results);
    });

    const wasFacetOrderFrozen = data.query.facetOptions && data.query.facetOptions.freezeFacetOrder;
    if (wasFacetOrderFrozen) {
      return this.callOnUpdateOnChildrenFacets();
    }

    if (this.options.enableReorder) {
      this.options.compareFacets ? this.sortFacetsWithCompareOption() : this.sortFacetsWithResponseOrder(data.results.facets);
      this.reorderFacetsInDom();
    }

    this.respectMaximumExpandedFacetsThreshold();
    this.callOnUpdateOnChildrenFacets();
  }

  private callOnUpdateOnChildrenFacets() {
    if (!this.options.onUpdate) {
      return;
    }

    this.childrenFacets.forEach((dynamicFacet, index) => this.options.onUpdate(dynamicFacet, index));
  }

  private sortFacetsWithResponseOrder(facetsResponse: IFacetResponse[]) {
    const facetsInResponse = facetsResponse.map(({ facetId }) => this.getChildFacetWithId(facetId)).filter(Utils.exists);
    const facetsNotInResponse = without(this.childrenFacets, ...facetsInResponse);

    this.childrenFacets = [...facetsInResponse, ...facetsNotInResponse];
  }

  private sortFacetsWithCompareOption() {
    this.childrenFacets = this.childrenFacets.sort(this.options.compareFacets);
  }

  private reorderFacetsInDom() {
    this.resetContainer();
    const fragment = document.createDocumentFragment();

    this.childrenFacets.forEach(dynamicFacet => fragment.appendChild(dynamicFacet.element));

    this.containerElement.appendChild(fragment);
    this.prependContainer();
  }

  private respectMaximumExpandedFacetsThreshold() {
    if (this.options.maximumNumberOfExpandedFacets === -1) {
      return;
    }

    const [collapsableFacets, uncollapsableFacets] = partition(this.displayedFacets, facet => facet.options.enableCollapse);
    let facetsLeftToExpandCounter = this.options.maximumNumberOfExpandedFacets - uncollapsableFacets.length;

    collapsableFacets.forEach(dynamicFacet => {
      if (facetsLeftToExpandCounter < 1) {
        return dynamicFacet.collapse();
      }

      if (dynamicFacet.options.collapsedByDefault) {
        dynamicFacet.logger.info(
          'The facet has its "collapsedByDefault" option set to "true", which prevents the DynamicFacetManager from expanding it.',
          'While this configuration may be legitimate, it partially defeats the purpose of the dynamic navigation experience feature.',
          'For more information, see https://docs.coveo.com/en/2917/.'
        );
        return dynamicFacet.collapse();
      }

      facetsLeftToExpandCounter--;
      dynamicFacet.expand();
    });
  }

  private getChildFacetWithId(id: string) {
    return find(this.childrenFacets, facet => facet.options.id === id);
  }

  private notImplementedError() {
    this.logger.error('DynamicFacetManager is not supported by your current search endpoint. Disabling this component.');
    this.disable();
  }

  public isCurrentlyDisplayed() {
    return !!find(this.childrenFacets, facet => facet.isCurrentlyDisplayed());
  }
}

Initialization.registerAutoCreateComponent(DynamicFacetManager);
DynamicFacetManager.doExport();
