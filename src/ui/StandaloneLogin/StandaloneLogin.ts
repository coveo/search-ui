/// <reference path="../../Base.ts" />
/// <reference path="../Login/Login.ts" />
module Coveo {
  export interface StandaloneLoginOptions extends LoginOptions {
    requirePageSettings?: boolean;
    includeDemoSection?: boolean;
  }

  export class StandaloneLogin extends Login {
    static ID = 'StandaloneLogin'

    private demoContainer: JQuery;
    private newToCoveoSection: JQuery;
    private demoCoveoSection: JQuery;

    public static options: StandaloneLoginOptions = {
      requirePageSettings: ComponentOptions.buildBooleanOption({defaultValue: true}),
      includeDemoSection: ComponentOptions.buildBooleanOption({defaultValue: true})
    }

    constructor(public element: HTMLElement, public options?: StandaloneLoginOptions, bindings?: IComponentBindings) {
      super(element, ComponentOptions.initComponentOptions(element, StandaloneLogin, options), bindings, StandaloneLogin.ID);
      $(this.element).hide();
      if (this.options.includeDemoSection) {
        this.buildAllDemo();
      }
      this.submit();
    }

    public getOrCreateContainerForDemo() {
      if (!this.demoContainer) {
        this.demoContainer = $(("<div class='coveo-demo-section-container'></div>"));
        $(this.root).append(this.demoContainer);
      }
      return this.demoContainer;
    }

    private buildAllDemo() {
      this.buildNewToCoveoSection();
      this.buildDemoSection();
      this.hideDemoSection();
    }

    private buildDemoSection() {
      this.demoCoveoSection = $("<div class='coveo-demo-section'></div>");
      this.hideDemoSection();

      var backToLogin = $("<div class='coveo-demo-section-back-to-login'><span class='coveo-demo-section-arrow-backward'></span>" + l("GoBack") + "</div>");
      backToLogin.click(()=> {
        this.hideDemoSection();
      })

      var logo = $("<div class='coveo-demo-section-logo'></div>");
      var intro = $("<div class='coveo-demo-section-explanation'>" + l("AppIntro") + "</div>");

      var tryIt = $("<button class='coveo-demo-section-try-it'>" + l("TryDemo") + "</button>");
      tryIt.click(()=> {
        window.location.href = "demo.html";
      })

      var contact = $("<button class='coveo-demo-section-contact'>" + l("ContactUs") + "</button>");
      contact.click(()=> {
        window.open("http://www.coveo.com/company/contact-us", "_system");
      });

      this.demoCoveoSection.append(backToLogin, logo, intro, tryIt, contact);
      this.getOrCreateContainerForDemo().append(this.demoCoveoSection);
    }

    private buildNewToCoveoSection() {
      this.newToCoveoSection = $("<div class='coveo-new-to-coveo-section'><h2>" + l("NewToCoveo") + "</h2><h3>" + l("LetUsHelpGetStarted") + "</h3><span class='coveo-demo-section-arrow-forward'></span></div>");
      this.newToCoveoSection.click(()=> this.showDemoSection());

      // Android has a shitty way to handle input focus compared to IOS :
      // we need to manually calculate if the input is below the keyboard when it open, and then reposition the container.
      // ALSO : android:softWindowInputMode must be set to adjustPan for this to work correctly in AndroidManifest.xml
      if (DeviceUtils.isAndroid()) {
        window.addEventListener('native.keyboardshow', (e: any)=> {
          var availableHeight = $(window).height() - e.keyboardHeight;
          var currentFocusPosition = $(':focus').get(0).getBoundingClientRect();
          if (currentFocusPosition.top > availableHeight) {
            var newTop = (currentFocusPosition.top - availableHeight) + currentFocusPosition.height;
            this.getOrCreateCombined().css('top', '-' + newTop + 'px');
          }
        });
        window.addEventListener('native.keyboardhide', ()=> {
          this.getOrCreateCombined().css('top', '0');
        });
      }
      this.getOrCreateCombined().append(this.newToCoveoSection);
    }

    private showDemoSection() {
      this.getOrCreateContainerForDemo().addClass('coveo-active');
      this.getOrCreateCombined().removeClass('coveo-active');
    }

    private hideDemoSection() {
      this.getOrCreateContainerForDemo().removeClass('coveo-active');
      this.getOrCreateCombined().addClass('coveo-active');
    }
  }

  Initialization.registerAutoCreateComponent(StandaloneLogin);
}