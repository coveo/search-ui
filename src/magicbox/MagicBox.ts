import { $$ } from '../utils/Dom';
import { Result } from './Result/Result';
import { Grammar } from './Grammar';
import { doMagicBoxExport } from './doMagicBoxExport';
import { Suggestion, SuggestionsManager } from './SuggestionsManager';
import { InputManager } from './InputManager';
import { isUndefined, each, find } from 'underscore';
import { MagicBoxClear } from './MagicBoxClear';

export interface Options {
  inline?: boolean;
  selectableSuggestionClass?: string;
  selectedSuggestionClass?: string;
  suggestionTimeout?: number;
}

export class MagicBoxInstance {
  public onblur: () => void;
  public onfocus: () => void;
  public onchange: () => void;
  public onsuggestions: (suggestions: Suggestion[]) => void;
  public onsubmit: () => void;
  public onselect: (suggestion: Suggestion) => void;
  public onclear: () => void;
  public onmove: () => void;
  public ontabpress: () => void;

  public getSuggestions: () => Array<Promise<Suggestion[]> | Suggestion[]>;

  private inputManager: InputManager;
  private suggestionsManager: SuggestionsManager;
  private magicBoxClear: MagicBoxClear;

  private lastSuggestions: Suggestion[] = [];

  private result: Result;
  private displayedResult: Result;

  constructor(public element: HTMLElement, public grammar: Grammar, public options: Options = {}) {
    if (isUndefined(this.options.inline)) {
      this.options.inline = false;
    }
    $$(element).addClass('magic-box');
    if (this.options.inline) {
      $$(element).addClass('magic-box-inline');
    }
    $$(this.element).setAttribute('role', 'combobox');

    this.result = this.grammar.parse('');
    this.displayedResult = this.result.clean();

    let inputContainer = $$(element).find('.magic-box-input');
    if (!inputContainer) {
      inputContainer = document.createElement('div');
      inputContainer.className = 'magic-box-input';
      element.appendChild(inputContainer);
    }

    this.inputManager = new InputManager(
      inputContainer,
      (text, wordCompletion) => {
        if (!wordCompletion) {
          this.setText(text);
          this.showSuggestion();
          this.onchange && this.onchange();
        } else {
          this.setText(text);
          this.onselect && this.onselect(this.getFirstSuggestionText());
        }
      },
      this
    );

    this.inputManager.ontabpress = () => {
      this.ontabpress && this.ontabpress();
    };

    const existingValue = this.inputManager.getValue();
    if (existingValue) {
      this.displayedResult.input = existingValue;
    }

    this.inputManager.setResult(this.displayedResult);

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'magic-box-suggestions';
    this.element.appendChild(suggestionsContainer);

    this.suggestionsManager = new SuggestionsManager(suggestionsContainer, this.element, this.inputManager, {
      selectableClass: this.options.selectableSuggestionClass,
      selectedClass: this.options.selectedSuggestionClass,
      timeout: this.options.suggestionTimeout
    });

    this.magicBoxClear = new MagicBoxClear(this);
    this.setupHandler();
  }

  public getResult() {
    return this.result;
  }

  public getDisplayedResult() {
    return this.displayedResult;
  }

  public setText(text: string) {
    $$(this.element).toggleClass('magic-box-notEmpty', text.length > 0);
    this.magicBoxClear.toggleTabindex(text.length > 0);

    this.result = this.grammar.parse(text);
    this.displayedResult = this.result.clean();

    this.inputManager.setResult(this.displayedResult);
  }

  public setCursor(index: number) {
    this.inputManager.setCursor(index);
  }

  public getCursor() {
    return this.inputManager.getCursor();
  }

  public resultAtCursor(match?: string | { (result: Result): boolean }): Result[] {
    return this.displayedResult.resultAt(this.getCursor(), match);
  }

  private setupHandler() {
    this.inputManager.onblur = () => {
      $$(this.element).removeClass('magic-box-hasFocus');
      this.onblur && this.onblur();
      if (!this.options.inline) {
        this.clearSuggestion();
      }
    };

    this.inputManager.onfocus = () => {
      $$(this.element).addClass('magic-box-hasFocus');
      this.showSuggestion();
      this.onfocus && this.onfocus();
    };

    this.inputManager.onkeydown = (key: number) => {
      if (key == 38 || key == 40) {
        // Up, Down
        return false;
      }
      if (key == 13) {
        // Enter
        const suggestion = this.suggestionsManager.selectAndReturnKeyboardFocusedElement();
        if (suggestion == null) {
          this.onsubmit && this.onsubmit();
        }
        return false;
      } else if (key == 27) {
        // ESC
        this.clearSuggestion();
        this.blur();
      }
      return true;
    };

    this.inputManager.onchangecursor = () => {
      this.showSuggestion();
    };

    this.inputManager.onkeyup = (key: number) => {
      if (key == 38) {
        // Up
        this.onmove && this.onmove();
        this.focusOnSuggestion(this.suggestionsManager.moveUp());
        this.onchange && this.onchange();
      } else if (key == 40) {
        // Down
        this.onmove && this.onmove();
        this.focusOnSuggestion(this.suggestionsManager.moveDown());
        this.onchange && this.onchange();
      } else {
        return true;
      }
      return false;
    };
  }

  public showSuggestion() {
    this.suggestionsManager.mergeSuggestions(this.getSuggestions != null ? this.getSuggestions() : [], suggestions => {
      this.updateSuggestion(suggestions);
    });
  }

  private updateSuggestion(suggestions: Suggestion[]) {
    this.lastSuggestions = suggestions;
    const firstSuggestion = this.getFirstSuggestionText();
    this.inputManager.setWordCompletion(firstSuggestion && firstSuggestion.text);
    this.onsuggestions && this.onsuggestions(suggestions);
    each(suggestions, (suggestion: Suggestion) => {
      if (suggestion.onSelect == null && suggestion.text != null) {
        suggestion.onSelect = () => {
          this.setText(suggestion.text);
          this.onselect && this.onselect(suggestion);
        };
      }
    });
  }

  public focus() {
    $$(this.element).addClass('magic-box-hasFocus');
    this.inputManager.focus();
  }

  public blur() {
    this.inputManager.blur();
  }

  public clearSuggestion() {
    this.suggestionsManager.mergeSuggestions([], suggestions => {
      this.updateSuggestion(suggestions);
    });
    this.inputManager.setWordCompletion(null);
  }

  private focusOnSuggestion(suggestion: Suggestion) {
    if (suggestion == null || suggestion.text == null) {
      suggestion = this.getFirstSuggestionText();
      this.inputManager.setResult(this.displayedResult, suggestion && suggestion.text);
    } else {
      this.inputManager.setResult(this.grammar.parse(suggestion.text).clean(), suggestion.text);
    }
  }

  private getFirstSuggestionText(): Suggestion {
    return find(this.lastSuggestions, suggestion => suggestion.text != null);
  }

  public getText() {
    return this.inputManager.getValue();
  }

  public getWordCompletion() {
    return this.inputManager.getWordCompletion();
  }

  public clear() {
    this.setText('');
    this.showSuggestion();
    this.focus();
    this.onclear && this.onclear();
  }

  public hasSuggestions() {
    return this.suggestionsManager.hasSuggestions;
  }
}

export function createMagicBox(element: HTMLElement, grammar: Grammar, options?: Options) {
  return new MagicBoxInstance(element, grammar, options);
}

export function requestAnimationFrame(callback: () => void) {
  if ('requestAnimationFrame' in window) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(callback);
}

doMagicBoxExport();
