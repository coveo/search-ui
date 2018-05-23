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
 * This component is in charge of
 */
export class PromotedResultsBadge extends Component {
  static ID = 'PromotedResultsBadge';

  static doExport = () => {
    exportGlobally({
      PromotedResultsBadge
    });
  };

  static options: IPromotedResultsBadgeOptions = {
    showBadgeForFeaturedResults: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    showBadgeForRecommendedResults: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    captionForRecommended: ComponentOptions.buildLocalizedStringOption({
      defaultValue: l('Recommended'),
      depend: 'showBadgeForRecommendedResults'
    }),
    captionForFeatured: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('Featured'), depend: 'showBadgeForFeaturedResults' }),

    colorForFeaturedResults: ComponentOptions.buildColorOption({ depend: 'showBadgeForFeaturedResults' }),
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
