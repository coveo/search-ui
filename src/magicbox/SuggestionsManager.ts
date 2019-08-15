import { $$, Dom } from '../utils/Dom';
import { InputManager } from './InputManager';
import { each, defaults, indexOf, compact } from 'underscore';
import { OmniboxEvents, Component } from '../Core';
import { IQuerySuggestSelection } from '../events/OmniboxEvents';

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

type direction = 'up' | 'down' | 'left' | 'right';

export class SuggestionsManager {
  public hasSuggestions: boolean;
  private pendingSuggestion: Promise<Suggestion[]>;
  private options: SuggestionsManagerOptions;
  private keyboardFocusedSuggestion: HTMLElement;
  private lastSelectedSuggestion: HTMLElement;

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

    this.addAccessibilityProperties();
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

  public moveDown() {
    const selected = this.move('down');
    return this.afterMoving(selected);
  }

  public moveUp() {
    const selected = this.move('up');
    return this.afterMoving(selected);
  }

  public moveLeft() {
    const selected = this.move('left');
    return this.afterMoving(selected);
  }

  public moveRight() {
    const selected = this.move('right');
    return this.afterMoving(selected);
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
    $$(this.element).empty();
    this.element.className = 'magic-box-suggestions';

    this.hasSuggestions = suggestions.length > 0;

    $$(this.element).toggleClass('magic-box-hasSuggestion', this.hasSuggestions);
    $$(this.magicBoxContainer).setAttribute('aria-expanded', this.hasSuggestions.toString());

    if (!this.hasSuggestions) {
      this.removeAccessibilityPropertiesForSuggestions();
      $$(this.root).trigger(OmniboxEvents.querySuggestLoseFocus);
      return;
    }

    const suggestionsContainer = this.buildSuggestionsContainer();
    const suggestionPreviewContainer = this.initPreviewForSuggestions(suggestionsContainer);
    $$(this.element).append(suggestionPreviewContainer.el);
    this.addAccessibilityPropertiesForSuggestions();

    each(suggestions, (suggestion: Suggestion) => {
      const dom = suggestion.dom ? this.modifyDomFromExistingSuggestion(suggestion.dom) : this.createDomFromSuggestion(suggestion);

      dom.setAttribute('id', `magic-box-suggestion-${indexOf(suggestions, suggestion)}`);
      dom.setAttribute('role', 'gridcell');
      dom.setAttribute('aria-selected', 'false');

      dom['suggestion'] = suggestion;
      suggestionsContainer.append(dom.el);
    });
    $$(this.root).trigger(OmniboxEvents.querySuggestRendered);
  }

  private afterMoving(selected) {
    if (this.htmlElementIsSuggestion(selected)) {
      return this.returnMoved(selected) as Suggestion;
    }
    return selected;
  }

  private processKeyboardSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.updateSelectedSuggestion(suggestion.innerText);
    this.keyboardFocusedSuggestion = suggestion;
    $$(this.inputManager.input).setAttribute('aria-activedescendant', $$(suggestion).getAttribute('id'));
  }

  private processKeyboardPreviewSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.keyboardFocusedSuggestion = suggestion;
  }

  private processMouseSelection(suggestion: HTMLElement) {
    this.addSelectedStatus(suggestion);
    this.updateSelectedSuggestion(suggestion.innerText);
    this.keyboardFocusedSuggestion = null;
  }

  private buildSuggestionsContainer() {
    return $$('div', {
      className: 'coveo-magicbox-suggestions'
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
      className: 'coveo-suggestion-container',
      role: 'grid'
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

  private move(direction: direction) {
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);
    if (previewSelectables.length > 0) {
      return this.moveWithQuerySuggestPreview(direction);
    }
    return this.moveWithinSuggestion(direction);
  }

  private moveWithinSuggestion(direction: direction) {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const selectables = $$(this.element).findAll(`.${this.options.selectableClass}`);
    const currentIndex = indexOf(selectables, currentlySelected);

    let index = direction == 'up' ? currentIndex - 1 : currentIndex + 1;
    index = (index + selectables.length) % selectables.length;

    this.lastSelectedSuggestion = selectables[index];

    return this.selectQuerySuggest(this.lastSelectedSuggestion);
  }

  private selectQuerySuggest(suggestion: HTMLElement) {
    if (suggestion) {
      this.processKeyboardSelection(suggestion);
    } else {
      this.keyboardFocusedSuggestion = null;
      this.inputManager.input.removeAttribute('aria-activedescendant');
    }

    return suggestion;
  }

  private moveWithQuerySuggestPreview(direction: direction) {
    const currentlySelected = $$(this.element).find(`.${this.options.selectedClass}`);
    const omniboxSelectables = $$(this.element).findAll(`.${this.options.selectableClass}`);
    const previewSelectables = $$(this.element).findAll(`.coveo-preview-selectable`);
    const omniboxIndex = indexOf(omniboxSelectables, currentlySelected);
    const previewIndex = indexOf(previewSelectables, currentlySelected);
    const noSelection = omniboxIndex == -1 && previewIndex == -1;

    if ((noSelection || omniboxIndex > -1) && (direction == 'up' || direction == 'down')) {
      return this.moveWithinSuggestion(direction);
    }

    if (previewSelectables.length == 0 || (direction == 'left' && previewIndex == -1)) {
      return this.lastSelectedSuggestion;
    }

    let index = previewIndex;
    if (direction == 'up' || direction == 'down') {
      if (previewSelectables.length < 4) {
        return this.lastSelectedSuggestion;
      }

      let offset = Math.ceil(previewSelectables.length / 2);
      index = direction == 'up' ? previewIndex - offset : previewIndex + offset;
    } else if (direction == 'left' || direction == 'right') {
      if (index === 0 && direction == 'left') {
        return this.selectQuerySuggest(this.lastSelectedSuggestion);
      }
      index = direction == 'left' ? previewIndex - 1 : previewIndex + 1;
    }
    index = (index + previewSelectables.length) % previewSelectables.length;

    this.processKeyboardPreviewSelection(previewSelectables[index]);
    return previewSelectables[index];
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

  private addAccessibilityProperties() {
    $$(this.magicBoxContainer).setAttribute('aria-expanded', 'false');
    $$(this.magicBoxContainer).setAttribute('aria-haspopup', 'listbox');
    this.inputManager.input.removeAttribute('aria-activedescendant');
  }

  private addAccessibilityPropertiesForSuggestions() {
    $$(this.magicBoxContainer).setAttribute('aria-owns', 'coveo-magicbox-suggestions');
    this.inputManager.input.setAttribute('aria-controls', 'coveo-magicbox-suggestions');
  }

  private removeAccessibilityPropertiesForSuggestions() {
    this.inputManager.input.removeAttribute('aria-activedescendant');
    this.inputManager.input.removeAttribute('aria-controls');
    this.magicBoxContainer.removeAttribute('aria-owns');
  }

  private htmlElementIsSuggestion(selected: HTMLElement) {
    const omniboxSelectables = $$(this.element).findAll(`.${this.options.selectableClass}`);
    return indexOf(omniboxSelectables, selected) > -1;
  }
}
