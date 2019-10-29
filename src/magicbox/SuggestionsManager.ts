import { compact, defaults, each, indexOf } from 'underscore';
import { IQuerySuggestSelection, OmniboxEvents } from '../events/OmniboxEvents';
import { Component } from '../ui/Base/Component';
import { $$, Dom } from '../utils/Dom';
import { Utils } from '../utils/Utils';
import { InputManager } from './InputManager';
import { findIndex } from 'lodash';

export interface Suggestion {
  text?: string;
  index?: number;
  html?: string;
  dom?: HTMLElement;
  separator?: string;
  onSelect?: () => void;
}

export interface ISearchResultPreview {
  element: HTMLElement;
  onSelect: () => void;
}

export interface SuggestionsManagerOptions {
  suggestionClass?: string;
  selectedClass?: string;
  timeout?: number;
  previewHeaderText?: string;
}

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export interface IPopulateSearchResultPreviewsEventArgs {
  suggestionText: string;
  previewsQuery: Promise<ISearchResultPreview[]>;
}

export enum SuggestionsManagerEvents {
  PopulateSearchResultPreviews = 'populateSearchResultPreviews'
}

export class SuggestionsManager {
  public hasSuggestions: boolean;
  private pendingSuggestion: Promise<Suggestion[]>;
  private options: SuggestionsManagerOptions;
  private keyboardFocusedElement: HTMLElement;
  private suggestionsListbox: Dom;
  private suggestionsPreviewContainer: Dom;
  private lastSelectedSuggestion: HTMLElement;
  private root: HTMLElement;
  private containsPreviews: boolean;
  private previewContainer: Dom;
  private lastPreviewsQuery: Promise<ISearchResultPreview[]>;

  public get hasFocus() {
    return $$(this.element).findClass(this.options.selectedClass).length > 0;
  }

  public get hasPreviews() {
    return !!this.suggestionsPreviewContainer;
  }

  private get resultPerRow() {
    // To account for every CSS that may span previews over multiple rows, this solution was found: https://stackoverflow.com/a/49090306
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);
    if (previewSelectables.length === 0) {
      return 0;
    }
    const firstVerticalOffset = previewSelectables[0].offsetTop;
    const firstIndexOnNextRow = findIndex(previewSelectables, previewSelectable => previewSelectable.offsetTop !== firstVerticalOffset);
    return firstIndexOnNextRow !== -1 ? firstIndexOnNextRow : previewSelectables.length;
  }

  constructor(
    private element: HTMLElement,
    private magicBoxContainer: HTMLElement,
    private inputManager: InputManager,
    options?: SuggestionsManagerOptions
  ) {
    this.root = Component.resolveRoot(element);
    this.options = defaults(options, <SuggestionsManagerOptions>{
      suggestionClass: 'magic-box-suggestion',
      selectedClass: 'magic-box-selected',
      previewHeaderText: 'Query result items for'
    });
    // Put in a sane default, so as to not reject every suggestions if not set on initialization
    if (this.options.timeout == undefined) {
      this.options.timeout = 500;
    }

    this.hasSuggestions = false;

    $$(this.element).on('mouseover', e => {
      this.handleMouseOver(e);
    });

    $$(this.element).on('mouseout', e => {
      this.handleMouseOut(e);
    });

    this.suggestionsListbox = this.buildSuggestionsContainer();
    $$(this.element).append(this.suggestionsListbox.el);
    this.addAccessibilityPropertiesForCombobox();
    this.appendEmptySuggestionOption();
  }

  public handleMouseOver(e) {
    let target = $$(<HTMLElement>e.target);
    let parents = target.parents(this.options.suggestionClass);
    if (target.hasClass(this.options.suggestionClass)) {
      this.processMouseSelection(target.el);
    } else if (parents.length > 0 && this.element.contains(parents[0])) {
      this.processMouseSelection(parents[0]);
    }
  }

  public handleMouseOut(e) {
    let target = $$(<HTMLElement>e.target);
    let targetParents = target.parents(this.options.suggestionClass);

    //e.relatedTarget is not available if moving off the browser window or is an empty object `{}` when moving out of namespace in LockerService.
    if (e.relatedTarget && $$(e.relatedTarget).isValid()) {
      let relatedTargetParents = $$(<HTMLElement>e.relatedTarget).parents(this.options.suggestionClass);
      if (target.hasClass(this.options.selectedClass) && !$$(<HTMLElement>e.relatedTarget).hasClass(this.options.suggestionClass)) {
        this.removeSelectedStatus(target.el);
      } else if (relatedTargetParents.length == 0 && targetParents.length > 0) {
        this.removeSelectedStatus(targetParents[0]);
      }
    } else {
      if (target.hasClass(this.options.selectedClass)) {
        this.removeSelectedStatus(target.el);
      } else if (targetParents.length > 0) {
        this.removeSelectedStatus(targetParents[0]);
      }
    }
    $$(this.root).trigger(OmniboxEvents.querySuggestLoseFocus);
  }

  public moveDown() {
    this.move(Direction.Down);
  }

  public moveUp() {
    this.move(Direction.Up);
  }

  public moveLeft() {
    this.move(Direction.Left);
  }

  public moveRight() {
    this.move(Direction.Right);
  }

  public selectAndReturnKeyboardFocusedElement(): HTMLElement {
    const selected = this.keyboardFocusedElement;
    if (selected != null) {
      $$(selected).trigger('keyboardSelect');
      // By definition, once an element has been "selected" with the keyboard,
      // it is not longer "active" since the event has been processed.
      this.keyboardFocusedElement = null;
    }
    return selected;
  }

  public clearKeyboardFocusedElement() {
    this.keyboardFocusedElement = null;
  }

  // TODO: Replace this with a class that can accumulate results more cleanly (e.g., QueriesProcessor)
  public mergeSuggestions(suggestions: Array<Promise<Suggestion[]> | Suggestion[]>, callback?: (suggestions: Suggestion[]) => void) {
    let results: Suggestion[] = [];
    let timeout;
    let stillNeedToResolve = true;
    // clean empty / null values in the array of suggestions
    suggestions = compact(suggestions);
    const promise = (this.pendingSuggestion = new Promise<Suggestion[]>((resolve, reject) => {
      // Concat all promises results together in one flat array.
      // If one promise take too long to resolve, simply skip it
      each(suggestions, (suggestion: Promise<Suggestion[]>) => {
        let shouldRejectPart = false;
        setTimeout(function() {
          shouldRejectPart = true;
          stillNeedToResolve = false;
        }, this.options.timeout);
        suggestion.then((item: Suggestion[]) => {
          if (!shouldRejectPart && item) {
            results = results.concat(item);
          }
        });
      });

      // Resolve the promise when one of those conditions is met first :
      // - All suggestions resolved
      // - Timeout is reached before all promises have processed -> resolve with what we have so far
      // - No suggestions given (length 0 or undefined)
      const onResolve = () => {
        if (stillNeedToResolve) {
          if (timeout) {
            clearTimeout(timeout);
          }
          if (results.length == 0) {
            resolve([]);
          } else if (promise == this.pendingSuggestion || this.pendingSuggestion == null) {
            resolve(results.sort((a, b) => b.index - a.index));
          } else {
            reject('new request queued');
          }
        }
        stillNeedToResolve = false;
      };

      if (suggestions.length == 0) {
        onResolve();
      }
      if (suggestions == undefined) {
        onResolve();
      }

      timeout = setTimeout(function() {
        onResolve();
      }, this.options.timeout);

      Promise.all(suggestions).then(() => onResolve());
    }));

    promise
      .then((suggestions: Suggestion[]) => {
        if (callback) {
          callback(suggestions);
        }
        this.updateSuggestions(suggestions);
        return suggestions;
      })
      .catch(() => {
        return null;
      });
  }

  public updateSuggestions(suggestions: Suggestion[]) {
    this.suggestionsListbox.empty();
    this.inputManager.input.removeAttribute('aria-activedescendant');

    this.hasSuggestions = suggestions.length > 0;

    $$(this.element).toggleClass('magic-box-hasSuggestion', this.hasSuggestions);
    $$(this.magicBoxContainer).setAttribute('aria-expanded', this.hasSuggestions.toString());

    if (!this.hasSuggestions) {
      this.appendEmptySuggestionOption();
      $$(this.root).trigger(OmniboxEvents.querySuggestLoseFocus);
      return;
    }

    each(suggestions, (suggestion: Suggestion) => {
      const dom = suggestion.dom ? this.modifyDomFromExistingSuggestion(suggestion.dom) : this.createDomFromSuggestion(suggestion);

      dom.setAttribute('id', `magic-box-suggestion-${indexOf(suggestions, suggestion)}`);
      dom.setAttribute('role', 'option');
      dom.setAttribute('aria-selected', 'false');
      dom.setAttribute('aria-label', dom.text());

      dom['suggestion'] = suggestion;
      this.suggestionsListbox.append(dom.el);
    });

    $$(this.root).trigger(OmniboxEvents.querySuggestRendered);
  }

  public get selectedSuggestion(): Suggestion {
    if (this.htmlElementIsSuggestion(this.keyboardFocusedElement)) {
      return this.returnMoved(this.keyboardFocusedElement) as Suggestion;
    }
    return null;
  }

  private processKeyboardSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.updateSelectedSuggestion(suggestion);
    this.keyboardFocusedElement = suggestion;
    $$(this.inputManager.input).setAttribute('aria-activedescendant', $$(suggestion).getAttribute('id'));
  }

  private processKeyboardPreviewSelection(preview: HTMLElement) {
    this.addSelectedStatus(preview);
    this.keyboardFocusedElement = preview;
  }

  private processMouseSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.updateSelectedSuggestion(suggestion);
    this.keyboardFocusedElement = null;
  }

  private buildSuggestionsContainer() {
    return $$('div', {
      className: 'coveo-magicbox-suggestions',
      id: 'coveo-magicbox-suggestions',
      role: 'listbox'
    });
  }

  private buildPreviewContainer() {
    return (this.previewContainer = $$(
      'div',
      {
        className: 'coveo-preview-container'
      },
      $$('h4', {
        className: 'coveo-preview-header'
      }),
      $$('div', {
        className: 'coveo-preview-results'
      })
    )).el;
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

  private createDomFromSuggestion(suggestion: Suggestion) {
    const dom = $$('div', {
      className: `magic-box-suggestion ${this.options.suggestionClass}`
    });

    dom.on('click', () => {
      this.selectSuggestion(suggestion);
    });

    dom.on('keyboardSelect', () => {
      this.selectSuggestion(suggestion);
    });

    if (suggestion.html) {
      dom.el.innerHTML = suggestion.html;
      return dom;
    }

    if (suggestion.text) {
      dom.text(suggestion.text);

      return dom;
    }

    if (suggestion.separator) {
      dom.addClass('magic-box-suggestion-seperator');
      const suggestionLabel = $$(
        'div',
        {
          className: 'magic-box-suggestion-seperator-label'
        },
        suggestion.separator
      );
      dom.append(suggestionLabel.el);
      return dom;
    }

    return dom;
  }

  private selectSuggestion(suggestion: Suggestion) {
    suggestion.onSelect();
    $$(this.root).trigger(OmniboxEvents.querySuggestSelection, <IQuerySuggestSelection>{ suggestion: suggestion.text });
  }

  private appendEmptySuggestionOption() {
    // Accessibility tools reports that a listbox element must always have at least one child with an option
    // Even if there is no suggestions to show.
    this.suggestionsListbox.append($$('div', { role: 'option' }).el);
  }

  private modifyDomFromExistingSuggestion(dom: HTMLElement) {
    // this need to be done if the selection is in cache and the dom is set in the suggestion
    this.removeSelectedStatus(dom);
    const found = $$(dom).find('.' + this.options.suggestionClass);
    this.removeSelectedStatus(found);
    return $$(dom);
  }

  private move(direction: Direction) {
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);
    if (previewSelectables.length > 0) {
      this.moveWithQuerySuggestPreview(direction);
    } else {
      this.moveWithinSuggestion(direction);
    }
  }

  private moveWithinSuggestion(direction: Direction) {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const selectables = $$(this.element).findAll(`.${this.options.suggestionClass}`);
    const currentIndex = indexOf(selectables, currentlySelected);

    let index = direction === Direction.Up ? currentIndex - 1 : currentIndex + 1;
    index = (index + selectables.length) % selectables.length;

    this.selectQuerySuggest(selectables[index]);
  }

  private selectQuerySuggest(suggestion: HTMLElement) {
    if (suggestion) {
      this.processKeyboardSelection(suggestion);
    } else {
      this.keyboardFocusedElement = null;
      this.inputManager.input.removeAttribute('aria-activedescendant');
    }

    return suggestion;
  }

  private moveWithQuerySuggestPreview(direction: Direction) {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const omniboxSelectables = $$(this.element).findAll(`.${this.options.suggestionClass}`);
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);
    const omniboxIndex = indexOf(omniboxSelectables, currentlySelected);
    const previewIndex = indexOf(previewSelectables, currentlySelected);

    const verticalMove = direction === Direction.Up || direction === Direction.Down;
    const suggestionIsSelected = omniboxIndex > -1;
    if (suggestionIsSelected && verticalMove) {
      this.moveWithinSuggestion(direction);
      return;
    }

    const noPreviewDisplayed = previewSelectables.length === 0;
    const directionIsLeft = direction === Direction.Left;
    const noPreviewSelected = previewIndex === -1;
    if (noPreviewDisplayed || (directionIsLeft && noPreviewSelected)) {
      return;
    }
    this.moveWithinPreview(direction);
  }

  private moveWithinPreview(direction: Direction) {
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);

    let newSelectedIndex;
    if (direction === Direction.Up || direction === Direction.Down) {
      newSelectedIndex = this.moveVerticallyInPreview(direction);
    }

    if (direction === Direction.Left || direction === Direction.Right) {
      newSelectedIndex = this.moveHorizontallyInPreview(direction);
    }
    if (Utils.isNullOrUndefined(newSelectedIndex)) {
      return;
    }

    newSelectedIndex = (newSelectedIndex + previewSelectables.length) % previewSelectables.length;
    this.processKeyboardPreviewSelection(previewSelectables[newSelectedIndex]);
  }

  private moveVerticallyInPreview(direction: Direction) {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);
    const previewIndex = indexOf(previewSelectables, currentlySelected);

    if (previewSelectables.length <= this.resultPerRow) {
      return null;
    }
    const offset = Math.ceil(previewSelectables.length / 2);
    return direction === Direction.Up ? previewIndex - offset : previewIndex + offset;
  }

  private moveHorizontallyInPreview(direction: Direction) {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);
    const previewIndex = indexOf(previewSelectables, currentlySelected);

    if (previewIndex === 0 && direction === Direction.Left) {
      this.selectQuerySuggest(this.lastSelectedSuggestion);
      return;
    }
    return direction === Direction.Left ? previewIndex - 1 : previewIndex + 1;
  }

  private returnMoved(selected) {
    if (selected != null) {
      if (selected['suggestion']) {
        return selected['suggestion'];
      }
      if (selected['no-text-suggestion']) {
        return null;
      }
      if (selected instanceof HTMLElement) {
        return {
          text: $$(selected).text()
        };
      }
    }
    return null;
  }

  private addSelectedStatus(element: HTMLElement): void {
    const selected = this.element.getElementsByClassName(this.options.selectedClass);
    for (let i = 0; i < selected.length; i++) {
      const elem = <HTMLElement>selected.item(i);
      this.removeSelectedStatus(elem);
    }
    $$(element).addClass(this.options.selectedClass);
    this.updateAreaSelectedIfDefined(element, 'true');
  }

  private updateSelectedSuggestion(suggestion: HTMLElement) {
    $$(this.root).trigger(OmniboxEvents.querySuggestGetFocus, <IQuerySuggestSelection>{
      suggestion: suggestion.innerText
    });
    this.displaySearchResultPreviewsForSuggestion(suggestion);
  }

  private removeSelectedStatus(suggestion: HTMLElement): void {
    $$(suggestion).removeClass(this.options.selectedClass);
    this.updateAreaSelectedIfDefined(suggestion, 'false');
  }

  private updateAreaSelectedIfDefined(suggestion: HTMLElement, value: string): void {
    if ($$(suggestion).getAttribute('aria-selected')) {
      $$(suggestion).setAttribute('aria-selected', value);
    }
  }

  private addAccessibilityPropertiesForCombobox() {
    const combobox = $$(this.magicBoxContainer);
    const input = $$(this.inputManager.input);

    combobox.setAttribute('aria-expanded', 'false');
    combobox.setAttribute('role', 'combobox');
    combobox.setAttribute('aria-owns', 'coveo-magicbox-suggestions');
    combobox.setAttribute('aria-haspopup', 'listbox');

    input.el.removeAttribute('aria-activedescendant');
    input.setAttribute('aria-controls', 'coveo-magicbox-suggestions');
    input.setAttribute('aria-autocomplete', 'list');
  }

  private htmlElementIsSuggestion(selected: HTMLElement) {
    const omniboxSelectables = $$(this.element).findAll(`.${this.options.suggestionClass}`);
    return indexOf(omniboxSelectables, selected) > -1;
  }

  private getSearchResultPreviewsQuery(suggestion: HTMLElement) {
    const populateEventArgs: IPopulateSearchResultPreviewsEventArgs = {
      suggestionText: suggestion.innerText,
      previewsQuery: null
    };
    $$(this.root).trigger(SuggestionsManagerEvents.PopulateSearchResultPreviews, populateEventArgs);
    return populateEventArgs.previewsQuery;
  }

  // TODO: Move this to a seperate class
  private updateSearchResultPreviewsHeader(text: string) {
    this.previewContainer.findClass('coveo-preview-header')[0].innerText = text;
  }

  // TODO: Move this to a seperate class
  private updateSearchResultPreviews(previews: ISearchResultPreview[]) {
    const previewWidth = previews.length % 3 === 0 ? 33 : 50;
    const resultsContainer = $$(this.previewContainer.findClass('coveo-preview-results')[0]);
    resultsContainer.empty();
    const previewStyle = `0 0 ${previewWidth}%`;
    previews.forEach(preview => {
      preview.element.style.flex = previewStyle;
      resultsContainer.append(preview.element);
      const elementDom = $$(preview.element);
      elementDom.on('click', () => preview.onSelect());
      elementDom.on('keyboardSelect', () => preview.onSelect());
    });
  }

  private displaySuggestionPreviews(suggestion: HTMLElement, previews: ISearchResultPreview[]) {
    if (!this.suggestionsPreviewContainer) {
      this.initPreviewForSuggestions();
    }
    this.lastPreviewsQuery = null;
    this.lastSelectedSuggestion = suggestion;
    this.updateSearchResultPreviews(previews);
    this.containsPreviews = previews.length > 0;
    this.element.classList.toggle('magic-box-hasPreviews', this.containsPreviews);
    this.updateSearchResultPreviewsHeader(this.containsPreviews ? `${this.options.previewHeaderText} "${suggestion.innerText}"` : '');
  }

  private async loadSearchResultPreviews(suggestion: HTMLElement, query: Promise<ISearchResultPreview[]>) {
    this.lastPreviewsQuery = query;
    const previews = await this.lastPreviewsQuery;
    if (this.lastPreviewsQuery !== query) {
      return;
    }
    if (!previews) {
      return;
    }
    this.displaySuggestionPreviews(suggestion, previews);
  }

  private async displaySearchResultPreviewsForSuggestion(suggestion: HTMLElement) {
    if (this.lastSelectedSuggestion !== suggestion) {
      await this.loadSearchResultPreviews(suggestion, this.getSearchResultPreviewsQuery(suggestion));
    }
  }
}
