import { Component } from '../Base/Component';
import { MLFacet } from '../MLFacet/MLFacet';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { shuffle, find } from 'underscore';
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

export class MLFacetManager extends Component {
  static ID = 'MLFacetManager';
  static doExport = () => exportGlobally({ MLFacetManager });

  /**
   * The options for the MLFacet
   * @componentOptions
   */
  static options: IMLFacetManagerOptions = {
    /**
     * Whether to allow the reordering of the facets depending on the server's response.
     *
     * **Default:** `true`
     */
    enableReorder: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Filtering' }),
    /**
     * Specifies the event handler function to execute when the facets are updated on the query response
     * For each `MLFacet`, you can provide a callback function to execute after the facet is reordered.
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     *
     * **Example:**
     *
     * ```javascript
     *
     * var myOnUpdateFunction = function(mLFacetComponent, index) {
     *     // Collapse every facet except the first one
     *     if (index > 0) {
     *       mLFacetComponent.collapse();
     *     } else {
     *       mLFacetComponent.expand();
     *     }
     *
     * };
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *    MLFacetManager : {
     *      onUpdate : myOnUpdateFunction
     *    }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector("#search"), {
     * //   MLFacetManager : {
     * //     onUpdate : myOnUpdateFunction
     * //   }
     * // });
     * ```
     */
    onUpdate: ComponentOptions.buildCustomOption<IMLFacetManagerOnUpdate>(() => {
      return null;
    }),
    /**
     * Specifies a function that defines the sort order for the facets.
     *
     * Called on every successful query reponse.
     *
     * The implementation of this method is identical to the Javascript `compareFunction` of the sort method for arrays.
     * (see [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort))
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     *
     * **Example:**
     *
     * ```javascript
     *
     * var myCompareFacetsMethodFunction = function(facetA, facetB) {
     *     // Sort the facets by number of selected values
     *     return facetB.values.selectedValues.length - facetA.values.selectedValues.length;
     * };
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *    MLFacetManager : {
     *      compareFacets : myCompareFacetsMethodFunction
     *    }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector("#search"), {
     * //   MLFacetManager : {
     * //     compareFacets : myCompareFacetsMethodFunction
     * //   }
     * // });
     * ```
     */
    compareFacets: ComponentOptions.buildCustomOption<IMLFacetManagerCompareFacet>(() => {
      return null;
    })
  };

  // Children MLFacet components of the MLFacetManager
  private mLFacets: MLFacet[];
  private containerElement: HTMLElement;
  // TODO: Remove this when freezeCurrentFacets is implemented on the API
  public freezeCurrentFacets = false;

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

    this.mLFacets.forEach(mLFacet => mLFacet.registerManager(this));
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (this.disabled) {
      return;
    }

    if (Utils.isNullOrUndefined(data.results.facets)) {
      return this.notImplementedError();
    }

    if (this.options.enableReorder) {
      // TODO: remove shuffle for the results
      !this.freezeCurrentFacets && this.mapResponseToComponents(shuffle(data.results.facets));
      this.sortFacetsIfCompareOptionsProvided();
      this.reorderMLFacetsInDom();
    }

    this.freezeCurrentFacets = false;
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
