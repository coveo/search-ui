import { compact, defaults, each, indexOf } from 'underscore';
import { Component, OmniboxEvents } from '../Core';
import { IQuerySuggestSelection } from '../events/OmniboxEvents';
import { $$, Dom } from '../utils/Dom';
import { InputManager } from './InputManager';

export interface Suggestion {
  text?: string;
  index?: number;
  html?: string;
  dom?: HTMLElement;
  separator?: string;
  onSelect?: () => void;
}

export interface SuggestionsManagerOptions {
  selectableClass?: string;
  selectedClass?: string;
  timeout?: number;
}

export class SuggestionsManager {
  public hasSuggestions: boolean;
  private pendingSuggestion: Promise<Suggestion[]>;
  private options: SuggestionsManagerOptions;
  private keyboardFocusedSuggestion: HTMLElement;
  private suggestionsListbox: Dom;
  private suggestionsPreviewContainer: Dom;

  constructor(
    private element: HTMLElement,
    private magicBoxContainer: HTMLElement,
    private root: HTMLElement,
    private inputManager: InputManager,
    options?: SuggestionsManagerOptions
  ) {
    this.options = defaults(options, <SuggestionsManagerOptions>{
      selectableClass: 'magic-box-suggestion',
      selectedClass: 'magic-box-selected'
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
    this.suggestionsPreviewContainer = this.initPreviewForSuggestions(this.suggestionsListbox);
    $$(this.element).append(this.suggestionsPreviewContainer.el);
    this.addAccessibilityPropertiesForCombobox();
  }

  public handleMouseOver(e) {
    let target = $$(<HTMLElement>e.target);
    let parents = target.parents(this.options.selectableClass);
    if (target.hasClass(this.options.selectableClass)) {
      this.processMouseSelection(target.el);
    } else if (parents.length > 0 && this.element.contains(parents[0])) {
      this.processMouseSelection(parents[0]);
    }
  }

  public handleMouseOut(e) {
    let target = $$(<HTMLElement>e.target);
    let targetParents = target.parents(this.options.selectableClass);

    //e.relatedTarget is not available if moving off the browser window or is an empty object `{}` when moving out of namespace in LockerService.
    if (e.relatedTarget && $$(e.relatedTarget).isValid()) {
      let relatedTargetParents = $$(<HTMLElement>e.relatedTarget).parents(this.options.selectableClass);
      if (target.hasClass(this.options.selectedClass) && !$$(<HTMLElement>e.relatedTarget).hasClass(this.options.selectableClass)) {
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

  public moveDown(): Suggestion {
    return this.returnMoved(this.move('down'));
  }

  public moveUp(): Suggestion {
    return this.returnMoved(this.move('up'));
  }

  public selectAndReturnKeyboardFocusedElement(): HTMLElement {
    const selected = this.keyboardFocusedSuggestion;
    if (selected != null) {
      $$(selected).trigger('keyboardSelect');
      // By definition, once an element has been "selected" with the keyboard,
      // it is not longer "active" since the event has been processed.
      this.keyboardFocusedSuggestion = null;
    }
    return selected;
  }

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
    $$(this.inputManager.input).setAttribute('aria-activedescendant', '');

    this.hasSuggestions = suggestions.length > 0;

    $$(this.element).toggleClass('magic-box-hasSuggestion', this.hasSuggestions);
    $$(this.magicBoxContainer).setAttribute('aria-expanded', this.hasSuggestions.toString());

    if (!this.hasSuggestions) {
      return;
    }

    each(suggestions, (suggestion: Suggestion) => {
      const dom = suggestion.dom ? this.modifyDomFromExistingSuggestion(suggestion.dom) : this.createDomFromSuggestion(suggestion);

      dom.setAttribute('id', `magic-box-suggestion-${indexOf(suggestions, suggestion)}`);
      dom.setAttribute('role', 'option');
      dom.setAttribute('aria-selected', 'false');
      dom.setAttribute('aria-label', suggestion.text);

      dom['suggestion'] = suggestion;
      this.suggestionsListbox.append(dom.el);
    });

    $$(this.root).trigger(OmniboxEvents.querySuggestRendered);
  }

  private processKeyboardSelection(suggestion: HTMLElement) {
    this.keyboardFocusedSuggestion = suggestion;
    $$(this.inputManager.input).setAttribute('aria-activedescendant', $$(suggestion).getAttribute('id'));
    this.addSelectedStatus(suggestion);
  }

  private processMouseSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.keyboardFocusedSuggestion = null;
  }

  private buildSuggestionsContainer() {
    return $$('div', {
      className: 'coveo-magicbox-suggestions',
      id: 'coveo-magicbox-suggestions',
      role: 'listbox'
    });
  }

  private buildPreviewContainer() {
    return $$('div', {
      className: 'coveo-preview-container'
    }).el;
  }

  private get querySuggestPreviewComponent() {
    const querySuggestPreviewElement: HTMLElement = $$(this.root).find(`.${Component.computeCssClassNameForType('QuerySuggestPreview')}`);
    if (!querySuggestPreviewElement) {
      return;
    }
    return Component.get(querySuggestPreviewElement);
  }

  private initPreviewForSuggestions(suggestions: Dom) {
    const querySuggestPreview = this.querySuggestPreviewComponent;
    if (!querySuggestPreview) {
      return suggestions;
    }

    const suggestionContainerParent = $$('div', {
      className: 'coveo-suggestion-container'
    });

    const previewContainer = this.buildPreviewContainer();
    suggestionContainerParent.append(suggestions.el);
    suggestionContainerParent.append(previewContainer);
    return suggestionContainerParent;
  }

  private createDomFromSuggestion(suggestion: Suggestion) {
    const dom = $$('div', {
      className: `magic-box-suggestion ${this.options.selectableClass}`
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

  private modifyDomFromExistingSuggestion(dom: HTMLElement) {
    // this need to be done if the selection is in cache and the dom is set in the suggestion
    this.removeSelectedStatus(dom);
    const found = $$(dom).find('.' + this.options.selectableClass);
    this.removeSelectedStatus(found);
    return $$(dom);
  }

  private move(direction: 'up' | 'down') {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const selectables = $$(this.element).findAll(`.${this.options.selectableClass}`);
    const currentIndex = indexOf(selectables, currentlySelected);

    let index = direction == 'up' ? currentIndex - 1 : currentIndex + 1;
    if (index < -1) {
      index = selectables.length - 1;
    }
    if (index > selectables.length) {
      index = 0;
    }

    const newlySelected = selectables[index];

    if (newlySelected) {
      this.processKeyboardSelection(newlySelected);
    } else {
      this.keyboardFocusedSuggestion = null;
      $$(this.inputManager.input).setAttribute('aria-activedescendant', '');
    }

    return newlySelected;
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

  private addSelectedStatus(suggestion: HTMLElement): void {
    const selected = this.element.getElementsByClassName(this.options.selectedClass);
    for (let i = 0; i < selected.length; i++) {
      const elem = <HTMLElement>selected.item(i);
      this.removeSelectedStatus(elem);
    }
    $$(suggestion).addClass(this.options.selectedClass);
    this.updateSelectedSuggestion(suggestion.innerText);
    this.updateAreaSelectedIfDefined(suggestion, 'true');
  }

  private updateSelectedSuggestion(suggestion: string) {
    $$(this.root).trigger(OmniboxEvents.querySuggestGetFocus, <IQuerySuggestSelection>{
      suggestion
    });
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

    input.setAttribute('aria-activedescendant', '');
    input.setAttribute('aria-controls', 'coveo-magicbox-suggestions');
    input.setAttribute('aria-autocomplete', 'list');
  }
}
