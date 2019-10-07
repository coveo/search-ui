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
  selectedClass?: string;
}

type ReceivedSearchResultPreview = Readonly<SearchResultPreview>;

type ReceivedSearchResultPreviews = Readonly<ReceivedSearchResultPreview[]>;

/**
 * This class renders a grid of result previews from [`QuerySuggestPreview`]{@link QuerySuggestPreview} inside a given container and allows navigation within it.
 * It waits to receive a first [`SearchResultPreview`]{@link SearchResultPreview} before creating any HTML element.
 */
export class ResultPreviewsGrid {
  public static ContainerClassName = 'coveo-preview-container';
  public static HeaderClassName = 'coveo-preview-header';
  public static ResultsContainerClassName = 'coveo-preview-results';

  private static setPreviewId(element: HTMLElement, id: number) {
    element.dataset.previewId = id.toString();
  }

  private static getPreviewId(element: HTMLElement) {
    return element.dataset.previewId ? parseInt(element.dataset.previewId) : null;
  }

  private resultContainerElements?: {
    container: Dom;
    status: Dom;
    results: Dom;
  };
  private options: IResultPreviewsGridOptions;
  private queryProcessingRejector: Function;
  private activePreviews: ActiveSearchResultPreview[];
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
    if (this.activePreviews.length === 0) {
      return null;
    }
    const firstVerticalOffset = this.activePreviews[0].dom.offsetTop;
    const firstIndexOnNextRow = _.findIndex(this.activePreviews, preview => preview.dom.offsetTop !== firstVerticalOffset);
    return firstIndexOnNextRow !== -1 ? firstIndexOnNextRow : this.activePreviews.length;
  }

  public receiveLegacyOptions(options: IResultPreviewGridLegacyOptions) {
    Object.keys(this.options).forEach(optionName => (this.options[optionName] = options[optionName] || this.options[optionName]));
  }

  /**
   * Waits for one of the following conditions to be true then creates a container and fills it with the results.
   * 1. No query was given
   * 2. All queries were completed
   * 3. Enough queries were completed to fill the maximum previews
   * 4. [`timeout`]{@link ResultPreviewsGrid.options.timeout} has passed
   * If the function is called again while it's still processing, the previous call is cancelled and overriden by the new one.
   */
  public receiveSearchResultPreviews(
    variantSearchResultPreviewsQueries: Array<Promise<ReceivedSearchResultPreviews> | ReceivedSearchResultPreviews>,
    getCompletionMessage?: ((activePreviews: SearchResultPreview[]) => string) | void
  ): Promise<SearchResultPreview[]> {
    return new Promise((resolve, reject) => {
      if (this.queryProcessingRejector) {
        this.queryProcessingRejector('new request queued');
      }

      const currentQueries = variantSearchResultPreviewsQueries
        .filter(preview => preview)
        .map(preview => (preview instanceof Promise ? preview : Promise.resolve(preview)));

      const receivedPreviews: ReceivedSearchResultPreview[] = [];
      let numOfUnresolvedQueries: number = currentQueries.length;

      const showAndReturn = () => {
        this.queryProcessingRejector = null;
        if (!this.resultContainerElements) {
          this.buildResultsPreviewsContainer();
        }
        this.clearPreviews();
        this.appendSearchResultPreviews(receivedPreviews);
        this.setStatusMessage(getCompletionMessage ? <string>getCompletionMessage(this.activePreviews) : null);
        resolve(this.activePreviews);
      };

      if (numOfUnresolvedQueries === 0) {
        showAndReturn();
        return;
      }

      this.setStatusMessage();

      const rejector = (this.queryProcessingRejector = (message: string) => {
        this.queryProcessingRejector = null;
        reject(message);
      });

      currentQueries.forEach(previews => {
        previews
          .then(results => {
            if (rejector !== this.queryProcessingRejector) {
              return;
            }
            if (this.options.maximumPreviews && receivedPreviews.length + results.length > this.options.maximumPreviews) {
              receivedPreviews.push(...results.slice(0, this.options.maximumPreviews - receivedPreviews.length));
              showAndReturn();
              return;
            } else {
              receivedPreviews.push(...results);
            }
          })
          .finally(() => {
            if (rejector !== this.queryProcessingRejector) {
              return;
            }
            numOfUnresolvedQueries -= 1;
            if (numOfUnresolvedQueries === 0) {
              showAndReturn();
            }
          });
      });

      setTimeout(() => {
        if (rejector !== this.queryProcessingRejector) {
          return;
        }
        showAndReturn();
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
    if (!this.activePreviews || this.activePreviews.length === 0) {
      return (this.keyboardSelectionMode = false);
    }
    this.setSelectedPreviewId(0);
    return (this.keyboardSelectionMode = true);
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
    Assert.isSmallerThan(this.activePreviews.length, id);
    if (!this.activePreviews) {
      return;
    }
    this.setSelectedPreviewElement(this.activePreviews[id].dom);
  }

  private getSelectedPreview() {
    if (!this.activePreviews || this.activePreviews.length === 0) {
      return null;
    }
    const previewId = this.getSelectedPreviewId();
    if (previewId === null) {
      return null;
    }
    return this.activePreviews[previewId];
  }

  private setStatusMessage(text?: string) {
    if (!this.resultContainerElements) {
      return;
    }
    this.resultContainerElements.status.text(text || '');
  }

  private deselectElement(element: HTMLElement) {
    this.keyboardSelectionMode = false;
    element.classList.remove(this.options.selectedClass);
  }

  private clearPreviews() {
    this.keyboardSelectionMode = false;
    if (this.activePreviews) {
      this.activePreviews.forEach(preview => preview.deactivate());
    }
    this.activePreviews = [];
    if (this.resultContainerElements) {
      this.resultContainerElements.results.empty();
    }
  }

  private appendSearchResultPreviews(previews: ReceivedSearchResultPreviews) {
    previews.forEach(preview =>
      this.appendSearchResultPreview({
        dom: preview.dom.cloneNode(true) as HTMLElement,
        onSelect: preview.onSelect
      })
    );
  }

  private appendSearchResultPreview(preview: SearchResultPreview) {
    ResultPreviewsGrid.setPreviewId(preview.dom, this.activePreviews.length);
    preview.dom.setAttribute('role', 'gridcell');
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
    this.activePreviews.push(activePreview);
    this.resultContainerElements.results.append(preview.dom);
  }

  private buildResultsPreviewsContainer() {
    const container = $$('div', { className: ResultPreviewsGrid.ContainerClassName, role: 'tab' });
    const status = $$('div', { className: ResultPreviewsGrid.HeaderClassName, role: 'status' });
    container.append(status.el);
    const results = $$('div', { className: ResultPreviewsGrid.ResultsContainerClassName, role: 'grid' });
    container.append(results.el);
    this.resultContainerElements = {
      container,
      status,
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
    const totalLength = this.activePreviews.length;
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
