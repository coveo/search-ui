import { $$, Dom } from '../utils/Dom';
import { l } from '../strings/Strings';
import { defaults, findIndex } from 'underscore';
import { Component } from '../ui/Base/Component';
import { Direction, Suggestion } from './SuggestionsManager';
import {
  ResultPreviewsManagerEvents,
  IPopulateSearchResultPreviewsEventArgs,
  IUpdateResultPreviewsManagerOptionsEventArgs
} from '../events/ResultPreviewsManagerEvents';
import { QueryProcessor, ProcessingStatus } from './QueryProcessor';
import { Utils } from '../utils/Utils';

export interface ISearchResultPreview {
  element: HTMLElement;
  onSelect: () => void;
}

export interface IResultPreviewsManagerOptions {
  previewClass: string;
  selectedClass: string;
  previewHeaderText: string;
  previewHeaderFieldText: string;
  timeout: number;
}

export class ResultPreviewsManager {
  private options: IResultPreviewsManagerOptions;
  private suggestionsPreviewContainer: Dom;
  private resultPreviewsHeader: Dom;
  private resultPreviewsContainer: Dom;
  private lastQueriedSuggestion: Suggestion;
  private lastDisplayedSuggestion: Suggestion;
  private previewsProcessor: QueryProcessor<ISearchResultPreview>;
  private lastDelay: Promise<void>;
  private root: HTMLElement;

  public get previewsOwner() {
    return this.lastDisplayedSuggestion;
  }

  public get hasPreviews() {
    return !!this.suggestionsPreviewContainer;
  }

  public get focusedPreviewElement() {
    if (!this.hasPreviews) {
      return null;
    }
    const focusedElement = this.suggestionsPreviewContainer.findClass(this.options.selectedClass)[0];
    if (!focusedElement || !focusedElement.classList.contains(this.options.previewClass)) {
      return null;
    }
    return focusedElement;
  }

  public get previewElements() {
    if (!this.hasPreviews) {
      return [];
    }
    return this.suggestionsPreviewContainer.findClass(this.options.previewClass);
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

  private get previewContainerId() {
    return `coveo-previews-for-${this.lastDisplayedSuggestion.dom.id}`;
  }

  constructor(private element: HTMLElement, options: Partial<IResultPreviewsManagerOptions> = {}) {
    this.options = defaults(options, <IResultPreviewsManagerOptions>{
      previewHeaderText: l('QuerySuggestPreview'),
      previewHeaderFieldText: l('QuerySuggestPreviewWithField'),
      previewClass: 'coveo-preview-selectable',
      selectedClass: 'magic-box-selected'
    });
    this.root = Component.resolveRoot(element);
    this.previewsProcessor = new QueryProcessor({ timeout: this.options.timeout });
  }

  public async displaySearchResultPreviewsForSuggestion(suggestion: Suggestion) {
    const externalOptions = this.getExternalOptions();
    const currentDelay = (this.lastDelay = Utils.resolveAfter(
      Utils.isNullOrUndefined(externalOptions.displayAfterDuration) ? 200 : externalOptions.displayAfterDuration
    ));
    await currentDelay;
    if (currentDelay !== this.lastDelay) {
      return;
    }
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

  public getElementInDirection(direction: Direction) {
    const previewElements = this.previewElements;
    const focusedIndex = previewElements.indexOf(this.focusedPreviewElement);

    if (focusedIndex === -1) {
      return null;
    }

    if (focusedIndex === 0 && direction === Direction.Left) {
      return null;
    }

    return previewElements[(focusedIndex + this.getIncrementInDirection(direction)) % previewElements.length];
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
    this.suggestionsListbox.setAttribute('aria-controls', this.previewContainerId);
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
        className: 'coveo-preview-container',
        id: this.previewContainerId
      },
      (this.resultPreviewsHeader = $$('div', {
        className: 'coveo-preview-header',
        role: 'status'
      })),
      (this.resultPreviewsContainer = $$('div', {
        className: 'coveo-preview-results',
        role: 'listbox',
        'aria-orientation': 'horizontal'
      }))
    ).el;
  }

  private getExternalOptions() {
    const optionsEventArgs: IUpdateResultPreviewsManagerOptionsEventArgs = {};
    $$(this.root).trigger(ResultPreviewsManagerEvents.updateResultPreviewsManagerOptions, optionsEventArgs);
    return optionsEventArgs;
  }

  private getSearchResultPreviewsQuery(suggestion: Suggestion) {
    const populateEventArgs: IPopulateSearchResultPreviewsEventArgs = {
      suggestion,
      previewsQueries: []
    };
    $$(this.root).trigger(ResultPreviewsManagerEvents.populateSearchResultPreviews, populateEventArgs);
    return this.previewsProcessor.processQueries(populateEventArgs.previewsQueries);
  }

  private updateSearchResultPreviewsHeader(suggestion: Suggestion) {
    let text = `${this.options.previewHeaderText} "${suggestion.text}"`;
    if (suggestion.field) {
      text += ` ${this.options.previewHeaderFieldText} "${suggestion.field.values[0]}"`;
    }
    this.resultPreviewsHeader.text(text);
    this.resultPreviewsContainer.setAttribute('summary', text);
  }

  private appendSearchResultPreview(preview: ISearchResultPreview, position: number) {
    this.resultPreviewsContainer.append(preview.element);
    preview.element.id = `coveo-result-preview-${position}`;
    const elementDom = $$(preview.element);
    elementDom.setAttribute('aria-selected', 'false');
    elementDom.setAttribute('role', 'option');
    elementDom.on('click', () => preview.onSelect());
    elementDom.on('keyboardSelect', () => preview.onSelect());
  }

  private appendSearchResultPreviews(previews: ISearchResultPreview[]) {
    this.resultPreviewsContainer.empty();
    previews.forEach((preview, i) => this.appendSearchResultPreview(preview, i));
  }

  private displaySuggestionPreviews(suggestion: Suggestion, previews: ISearchResultPreview[]) {
    this.lastDisplayedSuggestion = suggestion;
    this.setHasPreviews(previews && previews.length > 0);
    this.element.classList.toggle('magic-box-hasPreviews', this.hasPreviews);
    if (!this.hasPreviews) {
      return;
    }
    this.appendSearchResultPreviews(previews);
    this.updateSearchResultPreviewsHeader(suggestion);
  }
}
