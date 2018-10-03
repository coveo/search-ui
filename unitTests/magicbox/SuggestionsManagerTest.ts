import { SuggestionsManager } from '../../src/magicbox/SuggestionsManager';
import { Dom } from '../../src/utils/Dom';
import { $$ } from '../../src/utils/Dom';
import { InputManager } from '../../src/magicbox/InputManager';
import { MagicBoxInstance } from '../../src/magicbox/MagicBox';

export function SuggestionsManagerTest() {
  describe('Suggestions manager', () => {
    let container: Dom;
    let suggestionContainer: Dom;
    let suggestionManager: SuggestionsManager;
    let suggestion: Dom;
    let elementInsideSuggestion: Dom;
    let selectableClass = 'selectable';
    let selectedClass = 'selected';

    beforeEach(() => {
      buildContainer();
      const inputManager = new InputManager(document.createElement('div'), () => {}, {} as MagicBoxInstance);

      suggestionManager = new SuggestionsManager(suggestionContainer.el, document.createElement('div'), inputManager, {
        selectedClass: selectedClass,
        selectableClass: selectableClass
      });
    });

    it('returns the correct selected element with keyboard on move down', () => {
      suggestionManager.moveDown();
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect($$(selectedWithKeyboard).hasClass(selectedClass)).toBe(true);
      expect(selectedWithKeyboard).toBe(suggestion.el);
    });

    it('returns the correct selected element with keyboard on move up', () => {
      suggestionManager.moveUp();
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect($$(selectedWithKeyboard).hasClass(selectedClass)).toBe(true);
      expect(selectedWithKeyboard).toBe(suggestion.el);
    });

    it('return no selected element with successive call to selectAndReturnKeyboardFocusedElement()', () => {
      suggestionManager.moveDown();
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect(selectedWithKeyboard).toBeDefined();

      const repeatCallToSelectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect(repeatCallToSelectedWithKeyboard).toBeNull();
    });

    it('return no selected element with keyboard on mouse over', () => {
      suggestionManager.handleMouseOver({
        target: suggestion.el
      });
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect(selectedWithKeyboard).toBeNull();
    });

    it('return no selected element with keyboard on mouse over following a move down', () => {
      suggestionManager.moveDown();
      suggestionManager.handleMouseOver({
        target: suggestion.el
      });
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect(selectedWithKeyboard).toBeNull();
    });

    it('return no selected element with keyboard on mouse over following a move up', () => {
      suggestionManager.moveUp();
      suggestionManager.handleMouseOver({
        target: suggestion.el
      });
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect(selectedWithKeyboard).toBeNull();
    });

    it('adds selected class when moving on element that is selectable', () => {
      suggestionManager.handleMouseOver({
        target: suggestion.el
      });
      expect(suggestion.hasClass(selectedClass)).toBe(true);
    });

    it('adds selected class when moving on element that is inside a selectable element', () => {
      suggestionManager.handleMouseOver({
        target: elementInsideSuggestion.el
      });
      expect(suggestion.hasClass(selectedClass)).toBe(true);
    });

    it('removes selected class when moving off a selected element', () => {
      suggestion.addClass(selectedClass);

      suggestionManager.handleMouseOut({
        target: suggestion.el,
        relatedTarget: container.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
    });

    it('removes selected class when moving off an element that is inside a selected element', () => {
      suggestion.addClass(selectedClass);

      suggestionManager.handleMouseOut({
        target: elementInsideSuggestion.el,
        relatedTarget: container.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
    });

    it('removes selected class when moving from a selected element to off the browser window', () => {
      suggestion.addClass(selectedClass);

      suggestionManager.handleMouseOut({
        target: suggestion.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
    });

    it('removes selected class when moving from an element inside a selected element to off the browser window', () => {
      suggestion.addClass(selectedClass);

      suggestionManager.handleMouseOut({
        target: elementInsideSuggestion.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
    });

    it('does not remove selected class when moving element between two element inside the suggestion', () => {
      let someDeepElement = document.createElement('div');
      elementInsideSuggestion.el.appendChild(someDeepElement);
      suggestion.addClass(selectedClass);

      suggestionManager.handleMouseOut({
        target: elementInsideSuggestion.el,
        relatedTarget: someDeepElement
      });

      expect(suggestion.hasClass(selectedClass)).toBe(true);
    });

    function buildContainer() {
      container = $$(document.createElement('div'));
      suggestionContainer = $$(document.createElement('div'));
      suggestion = $$(document.createElement('div'));
      elementInsideSuggestion = $$(document.createElement('div'));

      suggestion.addClass(selectableClass);
      suggestion.el.appendChild(elementInsideSuggestion.el);
      suggestionContainer.el.appendChild(suggestion.el);
      container.el.appendChild(suggestionContainer.el);
    }
  });
}
