import { ResultPreviewsGrid, SearchResultPreview } from '../../src/magicbox/ResultPreviewsGrid';
import { $$ } from '../../src/utils/Dom';
import { Assert } from '../../src/Core';
import {
  createGridWithDefaults,
  EmptySearchQueryType,
  ResultPreviewsGridType,
  createEmptySearchQuery,
  SingleSearchResultPreviewType,
  createSingleSearchResultPreview,
  SynchronousSingleSearchQueryType,
  createSynchronousSingleSearchQuery,
  SingleSearchResultPreviewId,
  AsynchronousSingleSearchQueryType,
  createAsynchronousSingleSearchQuery,
  MultipleSearchResultPreviewsType,
  PreviewElementProperties,
  createMultipleSearchResultPreviews,
  SynchronousMultipleSearchQueriesType,
  createSynchronousMultipleSearchQueries,
  AsynchronousMultipleSearchQueriesType,
  createAsynchronousMultipleSearchQueries,
  deferPromise,
  createActiveGridWithDefaults,
  ContainerWidth,
  PreviewSize,
  PreviewMargin,
  ContainerElementProperties,
  createMultipleSearchResultPreviews2
} from './ResultPreviewsGridTest.mock';

export function ResultPreviewsGridTest() {
  describe('ResultPreviewsGridTest', () => {
    // TODO: Add tests with non-default options?
    describe('with default options', () => {
      it('does not create any DOM element when instantiated', () => {
        const { root } = createGridWithDefaults();
        expect(root.children.length).toEqual(0);
      });

      it('does not have any selection when instantiated', () => {
        const { grid } = createGridWithDefaults();
        expect(grid.getSelectedPreviewElement()).toBeNull();
      });

      it('does not crash when calling selectKeyboardFocusedSelection without a selection', () => {
        const { grid } = createGridWithDefaults();
        expect(() => grid.selectKeyboardFocusedSelection()).not.toThrow();
      });

      it('does not allow navigation in any direction', () => {
        const { grid } = createGridWithDefaults();
        expect(grid.moveFirst()).toBeFalsy();
        expect(grid.moveUp()).toBeFalsy();
        expect(grid.moveDown()).toBeFalsy();
        expect(grid.moveLeft()).toBeFalsy();
        expect(grid.moveRight()).toBeFalsy();
      });

      it('cannot create any DOM element without receiving previews', () => {
        const { root, grid } = createGridWithDefaults();
        grid.getSelectedPreviewElement();
        grid.selectKeyboardFocusedSelection();
        grid.moveFirst();
        grid.moveUp();
        grid.moveDown();
        grid.moveLeft();
        grid.moveRight();
        grid.clearSelection();
        expect(root.children.length).toEqual(0);
      });

      describe('calling receiveSearchResultPreviews', () => {
        describe('with getCompletionMessage', () => {
          let getCompletionMessageSpy: jasmine.Spy;
          beforeEach(() => {
            getCompletionMessageSpy = jasmine.createSpy('getCompletionMessage');
          });

          describe('without any preview', () => {
            // TODO: Test getCompletionMessage with previews?
            it(`calls getCompletionMessage with an empty array`, async done => {
              const { grid } = createGridWithDefaults();
              await grid.receiveSearchResultPreviews([], getCompletionMessageSpy.and.returnValue(''));
              expect(getCompletionMessageSpy).toHaveBeenCalled();
              expect((getCompletionMessageSpy.calls.mostRecent().args[0] as SearchResultPreview[]).length).toEqual(0);
              done();
            });

            it('shows the provided message', async done => {
              const { root, grid } = createGridWithDefaults();
              const message = 'hello';
              await grid.receiveSearchResultPreviews([], getCompletionMessageSpy.and.returnValue(message));
              const [header] = root.findClass(ResultPreviewsGrid.HeaderClassName);
              expect(header).not.toBeNull();
              expect(header.innerText).toEqual(message);
              done();
            });
          });

          describe('with multiple previews', () => {});
        });

        describe('without any preview', () => {
          let query: EmptySearchQueryType;
          let gridContext: ResultPreviewsGridType;
          beforeEach(() => {
            gridContext = createGridWithDefaults();
            query = createEmptySearchQuery(gridContext);
          });

          it('appends a container to the root', async done => {
            const receivedPreviews = await query.receivePromise;
            expect(gridContext.root.children().length).toEqual(1);
            expect(receivedPreviews.length).toEqual(0);
            const [container] = gridContext.root.findClass(ResultPreviewsGrid.ContainerClassName);
            expect(container).not.toBeNull();
            const [header] = $$(container).findClass(ResultPreviewsGrid.HeaderClassName);
            expect(header).not.toBeNull();
            const [resultsContainer] = $$(container).findClass(ResultPreviewsGrid.ResultsContainerClassName);
            expect(resultsContainer).not.toBeNull();
            done();
          });

          it('does not have any selection when instantiated', async done => {
            await query.receivePromise;
            expect(gridContext.grid.getSelectedPreviewElement()).toBeNull();
            done();
          });

          it('does not crash when calling selectKeyboardFocusedSelection without a selection', async done => {
            await query.receivePromise;
            expect(() => gridContext.grid.selectKeyboardFocusedSelection()).not.toThrow();
            done();
          });

          it('does not allow navigation in any direction', async done => {
            await query.receivePromise;
            expect(gridContext.grid.moveFirst()).toBeFalsy();
            expect(gridContext.grid.moveUp()).toBeFalsy();
            expect(gridContext.grid.moveDown()).toBeFalsy();
            expect(gridContext.grid.moveLeft()).toBeFalsy();
            expect(gridContext.grid.moveRight()).toBeFalsy();
            done();
          });

          it(`doesn't return any preview`, async done => {
            expect((await query.receivePromise).length).toEqual(0);
            done();
          });

          it(`doesn't append any preview`, async done => {
            await query.receivePromise;
            const [resultsContainer] = $$(gridContext.root).findClass(ResultPreviewsGrid.ResultsContainerClassName);
            expect(resultsContainer.children.length).toEqual(0);
            done();
          });

          it(`doesn't show any message by default`, async done => {
            await query.receivePromise;
            const [header] = gridContext.root.findClass(ResultPreviewsGrid.HeaderClassName);
            expect(header).not.toBeNull();
            expect(header.innerText.length).toEqual(0);
            done();
          });
        });

        describe('with a single preview', () => {
          let dataset: SingleSearchResultPreviewType;
          let gridContext: ResultPreviewsGridType;
          beforeEach(() => {
            dataset = createSingleSearchResultPreview();
            gridContext = createGridWithDefaults();
          });

          describe('synchronously', () => {
            let query: SynchronousSingleSearchQueryType;
            beforeEach(() => {
              query = createSynchronousSingleSearchQuery(gridContext, dataset);
            });

            it('does not alter the received preview', async done => {
              const { copiedPreview, originalPreview } = dataset;
              const [receivedPreview] = await query.receivePromise;
              const appendedChild = gridContext.root.el.querySelector(`#${SingleSearchResultPreviewId}`);
              expect(receivedPreview.dom.outerHTML).not.toBe(copiedPreview.dom.outerHTML);
              expect(originalPreview.dom.outerHTML).toBe(copiedPreview.dom.outerHTML);
              expect(receivedPreview.dom.outerHTML).toBe(appendedChild.outerHTML);
              done();
            });

            it('only appends the received preview', async done => {
              await query.receivePromise;
              const appendedChild = gridContext.root.el.querySelector(`#${SingleSearchResultPreviewId}`);
              expect(appendedChild.parentElement.children.length).toEqual(1);
              done();
            });

            it('only returns the received preview', async done => {
              const receivedPreviews = await query.receivePromise;
              expect(receivedPreviews.length).toEqual(1);
              done();
            });

            it(`only allows moving to the first element after it's received`, async done => {
              expect(gridContext.grid.moveFirst()).toBeFalsy();
              expect(gridContext.grid.moveUp()).toBeFalsy();
              expect(gridContext.grid.moveDown()).toBeFalsy();
              expect(gridContext.grid.moveLeft()).toBeFalsy();
              expect(gridContext.grid.moveRight()).toBeFalsy();
              await query.receivePromise;
              expect(gridContext.grid.moveUp()).toBeFalsy();
              expect(gridContext.grid.moveDown()).toBeFalsy();
              expect(gridContext.grid.moveLeft()).toBeFalsy();
              expect(gridContext.grid.moveRight()).toBeFalsy();
              expect(gridContext.grid.moveFirst()).toBeTruthy();
              expect(gridContext.grid.moveUp()).toBeFalsy();
              expect(gridContext.grid.moveDown()).toBeFalsy();
              expect(gridContext.grid.moveLeft()).toBeFalsy();
              expect(gridContext.grid.moveRight()).toBeFalsy();
              done();
            });

            it('has no selection until moveFirst is called', async done => {
              expect(gridContext.grid.getSelectedPreviewElement()).toBeNull();
              gridContext.grid.moveFirst();
              await query.receivePromise;
              expect(gridContext.grid.getSelectedPreviewElement()).toBeNull();
              gridContext.grid.moveFirst();
              expect(gridContext.grid.getSelectedPreviewElement()).not.toBeNull();
              done();
            });

            it('can clear selection', async done => {
              await query.receivePromise;
              gridContext.grid.moveFirst();
              gridContext.grid.clearSelection();
              expect(gridContext.grid.getSelectedPreviewElement()).toBeNull();
              done();
            });

            it('can select an element by hovering it', async done => {
              const [receivedPreview] = await query.receivePromise;
              expect(gridContext.grid.getSelectedPreviewElement()).toBeNull();
              $$(receivedPreview.dom).trigger('mouseover');
              expect(gridContext.grid.getSelectedPreviewElement()).not.toBeNull();
              done();
            });

            it('can deselect an element by moving the mouse out of it', async done => {
              const [receivedPreview] = await query.receivePromise;
              $$(receivedPreview.dom).trigger('mouseover');
              expect(gridContext.grid.getSelectedPreviewElement()).not.toBeNull();
              $$(receivedPreview.dom).trigger('mouseout');
              expect(gridContext.grid.getSelectedPreviewElement()).toBeNull();
              done();
            });
          });

          describe('asynchronously', () => {
            let query: AsynchronousSingleSearchQueryType;
            beforeEach(() => {
              query = createAsynchronousSingleSearchQuery(gridContext, dataset);
            });

            it('does not create any DOM element until received', async done => {
              expect(gridContext.root.children().length).toEqual(0);
              await query.receivePromise;
              expect(gridContext.root.children().length).toEqual(1);
              done();
            });
          });
        });

        describe('with multiple previews', () => {
          let dataset: MultipleSearchResultPreviewsType;
          beforeEach(() => {
            dataset = createMultipleSearchResultPreviews();
          });

          describe('synchronously', () => {
            describe('with an inactive grid', () => {
              let gridContext: ResultPreviewsGridType;
              let query: SynchronousMultipleSearchQueriesType;
              beforeEach(() => {
                gridContext = createGridWithDefaults();
                query = createSynchronousMultipleSearchQueries(gridContext, dataset);
              });

              it('appends copies of received previews in the order they are received', async done => {
                const receivedPreviews = await query.receivePromise;
                const firstAppendedChild = gridContext.root.children()[0].querySelector(`#${dataset.originalPreviews[0].dom.id}`);
                expect(firstAppendedChild).not.toBeNull();
                $$(firstAppendedChild.parentElement)
                  .children()
                  .forEach((appendedChild, position) => {
                    expect(appendedChild.id).toEqual(dataset.previewCopiesInResolvedOrder[position].dom.id);
                    expect(appendedChild.outerHTML).toEqual(receivedPreviews[position].dom.outerHTML);
                    expect(appendedChild.id).not.toEqual(receivedPreviews[(position + 1) % receivedPreviews.length].dom.id);
                  });
                done();
              });
            });

            describe('with an active grid', () => {
              it('allows keyboard navigation', async done => {
                await createActiveGridWithDefaults(async gridContext => {
                  const query = createSynchronousMultipleSearchQueries(gridContext, dataset);
                  const receivedPreviews = await query.receivePromise;
                  const { root, grid } = gridContext;
                  root.findClass(PreviewElementProperties.className)[0].parentElement.style.cssText = ContainerElementProperties.style;

                  const columns = Math.floor(ContainerWidth / (PreviewSize + PreviewMargin * 2));
                  Assert.isLargerOrEqualsThan(2, columns); // We need to test with at-least two columns
                  const columnsInLastRow = dataset.previewCopiesInResolvedOrder.length % columns;
                  Assert.isLargerThan(0, columnsInLastRow); // We need to test a grid with a lesser amount of items on the last row.
                  const rows = Math.ceil(dataset.previewCopiesInResolvedOrder.length / columns);
                  Assert.isLargerOrEqualsThan(2, rows); // We need to test with at-least two rows
                  expect(grid.moveFirst()).toBeTruthy('can move to origin');
                  expect(grid.moveUp()).toBeFalsy();
                  expect(grid.moveLeft()).toBeFalsy();
                  for (let currentRow = 0; currentRow < rows; currentRow += 1) {
                    const isLastRow = currentRow === rows - 1;
                    const columnsInCurrentRow = isLastRow ? columnsInLastRow : columns;
                    let currentDirection = 1;
                    for (
                      let currentColumn = 0;
                      currentColumn < columnsInCurrentRow && currentColumn >= 0;
                      currentColumn += currentDirection
                    ) {
                      if (currentRow === 0) {
                        expect(grid.moveUp()).toBeFalsy();
                      }
                      if (currentColumn === 0) {
                        expect(grid.moveLeft()).toBeFalsy();
                      }
                      if (isLastRow || (currentRow === rows - 2 && currentColumn >= columnsInLastRow)) {
                        expect(grid.moveDown()).toBeFalsy();
                      }
                      if (currentColumn === columnsInCurrentRow - 1) {
                        expect(grid.moveRight()).toBeFalsy();
                        currentDirection = -1;
                      }
                      expect(grid.getSelectedPreviewElement().outerHTML).toEqual(
                        receivedPreviews[currentRow * columns + currentColumn].dom.outerHTML
                      );
                      if (currentDirection === 1 && currentColumn < columnsInCurrentRow - 1) {
                        expect(grid.moveRight()).toBeTruthy(`can move right to (${currentColumn + currentDirection}, ${currentRow})`);
                      } else if (currentDirection === -1 && currentColumn > 0) {
                        expect(grid.moveLeft()).toBeTruthy(`can move left to (${currentColumn + currentDirection}, ${currentRow})`);
                      }
                    }
                    if (!isLastRow) {
                      expect(grid.moveDown()).toBeTruthy(`can move down to (0, ${currentRow + 1})`);
                    }
                  }
                  expect(grid.moveFirst()).toBeTruthy('can move back to origin');
                  expect(grid.moveRight()).toBeTruthy('can move right from origin again');
                  expect(grid.selectKeyboardFocusedSelection().dom.outerHTML).toEqual(receivedPreviews[1].dom.outerHTML);
                  dataset.previewCopiesInResolvedOrder.forEach((preview, i) => {
                    if (i === 1) {
                      expect(preview.onSelect).toHaveBeenCalledTimes(1);
                    } else {
                      expect(preview.onSelect).not.toHaveBeenCalled();
                    }
                  });
                });
                done();
              });
            });
          });

          describe('asynchronously', () => {
            let gridContext: ResultPreviewsGridType;
            let query: AsynchronousMultipleSearchQueriesType;
            beforeEach(() => {
              gridContext = createGridWithDefaults();
              query = createAsynchronousMultipleSearchQueries(gridContext, dataset);
            });

            it('resolves once all given promises are resolved', async done => {
              let receivePromiseIsResolved = false;
              query.receivePromise.then(() => (receivePromiseIsResolved = true));

              await deferPromise();
              expect(gridContext.root.children().length).toEqual(0);
              expect(receivePromiseIsResolved).toBeFalsy();
              await query.subPromises.resolvedSecond;
              expect(gridContext.root.children().length).toEqual(0);
              expect(receivePromiseIsResolved).toBeFalsy();
              await query.subPromises.resolvedThird;
              expect(gridContext.root.children().length).toEqual(1);
              expect(gridContext.root.findClass(PreviewElementProperties.className).length).toEqual(dataset.previewCopies.length);
              await deferPromise();
              expect(receivePromiseIsResolved).toBeTruthy();
              done();
            });

            it('rejects and aborts if called again during resolution and process new call', async done => {
              // Spy on resolve and reject
              const resolveSpy = jasmine.createSpy('resolve');
              const rejectSpy = jasmine.createSpy('reject');
              const receiveResolvedPromise = new Promise(resolve =>
                query.receivePromise.then(() => {
                  resolveSpy();
                  resolve();
                })
              );
              const receiveRejectedPromise = new Promise(resolve =>
                query.receivePromise.catch(message => {
                  rejectSpy(message);
                  resolve();
                })
              );

              // Wait for some previews to be resolved then interrupt with another request
              await query.subPromises.resolvedSecond;
              const newDataset = createMultipleSearchResultPreviews2();
              const newQuery = createAsynchronousMultipleSearchQueries(gridContext, newDataset);

              // Wait for receivePromise rejection
              await Promise.race([receiveResolvedPromise, receiveRejectedPromise]);
              expect(resolveSpy).not.toHaveBeenCalled();
              expect(rejectSpy).toHaveBeenCalledWith('new request queued');

              // Check that the grid didn't add the new previews.
              expect(gridContext.root.children().length).toEqual(0);

              // Check that the new call was processed
              await newQuery.receivePromise;
              newDataset.previewCopies.forEach(preview => {
                expect(gridContext.root.el.querySelector(`#${preview.dom.id}`)).not.toBeNull();
              });
              expect(gridContext.root.findClass(PreviewElementProperties.className).length).toEqual(newDataset.previewCopies.length);
              done();
            });

            it('appends copies of received previews in the order they are received', async done => {
              const receivedPreviews = await query.receivePromise;
              const firstAppendedChild = gridContext.root.children()[0].querySelector(`#${dataset.originalPreviews[0].dom.id}`);
              expect(firstAppendedChild).not.toBeNull();
              $$(firstAppendedChild.parentElement)
                .children()
                .forEach((appendedChild, position) => {
                  expect(appendedChild.id).toEqual(dataset.previewCopiesInResolvedOrder[position].dom.id);
                  expect(appendedChild.outerHTML).toEqual(receivedPreviews[position].dom.outerHTML);
                  expect(appendedChild.id).not.toEqual(receivedPreviews[(position + 1) % receivedPreviews.length].dom.id);
                });
              done();
            });
          });
        });
      });
    });
  });
}
