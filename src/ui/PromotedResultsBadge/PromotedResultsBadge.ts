import 'styling/_PromotedResultsBadge';
import { $$, ComponentOptions, Dom, Initialization, l, ResultListEvents } from '../../Core';
import { IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { Component } from '../../ui/Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';

export interface IPromotedResultsBadgeOptions {
  showBadgeForFeaturedResults: boolean;
  showBadgeForRecommendedResults: boolean;

  captionForRecommended: string;
  captionForFeatured: string;

  colorForFeaturedResults: string;
  colorForRecommendedResults: string;
}

/**
 * The `PromotedResultsBadge` component adds a badge to promoted results in your interface.
 *
 * To be considered promoted, a result needs to either:
 * - be a Featured Result configured through a Coveo Query Pipeline (see [Adding and Managing Query Pipeline Featured Results](https://docs.coveo.com/en/1961/))
 * - be a recommended result by Coveo Machine Learning (see [Automatic Relevance Tuning (ART) Feature](https://docs.coveo.com/en/1671/#automatic-relevance-tuning-art-feature)).
 *
 * You can add this component anywhere in your search interface. The component will then add a badge to your results after they have been rendered.
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
     * Whether to show a badge when a result was promoted through a query pipeline _featured results_ rule.
     * @externaldocs [Adding and Managing Query Pipeline Featured Results](https://docs.coveo.com/1961/)
     *
     * Default value is `true`.
     */
    showBadgeForFeaturedResults: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Whether to show a badge when a result was promoted by a Coveo ML ART model.
     * @externaldocs (Automatic Relevance Tuning (ART) Feature)[https://docs.coveo.com/en/1671/#automatic-relevance-tuning-art-feature]
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
      localizedString: () => l('Recommended'),
      depend: 'showBadgeForRecommendedResults'
    }),
    /**
     * Specifies the caption that should be used for "Featured Results".
     *
     * Default value is the localized string for `Featured`.
     */
    captionForFeatured: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('Featured'),
      depend: 'showBadgeForFeaturedResults'
    }),

    /**
     * Specifies the color that should be used for "Featured Results".
     *
     * This can be specified using:
     * - a hexadecimal value (e.g., `#f58020`)
     * - an RGB value (e.g., `rgb(125,10,36)`)
     * - a CSS color name (e.g., `red`)
     *
     * Default value is `undefined`, and is controlled through the default stylesheet of the framework.
     */
    colorForFeaturedResults: ComponentOptions.buildColorOption({ depend: 'showBadgeForFeaturedResults' }),
    /**
     * Specifies the color that should be used for "Recommended Results".
     *
     * This can be specified using:
     * - a hexadecimal value (e.g., `#f58020`)
     * - an RGB value (e.g., `rgb(125,10,36)`)
     * - a CSS color name (e.g., `red`)
     *
     * Default value is `undefined`, and is controlled through the default stylesheet of the framework.
     */
    colorForRecommendedResults: ComponentOptions.buildColorOption({ depend: 'showBadgeForRecommendedResults' })
  };

  constructor(public element: HTMLElement, public options: IPromotedResultsBadgeOptions, public bindings: IComponentBindings) {
    super(element, PromotedResultsBadge.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PromotedResultsBadge, options);
    this.bind.onRootElement(ResultListEvents.newResultDisplayed, (args: IDisplayedNewResultEventArgs) => {
      const badge = this.buildBadge(args.result, args.item);
      if (badge) {
        this.appendBadge(badge, args.item);
      }
    });
  }

  private buildBadge(result: IQueryResult, resultElement: HTMLElement): Dom {
    if (!this.shouldShowABadge(result, resultElement)) {
      return null;
    }
    const badge = $$('div', {
      className: this.getClassName(result)
    });

    this.applyTagline(result, badge);
    this.applyColor(result, badge);
    return badge;
  }

  private appendBadge(badge: Dom, resultElement: HTMLElement) {
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
