import { defaults, each, indexOf } from 'underscore';
import { IQuerySuggestSelection, OmniboxEvents } from '../events/OmniboxEvents';
import { Component } from '../ui/Base/Component';
import { $$, Dom } from '../utils/Dom';
import { InputManager } from './InputManager';
import { ResultPreviewsManager, ISearchResultPreview } from './ResultPreviewsManager';
import { QueryProcessor, ProcessingStatus } from './QueryProcessor';
import { find } from 'lodash';

export interface Suggestion {
  text?: string;
  index?: number;
  html?: string;
  dom?: HTMLElement;
  separator?: string;
  onSelect?: () => void;
}

export interface SuggestionsManagerOptions {
  suggestionClass?: string;
  selectedClass?: string;
  timeout?: number;
  previewHeaderText?: string;
}

export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

type KeyboardFocus =
  | {
      type: 'suggestion';
      suggestion: Suggestion;
    }
  | {
      type: 'preview';
      preview: ISearchResultPreview;
    };

export class SuggestionsManager {
  private displayedSuggestions: Suggestion[];
  private suggestionsProcessor: QueryProcessor<Suggestion>;
  private options: SuggestionsManagerOptions;
  private keyboardFocusedElement: KeyboardFocus;
  private suggestionsListbox: Dom;
  private resultPreviewsManager: ResultPreviewsManager;
  private root: HTMLElement;

  public get hasFocus() {
    return $$(this.element).findClass(this.options.selectedClass).length > 0;
  }

  public get hasPreviews() {
    return this.resultPreviewsManager.hasPreviews;
  }

  public get suggestions() {
    return this.displayedSuggestions;
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
      selectedClass: 'magic-box-selected'
    });
    // Put in a sane default, so as to not reject every suggestions if not set on initialization
    if (this.options.timeout == undefined) {
      this.options.timeout = 500;
    }

    this.displayedSuggestions = [];

    $$(this.element).on('mouseover', e => {
      this.handleMouseOver(e);
    });

    $$(this.element).on('mouseout', e => {
      this.handleMouseOut(e);
    });

    this.suggestionsProcessor = new QueryProcessor({ timeout: this.options.timeout });
    this.resultPreviewsManager = new ResultPreviewsManager(element, { selectedClass: this.options.selectedClass });
    this.suggestionsListbox = this.buildSuggestionsContainer();
    $$(this.element).append(this.suggestionsListbox.el);
    this.addAccessibilityPropertiesForCombobox();
    this.appendEmptySuggestionOption();
  }

  public handleMouseOver(e) {
    const target = $$(<HTMLElement>e.target);
    const parents = target.parents(this.options.suggestionClass);
    if (target.hasClass(this.options.suggestionClass)) {
      this.processMouseSelection(this.getSuggestionFromElement(target.el));
    } else if (parents.length > 0 && this.element.contains(parents[0])) {
      this.processMouseSelection(this.getSuggestionFromElement(parents[0]));
    }
  }

  public handleMouseOut(e) {
    const target = $$(<HTMLElement>e.target);
    const targetParents = target.parents(this.options.suggestionClass);

    //e.relatedTarget is not available if moving off the browser window or is an empty object `{}` when moving out of namespace in LockerService.
    if (e.relatedTarget && $$(e.relatedTarget).isValid()) {
      const relatedTargetParents = $$(<HTMLElement>e.relatedTarget).parents(this.options.suggestionClass);
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
    if (selected) {
      const element = selected.type === 'suggestion' ? selected.suggestion.dom : selected.preview.element;
      $$(element).trigger('keyboardSelect');
      // By definition, once an element has been "selected" with the keyboard,
      // it is not longer "active" since the event has been processed.
      this.keyboardFocusedElement = null;
      return element;
    }
    return null;
  }

  public clearKeyboardFocusedElement() {
    this.keyboardFocusedElement = null;
  }

  public async receiveSuggestions(suggestions: Array<Promise<Suggestion[]> | Suggestion[]>) {
    const { results, status } = await this.suggestionsProcessor.processQueries(suggestions);
    if (status === ProcessingStatus.Overriden) {
      return;
    }
    this.updateSuggestions(results);
  }

  public clearSuggestions() {
    this.updateSuggestions([]);
  }

  public updateSuggestions(suggestions: Suggestion[]) {
    this.suggestionsListbox.empty();
    this.inputManager.input.removeAttribute('aria-activedescendant');

    this.displayedSuggestions = suggestions;

    const hasSuggestions = suggestions.length > 0;
    $$(this.element).toggleClass('magic-box-hasSuggestion', hasSuggestions);
    $$(this.magicBoxContainer).setAttribute('aria-expanded', hasSuggestions.toString());

    this.resultPreviewsManager.displaySearchResultPreviewsForSuggestion(null);

    if (!hasSuggestions) {
      this.appendEmptySuggestionOption();
      $$(this.root).trigger(OmniboxEvents.querySuggestLoseFocus);
      return;
    }

    each(suggestions, (suggestion: Suggestion) => {
      if (suggestion.dom) {
        this.modifyDomFromExistingSuggestion(suggestion.dom);
      } else {
        suggestion.dom = this.createDomFromSuggestion(suggestion).el;
      }

      suggestion.dom.setAttribute('id', `magic-box-suggestion-${indexOf(suggestions, suggestion)}`);
      suggestion.dom.setAttribute('role', 'option');
      suggestion.dom.setAttribute('aria-selected', 'false');
      suggestion.dom.setAttribute('aria-label', suggestion.dom.innerText);

      this.suggestionsListbox.append(suggestion.dom);
    });

    $$(this.root).trigger(OmniboxEvents.querySuggestRendered);
  }

  public get selectedSuggestion(): Suggestion {
    if (this.keyboardFocusedElement && this.keyboardFocusedElement.type === 'suggestion') {
      return this.keyboardFocusedElement.suggestion;
    }
    return null;
  }

  private processKeyboardSelection(suggestion: Suggestion) {
    this.addSelectedStatus(suggestion.dom);
    this.updateSelectedSuggestion(suggestion);
    this.keyboardFocusedElement = { type: 'suggestion', suggestion };
    $$(this.inputManager.input).setAttribute('aria-activedescendant', $$(suggestion.dom).getAttribute('id'));
  }

  private processKeyboardPreviewSelection(preview: ISearchResultPreview) {
    this.addSelectedStatus(preview.element);
    this.keyboardFocusedElement = { type: 'preview', preview };
  }

  private processMouseSelection(suggestion: Suggestion) {
    this.addSelectedStatus(suggestion.dom);
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
    if (this.resultPreviewsManager.focusedPreview) {
      this.moveWithinPreview(direction);
      return;
    }
    if (direction === Direction.Right || direction === Direction.Left) {
      const firstPreview = this.resultPreviewsManager.previews[0];
      if (firstPreview) {
        this.processKeyboardPreviewSelection(firstPreview);
        return;
      }
    }
    this.moveWithinSuggestion(direction);
  }

  private moveWithinSuggestion(direction: Direction) {
    const currentlySelected =
      this.keyboardFocusedElement && this.keyboardFocusedElement.type === 'suggestion' ? this.keyboardFocusedElement.suggestion : null;
    const selectables = this.displayedSuggestions;
    const currentIndex = currentlySelected !== null ? indexOf(selectables, currentlySelected) : -1;

    let index = direction === Direction.Up ? currentIndex - 1 : currentIndex + 1;
    index = (index + selectables.length) % selectables.length;

    this.selectQuerySuggest(selectables[index]);
  }

  private selectQuerySuggest(suggestion: Suggestion) {
    if (suggestion) {
      this.processKeyboardSelection(suggestion);
    } else {
      this.keyboardFocusedElement = null;
      this.inputManager.input.removeAttribute('aria-activedescendant');
    }

    return suggestion;
  }

  private moveWithinPreview(direction: Direction) {
    const newFocusedPreview = this.resultPreviewsManager.getPreviewInDirection(direction);
    if (!newFocusedPreview) {
      this.selectQuerySuggest(this.resultPreviewsManager.previewsOwner);
      return;
    }
    this.processKeyboardPreviewSelection(newFocusedPreview);
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

  private updateSelectedSuggestion(suggestion: Suggestion) {
    $$(this.root).trigger(OmniboxEvents.querySuggestGetFocus, <IQuerySuggestSelection>{
      suggestion: suggestion.text
    });
    this.resultPreviewsManager.displaySearchResultPreviewsForSuggestion(suggestion);
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

  private getSuggestionFromElement(element: HTMLElement) {
    return find(this.displayedSuggestions, suggestion => suggestion.dom === element);
  }
}
