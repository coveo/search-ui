/**
 * Argument sent to all handlers bound on {@link InitializationEvents.afterComponentsInitialization}, and {@link InitializationEvents.afterInitialization}.
 */
export interface IInitializationEventArgs {
  defer: Promise<any>[];
}

/**
 * This static class is there to contain the different string definitions for all the events related to initialization.
 *
 * Note that these events will only be triggered when the {@link init} function is called.
 *
 * This means these events are normally called only once when the search interface is initialized.
 */
export class InitializationEvents {
  /**
   * This event is triggered right before each components inside the search interface get initialized (eg: Before the constructor of each component is executed).
   *
   * The string value is `beforeInitialization`.
   * @type {string}
   */
  public static beforeInitialization = 'beforeInitialization';
  /**
   * Triggered after the components are initialized (eg: After the constructor of each component is executed)
   * but before their state is set from the hash portion of the URL (e.g., `http://mysearchinterface#q=myQuery`).
   *
   * This is also before the first query is launched (if the {@link SearchInterface.options.autoTriggerQuery} is `true`).
   *
   * The string value is `afterComponentsInitialization`.
   * @type {string}
   */
  public static afterComponentsInitialization = 'afterComponentsInitialization';
  /**
   * Triggered right before the state from the URL (e.g., `http://mysearchinterface#q=myQuery`) gets applied in the interface.
   *
   * This will typically only be useful if the {@link SearchInterface.options.enableHistory} is set to `true`.
   *
   * The string value is `restoreHistoryState`.
   * @type {string}
   */
  public static restoreHistoryState = 'restoreHistoryState';
  /**
   * Triggered right after the UI is fully initialized.
   *
   * Concretely this means that the constructor of each component has been executed, and that the state coming for the URL (e.g., `http://mysearchinterface#q=myquery`) has been applied.
   *
   * It is triggered *before* the first query is launched, and if the {@link SearchInterface.options.autoTriggerQuery} is `true`.
   *
   * The string value is `afterInitialization`.
   * @type {string}
   */
  public static afterInitialization = 'afterInitialization';
  /**
   * This is triggered when the UI needs to be dynamically removed so that components can unbind any internal handlers they might have set globally on the window or the document.
   *
   * After this event has been executed, the search interface can be dynamically removed and all handlers can be considered cleanly removed.
   *
   * The string value is `nuke`.
   * @type {string}
   */
  public static nuke = 'nuke';
}
