import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { exportGlobally } from '../../GlobalExports';
import { NoNameFacetHeader } from './NoNameFacetHeader/NoNameFacetHeader';
import { NoNameFacetValues } from './NoNameFacetValues/NoNameFacetValues';
import { NoNameFacetOptions, INoNameFacetOptions } from './NoNameFacetOptions';

export class NoNameFacet extends Component {
  static ID = 'NoNameFacet';
  static doExport = () => exportGlobally({ NoNameFacet });
  static options: INoNameFacetOptions = { ...NoNameFacetOptions, ...ResponsiveFacetOptions };

  private header: NoNameFacetHeader;
  private values: NoNameFacetValues;

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

    this.values = this.createValues();
    this.element.appendChild(this.values.element);

    // TODO: Add mock values to the facet
    this.values.updateValues([
      { value: 'test 1', selected: true, numberOfResults: 847324 },
      { value: 'test 2', selected: false, numberOfResults: 1 }
    ]);
  }

  private createHeader() {
    return new NoNameFacetHeader(this.options);
  }

  private createValues() {
    return new NoNameFacetValues(this.options);
  }
}

Initialization.registerAutoCreateComponent(NoNameFacet);
NoNameFacet.doExport();
