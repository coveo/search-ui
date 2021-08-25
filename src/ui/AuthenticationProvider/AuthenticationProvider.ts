import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IBuildingCallOptionsEventArgs, IQueryErrorEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IInitializationEventArgs, InitializationEvents } from '../../events/InitializationEvents';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { DomUtils } from '../../utils/DomUtils';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { ModalBox } from '../../ExternalModulesShim';
import { MissingAuthenticationError } from '../../rest/MissingAuthenticationError';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_AuthenticationProvider';
import { SVGIcons } from '../../utils/SVGIcons';
import { HashUtils } from '../../utils/HashUtils';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';

export const accessTokenStorageKey = 'coveo-auth-provider-access-token';
const handshakeTokenParamName = 'handshake_token';

export interface IAuthenticationProviderOptions {
  name?: string;
  caption?: string;
  useIFrame?: boolean;
  showIFrame?: boolean;
}

/**
 * The `AuthenticationProvider` component makes it possible to execute queries with an identity that the end user
 * can obtain using an authentication provider configured on the Coveo REST Search API
 * (see [Claims Authentication](https://docs.coveo.com/en/113/)).
 *
 * When necessary, this component handles redirecting the browser to the address that starts the authentication process.
 *
 * You can use the `data-tab` attribute to enable the `AuthenticationProvider` component only for the tabs of your
 * search interface that require authentication (see the [`Tab`]{@link Tab} component).
 */
export class AuthenticationProvider extends Component {
  static ID = 'AuthenticationProvider';
  static handshakeInProgress = false;

  static doExport = () => {
    exportGlobally({
      AuthenticationProvider: AuthenticationProvider
    });
  };

  /**
   * The options for the component.
   * @componentOptions
   */
  static options: IAuthenticationProviderOptions = {
    /**
     * Specifies the name of the authentication provider.
     *
     * See [SAML Authentication](https://docs.coveo.com/en/91/).
     */
    name: ComponentOptions.buildStringOption(),

    /**
     * Specifies the display name of the authentication provider. This is the name that you want to appear in the user
     * interface when the end user is logging in.
     *
     * Default value is the [`name`]{@link AuthenticationProvider.options.name} option value.
     */
    caption: ComponentOptions.buildStringOption({ postProcessing: (value, options) => value || options.name }),

    /**
     * Specifies whether to use an `<iframe>` to host the chain of redirection that make up the authentication
     * process.
     *
     * Using an `<iframe>` prevents leaving the search page as part of the authentication process. However, some login
     * providers refuse to load in an `<iframe>`.
     *
     * Default value is `false`.
     */
    useIFrame: ComponentOptions.buildBooleanOption({
      defaultValue: false,
      alias: ['useIframe']
    }),

    /**
     * If the [`useIFrame`]{@link AuthenticationProvider.options.useIFrame} option is `true`, specifies whether to make
     * the authentication `<iframe>` visible to the user (inside a popup).
     *
     * When the underlying authentication provider requires no user interaction (for example, when a user authenticates
     * using Windows authentication along with SharePoint claims), setting this option to `false` reduces the visual
     * impact of the authentication process.
     *
     * Default value is `true`.
     */
    showIFrame: ComponentOptions.buildBooleanOption({
      defaultValue: true,
      alias: ['showIframe'],
      depend: 'useIFrame'
    })
  };

  private handlers: ((...args: any[]) => void)[];
  private redirectCount: number;

  /**
   * Creates a new `AuthenticationProvider` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `AuthenticationProvider` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(
    public element: HTMLElement,
    public options: IAuthenticationProviderOptions = {},
    bindings?: IComponentBindings,
    public _window?: Window
  ) {
    super(element, AuthenticationProvider.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, AuthenticationProvider, options);

    Assert.exists(this.options.name);

    this.handlers = [];

    this._window = this._window || window;
    this.redirectCount = 0;

    this.bind.onRootElement(QueryEvents.buildingCallOptions, this.handleBuildingCallOptions);
    this.bind.onRootElement(QueryEvents.queryError, this.handleQueryError);
    this.bind.onRootElement(InitializationEvents.nuke, this.handleNuke);
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, (args: IInitializationEventArgs) =>
      this.onAfterComponentsInitialization(args)
    );

    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        text: l('Reauthenticate', this.options.caption),
        className: 'coveo-authentication-provider',
        onOpen: () => this.authenticateWithProvider(),
        svgIcon: SVGIcons.icons.dropdownAuthenticate,
        svgIconClassName: 'coveo-authentication-provider-svg'
      });
    });
  }

  private getHandshakeTokenFromUrl() {
    const hash = this.getHashAfterAdjustingForAngular();
    const token = HashUtils.getValue(handshakeTokenParamName, hash);
    return typeof token === 'string' ? token : '';
  }

  private getHashAfterAdjustingForAngular() {
    const hash = HashUtils.getHash();
    return this.isAngularHash ? `#${hash.slice(2)}` : hash;
  }

  private get isAngularHash() {
    const rawHash = HashUtils.getHash();
    return rawHash.indexOf('#/') === 0;
  }

  private onAfterComponentsInitialization(args: IInitializationEventArgs) {
    if (AuthenticationProvider.handshakeInProgress) {
      const promise = this.waitForHandshakeToFinish().then(() => this.loadAccessTokenFromStorage());

      args.defer.push(promise);
      return;
    }

    const handshakeToken = this.getHandshakeTokenFromUrl();

    if (!handshakeToken) {
      return this.loadAccessTokenFromStorage();
    }

    if (!this.shouldExchangeHandshakeToken) {
      return;
    }

    this.enableHandshakeInProgressFlag();

    const promise = this.exchangeHandshakeToken(handshakeToken)
      .then(token => this.storeAccessToken(token))
      .then(() => this.removeHandshakeTokenFromUrl())
      .then(() => this.loadAccessTokenFromStorage())
      .catch(e => this.logger.error(e))
      .finally(() => this.disableHandshakeInProgressFlag());

    args.defer.push(promise);
  }

  private get shouldExchangeHandshakeToken() {
    const tabId = $$(this.element).getAttribute('data-tab');
    const hash = HashUtils.getHash();
    const activeTabId = HashUtils.getValue(QUERY_STATE_ATTRIBUTES.T, hash);
    return !tabId || tabId === activeTabId;
  }

  private exchangeHandshakeToken(handshakeToken: string) {
    const accessToken = localStorage.getItem(accessTokenStorageKey);
    const options = accessToken ? { handshakeToken, accessToken } : { handshakeToken };
    return this.queryController.getEndpoint().exchangeHandshakeToken(options);
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(accessTokenStorageKey, accessToken);
  }

  private waitForHandshakeToFinish() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (AuthenticationProvider.handshakeInProgress) {
          return;
        }

        clearInterval(interval);
        resolve();
      }, 100);
    });
  }

  private enableHandshakeInProgressFlag() {
    AuthenticationProvider.handshakeInProgress = true;
  }

  private disableHandshakeInProgressFlag() {
    AuthenticationProvider.handshakeInProgress = false;
  }

  private removeHandshakeTokenFromUrl() {
    const delimiter = `&`;
    const hash = this.getHashAfterAdjustingForAngular();
    const token = this.getHandshakeTokenFromUrl();
    const handshakeEntry = `${handshakeTokenParamName}=${token}`;

    const entries = hash.substr(1).split(delimiter);
    const newHash = entries.filter(param => param !== handshakeEntry).join(delimiter);
    const adjustedHash = this.isAngularHash ? `/${newHash}` : newHash;

    this._window.history.replaceState(null, '', `#${adjustedHash}`);
  }

  private loadAccessTokenFromStorage() {
    const token = this.getAccessTokenFromStorage();
    token && this.queryController.getEndpoint().accessToken.updateToken(token);
  }

  private getAccessTokenFromStorage() {
    return localStorage.getItem(accessTokenStorageKey);
  }

  private handleBuildingCallOptions(args: IBuildingCallOptionsEventArgs) {
    args.options.authentication.push(this.options.name);
  }

  private handleQueryError(args: IQueryErrorEventArgs) {
    const token = this.getAccessTokenFromStorage();
    const shouldClearToken = this.shouldClearTokenFollowingErrorEvent(args);

    if (token && shouldClearToken) {
      localStorage.removeItem(accessTokenStorageKey);
      this._window.location.reload();
      return;
    }

    let missingAuthError = <MissingAuthenticationError>args.error;

    if (
      missingAuthError.isMissingAuthentication &&
      missingAuthError.provider === this.options.name &&
      this.redirectCount < 2 &&
      this.redirectCount !== -1
    ) {
      ++this.redirectCount;
      this.authenticateWithProvider();
    } else {
      this.logger.error('The AuthenticationProvider is in a redirect loop. This may be due to a back-end configuration problem.');
      this.redirectCount = -1;
    }
  }

  private shouldClearTokenFollowingErrorEvent(args: IQueryErrorEventArgs) {
    const error = args.error.name;
    return error === 'InvalidTokenException' || error === 'ExpiredTokenException';
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
      src: this.getAuthenticationProviderUriForIFrame()
    }).el;

    let modalbox: Coveo.ModalBox.ModalBox;
    modalbox = this.options.showIFrame ? this.createPopupForVisibleIFrame(iframe) : this.createPopupForWaitMessage(iframe);

    let handler = this.createHandler(modalbox, iframe);
    $$(<any>this._window).one('message', handler);
    this.handlers.push(handler);
  }

  private createHandler(modalbox: Coveo.ModalBox.ModalBox, iframe: HTMLElement): () => void {
    return () => {
      $$(iframe).detach();
      this.logger.info(`Got authentication for provider ${this.options.name}; retrying query.`);
      modalbox.close();
      this.queryController.executeQuery();
    };
  }

  private handleNuke() {
    _.each(this.handlers, handler => $$(<any>this._window).off('message', handler));
  }

  private createPopupForWaitMessage(iframe: HTMLElement): Coveo.ModalBox.ModalBox {
    let popup = $$(
      'div',
      {
        className: 'coveo-waiting-for-authentication-popup'
      },
      DomUtils.getBasicLoadingAnimation()
    ).el;

    $$(iframe).hide();
    document.body.appendChild(iframe);

    ModalBox.open(popup, {
      title: l('Authenticating', this.options.caption),
      sizeMod: 'small',
      body: this.searchInterface.options.modalContainer
    });
    return ModalBox;
  }

  private createPopupForVisibleIFrame(iframe: HTMLElement): Coveo.ModalBox.ModalBox {
    $$(iframe).addClass('coveo-authentication-iframe');
    let popup = $$('div', {}, iframe).el;

    ModalBox.open(popup, {
      title: l('Authenticating', this.options.caption),
      className: 'coveo-authentication-popup',
      sizeMod: 'big',
      body: this.searchInterface.options.modalContainer
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
