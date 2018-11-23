import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
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

export interface IExportToExcelOptions {
  numberOfResults?: number;
  fieldsToInclude?: IFieldOption[];
}

/**
 * The ExportToExcel component renders an item in the {@link Settings} menu to allow the end user to export the current
 * search results to the Microsoft Excel format (.xlsx).
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
    let query = this.queryController.getLastQuery();

    if (query) {
      // Remove number of results and fields to include from the last query, because those 2 parameters
      // should be controlled/modified by the export to excel component.
      query = _.omit(query, ['numberOfResults', 'fieldsToInclude']);
      if (this.options.fieldsToInclude) {
        query.fieldsToInclude = <string[]>this.options.fieldsToInclude;
      }
      this.logger.debug("Performing query following 'Export to Excel' click");

      const endpoint = this.queryController.getEndpoint();
      this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.exportToExcel, {}, this.element);
      this._window.location.replace(endpoint.getExportToExcelLink(query, this.options.numberOfResults));
    }
  }

  static create(element: HTMLElement, options?: IExportToExcelOptions, root?: HTMLElement): ExportToExcel {
    return new ExportToExcel(element, options, (<SearchInterface>get(root, SearchInterface)).getBindings());
  }
}

Initialization.registerAutoCreateComponent(ExportToExcel);
