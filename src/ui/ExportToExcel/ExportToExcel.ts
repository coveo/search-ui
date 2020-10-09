import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption } from '../Base/IComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { IAnalyticsNoMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_ExportToExcel';
import { SVGIcons } from '../../utils/SVGIcons';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { get } from '../Base/RegisteredNamedMethods';
import * as moment from 'moment';
import { IQuery } from '../../rest/Query';

let createAnchor = () => document.createElement('a');

export function setCreateAnchor(fn: () => HTMLAnchorElement) {
  createAnchor = fn;
}

export interface IExportToExcelOptions {
  numberOfResults?: number;
  fieldsToInclude?: IFieldOption[];
}

/**
 * The ExportToExcel component renders an item in the {@link Settings} menu to allow the end user to export the current
 * search results to the Microsoft Excel format (.xlsx).
 *
 * @availablesince [November 2015 Release (v1.0.139)](https://docs.coveo.com/en/289/#november-2015-release-v10139)
 */
export class ExportToExcel extends Component {
  static ID = 'ExportToExcel';

  static doExport = () => {
    exportGlobally({
      ExportToExcel: ExportToExcel
    });
  };

  /**
   * The options for the ExportToExcel
   * @componentOptions
   */
  static options: IExportToExcelOptions = {
    /**
     * Specifies the number of results to include in the resulting Excel file.
     *
     * Generating and downloading the Excel file should take a reasonably short amount of time when using the default
     * value. However, this amount of time will increase exponentially as you set the value higher.
     *
     * Consequently, you should avoid setting this value above the default index limit of 1000 search results.
     *
     * Default value is `100`. Minimum value is `1`.
     *
     * @availablesince [February 2016 Release (v1.0.318)](https://docs.coveo.com/en/309/#february-2016-release-v10318)
     */
    numberOfResults: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 1 }),
    /**
     * Specifies the fields to include in the CSV output.
     *
     * Note that this does not affect top level properties such as the title, clickUri, printableUri and sysUri, for example.
     *
     * Default value is `undefined`, meaning all fields will be exported.
     */
    fieldsToInclude: ComponentOptions.buildFieldsOption()
  };

  /**
   * Creates a new ExportToExcel component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ExportToExcel component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param _window The global Window object (used to download the Excel link).
   */
  constructor(
    public element: HTMLElement,
    public options: IExportToExcelOptions,
    public bindings?: IComponentBindings,
    public _window?: Window
  ) {
    super(element, ExportToExcel.ID, bindings);
    this._window = this._window || window;
    this.options = ComponentOptions.initComponentOptions(element, ExportToExcel, options);
    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        text: l('ExportToExcel'),
        className: 'coveo-export-to-excel',
        tooltip: l('ExportToExcelDescription'),
        onOpen: () => this.download(),
        svgIcon: SVGIcons.icons.dropdownExport,
        svgIconClassName: 'coveo-export-to-excel-svg'
      });
    });
  }

  /**
   * Downloads the Excel representation of the current query.
   *
   * Also logs an `exportToExcel` event in the usage analytics.
   */
  public download() {
    const query = this.buildExcelQuery();
    this.logger.debug("Performing query following 'Export to Excel' click");

    const endpoint = this.queryController.getEndpoint();
    this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.exportToExcel, {}, this.element);

    endpoint.fetchBinary(query).then(content => this.generateExcelFile(content));
  }

  private buildExcelQuery(): IQuery {
    let query = this.queryController.getLastQuery();
    query = _.omit(query, ['numberOfResults', 'fieldsToInclude']);

    if (this.options.fieldsToInclude) {
      query.fieldsToInclude = <string[]>this.options.fieldsToInclude;
    }

    return {
      ...query,
      format: 'xlsx',
      numberOfResults: this.options.numberOfResults
    };
  }

  private generateExcelFile(content: ArrayBuffer) {
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const a = createAnchor();
    a.href = url;
    a.download = this.buildExcelFileName();
    a.click();

    URL.revokeObjectURL(url);
  }

  private buildExcelFileName() {
    const utc = moment().utc();
    const year = utc.format('YYYY');
    const month = utc.format('MM');
    const day = utc.format('DD');
    const hour = utc.format('HH');
    const minute = utc.format('mm');
    const second = utc.format('ss');

    return `query--${year}-${month}-${day}--${hour}-${minute}-${second}.xlsx`;
  }

  static create(element: HTMLElement, options?: IExportToExcelOptions, root?: HTMLElement): ExportToExcel {
    return new ExportToExcel(element, options, (<SearchInterface>get(root, SearchInterface)).getBindings());
  }
}

Initialization.registerAutoCreateComponent(ExportToExcel);
