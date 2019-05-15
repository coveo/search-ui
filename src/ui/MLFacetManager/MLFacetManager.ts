import { Component } from '../Base/Component';
import { MLFacet } from '../MLFacet/MLFacet';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { find } from 'underscore';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { ComponentOptions } from '../Base/ComponentOptions';

export interface IMLFacetManagerOptions {
  enableReorder?: boolean;
  onUpdate?: IMLFacetManagerOnUpdate;
  compareFacets?: IMLFacetManagerCompareFacet;
}

export interface IMLFacetManagerOnUpdate {
  (facet: MLFacet, index: number): void;
}

export interface IMLFacetManagerCompareFacet {
  (facetA: MLFacet, facetB: MLFacet): number;
}

/**
 * The `MLFacetManager` component is meant to be a parent for multiple [MLFacet]{@link MLFacet} components.
 * It allows more control over the rendering and ordering of the children [MLFacet]{@link MLFacet} components.
 */
export class MLFacetManager extends Component {
  static ID = 'MLFacetManager';
  static doExport = () => exportGlobally({ MLFacetManager });

  /**
   * The options for the MLFacet
   * @componentOptions
   */
  static options: IMLFacetManagerOptions = {
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
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     */
    onUpdate: ComponentOptions.buildCustomOption<IMLFacetManagerOnUpdate>(() => {
      return null;
    }),
    /**
     * A custom sort function to execute on facets on every successful query response (see [Implementing a Custom Dynamic Facet Sort Function](https://docs.coveo.com/en/2902/#implementing-a-custom-dynamic-facet-sort-function)).
     *
     * **Note:**
     * > If specified, the function must implement the JavaScript compareFunction (see [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     */
    compareFacets: ComponentOptions.buildCustomOption<IMLFacetManagerCompareFacet>(() => {
      return null;
    })
  };

  // Children MLFacet components of the MLFacetManager
  private mLFacets: MLFacet[];
  private containerElement: HTMLElement;

  /**
   * Creates a new `MLFacetManager` instance.
   *
   * @param element The element from which to instantiate the component.
   * @param options The component options.
   * @param bindings The component bindings. Automatically resolved by default.
   */
  constructor(element: HTMLElement, public options?: IMLFacetManagerOptions, private bindings?: IComponentBindings) {
    super(element, 'MLFacetManager');
    this.options = ComponentOptions.initComponentOptions(element, MLFacetManager, options);

    this.moveChildrenIntoContainer();
    this.initEvents();
  }

  private resetContainer() {
    this.containerElement && $$(this.containerElement).remove();
    this.containerElement = $$('div', { className: 'coveo-ml-facet-manager-container' }).el;
  }

  private moveChildrenIntoContainer() {
    this.resetContainer();
    $$(this.element)
      .children()
      .forEach(child => this.containerElement.appendChild(child));
    this.element.appendChild(this.containerElement);
  }

  private initEvents() {
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.handleAfterComponentsInitialization());
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  private handleAfterComponentsInitialization() {
    const allMLFacets = this.bindings.searchInterface.getComponents<MLFacet>('MLFacet');
    this.mLFacets = allMLFacets.filter(mlFacet => this.element.contains(mlFacet.element));

    if (!this.mLFacets.length) {
      this.disable();
    }
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (Utils.isNullOrUndefined(data.results.facets)) {
      return this.notImplementedError();
    }

    if (this.options.enableReorder) {
      this.mapResponseToComponents(data.results.facets);
      this.sortFacetsIfCompareOptionsProvided();
      this.reorderMLFacetsInDom();
    }
  }

  private mapResponseToComponents(facetsResponse: IFacetResponse[]) {
    this.mLFacets = facetsResponse.map(({ facetId }) => this.getMLFacetComponentById(facetId)).filter(Utils.exists);
  }

  private sortFacetsIfCompareOptionsProvided() {
    if (this.options.compareFacets) {
      this.mLFacets = this.mLFacets.sort(this.options.compareFacets);
    }
  }

  private reorderMLFacetsInDom() {
    this.resetContainer();
    const fragment = document.createDocumentFragment();

    this.mLFacets.forEach((mlFacet, index) => {
      fragment.appendChild(mlFacet.element);

      if (this.options.onUpdate) {
        this.options.onUpdate(mlFacet, index);
      }
    });

    this.containerElement.appendChild(fragment);
    this.element.appendChild(this.containerElement);
  }

  private getMLFacetComponentById(id: string) {
    const mLFacet = find(this.mLFacets, mLFacet => mLFacet.options.id === id);

    if (!mLFacet) {
      this.logger.error(`Cannot find MLFacet component with an id equal to "${id}".`);
      return null;
    }

    return mLFacet;
  }

  private notImplementedError() {
    this.logger.error('MLFacetManager is not supported by your current search endpoint. Disabling this component.');
    this.disable();
  }
}
