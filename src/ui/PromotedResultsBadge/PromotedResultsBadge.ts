import { Component } from '../../ui/Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, Initialization, l, $$, ResultListEvents, Dom } from '../../Core';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import 'styling/_PromotedResultsBadge';

export interface IPromotedResultsBadgeOptions {
  showBadgeForFeaturedResults: boolean;
  showBadgeForRecommendedResults: boolean;

  captionForRecommended: string;
  captionForFeatured: string;

  colorForFeaturedResults: string;
  colorForRecommendedResults: string;
}

/**
 * This component is in charge of adding a badge to promoted results in your interface.
 *
 * Promoted results consists of either "Featured Results" configured through a [Coveo Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=126)
 * or "Recommended Results" through a [Coveo Machine Learning algorithm](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=183).
 *
 * This component can be added anywhere inside the search interface, and will modify specific results after they have been rendered by adding a badge.
 */
export class PromotedResultsBadge extends Component {
  static ID = 'PromotedResultsBadge';

  static doExport = () => {
    exportGlobally({
      PromotedResultsBadge
    });
  };

  /**
   * @componentOptions
   */
  static options: IPromotedResultsBadgeOptions = {
    /**
     * Specifies if a badge should be added to "Featured Results" configured through a [Coveo Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=126).
     *
     * Default value is `true`.
     */
    showBadgeForFeaturedResults: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies if a badge should be added to "Recommended Results" returned by a [Coveo Machine Learning algorithm](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=183).
     *
     * Default value is `false`.
     */
    showBadgeForRecommendedResults: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the caption that should be used for "Recommended Results".
     *
     * Default value is the localized string for `Recommended`.
     */
    captionForRecommended: ComponentOptions.buildLocalizedStringOption({
      defaultValue: l('Recommended'),
      depend: 'showBadgeForRecommendedResults'
    }),
    /**
     * Specifies the caption that should be used for "Featured Results".
     *
     * Default value is the localized string for `Featured`.
     */
    captionForFeatured: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('Featured'), depend: 'showBadgeForFeaturedResults' }),

    /**
     * Specifies the color that should be used for "Featured Results".
     *
     * This can be specified using either an hexadecimal value (eg: `#f58020`), an RGB value (eg: `rgb(125,10,36)`), or a CSS color name (eg: `pink`, `yellow`, `orange`, etc.).
     *
     * Default value is `undefined`, and is controlled through the default stylesheet of the framework.
     */
    colorForFeaturedResults: ComponentOptions.buildColorOption({ depend: 'showBadgeForFeaturedResults' }),
    /**
     * Specifies the color that should be used for "Recommended Results".
     *
     * This can be specified using either an hexadecimal value (eg: `#f58020`), an RGB value (eg: `rgb(125,10,36)`), or a CSS color name (eg: `pink`, `yellow`, `orange`, etc.).
     *
     * Default value is `undefined`, and is controlled through the default stylesheet of the framework.
     */
    colorForRecommendedResults: ComponentOptions.buildColorOption({ depend: 'showBadgeForRecommendedResults' })
  };

  constructor(public element: HTMLElement, public options: IPromotedResultsBadgeOptions, public bindings: IComponentBindings) {
    super(element, PromotedResultsBadge.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PromotedResultsBadge, options);
    this.bind.onRootElement(ResultListEvents.newResultDisplayed, (args: IDisplayedNewResultEventArgs) => {
      this.buildBadge(args.result, args.item);
    });
  }

  private buildBadge(result: IQueryResult, resultElement: HTMLElement): void {
    if (!this.shouldShowABadge(result, resultElement)) {
      return null;
    }
    const badge = $$('div', {
      className: this.getClassName(result)
    });

    this.applyTagline(result, badge);
    this.applyColor(result, badge);

    if (this.isCardLayout(resultElement)) {
      this.addBadgeToCardLayout(badge, resultElement);
    } else {
      $$(resultElement).prepend(badge.el);
    }
  }

  private addBadgeToCardLayout(badge: Dom, resultElement: HTMLElement): void {
    let container: Dom;

    if (resultElement.parentElement == null) {
      container = $$('div', {
        className: 'coveo-promoted-result-badge-container-card-layout'
      });

      container.insertBefore(resultElement);
    } else {
      container = $$(resultElement.parentElement);
    }

    container.append(badge.el);
    container.append(resultElement);
  }

  private applyColor(result: IQueryResult, badge: Dom) {
    if (this.isFeatured(result) && this.options.colorForFeaturedResults) {
      badge.el.style.backgroundColor = this.options.colorForFeaturedResults;
    }

    if (this.isRecommended(result) && this.options.colorForRecommendedResults) {
      badge.el.style.backgroundColor = this.options.colorForRecommendedResults;
    }
  }

  private applyTagline(result: IQueryResult, badge: Dom): string {
    if (this.isFeatured(result) && this.options.showBadgeForFeaturedResults) {
      badge.text(this.options.captionForFeatured);
    }
    if (this.isRecommended(result) && this.options.showBadgeForRecommendedResults) {
      return badge.text(this.options.captionForRecommended);
    }
  }

  private isFeatured(result: IQueryResult): boolean {
    return result.isTopResult;
  }

  private isRecommended(result: IQueryResult): boolean {
    return result.isRecommendation && !result.isTopResult;
  }

  private isTableLayout(resultElement: HTMLElement): boolean {
    return $$(resultElement).hasClass('coveo-table-layout');
  }

  private isCardLayout(resultElement: HTMLElement): boolean {
    return $$(resultElement).hasClass('coveo-card-layout');
  }

  private getClassName(result: IQueryResult) {
    return `coveo-promoted-result-badge coveo-${this.isFeatured(result) ? 'featured' : 'recommended'}-result-badge`;
  }

  private shouldShowABadge(result: IQueryResult, resultElement: HTMLElement): boolean {
    if (this.isTableLayout(resultElement)) {
      return false;
    }

    if (this.isFeatured(result) && this.options.showBadgeForFeaturedResults) {
      return true;
    }

    if (this.isRecommended(result) && this.options.showBadgeForRecommendedResults) {
      return true;
    }

    return false;
  }
}

Initialization.registerAutoCreateComponent(PromotedResultsBadge);
