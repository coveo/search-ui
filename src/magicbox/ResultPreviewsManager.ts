import { $$, Dom } from '../utils/Dom';
import { l } from '../strings/Strings';
import { defaults, findIndex, find } from 'lodash';
import { Component } from '../ui/Base/Component';
import { Direction, Suggestion } from './SuggestionsManager';
import { ResultPreviewsManagerEvents, IPopulateSearchResultPreviewsEventArgs } from '../events/ResultPreviewsManagerEvents';
import { QueryProcessor, ProcessingStatus } from './QueryProcessor';

export interface ISearchResultPreview {
  element: HTMLElement;
  onSelect: () => void;
}

export interface IResultPreviewsManagerOptions {
  previewClass: string;
  selectedClass: string;
  previewHeaderText: string;
}

export class ResultPreviewsManager {
  private options: IResultPreviewsManagerOptions;
  private displayedPreviews: ISearchResultPreview[];
  private suggestionsPreviewContainer: Dom;
  private resultPreviewsHeader: Dom;
  private resultPreviewsContainer: Dom;
  private lastQueriedSuggestion: Suggestion;
  private lastDisplayedSuggestion: Suggestion;
  private previewsProcessor: QueryProcessor<ISearchResultPreview>;
  private root: HTMLElement;

  public get previewsOwner() {
    return this.lastDisplayedSuggestion;
  }

  public get hasPreviews() {
    return !!this.suggestionsPreviewContainer;
  }

  public get focusedPreview() {
    if (!this.hasPreviews) {
      return null;
    }
    return find(this.displayedPreviews, preview => preview.element.classList.contains(this.options.selectedClass));
  }

  public get previews() {
    return this.displayedPreviews;
  }

  private get suggestionsListbox() {
    return $$($$(this.element).findClass('coveo-magicbox-suggestions')[0]);
  }

  private get numberOfResultsPerRow() {
    const previewSelectables = this.suggestionsPreviewContainer.findClass(this.options.previewClass);
    if (previewSelectables.length === 0) {
      return 0;
    }
    const firstVerticalOffset = previewSelectables[0].offsetTop;
    const firstIndexOnNextRow = findIndex(previewSelectables, previewSelectable => previewSelectable.offsetTop !== firstVerticalOffset);
    return firstIndexOnNextRow !== -1 ? firstIndexOnNextRow : previewSelectables.length;
  }

  constructor(private element: HTMLElement, options: Partial<IResultPreviewsManagerOptions> = {}) {
    this.options = defaults(options, <IResultPreviewsManagerOptions>{
      previewHeaderText: l('QuerySuggestPreview'),
      previewClass: 'coveo-preview-selectable',
      selectedClass: 'magic-box-selected'
    });
    this.root = Component.resolveRoot(element);
    this.displayedPreviews = [];
    this.previewsProcessor = new QueryProcessor();
  }

  public async displaySearchResultPreviewsForSuggestion(suggestion: Suggestion) {
    const isQueryForSuggestionOngoing = suggestion && this.lastQueriedSuggestion === suggestion;
    if (isQueryForSuggestionOngoing) {
      return;
    }
    const arePreviewsForSuggestionCurrentlyDisplayed = this.lastDisplayedSuggestion === suggestion;
    if (arePreviewsForSuggestionCurrentlyDisplayed) {
      this.previewsProcessor.overrideIfProcessing();
      this.lastQueriedSuggestion = null;
      return;
    }
    this.lastQueriedSuggestion = suggestion;
    if (!suggestion) {
      this.displaySuggestionPreviews(null, []);
      return;
    }
    const { status, results } = await this.getSearchResultPreviewsQuery(suggestion);
    if (status === ProcessingStatus.Overriden) {
      return;
    }
    this.lastQueriedSuggestion = null;
    this.displaySuggestionPreviews(suggestion, results);
  }

  public getPreviewInDirection(direction: Direction) {
    const previews = this.previews;
    const focusedIndex = previews.indexOf(this.focusedPreview);

    if (focusedIndex === -1) {
      return null;
    }

    if (focusedIndex === 0 && direction === Direction.Left) {
      return null;
    }

    return previews[(focusedIndex + this.getIncrementInDirection(direction)) % previews.length];
  }

  private getIncrementInDirection(direction: Direction) {
    switch (direction) {
      case Direction.Left:
        return -1;
      case Direction.Right:
        return 1;
      case Direction.Up:
        return -this.numberOfResultsPerRow;
      case Direction.Down:
        return this.numberOfResultsPerRow;
    }
  }

  private setHasPreviews(shouldHavePreviews: boolean) {
    if (this.hasPreviews === !!shouldHavePreviews) {
      return;
    }
    if (shouldHavePreviews) {
      this.initPreviewForSuggestions();
    } else {
      this.revertPreviewForSuggestions();
    }
  }

  private initPreviewForSuggestions() {
    this.suggestionsPreviewContainer = $$(
      'div',
      {
        className: 'coveo-suggestion-container'
      },
      this.suggestionsListbox.el,
      this.buildPreviewContainer()
    );
    this.element.appendChild(this.suggestionsPreviewContainer.el);
  }

  private revertPreviewForSuggestions() {
    this.element.appendChild(this.suggestionsListbox.el);
    this.suggestionsPreviewContainer.remove();
    this.suggestionsPreviewContainer = null;
  }

  private buildPreviewContainer() {
    return $$(
      'div',
      {
        className: 'coveo-preview-container'
      },
      (this.resultPreviewsHeader = $$('div', {
        className: 'coveo-preview-header'
      })),
      (this.resultPreviewsContainer = $$('div', {
        className: 'coveo-preview-results'
      }))
    ).el;
  }

  private getSearchResultPreviewsQuery(suggestion: Suggestion) {
    const populateEventArgs: IPopulateSearchResultPreviewsEventArgs = {
      suggestionText: suggestion.text,
      previewsQueries: []
    };
    $$(this.root).trigger(ResultPreviewsManagerEvents.PopulateSearchResultPreviews, populateEventArgs);
    return this.previewsProcessor.processQueries(populateEventArgs.previewsQueries);
  }

  private updateSearchResultPreviewsHeader(text: string) {
    this.resultPreviewsHeader.text(text);
  }

  private appendSearchResultPreview(preview: ISearchResultPreview, widthPercentage: number) {
    preview.element.style.flex = `0 0 ${widthPercentage}%`;
    this.resultPreviewsContainer.append(preview.element);
    const elementDom = $$(preview.element);
    elementDom.on('click', () => preview.onSelect());
    elementDom.on('keyboardSelect', () => preview.onSelect());
  }

  private appendSearchResultPreviews(previews: ISearchResultPreview[]) {
    this.resultPreviewsContainer.empty();
    previews.forEach(preview => this.appendSearchResultPreview(preview, previews.length % 3 === 0 ? 33 : 50));
  }

  private displaySuggestionPreviews(suggestion: Suggestion, previews: ISearchResultPreview[]) {
    this.setHasPreviews(previews && previews.length > 0);
    this.element.classList.toggle('magic-box-hasPreviews', this.hasPreviews);
    this.lastDisplayedSuggestion = suggestion;
    this.displayedPreviews = previews;
    if (!this.hasPreviews) {
      return;
    }
    this.appendSearchResultPreviews(previews);
    this.updateSearchResultPreviewsHeader(`${this.options.previewHeaderText} "${suggestion.text}"`);
  }
}
