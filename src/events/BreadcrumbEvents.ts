/**
 * Represent an item to insert in the breadcrumb
 */
export interface IBreadcrumbItem {
  /**
   * The HTMLElement to insert in the breadcrumb
   */
  element: HTMLElement;
}

/**
 * Event triggered when populating the breadcrumb
 */
export interface IPopulateBreadcrumbEventArgs {
  breadcrumbs: IBreadcrumbItem[];
}

export interface IClearBreadcrumbEventArgs {
}

export class BreadcrumbEvents {
  public static populateBreadcrumb = 'populateBreadcrumb';
  public static clearBreadcrumb = 'clearBreadcrumb';
  public static redrawBreadcrumb = 'redrawBreadcrumb';
}
