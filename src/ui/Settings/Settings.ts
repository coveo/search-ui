import PopperJs from 'popper.js';
import 'styling/_Settings';
import { each, escape, times } from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';
import { SettingsEvents } from '../../events/SettingsEvents';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { IMenuItem } from '../Menu/MenuItem';

export interface ISettingsPopulateMenuArgs {
  settings: Settings;
  menuData: IMenuItem[];
}

export interface ISettingsOptions {
  menuDelay: number;
}

/**
 * The Settings component renders a **Settings** button that the end user can click to access a popup menu from which
 * it is possible to perform several contextual actions. The usual location of the **Settings** button in the page is to
 * the right of the {@link Searchbox}.
 *
 * This component can reference several components to populate its popup menu:
 * - {@link AdvancedSearch}
 * - {@link ExportToExcel}
 * - {@link PreferencesPanel} (see also {@link ResultsFiltersPreferences} and {@link ResultsPreferences})
 * - {@link SearchAlerts} (see also {@link SearchAlertsMessage})
 * - {@link ShareQuery}
 */
export class Settings extends Component {
  static ID = 'Settings';

  static doExport = () => {
    exportGlobally({
      Settings: Settings
    });
  };

  /**
   * The options for Settings
   * @componentOptions
   */
  static options: ISettingsOptions = {
    /**
     * Specifies the delay (in milliseconds) before hiding the popup menu when the cursor is not hovering over it.
     *
     * Default value is `300`. Minimum value is `0 `.
     */
    menuDelay: ComponentOptions.buildNumberOption({ defaultValue: 300, min: 0 })
  };

  private menu: HTMLElement;
  private closeTimeout: number;
  private isOpened: boolean = false;

  /**
   * Creates a new Settings component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Settings component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: ISettingsOptions, bindings?: IComponentBindings) {
    super(element, Settings.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Settings, options);
    this.bind.onRootElement(InitializationEvents.afterInitialization, () => this.init());
  }

  /**
   * Opens the **Settings** popup menu.
   */
  public open() {
    this.isOpened = true;
    if (this.menu != null) {
      $$(this.menu).detach();
    }

    this.menu = this.buildMenu();
    $$(this.menu).insertAfter(this.element);

    new PopperJs(this.element, this.menu, {
      placement: 'bottom-end',
      modifiers: {
        offset: {
          offset: '0, 5'
        },
        preventOverflow: {
          boundariesElement: this.root
        }
      }
    });
  }

  /**
   * Closes the **Settings** popup menu.
   */
  public close() {
    this.isOpened = false;
    if (this.menu != null) {
      $$(this.menu).detach();
      this.menu = null;
    }
  }

  private toggle() {
    if (this.isOpened) {
      this.close();
    } else {
      this.open();
    }
  }

  private init() {
    const square = $$('span', { className: 'coveo-settings-square' }).el;
    const squares = $$('span', { className: 'coveo-settings-squares' }).el;
    times(3, () => squares.appendChild(square.cloneNode()));
    this.element.appendChild(squares);

    new AccessibleButton()
      .withElement(this.element)
      .withOwner(this.bind)
      .withSelectAction(() => this.toggle())
      .withFocusAndMouseEnterAction(() => this.onfocus())
      .withBlurAndMouseLeaveAction(() => this.onblur())
      .withLabel(l('Settings'))
      .build();
  }

  private buildMenu(): HTMLElement {
    const menu = $$('div', { className: 'coveo-settings-advanced-menu' }).el;
    const settingsPopulateMenuArgs: ISettingsPopulateMenuArgs = {
      settings: this,
      menuData: []
    };
    $$(this.root).trigger(SettingsEvents.settingsPopulateMenu, settingsPopulateMenuArgs);

    each(settingsPopulateMenuArgs.menuData, menuItem => {
      const { menuItemElement, menuItemIcon, menuItemText } = this.buildMenuItem(menuItem, settingsPopulateMenuArgs);

      menuItemElement.appendChild(menuItemIcon);
      menuItemElement.appendChild(menuItemText);

      menu.appendChild(menuItemElement);
    });
    return menu;
  }

  private buildMenuItem(menuItem: IMenuItem, settingsPopulateMenuArgs: ISettingsPopulateMenuArgs) {
    const menuItemElement = $$('div', {
      className: `coveo-settings-item ${menuItem.className}`
    }).el;

    const selectAction = () => {
      each(settingsPopulateMenuArgs.menuData, menuItem => {
        menuItem.onClose && menuItem.onClose();
      });
      this.close();
      menuItem.onOpen();
    };

    new AccessibleButton()
      .withElement(menuItemElement)
      .withSelectAction(selectAction)
      .withFocusAndMouseEnterAction(() => this.onfocus())
      .withBlurAndMouseLeaveAction(() => this.onblur())
      .withLabel(menuItem.tooltip || menuItem.text)
      .build();

    return {
      menuItemElement,
      menuItemIcon: this.buildMenuItemIcon(menuItem),
      menuItemText: this.buildMenuItemText(menuItem)
    };
  }

  private buildMenuItemIcon(menuItem: IMenuItem) {
    const iconElement = $$('div', {
      className: 'coveo-icon'
    }).el;

    if (menuItem.svgIcon) {
      iconElement.innerHTML = menuItem.svgIcon;
    }

    if (menuItem.svgIconClassName) {
      SVGDom.addClassToSVGInContainer(iconElement, menuItem.svgIconClassName);
    }

    return iconElement;
  }

  private buildMenuItemText(menuItem: IMenuItem) {
    const textElement = $$(
      'div',
      {
        className: 'coveo-settings-text'
      },
      escape(menuItem.text)
    ).el;

    return textElement;
  }

  private onblur() {
    clearTimeout(this.closeTimeout);
    this.closeTimeout = window.setTimeout(() => {
      this.close();
    }, this.options.menuDelay);
  }

  private onfocus() {
    clearTimeout(this.closeTimeout);
  }
}
Initialization.registerAutoCreateComponent(Settings);
