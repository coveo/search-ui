import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {IAnalyticsNoMeta, analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta'
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';

export interface IExportToExcelOptions {
  numberOfResults?: number
}

/**
 * This component allows users to export the current search results in a Microsoft Excel (.xlsx) format.
 * It populates the {@link Settings} component's menu.
 */
export class ExportToExcel extends Component {
  static ID = 'ExportToExcel';
  /**
   * The options for the component
   * @componentOptions
   */
  static options: IExportToExcelOptions = {
    /**
     * The number of results included in the exported Excel file.<br/>
     * The default value of <code>100</code> makes the generation and the download of the resulting Excel file
     * last about 1 second.<br/>
     * Increasing this value will exponentially increase the time needed to create the Excel file.<br/>
     * It is not recommended to go above the default index limit of 1000 search results.
     */
    numberOfResults: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 1 })
  };

  /**
   * Create a new ExportToExcel component
   * @param element
   * @param options
   * @param bindings
   * @param _window The global Window object (used to download the Excel link)
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
      })
    });
  }

  /**
   * Download the Excel representation of the current query
   */
  public download() {
    let query = this.queryController.getLastQuery();

    if (query) {
      query = _.omit(query, 'numberOfResults');
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
