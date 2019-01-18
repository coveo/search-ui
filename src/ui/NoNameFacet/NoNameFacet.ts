import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { exportGlobally } from '../../GlobalExports';
import { NoNameFacetHeader } from './NoNameFacetHeader';
import { NoNameFacetOptions, INoNameFacetOptions } from './NoNameFacetOptions';

export class NoNameFacet extends Component {
  static ID = 'NoNameFacet';
  static doExport = () => exportGlobally({ NoNameFacet });
  static options: INoNameFacetOptions = NoNameFacetOptions;

  private header: NoNameFacetHeader;

  constructor(
    public element: HTMLElement,
    public options: INoNameFacetOptions,
    bindings?: IComponentBindings,
    noNameFacetClassId: string = NoNameFacet.ID
  ) {
    super(element, noNameFacetClassId, bindings);
    this.options = ComponentOptions.initComponentOptions(element, NoNameFacet, options);

    ResponsiveFacets.init(this.root, this, this.options);

    this.ensureDom();
  }

  public createDom() {
    this.createContent();
  }

  private createContent() {
    this.header = this.createHeader();
    this.element.appendChild(this.header.element);
  }

  private createHeader() {
    return new NoNameFacetHeader({
      title: this.options.title,
      rootFacetOptions: this.options
    });
  }
}

Initialization.registerAutoCreateComponent(NoNameFacet);
NoNameFacet.doExport();
