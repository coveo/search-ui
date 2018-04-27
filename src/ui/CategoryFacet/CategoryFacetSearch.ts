import { CategoryFacet } from './CategoryFacet';
import { FacetSearchElement } from '../Facet/FacetSearchElement';
import { debounce, last, first } from 'underscore';
import { $$, Dom } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { l } from '../../strings/Strings';
import { IGroupByValue } from '../../rest/GroupByValue';
import { KEYBOARD } from '../../utils/KeyboardUtils';
import 'styling/_CategoryFacetSearch';

export class CategoryFacetSearch {
  public container: Dom | undefined;
  private facetSearchElement: FacetSearchElement;
  private currentlyDisplayedResults: HTMLElement;
  private displayNewValues: () => void;
  private currentResult: Dom | undefined;

  constructor(private categoryFacet: CategoryFacet) {
    this.facetSearchElement = new FacetSearchElement();
    this.displayNewValues = debounce(() => {
      this.facetSearchElement.showFacetSearchWaitingAnimation();
      this.categoryFacet.logger.info('Triggering new Category Facet search');
      this.categoryFacet.categoryFacetQueryController
        .searchFacetValues(this.facetSearchElement.input.value)
        .then((categoryFacetValues: IGroupByValue[]) => {
          if (categoryFacetValues.length == 0) {
            this.noFacetSearchResults();
            return;
          }
          this.withFacetSearchResults();
          $$(this.facetSearchElement.searchResults).empty();
          for (let i = 0; i < categoryFacetValues.length; i++) {
            const searchResult = this.buildFacetSearchValue(categoryFacetValues[i]);
            if (i == 0) {
              this.setAsCurrentResult(searchResult);
            }
            this.facetSearchElement.searchResults.appendChild(searchResult.el);
          }
          this.facetSearchElement.positionSearchResults(
            this.categoryFacet.root,
            this.categoryFacet.element.clientWidth,
            this.facetSearchElement.search
          );
          this.facetSearchElement.hideFacetSearchWaitingAnimation();
        });
    }, this.categoryFacet.options.facetSearchDelay);
    this.categoryFacet.root.addEventListener('click', (e: MouseEvent) => this.handleClickElsewhere(e));
  }

  public build() {
    this.container = $$('div', { className: 'coveo-category-facet-search-container' });

    const search = this.facetSearchElement.build(
      (e: KeyboardEvent) => {
        this.handleKeyboardEvent(e);
      },
      () => {},
      () => this.handleFacetSearchFocus()
    );
    const searchPlaceholder = this.buildfacetSearchPlaceholder();
    this.container.append(search);
    this.container.append(searchPlaceholder.el);
    return this.container;
  }

  public focus() {
    this.facetSearchElement.input.focus();
    this.handleFacetSearchFocus();
  }

  public clear() {
    this.closeSearchInput();
    this.container && this.container.detach();
  }

  private handleFacetSearchFocus() {
    if (this.currentlyDisplayedResults == null) {
      this.displayNewValues();
    }
  }

  private handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.which) {
      case KEYBOARD.ENTER:
        this.keyboardEventEnter();
        break;
      case KEYBOARD.DOWN_ARROW:
        this.moveCurrentResultDown();
        break;
      case KEYBOARD.UP_ARROW:
        this.moveCurrentResultUp();
        break;
      case KEYBOARD.ESCAPE:
        this.closeSearchInput();
        break;
      default:
        this.displayNewValues();
    }
  }

  private moveCurrentResultDown() {
    let nextResult = this.currentResult.el.nextSibling;
    if (!nextResult) {
      nextResult = first(this.facetSearchElement.searchResults.children);
    }
    this.setAsCurrentResult($$(<HTMLElement>nextResult));
  }

  private moveCurrentResultUp() {
    let previousResult = this.currentResult.el.previousSibling;
    if (!previousResult) {
      previousResult = last(this.facetSearchElement.searchResults.children);
    }
    this.setAsCurrentResult($$(<HTMLElement>previousResult));
  }

  private keyboardEventEnter() {
    this.selectCurrentResult();
  }

  private selectCurrentResult() {
    if (this.currentResult) {
      this.categoryFacet.changeActivePath(this.currentResult.el.dataset.path.split('|'));
    }
  }

  private setAsCurrentResult(toSet: Dom) {
    this.currentResult && this.currentResult.removeClass('coveo-category-facet-search-current-value');
    this.currentResult = toSet;
    toSet.addClass('coveo-category-facet-search-current-value');
  }

  private handleClickElsewhere(e: MouseEvent) {
    if (!$$(<HTMLElement>e.target).closest('.coveo-category-facet-search-container')) {
      this.closeSearchInput();
    }
  }

  private closeSearchInput() {
    this.withFacetSearchResults();
    $$(this.categoryFacet.element).removeClass('coveo-category-facet-searching');
    $$(this.facetSearchElement.searchResults).empty();
    this.facetSearchElement.clearSearchInput();
    this.facetSearchElement.hideSearchResultsElement();
  }

  private buildfacetSearchPlaceholder() {
    const placeholder = $$('div', { className: 'coveo-category-facet-search-placeholder' });
    placeholder.on('click', () => {
      $$(this.categoryFacet.element).addClass('coveo-category-facet-searching');
      this.focus();
    });
    const icon = $$('div', { className: 'coveo-category-facet-search-icon' }, SVGIcons.icons.checkboxHookExclusionMore);
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-category-facet-search-icon-svg');

    const label = $$('span', { className: 'coveo-category-facet-search-label' }, l('Search'));

    placeholder.append(icon.el);
    placeholder.append(label.el);
    return placeholder;
  }

  private buildFacetSearchValue(categoryFacetValue: IGroupByValue) {
    const path = categoryFacetValue.value.split('|');
    const pathLastValue = last(path) ? last(path) : '';
    const pathParents = path.slice(0, -1).length != 0 ? `${path.slice(0, -1)}/` : '';

    const value = $$('span', { className: 'coveo-category-facet-search-value-caption' }, last(path));
    const number = $$('span', { className: 'coveo-category-facet-search-value-number' }, categoryFacetValue.numberOfResults.toString(10));
    const pathParentsCaption = $$('span', { className: 'coveo-category-facet-search-path-parents' }, pathParents);
    const pathValue = $$('span', { className: 'coveo-category-facet-search-path-last-value' }, pathLastValue);
    const pathToValueCaption = $$('span', { className: 'coveo-category-facet-search-path' }, pathParentsCaption, pathValue);

    const firstRow = $$('div', { className: 'coveo-category-facet-search-first-row' }, value, number);
    const secondRow = $$('div', { className: 'coveo-category-facet-search-second-row' }, pathToValueCaption);
    const item = $$('li', { className: 'coveo-category-facet-search-value' }, firstRow, secondRow);
    item.el.dataset.path = categoryFacetValue.value;
    item.on('click', () => {
      this.categoryFacet.changeActivePath(categoryFacetValue.value.split('|'));
    });
    item.on('mouseover', (e: MouseEvent) => {
      this.setAsCurrentResult($$(<HTMLElement>e.target));
    });
    return item;
  }

  private noFacetSearchResults() {
    this.facetSearchElement.hideFacetSearchWaitingAnimation();
    this.facetSearchElement.hideSearchResultsElement();
    $$(this.facetSearchElement.search).addClass('coveo-facet-search-no-results');
    $$(this.categoryFacet.element).addClass('coveo-no-results');
  }

  private withFacetSearchResults() {
    this.facetSearchElement.search && $$(this.facetSearchElement.search).removeClass('coveo-facet-search-no-results');
    $$(this.categoryFacet.element).removeClass('coveo-no-results');
  }
}
