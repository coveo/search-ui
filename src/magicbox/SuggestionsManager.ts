import { defaults, each, indexOf, find } from 'underscore';
import { IQuerySuggestSelection, OmniboxEvents } from '../events/OmniboxEvents';
import { Component } from '../ui/Base/Component';
import { $$, Dom } from '../utils/Dom';
import { InputManager } from './InputManager';
import { ResultPreviewsManager } from './ResultPreviewsManager';
import { QueryProcessor, ProcessingStatus } from './QueryProcessor';

export interface ISuggestionField {
  name: string;
  value: string;
}

export interface ISuggestionCategoryField extends ISuggestionField {
  categoryFieldDelimitingCharacter: string;
}

export interface Suggestion {
  text?: string;
  index?: number;
  html?: string;
  dom?: HTMLElement;
  separator?: string;
  field?: ISuggestionField;
  advancedQuery?: string;
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

export class SuggestionsManager {
  private suggestionsProcessor: QueryProcessor<Suggestion>;
  private currentSuggestions: Suggestion[];
  private options: SuggestionsManagerOptions;
  private keyboardFocusedElement: HTMLElement;
  private suggestionsListbox: Dom;
  private resultPreviewsManager: ResultPreviewsManager;
  private root: HTMLElement;

  public get hasSuggestions() {
    return this.currentSuggestions && this.currentSuggestions.length > 0;
  }

  public get hasFocus() {
    return $$(this.element).findClass(this.options.selectedClass).length > 0;
  }

  public get hasPreviews() {
    return this.resultPreviewsManager.hasPreviews;
  }

  private get focusedSuggestion() {
    return find(this.currentSuggestions || <Suggestion[]>[], suggestion => suggestion.dom.classList.contains(this.options.selectedClass));
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

    $$(this.element).on('mouseover', e => {
      this.handleMouseOver(e);
    });

    $$(this.element).on('mouseout', e => {
      this.handleMouseOut(e);
    });

    this.suggestionsProcessor = new QueryProcessor({ timeout: this.options.timeout });
    this.resultPreviewsManager = new ResultPreviewsManager(element, {
      selectedClass: this.options.selectedClass,
      timeout: this.options.timeout
    });
    this.suggestionsListbox = this.buildSuggestionsContainer();
    $$(this.element).append(this.suggestionsListbox.el);
    this.addAccessibilityPropertiesForCombobox();
    this.appendEmptySuggestionOption();
  }

  public handleMouseOver(e) {
    const target = $$(<HTMLElement>e.target);
    const parents = target.parents(this.options.suggestionClass);
    if (target.hasClass(this.options.suggestionClass)) {
      this.processMouseSelection(target.el);
    } else if (parents.length > 0 && this.element.contains(parents[0])) {
      this.processMouseSelection(parents[0]);
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

  public async moveDown() {
    await this.move(Direction.Down);
  }

  public async moveUp() {
    await this.move(Direction.Up);
  }

  public async moveLeft() {
    await this.move(Direction.Left);
  }

  public async moveRight() {
    await this.move(Direction.Right);
  }

  public selectAndReturnKeyboardFocusedElement(): HTMLElement {
    const selected = this.keyboardFocusedElement;
    if (selected) {
      $$(selected).trigger('keyboardSelect');
      // By definition, once an element has been "selected" with the keyboard,
      // it is not longer "active" since the event has been processed.
      this.keyboardFocusedElement = null;
      this.inputManager.blur();
    }
    return selected;
  }

  public clearKeyboardFocusedElement() {
    this.keyboardFocusedElement = null;
  }

  public async receiveSuggestions(suggestions: (Promise<Suggestion[]> | Suggestion[])[]) {
    const { results, status } = await this.suggestionsProcessor.processQueries(suggestions);
    if (status === ProcessingStatus.Overriden) {
      return [];
    }
    this.updateSuggestions(results);
    return results;
  }

  public clearSuggestions() {
    this.updateSuggestions([]);
  }

  public updateSuggestions(suggestions: Suggestion[]) {
    this.suggestionsListbox.empty();
    this.inputManager.input.removeAttribute('aria-activedescendant');

    this.currentSuggestions = suggestions;

    $$(this.element).toggleClass('magic-box-hasSuggestion', this.hasSuggestions);
    $$(this.magicBoxContainer).setAttribute('aria-expanded', this.hasSuggestions.toString());

    this.resultPreviewsManager.displaySearchResultPreviewsForSuggestion(null);

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

  private async processKeyboardSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.keyboardFocusedElement = suggestion;
    $$(this.inputManager.input).setAttribute('aria-activedescendant', $$(suggestion).getAttribute('id'));
    await this.updateSelectedSuggestion(this.focusedSuggestion);
  }

  private processKeyboardPreviewSelection(preview: HTMLElement) {
    this.addSelectedStatus(preview);
    this.keyboardFocusedElement = preview;
  }

  private processMouseSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.updateSelectedSuggestion(this.focusedSuggestion);
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

    suggestion.dom = dom.el;

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

  private async move(direction: Direction) {
    if (this.resultPreviewsManager.focusedPreviewElement) {
      await this.moveWithinPreview(direction);
      return;
    }
    if (direction === Direction.Right || direction === Direction.Left) {
      const firstPreview = this.resultPreviewsManager.previewElements[0];
      if (firstPreview) {
        this.processKeyboardPreviewSelection(firstPreview);
        return;
      }
    }
    await this.moveWithinSuggestion(direction);
  }

  private async moveWithinSuggestion(direction: Direction) {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const selectables = $$(this.element).findAll(`.${this.options.suggestionClass}`);
    const currentIndex = indexOf(selectables, currentlySelected);

    let index = direction === Direction.Up ? currentIndex - 1 : currentIndex + 1;
    index = (index + selectables.length) % selectables.length;

    await this.selectQuerySuggest(selectables[index]);
  }

  private async selectQuerySuggest(suggestion: HTMLElement) {
    if (suggestion) {
      await this.processKeyboardSelection(suggestion);
    } else {
      this.keyboardFocusedElement = null;
      this.inputManager.input.removeAttribute('aria-activedescendant');
    }

    return suggestion;
  }

  private async moveWithinPreview(direction: Direction) {
    const newFocusedPreview = this.resultPreviewsManager.getElementInDirection(direction);
    if (!newFocusedPreview) {
      await this.selectQuerySuggest(this.resultPreviewsManager.previewsOwner.dom);
      return;
    }
    this.processKeyboardPreviewSelection(newFocusedPreview);
  }

  private returnMoved(selected) {
    if (selected) {
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

  private async updateSelectedSuggestion(suggestion: Suggestion) {
    $$(this.root).trigger(OmniboxEvents.querySuggestGetFocus, <IQuerySuggestSelection>{
      suggestion: suggestion.text
    });
    await this.resultPreviewsManager.displaySearchResultPreviewsForSuggestion(suggestion);
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
}
