/// <reference path='../Base.ts' />
/// <reference path='../ui/Breadcrumb/BreadcrumbInterface.ts' />
module Coveo {
  /**
   * Event triggered when populating the breadcrumb
   */
  export interface IPopulateBreadcrumbEventArgs {
    breadcrumbs: IBreadcrumbItem[];
  }

  export interface ClearBreadcrumbEventArgs {
  }

  export class BreadcrumbEvents {
    public static populateBreadcrumb = 'populateBreadcrumb';
    public static clearBreadcrumb = 'clearBreadcrumb';
    public static redrawBreadcrumb = 'redrawBreadcrumb';
  }
}