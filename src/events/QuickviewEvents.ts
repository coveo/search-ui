export interface IQuickviewLoadedEventArgs {
  duration: number;
}

export interface IOpenQuickviewEventArgs{
  termsToHighlight: Array<string>;
}

export class QuickviewEvents {
  public static quickviewLoaded = "quickviewLoaded";
  public static openQuickview = "openQuickview";
 }