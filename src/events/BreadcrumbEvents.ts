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

export interface IClearBreadcrumbEventArgs {}

/**
 * This static class is there to contains the different string definition for all the events related to {@link Breadcrumb}.
 */
export class BreadcrumbEvents {
  /**
   * Triggered when the breadcrumb needs to update its content. External code can use this event to provide bits of HTML that should be included in the breadcrumb.
   *
   * All handlers bound to this event will receive a {@link IPopulateBreadcrumbEventArgs} as an argument.
   */
  public static populateBreadcrumb = 'populateBreadcrumb';
  /**
   * Triggered when the user clicks the Clear All button in the breadcrumb. When this event is raised, every filter that is included in the breadcrumb should be removed.
   *
   * This event does not provide custom event data.
   */
  public static clearBreadcrumb = 'clearBreadcrumb';
  public static redrawBreadcrumb = 'redrawBreadcrumb';
}
