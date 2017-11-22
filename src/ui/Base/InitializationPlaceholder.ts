import { $$, Dom } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import * as _ from 'underscore';
import 'styling/_InitializationPlaceholder';
import { QueryEvents } from '../../events/QueryEvents';
import { InitializationEvents } from '../../events/InitializationEvents';
import { ResultListEvents } from '../../events/ResultListEvents';
import { HashUtils } from '../../utils/HashUtils';

export interface InitializationPlaceholderOption {
  searchInterface?: boolean;
  facet?: boolean;
  searchbox?: boolean;
  resultList?: boolean;
  layout?: string;
  waitingForFirstQueryMode?: boolean;
}

export class InitializationPlaceholder {
  public facetPlaceholder = `<div class="coveo-placeholder-title"></div>
    <div class="coveo-facet-placeholder-line">
      <div class="coveo-facet-placeholder-checkbox"></div>
      <div class="coveo-placeholder-text"></div>
    </div>
    <div class="coveo-facet-placeholder-line">
      <div class="coveo-facet-placeholder-checkbox"></div>
      <div class="coveo-placeholder-text"></div>
    </div>
    <div class="coveo-facet-placeholder-line">
      <div class="coveo-facet-placeholder-checkbox"></div>
      <div class="coveo-placeholder-text"></div>
    </div>
    <div class="coveo-facet-placeholder-line">
      <div class="coveo-facet-placeholder-checkbox"></div>
      <div class="coveo-placeholder-text"></div>
    </div>
    <div class="coveo-facet-placeholder-line">
      <div class="coveo-facet-placeholder-checkbox"></div>
      <div class="coveo-placeholder-text"></div>
    </div>`;

  public resultListPlaceholder = `<div class="coveo-result-frame coveo-placeholder-result">
  <div class="coveo-result-row">
    <div class="coveo-result-cell" style="width:85px;text-align:center;">
      <div class="coveo-placeholder-icon"></div>
    </div>
    <div class="coveo-result-cell" style="padding-left:15px;">
      <div class="coveo-result-row">
        <div class="coveo-result-cell">
          <div class="coveo-placeholder-title" style="width: 60%"></div>
        </div>
        <div class="coveo-result-cell" style="width:120px; text-align:right;">
          <div class="coveo-placeholder-text" style="width: 80%"></div>
        </div>
      </div>
      <div class="coveo-result-row">
        <div class="coveo-result-cell">
          <div class="coveo-placeholder-text" style="width: 70%"></div>
          <div class="coveo-placeholder-text" style="width: 90%"></div>
          <div class="coveo-placeholder-text" style="width: 60%"></div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  public cardResultListPlaceholder = `<div class="coveo-card-layout coveo-placeholder-result CoveoResult">
  <div class="coveo-result-frame">
    <div class="coveo-result-row" style="margin-bottom: 20px;">
      <div class="coveo-result-cell" style="width: 32px; vertical-align: middle;">
        <div class="coveo-placeholder-icon-small"></div>
      </div>
      <div class="coveo-result-cell" style="text-align:left; padding-left: 10px; vertical-align: middle;">
        <div class="coveo-placeholder-title" style="width: 60%"></div>
      </div>
    </div>
    <div class="coveo-result-row" style="margin-bottom: 20px;">
      <div class="coveo-result-cell">
        <div class="coveo-placeholder-text" style="width: 70%"></div>
        <div class="coveo-placeholder-text" style="width: 90%"></div>
        <div class="coveo-placeholder-text" style="width: 60%"></div>
      </div>
      <div class="coveo-result-cell">
        <div class="coveo-placeholder-text" style="width: 90%"></div>
        <div class="coveo-placeholder-text" style="width: 70%"></div>
        <div class="coveo-placeholder-text" style="width: 60%"></div>
      </div>
    </div>
    <div class="coveo-result-row">
      <div class="coveo-result-cell">
        <div class="coveo-placeholder-text" style="width: 90%"></div>
          <div class="coveo-placeholder-text" style="width: 100%"></div>
      </div>
    </div>
  </div>
</div>
`;

  public recommendationResultListPlaceholder = `<div class="coveo-result-frame coveo-placeholder-result">
  <div class="coveo-result-row">
    <div class="coveo-result-cell" style="width: 32px; vertical-align: middle;">
        <div class="coveo-placeholder-icon-small"></div>
      </div>
    <div class="coveo-result-cell" style="padding-left:10px; vertical-align: middle;">
      <div class="coveo-result-row">
        <div class="coveo-result-cell">
          <div class="coveo-placeholder-title" style="width: 90%"></div>
        </div>
      </div>
    </div>
  </div>
  `;

  public static NUMBER_OF_FACETS = 3;
  public static NUMBER_OF_RESULTS = 10;
  public static NUMBER_OF_RESULTS_RECOMMENDATION = 5;
  public static INITIALIZATION_CLASS = 'coveo-during-initialization';

  private eventToRemovePlaceholder = InitializationEvents.afterComponentsInitialization;

  constructor(public root: HTMLElement) {}

  public withEventToRemovePlaceholder(event: string) {
    this.eventToRemovePlaceholder = event;
    return this;
  }

  public withFullInitializationStyling() {
    $$(this.root).addClass(InitializationPlaceholder.INITIALIZATION_CLASS);
    $$(this.root).one(this.eventToRemovePlaceholder, () => {
      $$(this.root).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS);
    });
    return this;
  }

  public withHiddenRootElement() {
    $$(this.root).addClass('coveo-hidden');
    return this;
  }

  public withVisibleRootElement() {
    $$(this.root).removeClass('coveo-hidden');
    return this;
  }

  public withWaitingForFirstQueryMode() {
    $$(this.root).addClass('coveo-waiting-for-query');
    $$(this.root).one(QueryEvents.duringQuery, () => {
      $$(this.root).removeClass('coveo-waiting-for-query');
    });

    return this;
  }

  public withAllPlaceholders() {
    this.withPlaceholderForFacets();
    this.withPlaceholderForResultList();
    this.withPlaceholderSearchbox();
    return this;
  }

  public withPlaceholderForFacets() {
    // Render an arbitrary number of placeholder facet.
    // Facets should become usable on the first deferredQuerySuccess

    const facetElements = this.getAllFacetsElements();
    if (Utils.isNonEmptyArray(facetElements)) {
      const placeholders: Dom[] = [];
      _.each(facetElements, (facetElement: HTMLElement) => $$(facetElement).addClass(InitializationPlaceholder.INITIALIZATION_CLASS));
      _.each(_.first(facetElements, InitializationPlaceholder.NUMBER_OF_FACETS), (facetElement: HTMLElement) => {
        $$(facetElement).addClass('coveo-with-placeholder');
        const placeHolder = $$('div', { className: 'coveo-facet-placeholder' }, this.facetPlaceholder);
        facetElement.appendChild(placeHolder.el);
        placeholders.push(placeHolder);
      });

      $$(this.root).one(this.eventToRemovePlaceholder, () => {
        const toExecuteAfterInitialization = () => {
          _.each(placeholders, (placeholder: Dom) => placeholder.remove());
          _.each(facetElements, (facetElement: HTMLElement) =>
            $$(facetElement).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS)
          );
          _.each(facetElements, (facetElement: HTMLElement) => $$(facetElement).removeClass('coveo-with-placeholder'));
        };
        $$(this.root).one(QueryEvents.queryError, () => toExecuteAfterInitialization());
        $$(this.root).one(QueryEvents.deferredQuerySuccess, () => toExecuteAfterInitialization());
      });
    }
    return this;
  }

  public withPlaceholderSearchbox() {
    // Searchbox should be good/usable afterComponentsInitialization
    // Create a placeholder until we reach that event.

    const searchBoxElements = $$(this.root).findAll('.CoveoSearchbox');
    if (Utils.isNonEmptyArray(searchBoxElements)) {
      _.each(searchBoxElements, el => {
        $$(el).addClass(InitializationPlaceholder.INITIALIZATION_CLASS);
      });
      $$(this.root).one(this.eventToRemovePlaceholder, () => {
        _.each(searchBoxElements, (el: HTMLElement) => $$(el).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS));
      });
    }

    return this;
  }

  public withPlaceholderForResultList() {
    // Render an arbitrary number of placeholder in the first result list we find
    // When we get the first newResultDisplayedEvent, the result list should be usable.

    const resultListsElements = $$(this.root).findAll('.CoveoResultList');
    if (Utils.isNonEmptyArray(resultListsElements)) {
      _.each(resultListsElements, el => $$(el).addClass(InitializationPlaceholder.INITIALIZATION_CLASS));

      const { placeholderToUse, resultListToUse, rootToUse } = this.determineResultListPlaceholder(resultListsElements);
      $$(resultListToUse).append(rootToUse);
      $$(resultListToUse).addClass('coveo-with-placeholder');

      _.times(
        this.isRecommendationRoot()
          ? InitializationPlaceholder.NUMBER_OF_RESULTS_RECOMMENDATION
          : InitializationPlaceholder.NUMBER_OF_RESULTS,
        () => {
          rootToUse.innerHTML += placeholderToUse;
        }
      );
      const reset = () => {
        $$(rootToUse).remove();
        _.each(resultListsElements, el => $$(el).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS));
        $$(resultListToUse).removeClass('coveo-with-placeholder');
      };
      $$(this.root).one(ResultListEvents.newResultDisplayed, () => reset());
      $$(this.root).one(QueryEvents.queryError, () => reset());
      $$(this.root).one(QueryEvents.noResults, () => reset());
    }

    return this;
  }

  private determineResultListPlaceholder(resultListElements: HTMLElement[]) {
    let currentLayout;
    if (resultListElements.length > 1) {
      currentLayout = HashUtils.getValue('layout', HashUtils.getHash());
    } else if (resultListElements.length == 1) {
      currentLayout = resultListElements[0].getAttribute('data-layout');
    }

    if (!currentLayout) {
      currentLayout = 'list';
    }

    if (resultListElements.length > 1) {
      let resultListElement = _.find(resultListElements, resultListElement => {
        return resultListElement.getAttribute('data-layout') == currentLayout;
      });
      if (!resultListElement) {
        // No data-layout default to list
        resultListElement = _.find(resultListElements, resultListElement => {
          return resultListElement.getAttribute('data-layout') == null;
        });
      }
      if (!resultListElement) {
        // Last fallback
        resultListElement = _.first(resultListElements);
      }
      return {
        placeholderToUse: this.determineResultListFromLayout(currentLayout),
        resultListToUse: resultListElement,
        rootToUse: this.determineRootFromLayout(currentLayout)
      };
    } else if (resultListElements.length == 1) {
      return {
        placeholderToUse: this.determineResultListFromLayout(currentLayout),
        resultListToUse: resultListElements[0],
        rootToUse: this.determineRootFromLayout(currentLayout)
      };
    } else {
      return null;
    }
  }

  private determineResultListFromLayout(layout: string) {
    switch (layout) {
      case 'list':
        if (this.isRecommendationRoot()) {
          return this.recommendationResultListPlaceholder;
        } else {
          return this.resultListPlaceholder;
        }
      case 'card':
        return this.cardResultListPlaceholder;
      default:
        return this.resultListPlaceholder;
    }
  }

  private determineRootFromLayout(layout: string): HTMLElement {
    switch (layout) {
      case 'list':
        return $$('div').el;
      case 'card':
        return $$('div', { className: 'coveo-result-list-container coveo-card-layout-container' }).el;
      default:
        return $$('div').el;
    }
  }

  private isRecommendationRoot(): boolean {
    return $$(this.root).hasClass('CoveoRecommendation');
  }

  private getAllFacetsElements(): HTMLElement[] {
    let facetElements = $$(this.root).findAll('.CoveoFacet');
    facetElements = facetElements.concat($$(this.root).findAll('.CoveoFacetRange'));
    facetElements = facetElements.concat($$(this.root).findAll('.CoveoFacetSlider'));
    facetElements = facetElements.concat($$(this.root).findAll('.CoveoHierarchicalFacet'));
    return facetElements;
  }
}
