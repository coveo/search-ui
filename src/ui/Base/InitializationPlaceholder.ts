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

  public static NUMBER_OF_FACETS = 3;
  public static NUMBER_OF_RESULTS = 10;
  public static INITIALIZATION_CLASS = 'coveo-during-initialization';

  constructor(public root: HTMLElement, public options: InitializationPlaceholderOption = {
    facet: true,
    searchbox: true,
    resultList: true,
    searchInterface: true
  }) {
    if (options.searchInterface) {
      $$(this.root).addClass(InitializationPlaceholder.INITIALIZATION_CLASS);
    }
    if (options.facet) {
      this.createPlaceholderForFacets();
    }
    if (options.searchbox) {
      this.createPlaceholderSearchbox();
    }
    if (options.resultList) {
      this.createPlaceholderForResultList();
    }
    if (options.searchbox) {
      $$(this.root).one(InitializationEvents.afterComponentsInitialization, () => {
        $$(this.root).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS);
      });
    }

  }
  private createPlaceholderForFacets() {
    // Render an arbitrary number of placeholder facet.
    // Facets should become usable on the first deferredQuerySuccess

    let facetElements = $$(this.root).findAll('.CoveoFacet');
    facetElements = facetElements.concat($$(this.root).findAll('.CoveoFacetRange'));
    facetElements = facetElements.concat($$(this.root).findAll('.CoveoFacetSlider'));
    facetElements = facetElements.concat($$(this.root).findAll('.CoveoHierarchicalFacet'));

    if (Utils.isNonEmptyArray(facetElements)) {
      const placeholders: Dom[] = [];
      _.each(facetElements, (facetElement: HTMLElement) => $$(facetElement).addClass(InitializationPlaceholder.INITIALIZATION_CLASS));
      _.each(_.first(facetElements, InitializationPlaceholder.NUMBER_OF_FACETS), (facetElement: HTMLElement) => {
        $$(facetElement).addClass('coveo-with-placeholder');
        const placeHolder = $$('div', { className: 'coveo-facet-placeholder' }, this.facetPlaceholder);
        facetElement.appendChild(placeHolder.el);
        placeholders.push(placeHolder);
      });

      $$(this.root).one(InitializationEvents.afterComponentsInitialization, ()=> {
        $$(this.root).one(QueryEvents.deferredQuerySuccess, () => {
          _.each(placeholders, (placeholder: Dom) => placeholder.remove());
          _.each(facetElements, (facetElement: HTMLElement) => $$(facetElement).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS));
          _.each(facetElements, (facetElement: HTMLElement) => $$(facetElement).removeClass('coveo-with-placeholder'));
        });
      });
    }
  }

  private createPlaceholderSearchbox() {
    // Searchbox should be good/usable afterComponentsInitialization
    // Create a placeholder until we reach that event.

    const searchBoxElements = $$(this.root).findAll('.CoveoSearchbox');
    if (Utils.isNonEmptyArray(searchBoxElements)) {
      _.each(searchBoxElements, (el) => {
        $$(el).addClass(InitializationPlaceholder.INITIALIZATION_CLASS);
      });
      $$(this.root).one(InitializationEvents.afterComponentsInitialization, () => {
        _.each(searchBoxElements, (el: HTMLElement) => $$(el).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS));
      });
    }
  }

  private createPlaceholderForResultList() {
    // Render an arbitrary number of placeholder in the first result list we find
    // When we get the first newResultDisplayedEvent, the result list should be usable.

    const resultListsElements = $$(this.root).findAll('.CoveoResultList');
    if (Utils.isNonEmptyArray(resultListsElements)) {
      _.each(resultListsElements, el => $$(el).addClass(InitializationPlaceholder.INITIALIZATION_CLASS));

      const { placeholderToUse, resultListToUse, rootToUse } = this.determineResultListPlaceholder(resultListsElements);
      $$(resultListToUse).append(rootToUse);
      $$(resultListToUse).addClass('coveo-with-placeholder');

      _.times(InitializationPlaceholder.NUMBER_OF_RESULTS, () => {
        rootToUse.innerHTML += placeholderToUse;
      });
      const reset = () => {
        $$(rootToUse).remove();
        _.each(resultListsElements, el => $$(el).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS));
        $$(resultListToUse).removeClass('coveo-with-placeholder');
      };
      $$(this.root).one(ResultListEvents.newResultDisplayed, () => reset());
      $$(this.root).one(QueryEvents.queryError, () => reset());
      $$(this.root).one(QueryEvents.noResults, () => reset());
    }
  }

  private determineResultListPlaceholder(resultListElements: HTMLElement[]) {
    let currentLayout;
    if (this.options.layout) {
      currentLayout = this.options.layout;
    } else if (resultListElements.length > 1) {
      currentLayout = HashUtils.getValue('layout', HashUtils.getHash());
    } else {
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
        placeholderToUse: this.determinerResultListFromLayout(currentLayout),
        resultListToUse: resultListElement,
        rootToUse: this.determineRootFromLayout(currentLayout)
      };
    } else {
      return {
        placeholderToUse: this.determinerResultListFromLayout(currentLayout),
        resultListToUse: resultListElements[0],
        rootToUse: this.determineRootFromLayout(currentLayout)
      };
    }
  }

  private determinerResultListFromLayout(layout: string) {
    switch (layout) {
      case 'list':
        return this.resultListPlaceholder;
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
}

