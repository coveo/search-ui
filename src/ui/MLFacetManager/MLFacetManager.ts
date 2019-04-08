import { Component } from '../Base/Component';
import { MLFacet } from '../MLFacet/MLFacet';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';

export class MLFacetManager extends Component {
  static ID = 'MLFacetManager';
  static doExport = () => exportGlobally({ MLFacetManager });

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

    // TODO: have fun here
  }
}
