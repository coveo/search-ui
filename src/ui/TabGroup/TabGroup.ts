


module Coveo {
  export interface TabGroupOptions {
    id?: string;
    icon?: string;
    expression?: string;
  }

  export class TabGroup extends Component {
    static ID = "TabGroup";
    static options: TabGroupOptions = {
      id: ComponentOptions.buildStringOption(),
      icon: ComponentOptions.buildIconOption(),
      expression: ComponentOptions.buildStringOption()
    };

    private title: string;
    private isSelected = false;

    private iconTemplate = _.template("<span class='coveo-icon <%= _class %>'></span>");

    constructor(element: HTMLElement, public options?: TabGroupOptions, bindings?: IComponentBindings) {
      super(element, TabGroup.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, TabGroup, options);

      this.title = $(this.element).text();

      this.initQueryEvents();
      this.initQueryStateEvents();
      $(this.element).prepend(this.iconTemplate({
        _class: this.options.icon
      }))
    }

    public select() {
      this.actionOnSelect();
      this.updateQueryStateModel();
    }

    public getTitle() {
      return this.title;
    }

    public getIcon() {
      return this.options.icon;
    }

    public getId() {
      return this.options.id;
    }

    private actionOnSelect() {
      this.hideTabsNotInThisGroup();
      this.isSelected = true;
    }

    private actionOnUnSelect() {
      this.isSelected = false;
    }

    private updateQueryStateModel() {
      this.queryStateModel.set(QueryStateModel.attributesEnum.tg, this.options.id);
    }

    private initQueryEvents() {
      $(this.root).on(QueryEvents.buildingQuery, $.proxy(this.handleBuildingQueryEvents, this));
    }

    private initQueryStateEvents() {
      var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.tg);
      $(this.root).on(eventName, $.proxy(this.handleQueryStateChange, this));
    }

    private handleBuildingQueryEvents(e: JQueryEventObject, args: IBuildingQueryEventArgs, foo: number) {
      Assert.exists(args);
      if (this.isSelected && Utils.isNonEmptyString(this.options.expression)) {
        args.queryBuilder.advancedExpression.add(this.options.expression);
      }
    }

    private handleQueryStateChange(e: JQueryEventObject, args: IAttributeChangedEventArg) {
      Assert.exists(args);
      if (args.value == this.options.id) {
        this.actionOnSelect();
      } else {
        this.actionOnUnSelect();
      }
    }

    private hideTabsNotInThisGroup() {
      var allTabs = this.getAllTabs();
      _.each(allTabs, (tab: Tab) => {
        if (this.isElementIncludedInTabGroup(tab.element)) {
          tab.enable();
        } else {
          tab.disable();
        }
      })
    }

    private getAllVisibleTab() {
      return _.filter(this.getAllTabs(), (tab: Tab) => {
        return $(tab.element).is(":visible");
      })
    }

    private getAllTabs() {
      return this.searchInterface.getComponents<Tab>(Tab.ID);
    }

    public isElementIncludedInTabGroup(element: HTMLElement) {
      var tabGroup = $(element).attr("data-tab-group");
      return tabGroup == undefined || _.contains(tabGroup.split(','), this.options.id);
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(TabGroup);
}
