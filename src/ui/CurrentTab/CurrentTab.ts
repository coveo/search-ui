

module Coveo {
  export interface CurrentTabOptions {
    tabSectionToOpen: string;
  }


  export class CurrentTab extends Component {
    static ID = 'CurrentTab';

    static options: CurrentTabOptions = {
      tabSectionToOpen: ComponentOptions.buildStringOption()
    }

    constructor(public element: HTMLElement, public options?: CurrentTabOptions, bindings?: IComponentBindings) {
      super(element, CurrentTab.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, CurrentTab, options);
      var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.t);
      $(this.root).on(eventName, $.proxy(this.handleTabChange, this));
      if (this.options.tabSectionToOpen) {
        $(this.options.tabSectionToOpen).addClass('coveo-targeted-by-current-tab');
        $(this.element).addClass('coveo-targeting-tab-section');
        this.bind.on(this.element, 'click', ()=> {
          $('.coveo-glass').toggleClass("coveo-active-glass").toggleClass('coveo-active-glass-for-current-tab');
          $(this.element).toggleClass('coveo-opening-tab-section');
          $(this.options.tabSectionToOpen).toggleClass('coveo-opened-by-current-tab');
          if ($(this.element).hasClass('coveo-opening-tab-section')) {
            $(this.options.tabSectionToOpen).css('z-index', '1001');
            $(this.element).css('z-index', '1001');
          } else {
            $(this.options.tabSectionToOpen).css('z-index', undefined);
            $(this.element).css('z-index', undefined);
          }
        })
      }
    }

    private handleTabChange() {
      var selectedTabId = this.queryStateModel.get(QueryStateModel.attributesEnum.t);
      if (Utils.isNonEmptyString(selectedTabId)) {
        var found = false;
        $(this.root).find(Component.computeSelectorForType(Tab.ID)).each((index, elem: HTMLElement) => {
          var tab = <Tab>Component.get(elem, Tab);
          if (tab.options.id == selectedTabId) {
            $(this.element).html($(tab.element).html());
            found = true;
          }
        });
        Assert.check(found, "Cannot find the currently active tab");
      } else {
        $(this.element).hide();
      }
    }
  }

  Initialization.registerAutoCreateComponent(CurrentTab);
}