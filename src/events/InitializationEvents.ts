export interface IBeforeInitializationEventArgs {
}

export interface IAfterInitializationEventArgs {
}

export class InitializationEvents {
  public static beforeInitialization = 'beforeInitialization';
  public static afterComponentsInitialization = 'afterComponentsInitialization';
  public static restoreHistoryState = 'restoreHistoryState';
  public static afterInitialization = 'afterInitialization';
  public static nuke = 'nuke';
}
