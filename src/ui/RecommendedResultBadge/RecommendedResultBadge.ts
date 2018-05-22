import { Component } from '../../ui/Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, Initialization, l, $$, ResultListEvents } from '../../Core';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import 'styling/_RecommendedResultBadge';

export interface IRecommendedResultBadgeOptions {
  captionForRecommended: string;
  captionForFeatured: string;
  showBadgeForFeaturedResults: boolean;
  showBadgeForRecommendedResults: boolean;
  colorForFeaturedResults: string;
  colorForRecommendedResults: string;
}

export class RecommendedResultBadge extends Component {
  static ID = 'RecommendedResultBadge';

  static doExport = () => {
    exportGlobally({
      RecommendedResultBadge
    });
  };

  static options: IRecommendedResultBadgeOptions = {
    captionForRecommended: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('Recommended') }),
    captionForFeatured: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('Featured') }),
    showBadgeForFeaturedResults: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    showBadgeForRecommendedResults: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    colorForFeaturedResults: ComponentOptions.buildColorOption(),
    colorForRecommendedResults: ComponentOptions.buildColorOption()
  };

  constructor(public element: HTMLElement, public options: IRecommendedResultBadgeOptions, public bindings: IComponentBindings) {
    super(element, RecommendedResultBadge.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, RecommendedResultBadge, options);
    this.bind.onRootElement(ResultListEvents.newResultDisplayed, (args: IDisplayedNewResultEventArgs) => {
      this.buildBadge(args.result, args.item);
      /*if (badge) {
        $$(args.item).prepend(badge.el)
      }*/
    });
  }

  private resolveTagline(result: IQueryResult) {
    if (this.isFeatured(result) && this.options.showBadgeForFeaturedResults) {
      return this.options.captionForFeatured;
    }
    if (this.isRecommended(result) && this.options.showBadgeForRecommendedResults) {
      return this.options.captionForRecommended;
    }

    return '';
  }

  private isFeatured(result: IQueryResult) {
    return result.isTopResult;
  }

  private isRecommended(result: IQueryResult) {
    return result.isRecommendation;
  }

  private shouldShowABadge(result: IQueryResult) {
    if (this.isFeatured(result) && this.options.showBadgeForFeaturedResults) {
      return true;
    }

    if (this.isRecommended(result) && this.options.showBadgeForRecommendedResults) {
      return true;
    }

    return false;
  }

  private buildBadge(result: IQueryResult, resultElement: HTMLElement) {
    if (!this.shouldShowABadge(result)) {
      return null;
    }

    const className = `coveo-promoted-result-badge coveo-${this.isFeatured(result) ? 'featured' : 'recommended'}-result-badge`;
    const badge = $$('div', {
      className
    });

    if (this.isFeatured(result) && this.options.colorForFeaturedResults) {
      badge.el.style.backgroundColor = this.options.colorForFeaturedResults;
    }
    if (this.isRecommended(result) && this.options.colorForRecommendedResults) {
      badge.el.style.backgroundColor = this.options.colorForRecommendedResults;
    }
    badge.text(this.resolveTagline(result));

    if ($$(resultElement).hasClass('coveo-card-layout')) {
      const container = $$('div', {
        className: 'coveo-promoted-result-badge-container-card-layout'
      });
      container.insertBefore(resultElement);
      container.append(badge.el);
      container.append(resultElement);
    } else {
      $$(resultElement).prepend(badge.el);
    }

    //return badge;
  }
}

Initialization.registerAutoCreateComponent(RecommendedResultBadge);
