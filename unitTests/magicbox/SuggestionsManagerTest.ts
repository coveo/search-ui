import { InputManager } from '../../src/magicbox/InputManager';
import { MagicBoxInstance } from '../../src/magicbox/MagicBox';
import { SuggestionsManager, Suggestion, suggestionListboxID } from '../../src/magicbox/SuggestionsManager';
import { $$, Dom } from '../../src/utils/Dom';
import { Utils } from '../../src/utils/Utils';
import { IMockEnvironment, MockEnvironmentBuilder } from '../MockEnvironment';
import { OmniboxEvents } from '../../src/Core';
import { last, first, toArray } from 'underscore';
import { ISearchResultPreview } from '../../src/magicbox/ResultPreviewsManager';
import {
  ResultPreviewsManagerEvents,
  IPopulateSearchResultPreviewsEventArgs,
  IUpdateResultPreviewsManagerOptionsEventArgs
} from '../../src/events/ResultPreviewsManagerEvents';

function deferAsync() {
  return Promise.resolve();
}

async function forEachAsync<T, U>(values: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]> {
  const accumulatedValues: U[] = [];
  for (let i = 0; i < values.length; i++) {
    accumulatedValues.push(await callbackfn(values[i], i, values));
  }
  return accumulatedValues;
}

export function SuggestionsManagerTest() {
  describe('SuggestionsManager', () => {
    const LOCKED_LOCKER_SERVICE_ELEMENT = {};
    const suggestionClass = 'selectable';
    const selectedClass = 'selected';

    describe('with preappended suggestions', () => {
      let container: Dom;
      let suggestionContainer: Dom;
      let suggestionManager: SuggestionsManager;
      let suggestion: Dom;
      let elementInsideSuggestion: Dom;

      beforeEach(() => {
        buildContainer();
        const inputManager = new InputManager(document.createElement('div'), () => {}, {} as MagicBoxInstance);

        suggestionManager = new SuggestionsManager(suggestionContainer.el, document.createElement('div'), inputManager, {
          selectedClass,
          suggestionClass
        });

        suggestionManager.updateSuggestions([buildSuggestion()]);
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

      it('clearKeyboardFocusedElement sets the keyboard focused element to null', () => {
        suggestionManager.moveDown();
        suggestionManager.clearKeyboardFocusedElement();
        expect(suggestionManager.selectAndReturnKeyboardFocusedElement()).toBeNull();
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
        const someDeepElement = document.createElement('div');
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
        container.el.appendChild(suggestionContainer.el);
      }

      function buildSuggestion(): Suggestion {
        const text = 'abc';
        suggestion = $$(
          'div',
          {
            className: suggestionClass,
            'aria-selected': false
          },
          (elementInsideSuggestion = $$('div', {}, text))
        );

        return { dom: suggestion.el, text, onSelect: () => {} };
      }
    });

    describe('with mock environment', () => {
      let env: IMockEnvironment;
      function buildEnvironment() {
        return (env = new MockEnvironmentBuilder().build());
      }

      let magicBoxContainer: Dom;
      function buildMagicBoxContainer() {
        return (magicBoxContainer = $$('div'));
      }

      function mockInputManager() {
        return <InputManager>{
          input: $$('input').el as HTMLInputElement,
          blur: jasmine.createSpy('blur') as () => void,
          expanded: null,
          activeDescendant: null
        };
      }

      let suggestionsManager: SuggestionsManager;
      let inputManager: InputManager;
      const timeout = 10;
      beforeEach(() => {
        suggestionsManager = new SuggestionsManager(
          buildEnvironment().root,
          buildMagicBoxContainer().el,
          (inputManager = mockInputManager()),
          {
            selectedClass,
            suggestionClass,
            timeout
          }
        );
      });

      it('sets the accesible role of MagicBox', () => {
        expect(magicBoxContainer.getAttribute('role')).toEqual('search');
      });

      it('sets aria-haspopup of MagicBox', () => {
        expect(magicBoxContainer.getAttribute('aria-haspopup')).toEqual('listbox');
      });

      it("sets aria-owns of InputManager to the id of SuggestionManager's listbox", () => {
        expect(inputManager.input.getAttribute('aria-owns')).toEqual(suggestionListboxID);
      });

      it("sets aria-controls of InputManager to the id of SuggestionManager's listbox", () => {
        expect(inputManager.input.getAttribute('aria-controls')).toEqual(suggestionListboxID);
      });

      it('sets aria-expanded of InputManager to false', () => {
        expect(inputManager.expanded).toEqual(false);
      });

      it("doesn't set activeDescendant in InputManager", () => {
        expect(inputManager.activeDescendant).toBeNull();
      });

      describe('calling receiveSuggestions', () => {
        const textSuggestions = ['4', 'right'];
        let suggestionOnSelects: { [text: string]: jasmine.Spy };
        let suggestions: Suggestion[];

        function createSuggestions() {
          suggestionOnSelects = textSuggestions.reduce((obj, text) => ({ ...obj, [text]: jasmine.createSpy(text) }), {});
          suggestions = textSuggestions.map(text => <Suggestion>{ text, onSelect: suggestionOnSelects[text] });
        }

        async function receiveSuggestions() {
          await suggestionsManager.receiveSuggestions([Promise.resolve(suggestions)]);
        }

        function waitForQuerySuggestRendered() {
          return new Promise(resolve => {
            $$(env.root).on(OmniboxEvents.querySuggestRendered, () => resolve());
          });
        }

        function mouseFocusSuggestion(suggestionId: number) {
          $$(suggestionElements[suggestionId]).trigger('mouseover');
        }

        let suggestionElements: HTMLElement[];

        async function renderSuggestions() {
          receiveSuggestions();
          await waitForQuerySuggestRendered();
          suggestionElements = $$(env.root).findClass(suggestionClass);
        }

        beforeEach(async done => {
          createSuggestions();
          await renderSuggestions();
          done();
        });

        it("doesn't set activeDescendant in InputManager", () => {
          expect(inputManager.activeDescendant).toBeNull();
        });

        it('sets expanded in InputManager', () => {
          expect(inputManager.expanded).toEqual(true);
        });

        it('sets activeDescendant in InputManager after focusing a suggestion', () => {
          mouseFocusSuggestion(1);
          expect(inputManager.activeDescendant).toEqual(suggestionElements[1]);
        });

        it('renders suggestions', () => {
          expect(suggestionElements.map(element => element.innerText)).toEqual(textSuggestions);
        });

        it('sorts suggestions by descending index value', async done => {
          suggestions[0].index = 100;
          suggestions[1].index = 200;
          await renderSuggestions();
          expect(suggestionElements[0].innerText).toEqual(textSuggestions[1]);
          done();
        });

        it('sorts suggestions by descending index index even with undefined values', async done => {
          suggestions[0].index = undefined;
          suggestions[1].index = 100;
          await renderSuggestions();
          expect(suggestionElements[0].innerText).toEqual(textSuggestions[1]);
          done();
        });

        it("doesn't have a previews container after focusing a suggestion", () => {
          mouseFocusSuggestion(0);
          expect($$(env.root).findClass('coveo-preview-container').length).toEqual(0);
        });

        it("doesn't select mouse focused suggestions", () => {
          suggestionElements.forEach((_, i) => {
            mouseFocusSuggestion(i);
            expect(suggestionsManager.selectAndReturnKeyboardFocusedElement()).toBeFalsy();
          });
        });

        it("doesn't have a selected suggestion by default", () => {
          expect(suggestionsManager.selectedSuggestion).toBeNull();
        });

        it('moving the focus down focuses the first suggestion', () => {
          suggestionsManager.moveDown();
          expect(suggestionsManager.selectedSuggestion.text).toEqual(first(suggestions).text);
        });

        it('moving the focus up focuses the first suggestion', () => {
          suggestionsManager.moveUp();
          expect(suggestionsManager.selectedSuggestion.text).toEqual(first(suggestions).text);
        });

        it('moving the focus up from the first suggestion focuses the last suggestion', () => {
          suggestionsManager.moveDown();
          suggestionsManager.moveUp();
          expect(suggestionsManager.selectedSuggestion.text).toEqual(last(suggestions).text);
        });

        it('moving the focus down from the last suggestion focuses the first suggestion', () => {
          suggestionsManager.moveDown();
          suggestionsManager.moveUp();
          suggestionsManager.moveDown();
          expect(suggestionsManager.selectedSuggestion.text).toEqual(first(suggestions).text);
        });

        it('moving the focus down multiple times can reach every suggestion', () => {
          suggestions.forEach(suggestion => {
            suggestionsManager.moveDown();
            expect(suggestionsManager.selectedSuggestion.text).toEqual(suggestion.text);
          });
        });

        it('moving the focus up multiple times can reach every suggestion', () => {
          suggestionsManager.moveDown();
          suggestions.reverse().forEach(suggestion => {
            suggestionsManager.moveUp();
            expect(suggestionsManager.selectedSuggestion.text).toEqual(suggestion.text);
          });
        });

        describe('with previews', () => {
          const previewClassName = 'coveo-preview-selectable';
          function buildPreview(text: string) {
            return <ISearchResultPreview>{
              element: $$(
                'div',
                {
                  className: previewClassName
                },
                text
              ).el,
              onSelect: jasmine.createSpy(`onSelect${text}`)
            };
          }

          const displayAfterDuration = 150;
          function setDisplayAfterDuration() {
            spyOn(suggestionsManager['resultPreviewsManager'], 'getExternalOptions' as any).and.returnValue(
              <IUpdateResultPreviewsManagerOptionsEventArgs>{
                displayAfterDuration
              }
            );
          }

          let populateSpy: jasmine.Spy;
          let waitForPreviewsPopulateEvent: () => Promise<any>;
          function bindPopulateEvent(getPreviews: (suggestionId: number) => Promise<ISearchResultPreview[]>) {
            let wasCalled = false;
            let onCall: () => any;
            populateSpy = jasmine.createSpy('PopulateSearchResultPreviews');
            $$(env.root).on(ResultPreviewsManagerEvents.populateSearchResultPreviews, (_, args: IPopulateSearchResultPreviewsEventArgs) => {
              populateSpy(args.suggestion);
              args.previewsQueries.push(getPreviews(textSuggestions.indexOf(args.suggestion.text)));
              if (onCall) {
                onCall();
                onCall = null;
              } else {
                wasCalled = true;
              }
            });
            waitForPreviewsPopulateEvent = () =>
              new Promise(resolve => {
                if (!wasCalled) {
                  onCall = () => resolve();
                  return;
                }
                wasCalled = false;
                resolve();
              });
          }

          let waitForSelectionUpdated: () => Promise<any>;
          function bindUpdateSelectedSuggestion() {
            const calls: Promise<any>[] = [];
            const oldFunc = suggestionsManager['updateSelectedSuggestion'].bind(suggestionsManager);
            suggestionsManager['updateSelectedSuggestion'] = suggestion => {
              const call = oldFunc(suggestion);
              calls.push(call);
              return call;
            };
            waitForSelectionUpdated = () => calls[calls.length - 1];
          }

          beforeEach(() => {
            jasmine.clock().install();
            setDisplayAfterDuration();
            bindUpdateSelectedSuggestion();
          });

          afterEach(() => {
            jasmine.clock().uninstall();
          });

          describe('timing out', () => {
            const resolveTime = timeout + 1;
            function createPreviewsPromise() {
              return Utils.resolveAfter(resolveTime, [buildPreview('abc')]);
            }

            beforeEach(() => {
              bindPopulateEvent(createPreviewsPromise);
            });

            it('times out if the previews takes too long to resolve', async done => {
              mouseFocusSuggestion(0);
              await deferAsync();
              jasmine.clock().tick(displayAfterDuration);
              await waitForPreviewsPopulateEvent();
              jasmine.clock().tick(timeout);
              await waitForSelectionUpdated();
              expect($$(env.root).findClass(previewClassName).length).toEqual(0);
              done();
            });
          });

          describe('within timeout delay', () => {
            let previewsBySuggestion: ISearchResultPreview[][];
            const textPreviews = [['4K TV', 'Set of 4 pairs of socks'], ['The right spoon', '🔶', 'Right angle SATA cable']];
            function buildPreviews() {
              previewsBySuggestion = textPreviews.map(previewTextsForSuggestion => previewTextsForSuggestion.map(buildPreview));
            }

            const previewsPromisesWaitTimes = [1, 2];
            function createPreviewsPromise(suggestionId: number) {
              return Utils.resolveAfter(previewsPromisesWaitTimes[suggestionId], previewsBySuggestion[suggestionId]);
            }

            beforeEach(() => {
              buildPreviews();
              bindPopulateEvent(createPreviewsPromise);
            });

            it("doesn't populate previews on initialization", () => {
              expect(populateSpy).not.toHaveBeenCalled();
            });

            it("doesn't append any previews when they aren't resolved yet", async done => {
              mouseFocusSuggestion(0);
              await deferAsync();
              jasmine.clock().tick(displayAfterDuration);
              await waitForPreviewsPopulateEvent();
              expect($$(env.root).findClass(previewClassName).length).toEqual(0);
              done();
            });

            it('appends previews when they are resolved', async done => {
              mouseFocusSuggestion(0);
              await deferAsync();
              jasmine.clock().tick(displayAfterDuration);
              await waitForPreviewsPopulateEvent();
              jasmine.clock().tick(previewsPromisesWaitTimes[0]);
              await waitForSelectionUpdated();
              expect($$(env.root).findClass(previewClassName).length).toBeGreaterThan(0);
              done();
            });

            describe('after keyboard focusing a suggestion', () => {
              let expectedSuggestionId: number;

              function moveDownToSuggestion(suggestionId: number) {
                if (expectedSuggestionId === suggestionId) {
                  return;
                }
                for (expectedSuggestionId; expectedSuggestionId < suggestionId; expectedSuggestionId++) {
                  suggestionsManager.moveDown();
                }
              }

              async function moveDownToSuggestionAndWait(suggestionId: number) {
                moveDownToSuggestion(suggestionId);
                jasmine.clock().tick(displayAfterDuration);
                await waitForPreviewsPopulateEvent();
                jasmine.clock().tick(previewsPromisesWaitTimes[suggestionId]);
                await waitForSelectionUpdated();
              }

              beforeEach(() => {
                expectedSuggestionId = -1;
              });

              it('has a previews container after focusing a suggestion', async done => {
                await moveDownToSuggestionAndWait(0);
                expect($$(env.root).findClass('coveo-preview-container').length).toEqual(1);
                done();
              });

              it('queries previews after `executePreviewsQueryDelay`', async done => {
                moveDownToSuggestion(0);
                jasmine.clock().tick(displayAfterDuration);
                await deferAsync();
                expect(populateSpy).toHaveBeenCalled();
                done();
              });

              it("doesn't query previews before `executePreviewsQueryDelay`", async done => {
                moveDownToSuggestion(0);
                jasmine.clock().tick(displayAfterDuration - 1);
                await deferAsync();
                expect(populateSpy).not.toHaveBeenCalled();
                done();
              });

              it("doesn't query previews if another suggestion is focused before the `executePreviewsQueryDelay`", async done => {
                moveDownToSuggestion(0);
                jasmine.clock().tick(displayAfterDuration - 1);
                moveDownToSuggestion(1);
                jasmine.clock().tick(1);
                await deferAsync();
                expect(populateSpy).not.toHaveBeenCalled();
                done();
              });

              it('only queries previews for the last focused suggestion', async done => {
                moveDownToSuggestion(0);
                jasmine.clock().tick(displayAfterDuration - 1);
                moveDownToSuggestion(1);
                jasmine.clock().tick(displayAfterDuration);
                await deferAsync();
                expect(populateSpy).toHaveBeenCalledTimes(1);
                expect((populateSpy.calls.mostRecent().args as [Suggestion])[0].text).toEqual(textSuggestions[1]);
                done();
              });

              it('populates the previews container', async done => {
                await forEachAsync(textPreviews, async (previewTextsForSuggestion, id) => {
                  await moveDownToSuggestionAndWait(id);
                  expect(
                    $$(env.root)
                      .findClass(previewClassName)
                      .map(element => element.innerText)
                  ).toEqual(previewTextsForSuggestion);
                });
                done();
              });

              it('moving the focus down multiple times can reach every suggestion', () => {
                suggestions.forEach(suggestion => {
                  suggestionsManager.moveDown();
                  expect(suggestionsManager.selectedSuggestion.text).toEqual(suggestion.text);
                });
              });

              it('moving the focus up multiple times can reach every suggestion', () => {
                suggestionsManager.moveDown();
                suggestions.reverse().forEach(suggestion => {
                  suggestionsManager.moveUp();
                  expect(suggestionsManager.selectedSuggestion.text).toEqual(suggestion.text);
                });
              });

              it("moving the focus right when there's previews blurs the suggestion", async done => {
                await moveDownToSuggestionAndWait(0);
                suggestionsManager.moveRight();
                expect(suggestionsManager.selectedSuggestion).toBeNull();
                done();
              });

              it("moving the focus right when there's previews sets aria-selected on the first preview", async done => {
                await moveDownToSuggestionAndWait(0);
                suggestionsManager.moveRight();
                const selectedElements = toArray<HTMLElement>(env.root.querySelectorAll('[aria-selected="true"]'));
                expect(selectedElements.length).toEqual(1);
                expect(selectedElements[0].innerText).toEqual(first(first(textPreviews)));
                done();
              });

              it('can select and return the first preview by moving the focus right from the first suggestion', async done => {
                await moveDownToSuggestionAndWait(0);
                suggestionsManager.moveRight();
                expect(suggestionsManager.selectAndReturnKeyboardFocusedElement().innerText).toEqual(first(first(textPreviews)));
                done();
              });

              it('moving the focus left from the first preview focuses on the first suggestion', async done => {
                await moveDownToSuggestionAndWait(0);
                suggestionsManager.moveRight();
                suggestionsManager.moveLeft();
                expect(suggestionsManager.selectedSuggestion.text).toEqual(first(suggestions).text);
                done();
              });

              it('can select every preview of every suggestion', async done => {
                let blurCount = 0;
                await forEachAsync(previewsBySuggestion, async (previews, suggestionId) => {
                  await moveDownToSuggestionAndWait(suggestionId);
                  previews.forEach((preview, previewId) => {
                    suggestionsManager.moveRight();
                    expect(suggestionsManager.selectAndReturnKeyboardFocusedElement().innerText).toEqual(
                      textPreviews[suggestionId][previewId],
                      `Unexpected preview at suggestion #${suggestionId} preview #${previewId}.`
                    );
                    expect(preview.onSelect).toHaveBeenCalledTimes(1);
                    blurCount += 1;
                    expect(inputManager.blur).toHaveBeenCalledTimes(blurCount);
                  });
                  previews.forEach(() => suggestionsManager.moveLeft());
                });
                done();
              });
            });
          });
        });
      });
    });
  });
}
