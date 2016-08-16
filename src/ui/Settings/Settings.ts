import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {InitializationEvents} from '../../events/InitializationEvents';
import {$$} from '../../utils/Dom';
import {PopupUtils, IPosition, HorizontalAlignment, VerticalAlignment} from '../../utils/PopupUtils';
import {IMenuItem} from '../Menu/MenuItem';
import {SettingsEvents} from '../../events/SettingsEvents';
import {Initialization} from '../Base/Initialization';

export interface ISettingsPopulateMenuArgs {
  settings: Settings;
  menuData: IMenuItem[];
}

export interface ISettingsOptions {
  menuDelay: number;
}

/**
 * The Settings component is comprised of a settings button (usually located
 * on the right of the search box) which allows for some contextual actions.<br/>
 * This component references other components to show in its menu, for example
 * the {@link ShareQuery} component.
 */
export class Settings extends Component {
  static ID = 'Settings';
  /**
   * The options for Settings
   * @componentOptions
   */
  static options: ISettingsOptions = {
    /**
     * The delay before hiding the popup menu when the mouse leaves it.<br/>
     * The default value is <code>300</code>
     */
    menuDelay: ComponentOptions.buildNumberOption({ defaultValue: 300, min: 0 })
  };

  private menu: HTMLElement;
  private closeTimeout: number;
  private isOpened: boolean = false;

  /**
   * Create a new Settings component
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options: ISettingsOptions, bindings?: IComponentBindings) {
    super(element, Settings.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Settings, options);
    this.bind.onRootElement(InitializationEvents.afterInitialization, () => this.init());
  }

  /**
   * Open the settings popup
   */
  public open() {
    this.isOpened = true;
    if (this.menu != null) {
      $$(this.menu).detach();
    }
    this.menu = this.buildMenu();
    $$(this.menu).on('mouseleave', () => this.mouseleave());
    $$(this.menu).on('mouseenter', () => this.mouseenter());
    PopupUtils.positionPopup(this.menu, this.element, this.root, this.getPopupPositioning(), this.root);

  }

  /**
   * Close the settings popup
   */
  public close() {
    this.isOpened = false;
    if (this.menu != null) {
      $$(this.menu).detach();
      this.menu = null;
    }
  }

  private init() {
    if (this.searchInterface.isNewDesign()) {
      var square = $$('span', { className: 'coveo-settings-square' }).el;
      var squares = $$('span', { className: 'coveo-settings-squares' }).el;
      _.times(3, () => squares.appendChild(square.cloneNode()));
      this.element.appendChild(squares);
    } else {
      var icon = $$('span', { className: 'coveo-settings-icon' }).el;
      this.element.appendChild(icon);
    }

    $$(this.element).on('click', () => {
      if (this.isOpened) {
        this.close();
      } else {
        this.open();
      }
    });

    $$(this.element).on('mouseleave', () => this.mouseleave());
    $$(this.element).on('mouseenter', () => this.mouseenter());
  }

  private buildMenu(): HTMLElement {
    var menu = $$('div', { className: 'coveo-settings-advanced-menu' }).el;
    var settingsPopulateMenuArgs: ISettingsPopulateMenuArgs = {
      settings: this,
      menuData: []
    }
    $$(this.root).trigger(SettingsEvents.settingsPopulateMenu, settingsPopulateMenuArgs);
    _.each(settingsPopulateMenuArgs.menuData, (menuItem) => {
      var menuItemDom = $$('div', {
        className: `coveo-settings-item ${menuItem.className}`,
        title: _.escape(menuItem.tooltip || '')
      }).el;
      menuItemDom.appendChild($$('div', { className: 'coveo-icon' }).el);
      menuItemDom.appendChild($$('div', { className: 'coveo-settings-text' }, _.escape(menuItem.text)).el);
      $$(menuItemDom).on('click', () => {
        $$(this.menu).detach();
        _.each(settingsPopulateMenuArgs.menuData, (menuItem) => {
          menuItem.onClose && menuItem.onClose();
        })
        menuItem.onOpen();
      });
      menu.appendChild(menuItemDom);
    });
    return menu;
  }

  private mouseleave() {
    clearTimeout(this.closeTimeout);
    this.closeTimeout = setTimeout(() => {
      this.close();
    }, this.options.menuDelay)
  }

  private mouseenter() {
    clearTimeout(this.closeTimeout);
  }

  private getPopupPositioning(): IPosition {
    return {
      horizontal: HorizontalAlignment.INNERRIGHT,
      vertical: VerticalAlignment.BOTTOM,
      verticalOffset: 8
    }
  }
}
Initialization.registerAutoCreateComponent(Settings);
