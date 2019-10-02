import { $$, Dom } from '../utils/Dom';
import _ = require('underscore');
import { Assert } from '../misc/Assert';
import { defaults } from 'underscore';
import { Component } from '../ui/Base/Component';

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export interface SearchResultPreview {
  dom: HTMLElement;
  onSelect?: () => void;
}

interface ActiveSearchResultPreview extends SearchResultPreview {
  deactivate: () => void;
}

export interface IResultPreviewGridLegacyOptions {
  suggestionWidthPixels?: number;
}

export interface IResultPreviewsGridOptions extends IResultPreviewGridLegacyOptions {
  timeout?: number;
  maximumPreviews?: number;
  loadingMessage?: string;
  selectedClass?: string;
}

type IncomingSearchResultPreviews = Readonly<SearchResultPreview[]>;

/**
 * This class renders a grid of result previews from [`QuerySuggestPreview`]{@link QuerySuggestPreview} inside a given container and allows navigation within it.
 * It waits to receive a first [`SearchResultPreview`]{@link SearchResultPreview} before creating any HTML element.
 */
export class ResultPreviewsGrid {
  private static setPreviewId(element: HTMLElement, id: number) {
    element.dataset.previewId = id.toString();
  }

  private static getPreviewId(element: HTMLElement) {
    return element.dataset.previewId ? parseInt(element.dataset.previewId) : null;
  }

  private resultContainerElements?: {
    container: Dom;
    header: Dom;
    results: Dom;
  };
  private options: IResultPreviewsGridOptions;
  private pendingPreviews: Promise<IncomingSearchResultPreviews>[];
  private pendingPreviewsRejector: Function;
  private currentPreviews: ActiveSearchResultPreview[];
  private keyboardSelectionMode: boolean;

  constructor(private parentContainer: HTMLElement, options: IResultPreviewsGridOptions = {}) {
    this.options = defaults(options, <IResultPreviewsGridOptions>{
      timeout: 2000,
      maximumPreviews: 6,
      selectedClass: 'magic-box-selected'
    });
  }

  private get previewsPerRow() {
    // To account for every CSS that may span previews over multiple rows, this solution was found: https://stackoverflow.com/a/49090306
    if (this.currentPreviews.length === 0) {
      return null;
    }
    const firstVerticalOffset = this.currentPreviews[0].dom.offsetTop;
    const firstIndexOnNextRow = _.findIndex(this.currentPreviews, preview => preview.dom.offsetTop !== firstVerticalOffset);
    return firstIndexOnNextRow !== -1 ? firstIndexOnNextRow : this.currentPreviews.length;
  }

  private get maxPreviewsReached() {
    return this.currentPreviews.length >= this.options.maximumPreviews;
  }

  public receiveLegacyOptions(options: IResultPreviewGridLegacyOptions) {
    Object.keys(this.options).forEach(optionName => (this.options[optionName] = options[optionName] || this.options[optionName]));
  }

  public receiveSearchResultPreviews(
    searchResultPreviews: Array<Promise<IncomingSearchResultPreviews> | IncomingSearchResultPreviews>,
    message?: string
  ): Promise<SearchResultPreview[]> {
    return new Promise((resolve, reject) => {
      const previewsPromises = searchResultPreviews
        .filter(preview => preview)
        .map(preview => (preview instanceof Promise ? preview : Promise.resolve(preview)));
      if (previewsPromises.length === 0) {
        resolve([]);
        return;
      }

      this.showLoadingMessage();

      if (this.pendingPreviewsRejector) {
        this.pendingPreviewsRejector('new request queued');
      }

      this.pendingPreviews = previewsPromises;

      let first = () => {
        if (this.pendingPreviews !== previewsPromises) {
          return;
        }
        this.clearPreviews();
        if (!this.resultContainerElements) {
          this.buildResultsPreviewsContainer();
        }
        this.resultContainerElements.header.text(message);
      };

      previewsPromises.forEach(previews => {
        previews.then(results => {
          if (this.pendingPreviews !== previewsPromises) {
            return;
          }
          if (first) {
            first();
            first = null;
          }
          this.appendSearchResultPreviews(results);
          if (this.maxPreviewsReached) {
            this.pendingPreviews, (this.pendingPreviewsRejector = null);
            resolve(this.currentPreviews);
          }
        });
      });

      this.pendingPreviewsRejector = (message: string) => {
        this.pendingPreviews, (this.pendingPreviewsRejector = null);
        reject(message);
      };

      Promise.all(previewsPromises).then(() => {
        if (this.pendingPreviews !== previewsPromises) {
          return;
        }
        this.pendingPreviews, (this.pendingPreviewsRejector = null);
        resolve(this.currentPreviews);
      });

      setTimeout(() => {
        if (this.pendingPreviews !== previewsPromises) {
          return;
        }
        this.pendingPreviews, (this.pendingPreviewsRejector = null);
        resolve(this.currentPreviews);
      }, this.options.timeout);
    });
  }

  public selectKeyboardFocusedSelection() {
    if (!this.keyboardSelectionMode) {
      return null;
    }
    const selection = this.getSelectedPreview();
    if (!selection) {
      return null;
    }
    this.clearSelection();
    $$(selection.dom).trigger('keyboardSelect');
    return selection as SearchResultPreview;
  }

  public moveFirst() {
    if (!this.currentPreviews || this.currentPreviews.length === 0) {
      return false;
    }
    this.setSelectedPreviewId(0);
    this.keyboardSelectionMode = true;
    return true;
  }

  public moveUp() {
    return (this.keyboardSelectionMode = this.move(Direction.Up));
  }

  public moveDown() {
    return (this.keyboardSelectionMode = this.move(Direction.Down));
  }

  public moveLeft() {
    return (this.keyboardSelectionMode = this.move(Direction.Left));
  }

  public moveRight() {
    return (this.keyboardSelectionMode = this.move(Direction.Right));
  }

  public getSelectedPreviewElement() {
    if (!this.resultContainerElements) {
      return null;
    }
    const selectedElements = this.resultContainerElements.results.findClass(this.options.selectedClass);
    if (!selectedElements || selectedElements.length !== 1) {
      return null;
    }
    return selectedElements[0];
  }

  public clearSelection() {
    const currentSelection = this.getSelectedPreviewElement();
    if (!currentSelection) {
      return;
    }
    this.deselectElement(currentSelection);
  }

  private setSelectedPreviewElement(element: HTMLElement) {
    this.clearSelection();
    if (!element) {
      return;
    }
    element.classList.add(this.options.selectedClass);
  }

  private getSelectedPreviewId() {
    const element = this.getSelectedPreviewElement();
    if (!element) {
      return null;
    }
    return ResultPreviewsGrid.getPreviewId(element);
  }

  private setSelectedPreviewId(id: number) {
    Assert.isLargerOrEqualsThan(0, id);
    Assert.isSmallerThan(this.currentPreviews.length, id);
    if (!this.currentPreviews) {
      return;
    }
    this.setSelectedPreviewElement(this.currentPreviews[id].dom);
  }

  private getSelectedPreview() {
    if (!this.currentPreviews || this.currentPreviews.length === 0) {
      return null;
    }
    const previewId = this.getSelectedPreviewId();
    if (previewId === null) {
      return null;
    }
    return this.currentPreviews[previewId];
  }

  private showLoadingMessage() {
    const { loadingMessage } = this.options;
    if (!loadingMessage) {
      return;
    }
    if (!this.resultContainerElements) {
      return;
    }
    this.resultContainerElements.header.text(loadingMessage);
  }

  private deselectElement(element: HTMLElement) {
    this.keyboardSelectionMode = false;
    element.classList.remove(this.options.selectedClass);
  }

  private clearPreviews() {
    this.keyboardSelectionMode = false;
    if (this.currentPreviews) {
      this.currentPreviews.forEach(preview => preview.deactivate());
    }
    this.currentPreviews = [];
    if (this.resultContainerElements) {
      this.resultContainerElements.results.empty();
    }
  }

  private appendSearchResultPreviews(previews: IncomingSearchResultPreviews) {
    const previewsToAppend =
      this.currentPreviews.length + previews.length > this.options.maximumPreviews
        ? previews.slice(0, this.currentPreviews.length - this.currentPreviews.length)
        : previews;
    previewsToAppend.forEach(preview =>
      this.appendSearchResultPreview({
        dom: preview.dom.cloneNode(true) as HTMLElement,
        onSelect: preview.onSelect
      })
    );
  }

  private appendSearchResultPreview(preview: SearchResultPreview) {
    ResultPreviewsGrid.setPreviewId(preview.dom, this.currentPreviews.length);
    const events: { name: string; funct: (e: Event) => void }[] = [
      {
        name: 'mouseover',
        funct: () => {
          this.keyboardSelectionMode = false;
          this.setSelectedPreviewElement(preview.dom);
        }
      },
      {
        name: 'mouseout',
        funct: () => {
          this.deselectElement(preview.dom);
        }
      },
      {
        name: 'keyboardSelect',
        funct: () => preview.onSelect && preview.onSelect()
      }
    ];
    events.forEach(event => $$(preview.dom).on(event.name, event.funct));
    const activePreview: ActiveSearchResultPreview = {
      ...preview,
      deactivate: () => events.forEach(event => preview.dom.removeEventListener(event.name, event.funct))
    };
    this.currentPreviews.push(activePreview);
    this.resultContainerElements.results.append(preview.dom);
  }

  private buildResultsPreviewsContainer() {
    const container = $$('div', { className: 'coveo-preview-container' });
    const header = $$('div', { className: 'coveo-preview-header' });
    container.append(header.el);
    const results = $$('div', { className: 'coveo-preview-results' });
    container.append(results.el);
    this.resultContainerElements = {
      container,
      header,
      results
    };
    this.parentContainer.appendChild(container.el);

    // Legacy support
    const { suggestionWidthPixels } = this.options;
    if (suggestionWidthPixels) {
      const suggestionsElement = $$(Component.resolveRoot(this.parentContainer)).findId('coveo-magicbox-suggestions');
      if (suggestionsElement) {
        suggestionsElement.style.width = `${suggestionWidthPixels}px`;
      }
    }
  }

  private move(direction: Direction) {
    const currentSelectionId = this.getSelectedPreviewId();
    if (currentSelectionId === null) {
      return false;
    }
    const totalLength = this.currentPreviews.length;
    const rowLength = this.previewsPerRow;
    switch (direction) {
      case Direction.Left:
        if (currentSelectionId === 0) {
          return false;
        }
        if (currentSelectionId % rowLength === 0) {
          return false;
        }
        this.setSelectedPreviewId(currentSelectionId - 1);
        return true;
      case Direction.Right:
        if (currentSelectionId === totalLength - 1) {
          return false;
        }
        if (currentSelectionId % rowLength === rowLength - 1) {
          return false;
        }
        this.setSelectedPreviewId(currentSelectionId + 1);
        return true;
      case Direction.Up:
        if (currentSelectionId - rowLength < 0) {
          return false;
        }
        this.setSelectedPreviewId(currentSelectionId - rowLength);
        return true;
      case Direction.Down:
        if (currentSelectionId + rowLength >= totalLength) {
          return false;
        }
        this.setSelectedPreviewId(currentSelectionId + rowLength);
        return true;
    }
  }
}
