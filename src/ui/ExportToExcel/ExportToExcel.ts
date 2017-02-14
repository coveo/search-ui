import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { IAnalyticsNoMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import * as _ from 'underscore';

export interface IExportToExcelOptions {
  numberOfResults?: number;
  fieldsToInclude?: IFieldOption[];
}

/**
 * This component allows the user to export their current search results to the Microsoft Excel format (.xlsx).
 * It populates the {@link Settings} component menu.
 */
export class ExportToExcel extends Component {
  static ID = 'ExportToExcel';

  /**
   * The options for the ExportToExcel
   * @componentOptions
   */
  static options: IExportToExcelOptions = {

    /**
     * Specifies the number of results to include in the exported Excel file.
     *
     * Generating and downloading the Excel file should take a reasonably short amount of time when using the default
     * value. However, this amount of time will increase exponentially if you set the value higher.
     *
     * It is therefore not recommended to set this value above the default index limit of 1000 search results.
     *
     * Default value is `100`.
     */
    numberOfResults: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 1 }),
    fieldsToInclude: ComponentOptions.buildFieldsOption()
  };

  /**
   * Creates a new ExportToExcel component
   * @param element
   * @param options
   * @param bindings
   * @param _window The global Window object (used to download the Excel link).
   */
  constructor(public element: HTMLElement, public options: IExportToExcelOptions, public bindings?: IComponentBindings, public _window?: Window) {
    super(element, ExportToExcel.ID, bindings);
    this._window = this._window || window;
    this.options = ComponentOptions.initComponentOptions(element, ExportToExcel, options);
    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        text: l('ExportToExcel'),
        className: 'coveo-export-to-excel',
        tooltip: l('ExportToExcelDescription'),
        onOpen: () => this.download()
      });
    });
  }

  /**
   * Downloads the Excel representation of the current query.
   *
   * This method also logs an `exportToExcel` event in the usage analytics.
   */
  public download() {
    let query = this.queryController.getLastQuery();

    if (query) {
      query = _.omit(query, 'numberOfResults');
      if (this.options.fieldsToInclude) {
        query.fieldsToInclude = <string[]>this.options.fieldsToInclude;
      }
      this.logger.debug('Performing query following \'Export to Excel\' click');

      let endpoint = this.queryController.getEndpoint();
      this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.exportToExcel, {}, this.element);
      this._window.location.replace(endpoint.getExportToExcelLink(query, this.options.numberOfResults));
    }
  }

  static create(element: HTMLElement, options?: IExportToExcelOptions, root?: HTMLElement): ExportToExcel {
    return new ExportToExcel(element, options, root);
  }
}

Initialization.registerAutoCreateComponent(ExportToExcel);
