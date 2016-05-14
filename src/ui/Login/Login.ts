/// <reference path="../../Base.ts" />
/// <reference path="LoginCredentials.ts" />
/// <reference path="LoginPageSettings.ts" />
module Coveo {
  export interface LoginOptions {
    id?: string;
    caption?: string;
    autoTriggerQuery?: boolean;
    requireLogin?: boolean;
    requirePageSettings?: boolean;
  }

  export class Login extends Component {
    static ID = 'Login';

    static options: LoginOptions = {
      id: ComponentOptions.buildStringOption({defaultValue: "default"}),
      caption: ComponentOptions.buildLocalizedStringOption(),
      autoTriggerQuery: ComponentOptions.buildBooleanOption({defaultValue: true}),
      requireLogin: ComponentOptions.buildBooleanOption({defaultValue: true}),
      requirePageSettings: ComponentOptions.buildBooleanOption({defaultValue: false})
    }

    public pageSettings: LoginPageSettings;
    public credentials: LoginCredentials;
    public isHidden: boolean;
    public container: JQuery;

    private loadingAnimation: JQuery;
    private submitButton: JQuery;
    private logo:JQuery;
    private errorMessage: JQuery;
    private caption: JQuery;
    public combined: JQuery;

    private errorMessageTemplate = _.template("<div class='coveo-login-error-message'></div>");
    private captionTemplate = _.template("<div class='coveo-login-caption'></div>");
    private tabButtonTemplate = _.template("<div class='coveo-login-tab'>Login</div>");
    private containerTemplate = _.template("<div class='coveo-login-form-container'></div>");
    private submitButtonTemplate = _.template("<button class='coveo-submit'type='submit'><div class='coveo-icon coveo-waiting'></div>" + l("GetStarted") + "</button>");
    private combinedTemplate = _.template("<div class='coveo-login-combined coveo-active'></div>")
    private logoTemplate = _.template("<div class='coveo-login-logo'></div>");

    constructor(public element: HTMLElement, public options?: LoginOptions, bindings?: IComponentBindings, loginId = Login.ID) {
      super(element, loginId, bindings);

      this.options = ComponentOptions.initComponentOptions(element, Login, options);

      Assert.exists(this.options.id);
      Assert.exists(Coveo.SearchEndpoint.endpoints[this.options.id]);

      this.isHidden = true;
      if (this.options.requireLogin) {
        this.credentials = new LoginCredentials(this);
      }
      if (this.options.requirePageSettings) {
        this.pageSettings = new LoginPageSettings(this);
      }

      this.loadingAnimation = $(this.searchInterface.options.firstLoadingAnimation);
      this.bind.onRoot(QueryEvents.queryError, this.handleQueryError);
      this.buildTabButton();
      this.ensureDom();
      this.updateEndpointWithCredentials();
      this.resetErrorMessage();
      this.hide();
      this.validate();
    }

    public getPageSettingsUrl() {
      return this.pageSettings ? this.pageSettings.getPageSettingsUrl() : undefined;
    }

    public setPageSettingsUrl(url: string) {
      if (this.pageSettings) {
        this.pageSettings.setPageSettingsUrl(url);
      }
    }

    public getUser() {
      return this.credentials ? this.credentials.getUser() : undefined;
    }

    public setUser(user: string) {
      if (this.credentials) {
        this.credentials.setUser(user)
      }
    }

    public getPassword() {
      return this.credentials ? this.credentials.getPassword() : undefined;
    }

    public setPassword(password: string) {
      if (this.credentials) {
        this.credentials.setPassword(password);
      }
    }

    public setErrorMessage(msg: string) {
      this.errorMessage.text(msg);
      this.errorMessage.show();
      this.logo.hide();
    }

    public resetErrorMessage() {
      this.errorMessage.text("");
      this.errorMessage.hide();
      this.logo.show();
    }

    public createDom() {
      this.logo = $(this.logoTemplate());
      this.getOrCreateCombined().append(this.logo);
      this.caption = $(this.captionTemplate())
      if (this.options.caption) {
        this.caption.text(this.options.caption)
      }
      this.errorMessage = $(this.errorMessageTemplate());
      this.getOrCreateCombined().append(this.errorMessage);
      this.getOrCreateContainer().append(this.caption);
      if (this.credentials) {
        this.credentials.buildDom();
      }
      if (this.pageSettings) {
        this.pageSettings.buildDom();
      }
      this.submitButton = $(this.submitButtonTemplate());
      this.submitButton.click((e: JQueryEventObject) => this.submit());
      this.getOrCreateContainer().append(this.submitButton);
    }

    public getOrCreateContainer() {
      if (!this.container) {
        this.container = $(this.containerTemplate());
        this.getOrCreateCombined().append(this.container);
      }
      return this.container;
    }

    public getOrCreateCombined() {
      if (!this.combined) {
        this.combined = $(this.combinedTemplate());
        $(this.root).append(this.combined);
      }
      return this.combined;
    }

    public hide() {
      this.isHidden = true;
      this.getOrCreateCombined().hide();
    }

    public hideAndExecuteQuery() {
      this.hide();
      this.queryController.executeQuery();
    }

    public validate() {
      this.baseValidationEvent("validate", this.hide);
    }

    public submit() {
      var onSuccess = ()=> {
        if (this.credentials) {
          this.updateEndpointWithCredentials();
        }
        if (!this.pageSettings) {
          this.hideAndExecuteQuery();
        }
      }
      this.baseValidationEvent("submit", onSuccess);
    }

    public isAccessDeniedError(error: EndpointError): boolean {
      return ((<AjaxError>error).status === 401) || ((<AjaxError>error).status === 403);
    }

    private baseValidationEvent(methodToGather: string, onSuccess: (...args: any[])=>void) {
      MobileUtils.hideIOSKeyboard(document.activeElement);
      this.resetErrorMessage();
      //deferreds is an array of deferred returned by all sub component. When they all resolve correctly, we're good to go.
      //allValidationPassed is a deferred we send to each sub component to alert them when everything is ok and they can proceed with their success callback
      var deferreds = [];
      var allValidationPassed = $.Deferred();
      if (this.credentials) {
        deferreds.push(this.credentials[methodToGather](allValidationPassed));
      }
      if (this.pageSettings) {
        deferreds.push(this.pageSettings[methodToGather](allValidationPassed));
      }
      $.when.apply(this, deferreds)
        .fail((error: string)=> {
          this.show();
          allValidationPassed.reject(false);
          if (this.pageSettings && Utils.isNonEmptyString(this.getPageSettingsUrl())) {
            this.setErrorMessage(error);
          }
          if (this.credentials && (Utils.isNonEmptyString(this.getPassword()) || Utils.isNonEmptyString(this.getUser()))) {
            this.setErrorMessage(error);
          }
        })
        .always(()=> {
          this.submitButton.removeClass("coveo-waiting");
        })
        .done(()=> {
          allValidationPassed.resolve(true);
          $.proxy(onSuccess, this);
        })
    }

    private show() {
      this.isHidden = false;
      this.ensureDom();
      MobileUtils.removeToggleClassOnSearchInterface();
      this.getOrCreateCombined().show();

      if (DeviceUtils.isPhonegap()) {
        $(document).on("backbutton", $.proxy(this.handleBackButton, this));
      }
    }

    private handleBackButton() {
      this.hide();
      $(document).off("backbutton");
    }

    private handleQueryError(e: JQueryEventObject, args: IQueryErrorEventArgs) {
      if (this.isAccessDeniedError(args.error)) {
        this.setErrorMessage(l("BadUserPass"));
        this.show();
      }
    }

    private updateEndpointWithCredentials() {
      if (this.credentials && Coveo.SearchEndpoint.endpoints[this.options.id] != undefined) {
        Coveo.SearchEndpoint.endpoints[this.options.id].options.password = this.getPassword();
        Coveo.SearchEndpoint.endpoints[this.options.id].options.username = this.getUser();
      }
    }

    private buildTabButton() {
      $(this.element).append($(this.tabButtonTemplate()));
      $(this.element).click(() => {
        this.show();
      })
    }
  }

  Initialization.registerAutoCreateComponent(Login);
}