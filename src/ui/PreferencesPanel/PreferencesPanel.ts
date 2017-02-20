import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { PreferencesPanelEvents } from '../../events/PreferencesPanelEvents';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';

export interface IPreferencesPanelOptions {
}

/**
 * The PreferencesPanel component renders a **Preferences** item inside the {@link Settings} component which the end
 * user can click to access a panel from which it is possible to specify certain customization options for the search
 * interface. These customization options are then saved in the browser local storage.
 *
 * See also the {@link ResultsFiltersPreferences} and {@link ResultsPreferences} components.
 */
export class PreferencesPanel extends Component {
  static ID = 'PreferencesPanel';

  static options: IPreferencesPanelOptions = {};

  /**
   * Creates a new PreferencesPanel.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the PreferencesPanel component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
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
   * Opens the PreferencesPanel.
   */
  public open(): void {
    $$(this.element).addClass('coveo-active');
  }

  /**
   * Closes the PreferencesPanel without saving changes.
   *
   * Also triggers the `exitPreferencesWithoutSave` event.
   */
  public close(): void {
    $$(this.element).removeClass('coveo-active');
    $$(this.element).trigger(PreferencesPanelEvents.exitPreferencesWithoutSave);
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

  private buildCloseButton(): void {
    var closeButton = $$('div', { className: 'coveo-preferences-panel-close' }, $$('span', { className: 'coveo-icon' }).el);
    closeButton.on('click', () => {
      this.close();
    });
    $$(this.element).prepend(closeButton.el);
  }

  private buildTitle(): void {
    var title = $$('div', { className: 'coveo-preferences-panel-title' }, l('Preferences')).el;
    $$(this.element).prepend(title);
  }
}

Initialization.registerAutoCreateComponent(PreferencesPanel);
