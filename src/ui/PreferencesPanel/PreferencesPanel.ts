import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { PreferencesPanelEvents } from '../../events/PreferencesPanelEvents';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import * as _ from 'underscore';

import 'styling/_PreferencesPanel';
import { InitializationEvents } from '../../events/InitializationEvents';
import { SVGIcons } from '../../utils/SVGIcons';

export interface IPreferencesPanelOptions {}

/**
 * The PreferencesPanel component renders a **Preferences** item inside the {@link Settings} component which the end
 * user can click to access a panel from which it is possible to specify certain customization options for the search
 * interface. These customization options are then saved in the browser local storage.
 *
 * This component should be used inside the {@link Settings} component.
 * 
 * See also the {@link ResultsFiltersPreferences} and {@link ResultsPreferences} components.
 */
export class PreferencesPanel extends Component {
  static ID = 'PreferencesPanel';

  static doExport = () => {
    exportGlobally({
      PreferencesPanel: PreferencesPanel
    });
  };

  static options: IPreferencesPanelOptions = {};
  private modalbox: Coveo.ModalBox.ModalBox;
  private content: HTMLElement[] = [];

  /**
   * Creates a new PreferencesPanel.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the PreferencesPanel component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(
    public element: HTMLElement,
    public options: IPreferencesPanelOptions,
    bindings?: IComponentBindings,
    private ModalBox = ModalBoxModule
  ) {
    super(element, PreferencesPanel.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PreferencesPanel, options);
    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        className: 'coveo-preferences-panel',
        text: l('Preferences'),
        onOpen: () => this.open(),
        onClose: () => this.close(),
        svgIcon: SVGIcons.icons.dropdownPreferences,
        svgIconClassName: 'coveo-preferences-panel-svg'
      });
    });
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => {
      this.content = $$(this.element).children();
    });
  }

  /**
   * Opens the PreferencesPanel.
   */
  public open(): void {
    if (this.modalbox == null) {
      let root = $$('div');
      _.each(this.content, oneChild => {
        root.append(oneChild);
      });

      this.modalbox = this.ModalBox.open(root.el, {
        title: l('Preferences'),
        validation: () => {
          this.cleanupOnExit();
          return true;
        }
      });
    }
  }

  /**
   * Closes the PreferencesPanel without saving changes.
   *
   * Also triggers the `exitPreferencesWithoutSave` event.
   */
  public close(): void {
    if (this.modalbox) {
      this.cleanupOnExit();
      this.modalbox.close();
      this.modalbox = null;
    }
  }

  /**
   * Saves the changes and executes a new query.
   *
   * Also triggers the `savePreferences` event.
   */
  public save(): void {
    $$(this.element).trigger(PreferencesPanelEvents.savePreferences);
    this.queryController.executeQuery();
  }

  private cleanupOnExit() {
    $$(this.element).trigger(PreferencesPanelEvents.exitPreferencesWithoutSave);
  }
}

Initialization.registerAutoCreateComponent(PreferencesPanel);
