import { $$, Dom } from '../utils/Dom';
import { defaults, findIndex } from 'underscore';
import { Component } from '../ui/Base/Component';
import { ISelectableItemsContainer } from './SuggestionsManager';

export enum ResultPreviewsGridDirection {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export interface ISearchResultPreview {
  element: HTMLElement;
  onSelect?: () => void;
}

interface IActiveSearchResultPreview extends ISearchResultPreview {
  deactivate: () => void;
}

export interface IResultPreviewsGridOptions {
  selectedClass?: string;
}

export interface IPreviewHoveredEventArgs {
  preview: ISearchResultPreview;
}

export enum ResultPreviewsGridEvents {
  PreviewHovered = 'previewHovered'
}

export class ResultPreviewsGrid implements ISelectableItemsContainer<ISearchResultPreview, ResultPreviewsGridDirection> {
  public static ContainerClassName = 'coveo-preview-container';
  public static HeaderClassName = 'coveo-preview-header';
  public static ResultsContainerClassName = 'coveo-preview-results';
  public static PreviewIdPrefix = 'magic-box-preview-';

  private static setItemIdOfElement(element: HTMLElement, id: number) {
    element.id = this.PreviewIdPrefix + id.toString();
  }

  private static getItemIdFromElement(element: HTMLElement) {
    const strId = element.id.substr(this.PreviewIdPrefix.length);
    return strId ? parseInt(strId, 10) : null;
  }

  private root: HTMLElement;
  private resultContainerElements?: {
    container: Dom;
    status: Dom;
    results: Dom;
  };
  private options: IResultPreviewsGridOptions;
  private activePreviews: IActiveSearchResultPreview[];
  private keyboardSelectionMode: boolean;

  constructor(private parentContainer: HTMLElement, options: IResultPreviewsGridOptions = {}) {
    this.root = Component.resolveRoot(parentContainer);
    this.options = defaults(options, <IResultPreviewsGridOptions>{
      selectedClass: 'magic-box-selected'
    });
    this.buildResultsPreviewsContainer();
  }

  public isHoverKeyboardControlled() {
    return this.keyboardSelectionMode;
  }

  public setDisplayedItems(items: ISearchResultPreview[]) {
    this.clearDisplayedItems();
    items.forEach(preview =>
      this.appendSearchResultPreview({
        element: preview.element.cloneNode(true) as HTMLElement,
        onSelect: preview.onSelect
      })
    );
  }

  public getHoveredItem(): ISearchResultPreview {
    if (!this.activePreviews || this.activePreviews.length === 0) {
      return null;
    }
    const previewId = this.getHoveredItemId();
    return this.activePreviews[previewId] || null;
  }

  public tryHoverOnFirstItem() {
    if (!this.activePreviews || this.activePreviews.length === 0) {
      return (this.keyboardSelectionMode = false);
    }
    this.setHoveredItemFromId(0);
    return (this.keyboardSelectionMode = true);
  }

  public tryHoverOnNextItem(direction: ResultPreviewsGridDirection) {
    const currentSelectionId = this.getHoveredItemId();
    if (currentSelectionId === null) {
      return false;
    }
    const totalLength = this.activePreviews.length;
    const rowLength = this.calculatePreviewsPerRow();
    switch (direction) {
      case ResultPreviewsGridDirection.Left:
        if (currentSelectionId === 0) {
          return false;
        }
        if (currentSelectionId % rowLength === 0) {
          return false;
        }
        this.setHoveredItemFromId(currentSelectionId - 1);
        this.keyboardSelectionMode = true;
        return true;
      case ResultPreviewsGridDirection.Right:
        if (currentSelectionId === totalLength - 1) {
          return false;
        }
        if (currentSelectionId % rowLength === rowLength - 1) {
          return false;
        }
        this.setHoveredItemFromId(currentSelectionId + 1);
        this.keyboardSelectionMode = true;
        return true;
      case ResultPreviewsGridDirection.Up:
        if (currentSelectionId - rowLength < 0) {
          return false;
        }
        this.setHoveredItemFromId(currentSelectionId - rowLength);
        this.keyboardSelectionMode = true;
        return true;
      case ResultPreviewsGridDirection.Down:
        if (currentSelectionId + rowLength >= totalLength) {
          return false;
        }
        this.setHoveredItemFromId(currentSelectionId + rowLength);
        this.keyboardSelectionMode = true;
        return true;
    }
  }

  public clearHover() {
    const currentSelection = this.getHoveredItemElement();
    if (!currentSelection) {
      return;
    }
    this.deselectElement(currentSelection);
    $$(this.root).trigger(ResultPreviewsGridEvents.PreviewHovered, <IPreviewHoveredEventArgs>{
      preview: null
    });
  }

  public keyboardSelect() {
    if (!this.keyboardSelectionMode) {
      return null;
    }
    const selection = this.getHoveredItem();
    if (!selection) {
      return null;
    }
    this.clearHover();
    $$(selection.element).trigger('keyboardSelect');
    return selection as ISearchResultPreview;
  }

  public setStatusMessage(text: string) {
    if (!this.resultContainerElements) {
      return;
    }
    this.resultContainerElements.status.text(text);
  }

  public clearStatusMessage() {
    this.setStatusMessage('');
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

  private getHoveredItemElement() {
    if (!this.resultContainerElements) {
      return null;
    }
    const selectedElements = this.resultContainerElements.results.findClass(this.options.selectedClass);
    if (!selectedElements || selectedElements.length !== 1) {
      return null;
    }
    return selectedElements[0];
  }

  private setHoveredItemFromElement(element: HTMLElement) {
    this.clearHover();
    if (!element) {
      return;
    }
    element.classList.add(this.options.selectedClass);
    $$(this.root).trigger(ResultPreviewsGridEvents.PreviewHovered, <IPreviewHoveredEventArgs>{
      preview: this.activePreviews[ResultPreviewsGrid.getItemIdFromElement(element)]
    });
  }

  private getHoveredItemId() {
    const element = this.getHoveredItemElement();
    if (!element) {
      return null;
    }
    return ResultPreviewsGrid.getItemIdFromElement(element);
  }

  private setHoveredItemFromId(id: number) {
    this.setHoveredItemFromElement(this.activePreviews[id].element);
  }

  private deselectElement(element: HTMLElement) {
    this.keyboardSelectionMode = false;
    element.classList.remove(this.options.selectedClass);
  }

  private clearDisplayedItems() {
    this.keyboardSelectionMode = false;
    if (this.activePreviews) {
      this.activePreviews.forEach(preview => preview.deactivate());
    }
    this.activePreviews = [];
    if (this.resultContainerElements) {
      this.resultContainerElements.results.empty();
    }
  }

  private appendSearchResultPreview(preview: ISearchResultPreview) {
    ResultPreviewsGrid.setItemIdOfElement(preview.element, this.activePreviews.length);
    preview.element.setAttribute('role', 'gridcell');
    const events: { name: string; funct: (e: Event) => void }[] = [
      {
        name: 'mouseover',
        funct: () => {
          this.keyboardSelectionMode = false;
          this.setHoveredItemFromElement(preview.element);
        }
      },
      {
        name: 'mouseout',
        funct: () => {
          this.deselectElement(preview.element);
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
    this.activePreviews.push(activePreview);
    this.resultContainerElements.results.append(preview.element);
  }
}
