/**
 * The `IBeforeRedirectEventArgs` interface describes the object that all
 * [`beforeRedirect`]{@link StandaloneSearchInterfaceEvents.beforeRedirect} event handlers receive as an argument.
 */
export interface IBeforeRedirectEventArgs {
  /**
   * The URI of the page that the search interface will redirect to when a query is performed by the [`StandaloneSearchBox`]{@link StandaloneSearchBox} component.
   */
  searchPageUri: string;

  /**
   * If this property is set to `true` by a `beforeRedirect` event handler, the [`StandaloneSearchBox`]{@link StandaloneSearchBox} component will not redirect to the full search page.
   */
  cancel: boolean;
}

/**
 * The `StandaloneSearchInterfaceEvents` static class contains the string definitions of all events that strongly relate to the standalone search interface.
 */
export class StandaloneSearchInterfaceEvents {
  /**
   * Triggered by the [`StandaloneSearchBox`]{@link StandaloneSearchBox} component during initialization, just before redirecting to the full search page.
   *
   * @type {string} The string value is `beforeRedirect`.
   */
  public static beforeRedirect = 'beforeRedirect';
}
