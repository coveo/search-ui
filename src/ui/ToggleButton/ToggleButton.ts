

module Coveo {
  export interface ToggleButtonOptions {
    toggleClass?: string;
    target: string;
    activateGlass?: boolean;
  }

  export class ToggleButton extends Component {
    static ID = 'ToggleButton';

    static options = <ToggleButtonOptions>{
      toggleClass: ComponentOptions.buildStringOption(),
      target: ComponentOptions.buildStringOption(),
      activateGlass: ComponentOptions.buildBooleanOption({defaultValue: true})
    };

    private classToToggle: string;
    private target: string;
    private activateGlass: boolean;

    constructor(public element: HTMLElement, public options?: ToggleButtonOptions, bindings?: IComponentBindings) {
      super(element, ToggleButton.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, ToggleButton, options);

      Assert.exists(element);
      Assert.exists(this.options);

      this.classToToggle = this.options.toggleClass;
      this.target = this.options.target;
      this.activateGlass = this.options.activateGlass;

      if (this.activateGlass) {
        this.buildGlass();
      }

      $(element).click(() => this.handleClick());

      // Provide a dummy href if the element is an hyperlink
      if (element.tagName == 'A') {
        $(element).attr('href', 'javascript:');
      }

      var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.t);
      this.bind.onRoot(eventName, this.handleTabChanged);
    }

    private handleClick() {
      if ($("." + this.target).hasClass(this.classToToggle)) {
        this.removeToggleClass();
      } else {
        this.addToggleClass();
      }
    }

    private handleTabChanged() {
      this.removeToggleClass();
    }

    private addToggleClass() {
      MobileUtils.addToggleClassOnSearchInterface(this.classToToggle.substr(6), DeviceUtils.isPhonegap());
    }

    private removeToggleClass() {
      MobileUtils.removeToggleClassOnSearchInterface(DeviceUtils.isPhonegap());
    }

    private getGlass() {
      return $(".coveo-glass");
    }

    private buildGlass() {
      if (this.getGlass().length == 0) {
        var glass = $("<div></div>").addClass('coveo-glass');
        glass.click(() => {
          MobileUtils.removeToggleClassOnSearchInterface();
        })
        var searchInterface = $("." + Component.computeCssClassName(SearchInterface));
        $(searchInterface).append(glass);
      }
    }
  }

  Initialization.registerAutoCreateComponent(ToggleButton);
}