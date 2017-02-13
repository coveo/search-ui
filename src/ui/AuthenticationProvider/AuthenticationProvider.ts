import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IBuildingCallOptionsEventArgs, IQueryErrorEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { InitializationEvents } from '../../events/InitializationEvents';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { DomUtils } from '../../utils/DomUtils';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { ModalBox } from '../../ExternalModulesShim';
import { MissingAuthenticationError } from '../../rest/MissingAuthenticationError';
import _ = require('underscore');

export interface IAuthenticationProviderOptions {
  name?: string;
  caption?: string;
  useIFrame?: boolean;
  showIFrame?: boolean;
}

/**
 * The AuthenticationProvider component arranges for queries to execute with an identity that the user obtains using an
 * Authentication Provider configured on the Coveo Search API
 * (see [On-Premises SharePoint Claims Authentication](https://developers.coveo.com/x/hQLL)).
 *
 * When necessary, this component handles redirecting the browser to the address that starts the authentication process.
 *
 * Using the standard `data-tab` attribute, you can enable the AuthenticationProvider component only for tabs requiring
 * authentication (see {@link Tab}).
 */
export class AuthenticationProvider extends Component {
  static ID = 'AuthenticationProvider';

  /**
   * The options for the component.
   * @componentOptions
   */
  static options: IAuthenticationProviderOptions = {

    /**
     * Specifies the name of the authentication provider.
     *
     * See [Windows Service Configuration File](https://developers.coveo.com/x/OQMv).
     */
    name: ComponentOptions.buildStringOption(),

    /**
     * Specifies the friendly name of the authentication provider. This is the name that you want to display in the user
     * interface when a user is logging in.
     *
     * Default value is the value set to {@link AuthenticationProvider.options.name}.
     */
    caption: ComponentOptions.buildStringOption({ postProcessing: (value, options) => value || options.name }),

    /**
     * Specifies whether to use an `<iframe>` to host the chain of redirections that make up the authentication
     * process.
     *
     * Default value is `false`.
     *
     * Using an `<iframe>` prevents leaving the search page as part of the authentication process. However, some login
     * providers will refuse to load in an `<iframe>`.
     */
    useIFrame: ComponentOptions.buildBooleanOption({ defaultValue: false, attrName: 'data-use-iframe' }),

    /**
     * If the {@link AuthenticationProvider.options.useIFrame} is set to `true`, specifies whether to make the
     * authentication `<iframe>` visible to the user (inside a popup).
     *
     * Default value is `true`.
     *
     * When the underlying authentication provider requires no user interaction (for example, when a user authenticates
     * using Windows Authentication along with SharePoint Claims), setting this option to `false` reduces the visual
     * impact of the authentication process.
     *
     */
    showIFrame: ComponentOptions.buildBooleanOption({
      defaultValue: true,
      attrName: 'data-show-iframe',
      depend: 'useIFrame'
    })
  };

  private handlers: ((...args: any[]) => void)[];

  private redirectCount: number;

  /**
   * Creates a new AuthenticationProvider component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the AuthenticationProvider component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IAuthenticationProviderOptions = {}, bindings?: IComponentBindings, public _window?: Window) {
    super(element, AuthenticationProvider.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, AuthenticationProvider, options);

    Assert.exists(this.options.name);

    this.handlers = [];

    this._window = this._window || window;
    this.redirectCount = 0;

    this.bind.onRootElement(QueryEvents.buildingCallOptions, this.handleBuildingCallOptions);
    this.bind.onRootElement(QueryEvents.queryError, this.handleQueryError);
    this.bind.onRootElement(InitializationEvents.nuke, this.handleNuke);

    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        text: l('Reauthenticate', this.options.caption),
        className: 'coveo-authentication-provider',
        onOpen: () => this.authenticateWithProvider()
      });
    });
  }

  private handleBuildingCallOptions(args: IBuildingCallOptionsEventArgs) {
    args.options.authentication.push(this.options.name);
  }

  private handleQueryError(args: IQueryErrorEventArgs) {
    let missingAuthError = <MissingAuthenticationError>args.error;

    if (missingAuthError.isMissingAuthentication && missingAuthError.provider === this.options.name && this.redirectCount < 2 && this.redirectCount !== -1) {
      ++this.redirectCount;
      this.authenticateWithProvider();
    } else {
      this.logger.error('The AuthenticationProvider is in a redirect loop. This may be due to a back-end configuration problem.');
      this.redirectCount = -1;
    }
  }

  private authenticateWithProvider() {
    this.options.useIFrame ? this.authenticateWithIFrame() : this.redirectToAuthenticationProvider();
  }

  private redirectToAuthenticationProvider() {
    this.logger.info(`Redirecting to authentication provider ${this.options.name}`);
    this._window.location.href = this.getAuthenticationProviderUriForRedirect();
  }

  private authenticateWithIFrame() {
    this.logger.info(`Using iframe to retrieve authentication for provider ${this.options.name}`);

    let iframe = $$('iframe', {
      'src': this.getAuthenticationProviderUriForIFrame()
    }).el;

    let modalbox: Coveo.ModalBox.ModalBox;
    modalbox = this.options.showIFrame ? this.createPopupForVisibleIFrame(iframe) : this.createPopupForWaitMessage(iframe);

    let handler = this.createHandler(modalbox, iframe);
    $$(<any>this._window).one('message', handler);
    this.handlers.push(handler);
  }

  private createHandler(modalbox: Coveo.ModalBox.ModalBox, iframe: HTMLElement): () => void {
    return () => {
      modalbox.close();
      $$(iframe).detach();
      this.logger.info(`Got authentication for provider ${this.options.name}; retrying query.`);
      this.queryController.executeQuery();
    };
  }

  private handleNuke() {
    _.each(this.handlers, handler => $$(<any>this._window).off('message', handler));
  }

  private createPopupForWaitMessage(iframe: HTMLElement): Coveo.ModalBox.ModalBox {
    let popup = $$('div', {
      className: 'coveo-waiting-for-authentication-popup'
    }, DomUtils.getBasicLoadingAnimation()).el;

    $$(iframe).hide();
    document.body.appendChild(iframe);

    ModalBox.open(popup, {
      title: l('Authenticating', this.options.caption)
    });
    return ModalBox;
  }

  private createPopupForVisibleIFrame(iframe: HTMLElement): Coveo.ModalBox.ModalBox {
    $$(iframe).addClass('coveo-authentication-iframe');
    let popup = $$('div', {}, iframe).el;

    ModalBox.open(popup, {
      title: l('Authenticating', this.options.caption),
      className: 'coveo-authentication-popup'
    });
    return ModalBox;
  }

  private getAuthenticationProviderUriForRedirect(): string {
    return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, this._window.location.href, undefined);
  }

  private getAuthenticationProviderUriForIFrame(): string {
    return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, undefined, 'success');
  }
}

Initialization.registerAutoCreateComponent(AuthenticationProvider);
