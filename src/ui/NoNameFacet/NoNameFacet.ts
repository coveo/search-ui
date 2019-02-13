import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { exportGlobally } from '../../GlobalExports';
import { NoNameFacetHeader } from './NoNameFacetHeader/NoNameFacetHeader';
import { NoNameFacetValuesList } from './NoNameFacetValues/NoNameFacetValuesList';
import { NoNameFacetOptions, INoNameFacetOptions } from './NoNameFacetOptions';
import { NoNameFacetValues } from './NoNameFacetValues/NoNameFacetValues';
import { INoNameFacetValue } from './NoNameFacetValues/NoNameFacetValue';

export class NoNameFacet extends Component {
  static ID = 'NoNameFacet';
  static doExport = () => exportGlobally({ NoNameFacet });
  static options: INoNameFacetOptions = { ...NoNameFacetOptions, ...ResponsiveFacetOptions };

  private header: NoNameFacetHeader;
  private valuesList: NoNameFacetValuesList;
  private values: NoNameFacetValues;

  constructor(public element: HTMLElement, public options?: INoNameFacetOptions, bindings?: IComponentBindings) {
    super(element, NoNameFacet.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, NoNameFacet, options);

    this.values = new NoNameFacetValues();
    // TODO: get mock values from somewhere
    this.values.createFromResults([
      { value: 'test 1', selected: true, numberOfResults: 847324 },
      { value: 'test 2', selected: false, numberOfResults: 1 },
      { value: 'test 3', selected: false, numberOfResults: 13 },
      { value: 'test 4', selected: false, numberOfResults: 13134 },
      { value: 'test 5', selected: false, numberOfResults: 2223 }
    ] as INoNameFacetValue[]);

    ResponsiveFacets.init(this.root, this, this.options);
    this.ensureDom();
  }

  public createDom() {
    this.createContent();
    this.updateAppearanceDependingOnState();
  }

  private createContent() {
    this.header = this.createHeader();
    this.element.appendChild(this.header.element);

    this.valuesList = this.createValues();
    this.valuesList.renderValues(this.values.getAll());
    this.element.appendChild(this.valuesList.element);
  }

  private createHeader() {
    return new NoNameFacetHeader(this);
  }

  private createValues() {
    return new NoNameFacetValuesList(this);
  }

  private updateAppearanceDependingOnState() {
    this.header.toggleClear(this.values.hasSelectedValues());
    // TODO: toggle facet's visibility
  }

  public clearAllValues() {
    this.values.clearAll();
    this.valuesList.renderValues(this.values.getAll());

    this.triggerNewQuery();
  }

  public triggerNewQuery() {
    this.beforeSendingQuery();

    // TODO: get mock values from somewhere
    setTimeout(() => this.onQueryResponse([]), 3000);
  }

  private beforeSendingQuery() {
    this.header.showLoading();
    this.updateAppearanceDependingOnState();
  }

  private onQueryResponse(values: INoNameFacetValue[]) {
    this.header.hideLoading();
    this.values.createFromResults(values);
    this.valuesList.renderValues(this.values.getAll());
    this.updateAppearanceDependingOnState();
  }
}

Initialization.registerAutoCreateComponent(NoNameFacet);
NoNameFacet.doExport();
