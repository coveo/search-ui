export interface IQuickviewLoadedEventArgs {
  duration: number;
}

export class QuickviewEvents {
  public static quickviewLoaded = 'quickviewLoaded';
  public static openQuickview = 'openQuickview';
}
