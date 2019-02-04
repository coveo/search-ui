import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { exportGlobally } from '../../GlobalExports';
import { NoNameFacetHeader } from './NoNameFacetHeader/NoNameFacetHeader';
import { NoNameFacetOptions, INoNameFacetOptions } from './NoNameFacetOptions';

export class NoNameFacet extends Component {
  static ID = 'NoNameFacet';
  static doExport = () => exportGlobally({ NoNameFacet });
  static options: INoNameFacetOptions = { ...NoNameFacetOptions, ...ResponsiveFacetOptions };

  private header: NoNameFacetHeader;

  constructor(public element: HTMLElement, public options?: INoNameFacetOptions, bindings?: IComponentBindings) {
    super(element, NoNameFacet.ID, bindings);
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
    return new NoNameFacetHeader(this.options);
  }
}

Initialization.registerAutoCreateComponent(NoNameFacet);
NoNameFacet.doExport();
