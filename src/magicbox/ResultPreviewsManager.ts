import { $$, Dom } from '../utils/Dom';
import { l } from '../strings/Strings';
import { defaults, findIndex } from 'lodash';
import { Component } from '../ui/Base/Component';
import { Direction } from './SuggestionsManager';

export interface IPopulateSearchResultPreviewsEventArgs {
  suggestionText: string;
  previewsQuery: Promise<ISearchResultPreview[]>;
}

export enum ResultPreviewsManagerEvents {
  PopulateSearchResultPreviews = 'populateSearchResultPreviews'
}

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
  private suggestionsPreviewContainer: Dom;
  private resultPreviewsHeader: Dom;
  private resultPreviewsContainer: Dom;
  private lastPreviewsQuery: Promise<ISearchResultPreview[]>;
  private lastSelectedSuggestion: HTMLElement;
  private root: HTMLElement;

  public get previewsOwner() {
    return this.lastSelectedSuggestion;
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

  constructor(private element: HTMLElement, options: Partial<IResultPreviewsManagerOptions> = {}) {
    this.options = defaults(options, <IResultPreviewsManagerOptions>{
      previewHeaderText: l('QuerySuggestPreview'),
      previewClass: 'coveo-preview-selectable',
      selectedClass: 'magic-box-selected'
    });
    this.root = Component.resolveRoot(element);
  }

  public async displaySearchResultPreviewsForSuggestion(suggestion: HTMLElement) {
    if (this.lastSelectedSuggestion !== suggestion) {
      await this.loadSearchResultPreviews(suggestion);
    }
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

  private getSearchResultPreviewsQuery(suggestion: HTMLElement) {
    if (!suggestion) {
      return Promise.resolve([]);
    }
    const populateEventArgs: IPopulateSearchResultPreviewsEventArgs = {
      suggestionText: suggestion.innerText,
      previewsQuery: null
    };
    $$(this.root).trigger(ResultPreviewsManagerEvents.PopulateSearchResultPreviews, populateEventArgs);
    return populateEventArgs.previewsQuery;
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

  private displaySuggestionPreviews(suggestion: HTMLElement, previews: ISearchResultPreview[]) {
    this.setHasPreviews(previews && previews.length > 0);
    this.element.classList.toggle('magic-box-hasPreviews', this.hasPreviews);
    this.lastPreviewsQuery = null;
    this.lastSelectedSuggestion = suggestion;
    if (!this.hasPreviews) {
      return;
    }
    this.appendSearchResultPreviews(previews);
    this.updateSearchResultPreviewsHeader(`${this.options.previewHeaderText} "${suggestion.innerText}"`);
  }

  private async loadSearchResultPreviews(suggestion: HTMLElement) {
    const query = (this.lastPreviewsQuery = this.getSearchResultPreviewsQuery(suggestion));
    const previews = await this.lastPreviewsQuery;
    if (this.lastPreviewsQuery !== query) {
      return;
    }
    this.displaySuggestionPreviews(suggestion, previews);
  }
}
