/// <reference path='../../../node_modules/modal-box/bin/ModalBox.d.ts' />

import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {Assert} from '../../misc/Assert';
import {QueryEvents, IBuildingCallOptionsEventArgs, IQueryErrorEventArgs} from '../../events/QueryEvents';
import {IComponentBindings} from '../Base/ComponentBindings';
import {InitializationEvents} from '../../events/InitializationEvents';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {DomUtils} from '../../utils/DomUtils';
import {$$} from '../../utils/Dom';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';

export interface IAuthenticationProviderOptions {
  name?: string;
  caption?: string;
  useIFrame?: boolean;
  showIFrame?: boolean;
}

/**
 * This component arranges for queries to be executed with an identity obtained
 * using an Authentication Provider configured on the Coveo Search API
 * (see [On-Premises SharePoint Claims Authentication](https://developers.coveo.com/display/public/SearchREST/On-Premises+SharePoint+Claims+Authentication)).
 * When needed, the component will handle redirecting the browser to the address
 * that starts the authentication process.
 *
 * Using the standard `data-tab` attribute, you can enable the
 * AuthenticationProvider component only for tabs in which authentication is
 * required (see {@link Tab}).
 */
export class AuthenticationProvider extends Component {
  static ID = 'AuthenticationProvider';

  /**
   * The options for the component.
   * @componentOptions
   */
  static options: IAuthenticationProviderOptions = {
    /**
     * Specifies the name of the authentication provider as specified in the
     * [Windows Service Configuration File](https://developers.coveo.com/display/public/SearchREST/Windows+Service+Configuration+File)
     */
    name: ComponentOptions.buildStringOption(),
    /**
     * Specifies the friendly name of the authentication provider that will be
     * displayed in the user interface while logging in.<br/>
     * If not specified, it will default to {@link options.name name}.
     */
    caption: ComponentOptions.buildStringOption({ postProcessing: (value, options) => value || options.name }),
    /**
     * Specifies whether an `<iframe>` will be used to host the chain of
     * redirections that make up the authentication process.<br/>
     * By default, this option is set to `false`.
     *
     * Using an `<iframe>` avoids leaving the search page as part of the authentication
     * process, but some login providers will refuse to load in an `<iframe>`.
     */
    useIFrame: ComponentOptions.buildBooleanOption({ defaultValue: false, attrName: 'data-use-iframe' }),
    /**
     * Specifies whether the `<iframe>` used for authentication will be made
     * visible to the user (inside a popup).<br/>
     * By default, this option is set to `true`.
     *
     * When the underlying authentication provider requires no user interaction
     * (for example, when Windows Authentication is used along with SharePoint Claims),
     * using this option reduces the visual impact of the authentication process.
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
   * Build a new AuthenticationProvider component
   * @param element
   * @param options
   * @param bindings
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
    })
  }

  private handleBuildingCallOptions(args: IBuildingCallOptionsEventArgs) {
    args.options.authentication.push(this.options.name)
  }

  private handleQueryError(args: IQueryErrorEventArgs) {
    if (args.error['provider'] === this.options.name && this.redirectCount < 2 && this.redirectCount !== -1) {
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
    }
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

    return Coveo.ModalBox.open(popup, {
      title: l('Authenticating', this.options.caption)
    });
  }

  private createPopupForVisibleIFrame(iframe: HTMLElement): Coveo.ModalBox.ModalBox {
    $$(iframe).addClass('coveo-authentication-iframe');
    let popup = $$('div', {}, iframe).el;

    return Coveo.ModalBox.open(popup, {
      title: l('Authenticating', this.options.caption),
      className: 'coveo-authentication-popup'
    });
  }

  private getAuthenticationProviderUriForRedirect(): string {
    return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, this._window.location.href, undefined);
  }

  private getAuthenticationProviderUriForIFrame(): string {
    return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, undefined, 'success');
  }
}

Initialization.registerAutoCreateComponent(AuthenticationProvider);
