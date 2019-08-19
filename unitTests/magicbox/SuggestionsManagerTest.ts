import { InputManager } from '../../src/magicbox/InputManager';
import { MagicBoxInstance } from '../../src/magicbox/MagicBox';
import { SuggestionsManager } from '../../src/magicbox/SuggestionsManager';
import { $$, Dom } from '../../src/utils/Dom';

export function SuggestionsManagerTest() {
  describe('Suggestions manager', () => {
    const LOCKED_LOCKER_SERVICE_ELEMENT = {};
    let container: Dom;
    let suggestionContainer: Dom;
    let suggestionManager: SuggestionsManager;
    let suggestion: Dom;
    let elementInsideSuggestion: Dom;
    let selectableClass = 'selectable';
    let selectedClass = 'selected';

    beforeEach(() => {
      buildContainer();
      const root = document.createElement('div');
      const inputManager = new InputManager(document.createElement('div'), () => {}, {} as MagicBoxInstance, root);

      suggestionManager = new SuggestionsManager(suggestionContainer.el, document.createElement('div'), root, inputManager, {
        selectedClass,
        selectableClass
      });
    });

    it('builds suggestions parent correctly when adding a suggestion', () => {
      suggestionManager.updateSuggestions([{}]);

      expect(suggestionManager.hasSuggestions).toBe(true);
      expect($$(suggestionContainer).hasClass('magic-box-hasSuggestion')).toBe(true);

      const suggestionsElement = $$(suggestionContainer).find('.coveo-magicbox-suggestions');
      expect(suggestionsElement).toBeTruthy();
      expect(suggestionsElement.children.length).toBe(1);
      expect(suggestionsElement.getAttribute('role')).toBe('listbox');
    });

    it('adds an empty option child to the suggestions parent when emptying sugggestions', () => {
      // Start by adding a suggestion so that elements are correctly created first
      suggestionManager.updateSuggestions([{}]);
      suggestionManager.updateSuggestions([]);

      expect(suggestionManager.hasSuggestions).toBe(false);
      expect($$(suggestionContainer).hasClass('magic-box-hasSuggestion')).toBe(false);

      const suggestionsElement = $$(suggestionContainer).find('.coveo-magicbox-suggestions');
      expect(suggestionsElement.childElementCount).toBe(1);
      expect(suggestionsElement.firstChild.textContent).toBe('');
    });

    it('builds suggestion children correctly when adding a suggestion', () => {
      suggestionManager.updateSuggestions([{}]);

      const suggestionElement = $$(suggestionContainer).find('#magic-box-suggestion-0');
      expect(suggestionElement).toBeTruthy();
      expect(suggestionElement.getAttribute('role')).toBe('option');
    });

    it('returns the correct selected element with keyboard on move down', () => {
      suggestionManager.moveDown();
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect($$(selectedWithKeyboard).hasClass(selectedClass)).toBe(true);
      expect($$(selectedWithKeyboard).getAttribute('aria-selected')).toBe('true');
      expect(selectedWithKeyboard).toBe(suggestion.el);
    });

    it('returns the correct selected element with keyboard on move up', () => {
      suggestionManager.moveUp();
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect($$(selectedWithKeyboard).hasClass(selectedClass)).toBe(true);
      expect($$(selectedWithKeyboard).getAttribute('aria-selected')).toBe('true');
      expect(selectedWithKeyboard).toBe(suggestion.el);
    });

    it('returns the correct selected element with keyboard on move left', () => {
      suggestionManager.moveLeft();
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect($$(selectedWithKeyboard).hasClass(selectedClass)).toBe(true);
      expect($$(selectedWithKeyboard).getAttribute('aria-selected')).toBe('true');
      expect(selectedWithKeyboard).toBe(suggestion.el);
    });

    it('returns the correct selected element with keyboard on move right', () => {
      suggestionManager.moveRight();
      const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
      expect($$(selectedWithKeyboard).hasClass(selectedClass)).toBe(true);
      expect($$(selectedWithKeyboard).getAttribute('aria-selected')).toBe('true');
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

    it('adds selected class and sets aria-selected to true when moving on element that is selectable', () => {
      suggestionManager.handleMouseOver({
        target: suggestion.el
      });
      expect(suggestion.hasClass(selectedClass)).toBe(true);
      expect(suggestion.getAttribute('aria-selected')).toBe('true');
    });

    it('adds selected class and sets aria-selected to true when moving on element that is inside a selectable element', () => {
      suggestionManager.handleMouseOver({
        target: elementInsideSuggestion.el
      });
      expect(suggestion.hasClass(selectedClass)).toBe(true);
      expect(suggestion.getAttribute('aria-selected')).toBe('true');
    });

    it('removes selected class and sets aria-selected to false when moving off a selected element', () => {
      suggestion.addClass(selectedClass);
      suggestion.setAttribute('aria-selected', 'true');

      suggestionManager.handleMouseOut({
        target: suggestion.el,
        relatedTarget: container.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
      expect(suggestion.getAttribute('aria-selected')).toBe('false');
    });

    it('removes selected class and sets aria-selected to false when moving off a selected element in LockerService', () => {
      suggestion.addClass(selectedClass);
      suggestion.setAttribute('aria-selected', 'true');

      suggestionManager.handleMouseOut({
        target: suggestion.el,
        relatedTarget: LOCKED_LOCKER_SERVICE_ELEMENT
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
      expect(suggestion.getAttribute('aria-selected')).toBe('false');
    });

    it('removes selected class and sets aria-selected to false when moving off an element that is inside a selected element', () => {
      suggestion.addClass(selectedClass);
      suggestion.setAttribute('aria-selected', 'true');

      suggestionManager.handleMouseOut({
        target: elementInsideSuggestion.el,
        relatedTarget: container.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
      expect(suggestion.getAttribute('aria-selected')).toBe('false');
    });

    it('removes selected class and sets aria-selected to false when moving off an element that is inside a selected element in LockerService', () => {
      suggestion.addClass(selectedClass);
      suggestion.setAttribute('aria-selected', 'true');

      suggestionManager.handleMouseOut({
        target: elementInsideSuggestion.el,
        relatedTarget: LOCKED_LOCKER_SERVICE_ELEMENT
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
      expect(suggestion.getAttribute('aria-selected')).toBe('false');
    });

    it('removes selected class and sets aria-selected to false when moving from a selected element to off the browser window', () => {
      suggestion.addClass(selectedClass);
      suggestion.setAttribute('aria-selected', 'true');

      suggestionManager.handleMouseOut({
        target: suggestion.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
      expect(suggestion.getAttribute('aria-selected')).toBe('false');
    });

    it('removes selected class and sets aria-selected to false when moving from an element inside a selected element to off the browser window', () => {
      suggestion.addClass(selectedClass);
      suggestion.setAttribute('aria-selected', 'true');

      suggestionManager.handleMouseOut({
        target: elementInsideSuggestion.el
      });

      expect(suggestion.hasClass(selectedClass)).toBe(false);
      expect(suggestion.getAttribute('aria-selected')).toBe('false');
    });

    it('does not remove selected class or set aria-selected to false when moving element between two element inside the suggestion', () => {
      let someDeepElement = document.createElement('div');
      elementInsideSuggestion.el.appendChild(someDeepElement);
      suggestion.addClass(selectedClass);
      suggestion.setAttribute('aria-selected', 'true');

      suggestionManager.handleMouseOut({
        target: elementInsideSuggestion.el,
        relatedTarget: someDeepElement
      });

      expect(suggestion.hasClass(selectedClass)).toBe(true);
      expect(suggestion.getAttribute('aria-selected')).toBe('true');
    });

    function buildContainer() {
      container = $$(document.createElement('div'));
      suggestionContainer = $$(document.createElement('div'));
      suggestion = $$(document.createElement('div'));
      elementInsideSuggestion = $$(document.createElement('div'));

      suggestion.addClass(selectableClass);
      suggestion.setAttribute('aria-selected', 'false');
      suggestion.el.appendChild(elementInsideSuggestion.el);
      suggestionContainer.el.appendChild(suggestion.el);
      container.el.appendChild(suggestionContainer.el);
    }
  });
}
