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
 * Depending on its configuration, this component will render badges on query result items whose ranking scores were increased by [featured results](https://docs.coveo.com/en/1961/) query pipeline rules and/or [Coveo ML ART](https://docs.coveo.com/en/1671/#automatic-relevance-tuning-art-feature).
 *
 * This component can be put anywhere in the markup configuration of a search interface. However, it is meant to be initialized only once, and should thus never be included in a result template.
 *
 * @externaldocs [Adding Promoted Results Badges](https://docs.coveo.com/en/3123/)
 * @availablesince [July 2018 Release (v2.4382.10)](https://docs.coveo.com/en/1360/)
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
     * Whether to show a badge when a result was promoted by a featured results query pipeline rule.
     */
    showBadgeForFeaturedResults: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Whether to show a badge when a result was promoted by Coveo ML ART.
     */
    showBadgeForRecommendedResults: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * The caption to show on the badge for results promoted by Coveo ML ART.
     *
     * Default value is the localized string for `Recommended`.
     *
     * @examples Recommended by Coveo ML
     */
    captionForRecommended: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('Recommended'),
      depend: 'showBadgeForRecommendedResults'
    }),

    /**
     * The caption to show on the badge for results promoted by a _featured results_ query pipeline rule.
     *
     * Default value is the localized string for `Featured`.
     *
     * @examples Recommended by ACME
     */
    captionForFeatured: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('Featured'),
      depend: 'showBadgeForFeaturedResults'
    }),

    /**
     * The badge color for results promoted by a _featured results_ query pipeline rule.
     *
     * Can be specified using:
     * - a hexadecimal value
     * - an RGB value
     * - a CSS color name
     *
     * @examples #f58020, rgb(125 10 36), red
     *
     * Default value is controlled through the default stylesheet of the framework.
     */
    colorForFeaturedResults: ComponentOptions.buildColorOption({ depend: 'showBadgeForFeaturedResults' }),

    /**
     * The badge color for results promoted by Coveo ML ART.
     *
     * Can be specified using:
     * - a hexadecimal value
     * - an RGB value
     * - a CSS color name
     *
     * @examples #f58020, rgb(125 10 36), red
     *
     * Default value is controlled through the default stylesheet of the framework.
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
