

module Coveo {
  export interface EnterOnSearchboxEventArgs {
    expression: string;
  }

  export interface QuickviewLoadedEventArgs {
    duration: number;
  }

  export interface OpenQuickviewEventArgs{
    termsToHighlight: Array<string>;
  }
  
  export interface AttachToCaseEventArgs {
    result: Coveo.IQueryResult;
    dataToAttach: any;
  }
  
  export interface DetachFromCaseEventArgs {
    result: Coveo.IQueryResult;
  }

  export class UserActionEvents {
    public static enterOnSearchbox = 'enterOnSearchbox';
    public static quickviewLoaded = 'quickviewLoaded';
    public static openQuickview = 'openQuickview';
    public static attachToCase = 'attachToCase';
    public static detachFromCase = 'detachFromCase';
    public static attachToCaseStateChanged = 'attachToCaseStateChanged';
  }
}