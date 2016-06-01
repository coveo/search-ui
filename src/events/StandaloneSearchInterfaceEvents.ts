export interface IBeforeRedirectEventArgs {
  searchPageUri: string;
  cancel: boolean;
}

export class StandaloneSearchInterfaceEvents {
  public static beforeRedirect = 'beforeRedirect';
}
