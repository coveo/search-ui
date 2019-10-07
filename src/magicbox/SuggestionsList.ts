import { defaults } from 'underscore';
import { Dom, $$ } from '../utils/Dom';
import { Assert } from '../Core';
import { Suggestion } from './SuggestionsManager';

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

interface ActiveSuggestion extends Suggestion {
  deactivate: () => void;
}

export interface ISuggestionsListOptions {
  selectableClass?: string;
  selectedClass?: string;
  timeout?: number;
}

export type ReceivedSuggestion = Suggestion;

export type ReceivedSuggestions = ReceivedSuggestion[];

export const SuggestionIdPrefix = 'magic-box-suggestion-';

export type OnSelectionChangedCallback = () => any;

/**
 * This class renders a list of suggestions from [`OmniboxEvents.populateOmniboxSuggestions`]{@link OmniboxEvents.populateOmniboxSuggestions}
 * inside a given container and allows navigation within it. It waits to receive a first [`Suggestion`]{@link Suggestion}  before creating
 * any HTML element.
 */
export class SuggestionsList {
  private static setSuggestionId(element: HTMLElement, id: number) {
    element.id = SuggestionIdPrefix + id;
  }

  private static getSuggestionId(element: HTMLElement) {
    const strId = element.id.substr(SuggestionIdPrefix.length);
    return strId ? parseInt(strId, 10) : null;
  }

  private suggestionsContainer?: {
    results: Dom;
  };
  private options: ISuggestionsListOptions;
  private queryProcessingRejector: Function;
  private activeSuggestions: ActiveSuggestion[];
  private keyboardSelectionMode: boolean;

  constructor(
    private parentContainer: HTMLElement,
    options: ISuggestionsListOptions = {},
    private onSelectionChanged?: OnSelectionChangedCallback
  ) {
    this.options = defaults(options, <ISuggestionsListOptions>{
      selectableClass: 'magic-box-suggestion',
      selectedClass: 'magic-box-selected',
      timeout: 500
    });
  }

  /**
   * Waits for one of the following conditions to be true then creates a container and fills it with the results.
   * 1. No query was given
   * 2. All queries were completed
   * 3. [`timeout`]{@link SuggestionsList.options.timeout} has passed
   * If the function is called again while it's still processing, the previous call is cancelled and overriden by the new one.
   */
  public receiveSuggestions(variantSuggestionsQueries: Array<Promise<ReceivedSuggestions> | ReceivedSuggestions>): Promise<Suggestion[]> {
    return new Promise((resolve, reject) => {
      if (this.queryProcessingRejector) {
        this.queryProcessingRejector('new request queued');
      }

      const currentQueries = variantSuggestionsQueries
        .filter(suggestions => suggestions)
        .map(suggestions => (suggestions instanceof Promise ? suggestions : Promise.resolve(suggestions)));

      const receivedSuggestions: ReceivedSuggestion[] = [];
      let numOfUnresolvedQueries: number = currentQueries.length;

      const showAndReturn = () => {
        this.queryProcessingRejector = null;
        if (!this.suggestionsContainer) {
          this.buildSuggestionsListContainer();
        }
        this.clearSuggestions();
        this.appendSuggestions(receivedSuggestions);
        resolve(this.activeSuggestions);
      };

      if (numOfUnresolvedQueries === 0) {
        showAndReturn();
        return;
      }

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
            receivedSuggestions.push(...results);
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
    const selection = this.getSelectedSuggestion();
    if (!selection) {
      return null;
    }
    this.clearSelection();
    $$(selection.dom).trigger('keyboardSelect');
    return selection as Suggestion;
  }

  public moveFirst() {
    if (!this.activeSuggestions || this.activeSuggestions.length === 0) {
      return (this.keyboardSelectionMode = false);
    }
    this.setSelectedSuggestionId(0);
    return (this.keyboardSelectionMode = true);
  }

  public moveUp() {
    return this.move(Direction.Up);
  }

  public moveDown() {
    return this.move(Direction.Down);
  }

  public getSelectedSuggestionElement() {
    if (!this.suggestionsContainer) {
      return null;
    }
    const selectedElements = this.suggestionsContainer.results.findClass(this.options.selectedClass);
    if (!selectedElements || selectedElements.length !== 1) {
      return null;
    }
    return selectedElements[0];
  }

  public clearSelection() {
    const currentSelection = this.getSelectedSuggestionElement();
    if (!currentSelection) {
      return;
    }
    this.deselectElement(currentSelection);
    if (this.onSelectionChanged) {
      this.onSelectionChanged();
    }
  }

  private setSelectedSuggestionElement(element: HTMLElement) {
    this.clearSelection();
    if (!element) {
      return;
    }
    element.setAttribute('aria-selected', 'true');
    element.classList.add(this.options.selectedClass);
    if (this.onSelectionChanged) {
      this.onSelectionChanged();
    }
  }

  private getSelectedSuggestionId() {
    const element = this.getSelectedSuggestionElement();
    if (!element) {
      return null;
    }
    return SuggestionsList.getSuggestionId(element);
  }

  private setSelectedSuggestionId(id: number) {
    Assert.isLargerOrEqualsThan(0, id);
    Assert.isSmallerThan(this.activeSuggestions.length, id);
    if (!this.activeSuggestions) {
      return;
    }
    this.setSelectedSuggestionElement(this.activeSuggestions[id].dom);
  }

  private getSelectedSuggestion() {
    if (!this.activeSuggestions || this.activeSuggestions.length === 0) {
      return null;
    }
    const suggestionId = this.getSelectedSuggestionId();
    if (suggestionId === null) {
      return null;
    }
    return this.activeSuggestions[suggestionId];
  }

  private deselectElement(element: HTMLElement) {
    this.keyboardSelectionMode = false;
    element.setAttribute('aria-selected', 'false');
    element.classList.remove(this.options.selectedClass);
  }

  private clearSuggestions() {
    this.keyboardSelectionMode = false;
    if (this.activeSuggestions) {
      this.activeSuggestions.forEach(preview => preview.deactivate());
    }
    this.activeSuggestions = [];
    if (this.suggestionsContainer) {
      this.suggestionsContainer.results.empty();
    }
  }

  private createDOMFromSuggestion(suggestion: Suggestion): HTMLElement {
    const dom = $$('div', {
      classList: ['magic-box-suggestion', this.options.selectableClass]
    }).el;
    if (suggestion.html) {
      dom.innerHTML = suggestion.html;
      return dom;
    }
    if (suggestion.text) {
      dom.innerText = suggestion.text;
    }
    return dom;
  }

  private modifyDOMFromExistingSuggestion(suggestion: Suggestion): HTMLElement {
    const dom = suggestion.dom.cloneNode(true) as HTMLElement;
    this.deselectElement(dom);
    $$(dom)
      .findClass(this.options.selectableClass)
      .forEach(selectable => this.deselectElement(selectable as HTMLElement));
    return dom;
  }

  private appendSuggestions(suggestions: ReceivedSuggestions) {
    suggestions.forEach(suggestion =>
      this.appendSuggestion({
        ...suggestion,
        dom: suggestion.dom ? this.modifyDOMFromExistingSuggestion(suggestion) : this.createDOMFromSuggestion(suggestion)
      })
    );
  }

  private appendSuggestion(suggestion: ReceivedSuggestion) {
    SuggestionsList.setSuggestionId(suggestion.dom, this.activeSuggestions.length);
    suggestion.dom.setAttribute('role', 'option');
    suggestion.dom.setAttribute('aria-selected', 'false');
    suggestion.dom.setAttribute('aria-label', suggestion.text);
    const events: { name: string; funct: (e: Event) => void }[] = [
      {
        name: 'mouseover',
        funct: () => {
          this.keyboardSelectionMode = false;
          this.setSelectedSuggestionElement(suggestion.dom);
        }
      },
      {
        name: 'mouseout',
        funct: () => {
          this.deselectElement(suggestion.dom);
        }
      },
      {
        name: 'keyboardSelect',
        funct: () => suggestion.onSelect && suggestion.onSelect()
      }
    ];
    events.forEach(event => $$(suggestion.dom).on(event.name, event.funct));
    const activeSuggestion: ActiveSuggestion = {
      ...suggestion,
      deactivate: () => events.forEach(event => suggestion.dom.removeEventListener(event.name, event.funct))
    };
    if (suggestion.separator) {
      suggestion.dom.classList.add('magic-box-suggestion-seperator');
      const suggestionLabel = $$(
        'div',
        {
          className: 'magic-box-suggestion-seperator-label'
        },
        suggestion.separator
      );
      suggestion.dom.appendChild(suggestionLabel.el);
    }
    this.activeSuggestions.push(activeSuggestion);
    this.suggestionsContainer.results.append(suggestion.dom);
  }

  private buildSuggestionsListContainer() {
    const results = $$('div', {
      className: 'coveo-magicbox-suggestions',
      id: 'coveo-magicbox-suggestions',
      role: 'listbox'
    });
    this.suggestionsContainer = {
      results
    };
    this.parentContainer.appendChild(results.el);
  }

  private move(direction: Direction) {
    const currentSelectionId = this.getSelectedSuggestionId();
    if (currentSelectionId === null) {
      return false;
    }
    this.keyboardSelectionMode = true;
    if (direction === Direction.Down) {
      if (currentSelectionId === this.activeSuggestions.length - 1) {
        return false;
      }
      this.setSelectedSuggestionId(currentSelectionId + 1);
      return true;
    } else {
      if (currentSelectionId === 0) {
        return false;
      }
      this.setSelectedSuggestionId(currentSelectionId - 1);
      return true;
    }
  }
}
