import { l } from '../strings/Strings';
import { $$ } from '../utils/Dom';
import { KEYBOARD } from '../utils/KeyboardUtils';
import { MagicBoxInstance } from './MagicBox';
import { Result } from './Result/Result';
import _ = require('underscore');

export class InputManager {
  public input: HTMLInputElement;
  private underlay: HTMLElement;
  private highlightContainer: HTMLElement;
  private ghostTextContainer: HTMLElement;

  private result: Result;
  private wordCompletion: string;

  private hasFocus: boolean = false;

  /**
   * Binding event
   */
  public onblur: () => void;
  public onfocus: () => void;
  public onkeyup: (key: number) => boolean;
  public onkeydown: (key: number) => boolean;
  public onchangecursor: () => void;
  public ontabpress: () => void;

  constructor(element: HTMLElement, private onchange: (text: string, wordCompletion: boolean) => void, private magicBox: MagicBoxInstance) {
    this.underlay = document.createElement('div');
    this.underlay.className = 'magic-box-underlay';

    this.highlightContainer = document.createElement('span');
    this.highlightContainer.className = 'magic-box-highlight-container';
    this.underlay.appendChild(this.highlightContainer);

    this.ghostTextContainer = document.createElement('span');
    this.ghostTextContainer.className = 'magic-box-ghost-text';
    this.underlay.appendChild(this.ghostTextContainer);

    this.input = $$(element).find('input') as HTMLInputElement;
    if (!this.input) {
      this.input = document.createElement('input');
      element.appendChild(this.underlay);
      element.appendChild(this.input);
    } else {
      element.insertBefore(this.underlay, this.input);
    }

    this.setupHandler();
    this.addAccessibilitiesProperties();
  }

  /**
   * Update the input with the result value
   */
  private updateInput() {
    if (this.input.value != this.result.input) {
      this.input.value = this.result.input;
      if (this.hasFocus) {
        this.setCursor(this.getValue().length);
      }
    }
  }

  /**
   * Update the highlight with the result value
   */
  private updateHighlight() {
    $$(this.highlightContainer).empty();
    this.highlightContainer.appendChild(this.result.toHtmlElement());
  }

  /**
   * Update the ghostText with the wordCompletion
   */
  private updateWordCompletion() {
    $$(this.ghostTextContainer).empty();
    this.ghostTextContainer.innerHTML = '';
    if (this.wordCompletion != null) {
      this.ghostTextContainer.appendChild(document.createTextNode(this.wordCompletion.substr(this.result.input.length)));
    }
  }

  /**
   * Set the result and update visual if needed
   */
  public setResult(result: Result, wordCompletion?: string) {
    this.result = result;

    this.updateInput();

    this.updateHighlight();

    // reuse last wordCompletion for a better visual
    if (_.isUndefined(wordCompletion) && this.wordCompletion != null && this.wordCompletion.indexOf(this.result.input) == 0) {
      this.updateWordCompletion();
    } else {
      this.setWordCompletion(wordCompletion);
    }
  }

  /**
   * Set the word completion. will be ignore if the word completion do not start with the result input
   */
  public setWordCompletion(wordCompletion: string) {
    if (wordCompletion != null && wordCompletion.toLowerCase().indexOf(this.result.input.toLowerCase()) != 0) {
      wordCompletion = null;
    }
    this.wordCompletion = wordCompletion;
    this.updateWordCompletion();
  }

  /**
   * Set cursor position
   */
  public setCursor(index: number) {
    this.input.focus();
    if ((<any>this.input).createTextRange) {
      var range = (<any>this.input).createTextRange();
      range.move('character', index);
      range.select();
    } else if (this.input.selectionStart != null) {
      this.input.focus();
      this.input.setSelectionRange(index, index);
    }
  }

  public getCursor() {
    return this.input.selectionStart;
  }

  private setupHandler() {
    this.input.onblur = () => {
      this.hasFocus = false;
      setTimeout(() => {
        if (!this.hasFocus) {
          this.onblur && this.onblur();
        }
      }, 300);
    };
    this.input.onfocus = e => {
      if (!this.hasFocus) {
        this.hasFocus = true;
        this.onfocus && this.onfocus();
      }
    };
    this.input.onkeydown = e => {
      this.keydown(e);
    };
    this.input.onkeyup = e => {
      this.keyup(e);
    };
    this.input.onclick = () => {
      this.onchangecursor();
    };
    this.input.oncut = () => {
      setTimeout(() => {
        this.onInputChange();
      });
    };
    this.input.onpaste = () => {
      setTimeout(() => {
        this.onInputChange();
      });
    };
  }

  private addAccessibilitiesProperties() {
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('role', 'searchbox');
    this.input.setAttribute('form', 'coveo-dummy-form');
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('title', `${l('InsertAQuery')}. ${l('PressEnterToSend')}`);
  }

  public focus() {
    this.hasFocus = true;
    // neet a timeout for IE8-9
    setTimeout(() => {
      this.input.focus();
      this.setCursor(this.getValue().length);
    });
  }

  public blur() {
    if (this.hasFocus) {
      this.input.blur();
    }
  }

  private keydown(e: KeyboardEvent) {
    switch (e.keyCode || e.which) {
      case KEYBOARD.TAB:
        // Take care of not "preventing" the default event behaviour : For accessibility reasons, it is much simpler
        // to simply let the browser do it's standard action (which is to focus out of the input).
        // Instead, handle "tabPress" immediately instead of "keyup".
        // The focus will be on the next element in the page when the key is released, so keyup on the input will never be triggered.
        this.tabPress();
        this.magicBox.clearSuggestion();
        break;
      default:
        e.stopPropagation();
        if (this.onkeydown == null || this.onkeydown(e.keyCode || e.which)) {
          requestAnimationFrame(() => {
            this.onInputChange();
          });
        } else {
          e.preventDefault();
        }
        break;
    }
  }

  private keyup(e: KeyboardEvent) {
    switch (e.keyCode || e.which) {
      case 37: // Left
      case 39: // Right
        this.onchangecursor();
        break;
      default:
        if (this.onkeydown == null || this.onkeyup(e.keyCode || e.which)) {
          this.onInputChange();
        } else {
          e.preventDefault();
        }
        break;
    }
  }

  private tabPress() {
    this.ontabpress && this.ontabpress();
    this.onblur && this.onblur();
  }

  private onInputChange() {
    if (this.result.input != this.input.value) {
      this.onchange(this.input.value, false);
    }
  }

  public getValue() {
    return this.input.value;
  }

  public getWordCompletion() {
    return this.wordCompletion;
  }
}
