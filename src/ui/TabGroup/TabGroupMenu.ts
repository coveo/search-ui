

module Coveo {
  export interface TabGroupMenuOptions {
    menuDelay?: number;
  }

  interface ItemInMenu {
    tabGroup: TabGroup;
    element: JQuery;
  }

  export class TabGroupMenu extends Component {
    static ID = 'TabGroupMenu';
    static options: TabGroupMenuOptions = {
      menuDelay: ComponentOptions.buildNumberOption({defaultValue: 300, min: 0})
    };

    private menuItems: ItemInMenu[];
    private activeMenuItem: ItemInMenu;
    private menuItemsContainer: JQuery;
    private activeMenuItemDisplay: JQuery;

    private menuIsOpen = false;

    private menuItemsContainerTemplate = _.template("<div class='coveo-menu-item-container'></div>");
    private activeMenuItemTemplate = _.template("<a class='coveo-menu-item-active'><%= itemIcon %><%= caption %><%= showMoreIcon %> </a>");
    private activeMenuItemIconTemplate = _.template("<span class='coveo-icon <%= _class %>'></span>");
    private activeMenuItemCaptionTemplate = _.template("<span class='coveo-caption'><%= text %></span>");

    constructor(element: HTMLElement, public options?: TabGroupMenuOptions, bindings?: IComponentBindings) {
      super(element, TabGroupMenu.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, TabGroupMenu, options);

      this.initQueryStateEvents();
      this.initMiscEvents();
    }

    public open() {
      this.renderMenu();
      this.menuItemsContainer.css("min-width", this.activeMenuItemDisplay.outerWidth())
      this.menuItemsContainer.show();
      this.activeMenuItemDisplay.addClass('coveo-menu-open')
      this.menuIsOpen = true;
    }

    public close() {
      this.menuItemsContainer.hide();
      this.activeMenuItemDisplay.removeClass('coveo-menu-open')
      this.menuIsOpen = false;
    }

    private handleClick(e: JQueryEventObject) {
      if (this.targetIsAMenuItem(e)) {
        this.handleClickOnMenuItem(e);
      } else {
        this.handleClickOnMenu();
      }
    }

    private handleClickOnMenuItem(e: JQueryEventObject) {
      var tabGroupItem = <TabGroup>Component.get(this.getCorrectTarget(e).get(0), TabGroup)
      this.selectMenuItem(this.getItemInMenuById(tabGroupItem.getId()));
      this.close();
      this.queryController.deferExecuteQuery();
    }

    private handleClickOnMenu() {
      if (this.menuIsOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    private handleMouseLeave(e: JQueryEventObject) {
      this.close();
    }

    private handleAfterInitialization() {
      this.initMenuItems();
      var activeTabGroupItemId = this.queryStateModel.get(QueryStateModel.attributesEnum.tg);
      this.selectMenuItem(this.getItemInMenuById(activeTabGroupItemId));
    }

    private handleQueryStateChange(e: JQueryEventObject, args: IAttributeChangedEventArg) {
      Assert.exists(args);
      this.selectMenuItem(this.getItemInMenuById(args.value))
    }

    private initMenuItems() {
      this.menuItemsContainer = $(this.menuItemsContainerTemplate()).hide();
      this.activeMenuItemDisplay = $("<div></div>");
      $(this.element).append(this.activeMenuItemDisplay, this.menuItemsContainer);
      this.menuItems = _.map($(this.element).find("." + Component.computeCssClassName(TabGroup)), (elementInside: HTMLElement) => {
        this.menuItemsContainer.append(elementInside);
        return {tabGroup: <TabGroup>$(elementInside).coveo(), element: $(elementInside)};
      })
    }

    private initQueryStateEvents() {
      var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.tg);
      $(this.root).on(eventName, $.proxy(this.handleQueryStateChange, this));
    }

    private initMiscEvents() {
      $(this.root).on(InitializationEvents.afterInitialization, () => this.handleAfterInitialization());
      $(this.element).click((e: JQueryEventObject) => {
        this.handleClick(e)
      });
      $(this.element).mouseleave((e: JQueryEventObject) => {
        setTimeout(() => {
          this.handleMouseLeave(e)
        }, this.options.menuDelay)
      });
    }

    private renderDisplayActiveMenuItem() {
      this.activeMenuItemDisplay.empty();
      this.activeMenuItemDisplay.html(this.activeMenuItemTemplate({
        itemIcon: this.activeMenuItemIconTemplate({
          _class: this.activeMenuItem.tabGroup.getIcon()
        }),
        caption: this.activeMenuItemCaptionTemplate({
          text: this.activeMenuItem.tabGroup.getTitle()
        }),
        showMoreIcon: this.activeMenuItemIconTemplate({
          _class: 'coveo-show-more'
        })
      }))
    }

    private renderMenu() {
      _.each(this.getInactiveMenuItems(), (inactive) => {
        inactive.element.show();
      })
      this.activeMenuItem.element.hide();
    }

    private selectMenuItem(menuItem: ItemInMenu) {
      if (this.menuItems != undefined) {
        if (menuItem == undefined) {
          menuItem = this.menuItems[0];
        }
        this.activeMenuItem = menuItem;
        this.activeMenuItem.tabGroup.select();
        this.renderDisplayActiveMenuItem();
      }
    }

    private getItemInMenuById(id: string) {
      return _.find(this.menuItems, (menuItem: ItemInMenu) => {
        return menuItem.tabGroup.getId() == id;
      })
    }

    private getItemInMenuByElement(element: JQuery) {
      return _.find(this.menuItems, (menuItem: ItemInMenu) => {
        return Utils.objectEqual(element, menuItem.element)
      })
    }

    private getInactiveMenuItems() {
      return _.reject(this.menuItems, (menuItem: ItemInMenu) => {
        return Utils.objectEqual(menuItem, this.activeMenuItem);
      })
    }

    private getItemMenuClass() {
      return Component.computeCssClassName(TabGroup);
    }

    private getCorrectTarget(e: JQueryEventObject) {
      if ($(e.target).parent().hasClass(this.getItemMenuClass())) {
        return $(e.target).parent();
      }
      return $(e.target);
    }

    private targetIsAMenuItem(e: JQueryEventObject) {
      return this.getCorrectTarget(e).hasClass(this.getItemMenuClass())
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(TabGroupMenu);
}