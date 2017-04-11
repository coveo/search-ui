import { $$, Dom } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import * as _ from 'underscore';
import 'styling/_InitializationPlaceholder';
import { QueryEvents } from '../../events/QueryEvents';
import { InitializationEvents } from '../../events/InitializationEvents';
import { ResultListEvents } from '../../events/ResultListEvents';

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

  public static NUMBER_OF_FACETS = 3;
  public static NUMBER_OF_RESULTS = 10;
  public static INITIALIZATION_CLASS = 'coveo-during-initialization';

  constructor(public root: HTMLElement) {
    $$(this.root).addClass(InitializationPlaceholder.INITIALIZATION_CLASS);
    this.createPlaceholderForFacets();
    this.createPlaceholderSearchbox();
    this.createPlaceholderForResultList();
    $$(this.root).one(InitializationEvents.afterComponentsInitialization, () => {
      $$(this.root).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS);
    });
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

      $$(this.root).one(QueryEvents.deferredQuerySuccess, () => {
        _.each(placeholders, (placeholder: Dom) => placeholder.remove());
        _.each(facetElements, (facetElement: HTMLElement) => $$(facetElement).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS));
        _.each(facetElements, (facetElement: HTMLElement) => $$(facetElement).removeClass('coveo-with-placeholder'));
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
      const firstResultList = <HTMLElement>_.first(resultListsElements);
      const placeholders: Dom[] = [];


      _.times(InitializationPlaceholder.NUMBER_OF_RESULTS, () => {
        const placeholder = $$('div', undefined, this.resultListPlaceholder);
        placeholders.push(placeholder);
        firstResultList.appendChild(placeholder.el);
      });
      $$(this.root).one(ResultListEvents.newResultDisplayed, () => {
        _.each(placeholders, placeholder => placeholder.remove());
        _.each(resultListsElements, el => $$(el).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS));
      });
    }
  }
}

