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
}

export interface IMLFacetManagerOnUpdate {
  (facet: MLFacet, index: number): void;
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
    })
  };

  // Children MLFacet components of the MLFacetManager
  private mLFacets: MLFacet[];

  constructor(element: HTMLElement, public options?: IMLFacetManagerOptions, private bindings?: IComponentBindings) {
    super(element, 'MLFacetManager');
    this.options = ComponentOptions.initComponentOptions(element, MLFacetManager, options);

    this.initEvents();
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
    if (this.disabled) {
      return;
    }

    if (Utils.isNullOrUndefined(data.results.facets)) {
      return this.notImplementedError();
    }

    if (this.options.enableReorder) {
      // TODO: remove shuffle for the results
      this.reorderMLFacetsInDom(shuffle(data.results.facets));
    }
  }

  private getMLFacetComponentById(id: string) {
    const mLFacet = find(this.mLFacets, mLFacet => mLFacet.options.id === id);

    if (!mLFacet) {
      // Idea: here we could create a MLFacet component if it doesn't exist
      this.logger.error(`Cannot find MLFacet component with an id equal to "${id}".`);
      return null;
    }

    return mLFacet;
  }

  private insertMLFacetComponentAfter(component: MLFacet, targetComponent: MLFacet) {
    const previousSibling = component.element.previousElementSibling;
    if (previousSibling && previousSibling.isEqualNode(targetComponent.element)) {
      return;
    }

    $$(component.element).insertAfter(targetComponent.element);
  }

  private reorderMLFacetsInDom(facetsResponse: IFacetResponse[]) {
    let previousMLFacetComponent: MLFacet;
    facetsResponse.forEach((facetResponse, index) => {
      const id = facetResponse.facetId;
      const mLFacetComponent = this.getMLFacetComponentById(id);
      if (!mLFacetComponent) {
        return;
      }

      if (previousMLFacetComponent) {
        this.insertMLFacetComponentAfter(mLFacetComponent, previousMLFacetComponent);
      }

      if (this.options.onUpdate) {
        this.options.onUpdate(mLFacetComponent, index);
      }

      previousMLFacetComponent = mLFacetComponent;
    });
  }

  private notImplementedError() {
    this.logger.error('MLFacetManager is not supported by your current search endpoint. Disabling this component.');
    this.disable();
  }
}
