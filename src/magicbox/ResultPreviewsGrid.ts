import { $$, Dom } from '../utils/Dom';
import { findIndex } from 'underscore';
import { Component } from '../ui/Base/Component';

export enum ResultPreviewsGridDirection {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export interface IProvidedSearchResultPreview {
  inactiveElement: HTMLElement;
  onSelect: () => void;
}

export interface ISearchResultPreview {
  element: HTMLElement;
}

interface IActiveSearchResultPreview extends ISearchResultPreview {
  deactivate: () => void;
}

export interface IResultPreviewsGridOptions {
  selectableClass: string;
  selectedClass: string;
}

export enum ResultPreviewsGridEvents {
  PreviewFocused = 'previewFocused',
  PreviewBlurred = 'previewBlurred'
}

export class ResultPreviewsGrid {
  private root: HTMLElement;
  private resultContainerElements: {
    container: Dom;
    status: Dom;
    results: Dom;
  };
  private options: IResultPreviewsGridOptions;
  private activePreviews: IActiveSearchResultPreview[] = [];
  private previewIdPrefix = 'magic-box-preview-';

  public get focusedPreview(): ISearchResultPreview {
    if (this.activePreviews.length === 0) {
      return null;
    }
    const previewId = this.getFocusPosition();
    return this.activePreviews[previewId] || null;
  }

  constructor(private parentContainer: HTMLElement, options: Partial<IResultPreviewsGridOptions> = {}) {
    this.root = Component.resolveRoot(parentContainer);
    this.options = {
      selectableClass: 'coveo-preview-selectable',
      selectedClass: 'magic-box-selected',
      ...options
    };
    this.buildResultsPreviewsContainer();
    this.appendEmptySearchResultPreview();
  }

  public bindOnPreviewFocused(binding: (e: Event, focusedPreview: ISearchResultPreview) => void) {
    $$(this.root).on(ResultPreviewsGridEvents.PreviewFocused, binding);
  }

  public bindOnPreviewBlurred(binding: (e: Event, oldFocusedPreview: ISearchResultPreview) => void) {
    $$(this.root).on(ResultPreviewsGridEvents.PreviewBlurred, binding);
  }

  public displayPreviews(providedPreviews: IProvidedSearchResultPreview[]) {
    this.clearDisplayedPreviews();
    if (providedPreviews.length === 0) {
      this.appendEmptySearchResultPreview();
      return;
    }
    this.activePreviews = providedPreviews.map((preview, id) => this.buildSearchResultPreview(preview, id));
    this.activePreviews.forEach(preview => this.resultContainerElements.results.append(preview.element));
    return this.activePreviews as ISearchResultPreview[];
  }

  public focusFirstPreview() {
    if (this.activePreviews.length === 0) {
      return;
    }
    this.focusAtPosition(0);
  }

  public focusNextPreview(direction: ResultPreviewsGridDirection) {
    const currentSelectionId = this.getFocusPosition();
    if (currentSelectionId === null) {
      return;
    }
    const totalLength = this.activePreviews.length;
    const rowLength = this.calculatePreviewsPerRow();
    let newSelectionId = currentSelectionId;
    switch (direction) {
      case ResultPreviewsGridDirection.Left:
        if (currentSelectionId % rowLength === 0) {
          break;
        }
        newSelectionId -= 1;
        break;
      case ResultPreviewsGridDirection.Right:
        if (currentSelectionId === totalLength - 1) {
          break;
        }
        if (currentSelectionId % rowLength === rowLength - 1) {
          break;
        }
        newSelectionId += 1;
        break;
      case ResultPreviewsGridDirection.Up:
        if (currentSelectionId - rowLength < 0) {
          break;
        }
        newSelectionId -= rowLength;
        break;
      case ResultPreviewsGridDirection.Down:
        if (currentSelectionId + rowLength >= totalLength) {
          break;
        }
        newSelectionId += rowLength;
        break;
    }
    if (newSelectionId === currentSelectionId) {
      return;
    }
    this.focusAtPosition(newSelectionId);
  }

  public blurFocusedPreview() {
    const oldFocusedPreview = this.focusedPreview;
    if (!oldFocusedPreview) {
      return;
    }
    this.blurElement(oldFocusedPreview.element);
    $$(this.root).trigger(ResultPreviewsGridEvents.PreviewBlurred, oldFocusedPreview);
  }

  public setStatusMessage(text: string) {
    this.resultContainerElements.status.text(text);
  }

  public clearStatusMessage() {
    this.setStatusMessage('');
  }

  private buildResultsPreviewsContainer() {
    const container = $$('div', { className: 'coveo-preview-container', role: 'tab' });
    const status = $$('div', { className: 'coveo-preview-header', role: 'status' });
    container.append(status.el);
    const results = $$('div', { className: 'coveo-preview-results', role: 'grid' });
    container.append(results.el);
    this.resultContainerElements = {
      container,
      status,
      results
    };
    this.parentContainer.appendChild(container.el);
  }

  private calculatePreviewsPerRow() {
    // To account for every CSS that may span previews over multiple rows, this solution was found: https://stackoverflow.com/a/49090306
    if (this.activePreviews.length === 0) {
      return 0;
    }
    const firstVerticalOffset = this.activePreviews[0].element.offsetTop;
    const firstIndexOnNextRow = findIndex(this.activePreviews, preview => preview.element.offsetTop !== firstVerticalOffset);
    return firstIndexOnNextRow !== -1 ? firstIndexOnNextRow : this.activePreviews.length;
  }

  private setPreviewIdOfElement(element: HTMLElement, id: number) {
    element.id = this.previewIdPrefix + id.toString();
  }

  private getPreviewIdFromElement(element: HTMLElement) {
    const strId = element.id.substr(this.previewIdPrefix.length);
    return strId ? parseInt(strId, 10) : null;
  }

  private getFocusPosition() {
    const focusedElements = this.resultContainerElements.results.findClass(this.options.selectedClass);
    if (focusedElements.length !== 1) {
      return null;
    }
    return this.getPreviewIdFromElement(focusedElements[0]);
  }

  private focusAtPosition(position: number) {
    this.focusElement(this.activePreviews[position].element);
  }

  private focusElement(element: HTMLElement) {
    this.blurFocusedPreview();
    element.classList.add(this.options.selectedClass);
    element.setAttribute('aria-selected', 'true');
    $$(this.root).trigger(ResultPreviewsGridEvents.PreviewFocused, this.activePreviews[this.getPreviewIdFromElement(element)]);
  }

  private blurElement(element: HTMLElement) {
    element.classList.remove(this.options.selectedClass);
    element.setAttribute('aria-selected', 'false');
  }

  private clearDisplayedPreviews() {
    this.activePreviews.forEach(preview => preview.deactivate());
    this.activePreviews = [];
    this.resultContainerElements.results.empty();
  }

  private buildSearchResultPreview(providedPreview: IProvidedSearchResultPreview, id: number) {
    const element = providedPreview.inactiveElement.cloneNode(true) as HTMLElement;
    this.setPreviewIdOfElement(element, id);
    element.setAttribute('role', 'gridcell');
    element.setAttribute('aria-selected', 'false');
    element.classList.add(this.options.selectableClass);
    const events: { name: string; funct: (e: Event) => void }[] = [
      {
        name: 'mouseover',
        funct: () => this.focusElement(element)
      },
      {
        name: 'mouseout',
        funct: () => this.blurElement(element)
      },
      {
        name: 'keyboardSelect',
        funct: () => providedPreview.onSelect && providedPreview.onSelect()
      }
    ];
    events.forEach(event => $$(element).on(event.name, event.funct));
    return {
      element,
      deactivate: () => events.forEach(event => element.removeEventListener(event.name, event.funct))
    };
  }

  private appendEmptySearchResultPreview() {
    this.resultContainerElements.results.append($$('div', { role: 'gridcell' }).el);
  }
}
