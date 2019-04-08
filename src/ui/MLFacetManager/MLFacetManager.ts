import { Component } from '../Base/Component';
import { MLFacet } from '../MLFacet/MLFacet';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { shuffle, find } from 'underscore';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { $$ } from '../../utils/Dom';

export class MLFacetManager extends Component {
  static ID = 'MLFacetManager';
  static doExport = () => exportGlobally({ MLFacetManager });

  // Children MLFacet components of the MLFacetManager
  private mLFacets: MLFacet[];

  constructor(element: HTMLElement, public options?: any, private bindings?: IComponentBindings) {
    super(element, 'MLFacetManager');

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

    this.reorderFacetsInDom(shuffle(data.results.facets));
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

  private reorderFacetsInDom(facetsResponse: IFacetResponse[]) {
    // console.log('facets', this.mLFacets.map(facet => facet.options.id));
    // console.log('response', facetsResponse.map(facet => facet.facetId));

    let previousMLFacetComponent: MLFacet;
    facetsResponse.forEach(facetResponse => {
      const id = facetResponse.facetId;
      const mLFacetComponent = this.getMLFacetComponentById(id);
      if (!mLFacetComponent) {
        return;
      }

      if (previousMLFacetComponent) {
        this.insertMLFacetComponentAfter(mLFacetComponent, previousMLFacetComponent);
      }

      previousMLFacetComponent = mLFacetComponent;
    });
  }
}
