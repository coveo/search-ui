import { $$ } from '../utils/Dom';
import { InputManager } from './InputManager';
import { each, defaults, indexOf, compact } from 'underscore';
import { l } from '../strings/Strings';

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
  private pendingSuggestion: Promise<Suggestion[]>;
  private options: SuggestionsManagerOptions;
  public hasSuggestions: boolean;

  constructor(
    private element: HTMLElement,
    private magicBoxContainer: HTMLElement,
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

    this.addAccessibilitiesProperties();
  }

  public handleMouseOver(e) {
    let target = $$(<HTMLElement>e.target);
    let parents = target.parents(this.options.selectableClass);
    if (target.hasClass(this.options.selectableClass)) {
      this.addSelectedClass(target.el);
    } else if (parents.length > 0 && this.element.contains(parents[0])) {
      this.addSelectedClass(parents[0]);
    }
  }

  public handleMouseOut(e) {
    let target = $$(<HTMLElement>e.target);
    let targetParents = target.parents(this.options.selectableClass);

    //e.relatedTarget is not available if moving off the browser window
    if (e.relatedTarget) {
      let relatedTargetParents = $$(<HTMLElement>e.relatedTarget).parents(this.options.selectableClass);
      if (target.hasClass(this.options.selectedClass) && !$$(<HTMLElement>e.relatedTarget).hasClass(this.options.selectableClass)) {
        target.removeClass(this.options.selectedClass);
      } else if (relatedTargetParents.length == 0 && targetParents.length > 0) {
        $$(targetParents[0]).removeClass(this.options.selectedClass);
      }
    } else {
      if (target.hasClass(this.options.selectedClass)) {
        target.removeClass(this.options.selectedClass);
      } else if (targetParents.length > 0) {
        $$(targetParents[0]).removeClass(this.options.selectedClass);
      }
    }
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
      this.addSelectedClass(newlySelected);
      $$(newlySelected).addClass(this.options.selectedClass);
      $$(this.inputManager.input).setAttribute('aria-activedescendant', $$(newlySelected).getAttribute('id'));
    } else {
      $$(this.inputManager.input).setAttribute('aria-activedescendant', '');
    }

    return newlySelected;
  }

  public moveDown(): Suggestion {
    return this.returnMoved(this.move('down'));
  }

  public moveUp(): Suggestion {
    return this.returnMoved(this.move('up'));
  }

  public select() {
    const selected = <HTMLElement>this.element.getElementsByClassName(this.options.selectedClass).item(0);
    if (selected != null) {
      $$(selected).trigger('keyboardSelect');
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
    this.element.setAttribute('id', 'magic-box-suggestions');
    each(suggestions, (suggestion: Suggestion) => {
      let dom = suggestion.dom;
      if (!dom) {
        dom = document.createElement('div');
        dom.className = 'magic-box-suggestion';
        dom.setAttribute('id', `magic-box-suggestion-${indexOf(suggestions, suggestion)}`);

        if (suggestion.html != null) {
          dom.innerHTML = suggestion.html;
        } else if (suggestion.text != null) {
          dom.appendChild(document.createTextNode(suggestion.text));
        } else if (suggestion.separator != null) {
          dom.className = 'magic-box-suggestion-seperator';
          const suggestionLabel = document.createElement('div');
          suggestionLabel.className = 'magic-box-suggestion-seperator-label';
          suggestionLabel.appendChild(document.createTextNode(suggestion.separator));
          dom.appendChild(suggestionLabel);
        }
        $$(dom).on('click', () => {
          suggestion.onSelect();
        });
        $$(dom).on('keyboardSelect', () => {
          suggestion.onSelect();
        });
        $$(dom).addClass(this.options.selectableClass);
      } else {
        // this need to be done if the selection is in cache and the dom is set in the suggestion
        $$(dom).removeClass(this.options.selectedClass);
        const found = $$(dom).find('.' + this.options.selectableClass);
        $$(found).removeClass(this.options.selectedClass);
      }
      dom['suggestion'] = suggestion;
      this.element.appendChild(dom);
    });
    if (suggestions.length > 0) {
      $$(this.element).addClass('magic-box-hasSuggestion');
      $$(this.magicBoxContainer).setAttribute('aria-expanded', 'true');
      this.hasSuggestions = true;
    } else {
      $$(this.element).removeClass('magic-box-hasSuggestion');
      $$(this.magicBoxContainer).setAttribute('aria-expanded', 'false');
      this.hasSuggestions = false;
    }
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

  private addSelectedClass(suggestion: HTMLElement): void {
    const selected = this.element.getElementsByClassName(this.options.selectedClass);
    for (let i = 0; i < selected.length; i++) {
      const elem = <HTMLElement>selected.item(i);
      $$(elem).removeClass(this.options.selectedClass);
    }
    $$(suggestion).addClass(this.options.selectedClass);
  }

  private addAccessibilitiesProperties() {
    $$(this.element).setAttribute('role', 'listbox');
    $$(this.element).setAttribute('id', 'coveo-magicbox-suggestions');
    $$(this.element).setAttribute('aria-label', l('SuggestedQueries'));

    $$(this.magicBoxContainer).setAttribute('aria-expanded', 'false');
    $$(this.magicBoxContainer).setAttribute('aria-haspopup', 'listbox');
    $$(this.magicBoxContainer).setAttribute('aria-owns', 'coveo-magibox-suggestions');

    $$(this.inputManager.input).setAttribute('aria-activedescendant', '');
  }
}
