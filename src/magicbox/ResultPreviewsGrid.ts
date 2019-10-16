import { $$, Dom } from '../utils/Dom';
import { findIndex } from 'underscore';
import { Component } from '../ui/Base/Component';

export enum ResultPreviewsGridDirection {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export interface ISearchResultPreview {
  element: HTMLElement;
  onSelect: () => void;
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
  private displayedPreviews: IActiveSearchResultPreview[] = [];
  private keyboardSelectionMode: boolean = false;
  private previewIdPrefix = 'magic-box-preview-';

  public get isFocusKeyboardControlled() {
    return this.keyboardSelectionMode;
  }

  public get focusedPreview(): ISearchResultPreview {
    if (this.displayedPreviews.length === 0) {
      return null;
    }
    const previewId = this.getFocusedPreviewPosition();
    return this.displayedPreviews[previewId] || null;
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

  public setDisplayedPreviews(previews: ISearchResultPreview[]) {
    this.clearDisplayedPreviews();
    if (previews.length === 0) {
      this.appendEmptySearchResultPreview();
      return;
    }
    previews.forEach(preview =>
      this.appendSearchResultPreview({
        element: preview.element.cloneNode(true) as HTMLElement,
        onSelect: preview.onSelect
      })
    );
  }

  public focusFirstPreview() {
    if (this.displayedPreviews.length === 0) {
      return;
    }
    this.setFocusedPreviewFromPosition(0);
    this.keyboardSelectionMode = true;
  }

  public focusNextPreview(direction: ResultPreviewsGridDirection) {
    const currentSelectionId = this.getFocusedPreviewPosition();
    if (currentSelectionId === null) {
      return;
    }
    const totalLength = this.displayedPreviews.length;
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
    this.setFocusedPreviewFromPosition(newSelectionId);
    this.keyboardSelectionMode = true;
  }

  public blurFocusedPreview() {
    const oldFocusedPreview = this.focusedPreview;
    if (!oldFocusedPreview) {
      return;
    }
    this.blurElement(oldFocusedPreview.element);
    $$(this.root).trigger(ResultPreviewsGridEvents.PreviewBlurred, oldFocusedPreview);
  }

  public selectKeyboardFocusedPreview() {
    if (!this.keyboardSelectionMode) {
      return null;
    }
    const selection = this.focusedPreview;
    if (!selection) {
      return null;
    }
    this.blurFocusedPreview();
    $$(selection.element).trigger('keyboardSelect');
    return selection as ISearchResultPreview;
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
    if (this.displayedPreviews.length === 0) {
      return 0;
    }
    const firstVerticalOffset = this.displayedPreviews[0].element.offsetTop;
    const firstIndexOnNextRow = findIndex(this.displayedPreviews, preview => preview.element.offsetTop !== firstVerticalOffset);
    return firstIndexOnNextRow !== -1 ? firstIndexOnNextRow : this.displayedPreviews.length;
  }

  private setPreviewIdOfElement(element: HTMLElement, id: number) {
    element.id = this.previewIdPrefix + id.toString();
  }

  private getPreviewIdFromElement(element: HTMLElement) {
    const strId = element.id.substr(this.previewIdPrefix.length);
    return strId ? parseInt(strId, 10) : null;
  }

  private setFocusedPreviewFromElement(element: HTMLElement) {
    this.blurFocusedPreview();
    element.classList.add(this.options.selectedClass);
    $$(this.root).trigger(ResultPreviewsGridEvents.PreviewFocused, this.displayedPreviews[this.getPreviewIdFromElement(element)]);
  }

  private getFocusedPreviewPosition() {
    const focusedElements = this.resultContainerElements.results.findClass(this.options.selectedClass);
    if (focusedElements.length !== 1) {
      return null;
    }
    return this.getPreviewIdFromElement(focusedElements[0]);
  }

  private setFocusedPreviewFromPosition(position: number) {
    this.setFocusedPreviewFromElement(this.displayedPreviews[position].element);
  }

  private blurElement(element: HTMLElement) {
    this.keyboardSelectionMode = false;
    element.classList.remove(this.options.selectedClass);
  }

  private clearDisplayedPreviews() {
    this.keyboardSelectionMode = false;
    this.displayedPreviews.forEach(preview => preview.deactivate());
    this.displayedPreviews = [];
    this.resultContainerElements.results.empty();
  }

  private appendSearchResultPreview(preview: ISearchResultPreview) {
    this.setPreviewIdOfElement(preview.element, this.displayedPreviews.length);
    preview.element.setAttribute('role', 'gridcell');
    preview.element.classList.add(this.options.selectableClass);
    const events: { name: string; funct: (e: Event) => void }[] = [
      {
        name: 'mouseover',
        funct: () => {
          this.keyboardSelectionMode = false;
          this.setFocusedPreviewFromElement(preview.element);
        }
      },
      {
        name: 'mouseout',
        funct: () => {
          this.blurElement(preview.element);
        }
      },
      {
        name: 'keyboardSelect',
        funct: () => preview.onSelect && preview.onSelect()
      }
    ];
    events.forEach(event => $$(preview.element).on(event.name, event.funct));
    const activePreview: IActiveSearchResultPreview = {
      ...preview,
      deactivate: () => events.forEach(event => preview.element.removeEventListener(event.name, event.funct))
    };
    this.displayedPreviews.push(activePreview);
    this.resultContainerElements.results.append(preview.element);
  }

  private appendEmptySearchResultPreview() {
    this.resultContainerElements.results.append($$('div', { role: 'gridcell' }).el);
  }
}
