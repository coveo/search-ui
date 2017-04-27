import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {PreferencesPanelEvents} from '../../events/PreferencesPanelEvents';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

export interface IPreferencesPanelOptions {
}

export class PreferencesPanel extends Component {
  static ID = 'PreferencesPanel';

  static options: IPreferencesPanelOptions = {};

  /**
   * Create a new PreferencesPanel
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options: IPreferencesPanelOptions, bindings?: IComponentBindings) {
    super(element, PreferencesPanel.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PreferencesPanel, options);
    this.buildCloseButton();
    this.buildTitle();

    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        className: 'coveo-preferences-panel',
        text: l('Preferences'),
        onOpen: () => this.open(),
        onClose: () => this.close()
      });
    });
  }

  /**
   * Open the PreferencesPanel
   */
  public open(): void {
    $$(this.element).addClass('coveo-active');
  }

  /**
   * Close the PreferencesPanel without saving changes
   */
  public close(): void {
    $$(this.element).removeClass('coveo-active');
    $$(this.element).trigger(PreferencesPanelEvents.exitPreferencesWithoutSave);
  }

  /**
   * Save the changes 
   */
  public save(): void {
    $$(this.element).trigger(PreferencesPanelEvents.savePreferences);
    this.queryController.executeQuery();
  }

  private buildCloseButton(): void {
    var closeButton = $$('div', { className: 'coveo-preferences-panel-close' }, $$('span', { className: 'coveo-icon' }).el)
    closeButton.on('click', () => {
      this.close();
    })
    $$(this.element).prepend(closeButton.el);
  }

  private buildTitle(): void {
    var title = $$('div', { className: 'coveo-preferences-panel-title' }, l('Preferences')).el;
    $$(this.element).prepend(title);
  }
}

Initialization.registerAutoCreateComponent(PreferencesPanel);
