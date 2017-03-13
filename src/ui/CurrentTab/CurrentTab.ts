import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Model } from '../../models/Model';
import { QueryStateModel } from '../../models/QueryStateModel';
import { Utils } from '../../utils/Utils';
import { Tab } from '../Tab/Tab';
import { Assert } from '../../misc/Assert';
import { Initialization } from '../Base/Initialization';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export interface ICurrentTabOptions {
  tabSectionToOpen: string;
}

/**
 * The CurrentTab component displays the name of the currently selected {@link Tab}. If no Tab is selected, this
 * component is not visible.
 */
export class CurrentTab extends Component {
  static ID = 'CurrentTab';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: ICurrentTabOptions = {

    /**
     * Specifies the CSS selector targeting the section which contains the {@link Tab}.
     * Clicking the CurrentTab component toggles between opening and closing this section.
     *
     * Default value is `undefined`.
     */
    tabSectionToOpen: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new CurrentTab component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the CurrentTab component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ICurrentTabOptions, bindings?: IComponentBindings) {
    super(element, CurrentTab.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, CurrentTab, options);
    let eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.t);
    this.bind.onRootElement(eventName, this.handleTabChange);
    if (this.options.tabSectionToOpen) {
      let tabSection = $$(this.root).find(this.options.tabSectionToOpen);
      $$(tabSection).addClass('coveo-targeted-by-current-tab');
      $$(this.element).addClass('coveo-targeting-tab-section');
      this.bind.on(this.element, 'click', () => {
        let glassElement = $$(this.root).find('.coveo-glass');
        if (glassElement) {
          let glass = $$(glassElement);
          glass.toggleClass('coveo-active-glass');
          glass.toggleClass('coveo-active-glass-for-current-tab');
        }
        $$(this.element).toggleClass('coveo-opening-tab-section');
        $$(tabSection).toggleClass('coveo-opened-by-current-tab');
        if ($$(this.element).hasClass('coveo-opening-tab-section')) {
          tabSection.style.zIndex = '1001';
          this.element.style.zIndex = '1001';
        } else {
          tabSection.style.zIndex = undefined;
          this.element.style.zIndex = undefined;
        }
      });
    }
  }

  private handleTabChange() {
    let selectedTabId = this.queryStateModel.get(QueryStateModel.attributesEnum.t);
    if (Utils.isNonEmptyString(selectedTabId)) {
      let found = false;
      let tabs = $$(this.root).findAll(Component.computeSelectorForType(Tab.ID));
      _.each(tabs, (elem: HTMLElement) => {
        let tab = <Tab>Component.get(elem, Tab);
        if (tab.options.id == selectedTabId) {
          this.element.innerHTML = tab.element.innerHTML;
          found = true;
        }
      });
      Assert.check(found, 'Cannot find the currently active tab');
    } else {
      $$(this.element).hide();
    }
  }
}

Initialization.registerAutoCreateComponent(CurrentTab);
