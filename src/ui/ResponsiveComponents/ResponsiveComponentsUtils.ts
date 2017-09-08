import { Dom } from '../../utils/Dom';

export class ResponsiveComponentsUtils {
  private static smallTabsClassName: string = 'coveo-small-tabs';
  private static smallFacetClassName: string = 'coveo-small-facets';
  private static smallRecommendationClassName: string = 'coveo-small-recommendation';

  static shouldDrawFacetSlider(root: Dom): boolean {
    return !this.isSmallFacetActivated(root) && !this.isSmallRecommendationActivated(root);
  }

  static isSmallTabsActivated(root: Dom): boolean {
    return root.hasClass(this.smallTabsClassName);
  }

  static isSmallFacetActivated(root: Dom): boolean {
    return root.hasClass(this.smallFacetClassName);
  }

  static isSmallRecommendationActivated(root: Dom): boolean {
    return root.hasClass(this.smallRecommendationClassName);
  }

  static activateSmallTabs(root: Dom): void {
    root.addClass(this.smallTabsClassName);
  }

  static deactivateSmallTabs(root: Dom): void {
    root.removeClass(this.smallTabsClassName);
  }

  static activateSmallFacet(root: Dom): void {
    root.addClass(this.smallFacetClassName);
  }

  static deactivateSmallFacet(root: Dom): void {
    root.removeClass(this.smallFacetClassName);
  }

  static activateSmallRecommendation(root: Dom): void {
    root.addClass(this.smallRecommendationClassName);
  }

  static deactivateSmallRecommendation(root: Dom): void {
    root.removeClass(this.smallRecommendationClassName);
  }
}
