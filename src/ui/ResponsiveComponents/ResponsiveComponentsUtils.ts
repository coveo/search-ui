import {Dom} from '../../utils/Dom';

export class ResponsiveComponentsUtils {

  private static smallTabsClassName: string = 'coveo-small-tabs';
  private static smallFacetClassName: string = 'coveo-small-facets';

  public static MEDIUM_MOBILE_WIDTH = 640;

  static isSmallTabsActivated(root: Dom): boolean {
    return root.hasClass(this.smallTabsClassName);
  }

  static isSmallFacetActivated(root: Dom): boolean {
    return root.hasClass(this.smallFacetClassName);
  }

  static activateSmallTabs(root: Dom) {
    root.addClass(this.smallTabsClassName);
  }

  static deactivateSmallTabs(root: Dom) {
    root.removeClass(this.smallTabsClassName);
  }

  static activateSmallFacet(root: Dom) {
    root.addClass(this.smallFacetClassName);
  }

  static deactivateSmallFacet(root: Dom) {
    root.removeClass(this.smallFacetClassName);
  }
}
