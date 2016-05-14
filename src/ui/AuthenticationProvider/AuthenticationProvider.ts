/// <reference path="../../Base.ts" />
/// <reference path="../Menu/MenuItem.ts" />

module Coveo {
  export interface AuthenticationProviderOptions {
    name?: string;
    caption?: string;
    useIFrame?: boolean;
    showIFrame?: boolean;
  }

  export class AuthenticationProvider extends Component {
    static ID = 'AuthenticationProvider';
        
    static options: AuthenticationProviderOptions = {
      name: ComponentOptions.buildStringOption(),
      caption: ComponentOptions.buildStringOption({ postProcessing: (value, options) => value || options.name }),
      useIFrame: ComponentOptions.buildBooleanOption({ defaultValue: false, attrName: 'data-use-iframe' }),
      showIFrame: ComponentOptions.buildBooleanOption({ defaultValue: true, attrName: 'data-show-iframe' })
    };
    
    private handlers: ((...args: any[]) => void)[];


    constructor(public element: HTMLElement, public options: AuthenticationProviderOptions = {}, bindings?: IComponentBindings) {
      super(element, AuthenticationProvider.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, AuthenticationProvider, options);

      this.bind.onRoot(QueryEvents.buildingCallOptions, this.handleBuildingCallOptions);
      this.bind.onRoot(QueryEvents.queryError, this.handleQueryError);
      this.bind.onRoot(InitializationEvents.nuke, this.handleNuke);

      this.bind.onRoot(SettingsEvents.settingsPopulateMenu, (e, args: ISettingsPopulateMenuArgs) => {
        args.menuData.push({
          text: l("Reauthenticate", this.options.caption),
          className: 'coveo-authentication-provider',
          onOpen: () => this.authenticateWithProvider()
        });
      })
    }

    private handleBuildingCallOptions(e, args: IBuildingCallOptionsEventArgs) {
      args.options.authentication.push(this.options.name)
    }

    private handleQueryError(e: JQueryEventObject, args: IQueryErrorEventArgs) {
      if (args.error['provider'] == this.options.name) {
        this.authenticateWithProvider();
      }
    }

    private authenticateWithProvider() {
      if (this.options.useIFrame) {
        this.useIFrameToAuthenticate();
      } else {
        this.redirectToAuthenticationProvider();
      }
    }

    private redirectToAuthenticationProvider() {
      this.logger.info("Redirecting to authentication provider " + this.options.name);
      window.location.href = this.getAuthenticationProviderUriForRedirect();
    }

    private useIFrameToAuthenticate() {
      this.logger.info("Using iframe to retrieve authentication for provider " + this.options.name);

      var iframe = $('<iframe/>').attr('src', this.getAuthenticationProviderUriForIFrame());

      var modalbox: ModalBox.ModalBox;
      if (this.options.showIFrame) {
        modalbox = this.createPopupForVisibleIFrame(iframe);
      } else {
        modalbox = this.createPopupForWaitMessage(iframe);
      }
      
      var handler = this.createHandler(modalbox, iframe);
      $(window).one('message', handler);
      this.handlers.push(handler);
    }
    
    private createHandler(modalbox: ModalBox.ModalBox, iframe: JQuery): () => void {
        return () => {
            modalbox.close();
            iframe.detach();
            this.logger.info("Got authentication for provider " + this.options.name + "; retrying query.");
            this.queryController.executeQuery();
      }
    }
    
    private handleNuke(){
        this.handlers.forEach(handler => {
            $(window).off('message', handler);
        });
    }

    private createPopupForWaitMessage(iframe: JQuery): ModalBox.ModalBox {
      var popup = $('<div/>')
        .addClass('coveo-waiting-for-authentication-popup')
        .append(JQueryUtils.getBasicLoadingDots());

      iframe.hide().appendTo(document.body);

      return ModalBox.open(popup.get(0), {
        title: l("Authenticating", this.options.caption)
      });
    }

    private createPopupForVisibleIFrame(iframe: JQuery): ModalBox.ModalBox {
      var popup = $('<div/>');
      iframe.addClass('coveo-authentication-iframe').appendTo(popup);

      return ModalBox.open(popup.get(0), {
        //title: l.Authenticating(this.options.caption),
        className: "coveo-authentication-popup"
      });
    }

    private getAuthenticationProviderUriForRedirect(): string {
      return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, window.location.href, undefined);
    }

    private getAuthenticationProviderUriForIFrame(): string {
      return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, undefined, 'success');
    }
  }

  Initialization.registerAutoCreateComponent(AuthenticationProvider);
}