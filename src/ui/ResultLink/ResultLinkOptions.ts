module Coveo {
  export interface ResultLinkOptions {
    onClick?: (e: JQueryEventObject, result: IQueryResult) => any;
    field?: string;
    openInOutlook?: boolean;
    openQuickview?: boolean;
    alwaysOpenInNewWindow?: boolean;
  }
}
