import { ResultPreviewsGrid, SearchResultPreview } from '../../src/magicbox/ResultPreviewsGrid';
import { $$, Dom } from '../../src/utils/Dom';
import { Assert } from '../../src/Core';

function deferPromise<T = void>(ms?: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

type HTMLProps = Partial<Element & { style: string }>;

const rootElementProperties: HTMLProps = {
  id: 'resultPreviewsGridContainer',
  style: `
    position: absolute;
  `
};

const containerWidth = 200;
const containerElementProperties: HTMLProps = {
  style: `
    width: ${containerWidth}px;
    height: 200px;
    display: flex;
    flex-wrap: wrap;
  `
};

const previewSize = 50;
const previewMargin = 5;
const previewClassName = 'common-class-name';
const previewElementProperties: HTMLProps = {
  className: previewClassName,
  style: `
    width: ${previewSize}px;
    height: ${previewSize}px;
    margin: ${previewMargin}px;
  `
};

export function ResultPreviewsGridTest() {
  describe('ResultPreviewsGridTest', () => {
    describe('with default options', () => {
      let grid: ResultPreviewsGrid;
      let root: Dom;
      beforeEach(() => {
        Assert.isNull(document.getElementById(rootElementProperties.id));
        root = $$('div', rootElementProperties);
        document.body.appendChild(root.el);
        Assert.isNotNull(document.getElementById(rootElementProperties.id));
        grid = new ResultPreviewsGrid(root.el);
      });

      afterEach(() => {
        Assert.isNotNull(document.getElementById(rootElementProperties.id));
        document.body.removeChild(root.el);
        Assert.isNull(document.getElementById(rootElementProperties.id));
      });

      it('does not create any DOM element when instantiated', () => {
        expect(root.children.length).toEqual(0);
      });

      it('does not have any selection when instantiated', () => {
        expect(grid.getSelectedPreviewElement()).toBeNull();
      });

      it('does not crash when calling selectKeyboardFocusedSelection without a selection', () => {
        expect(() => grid.selectKeyboardFocusedSelection()).not.toThrow();
      });

      it('disallows movement in any direction', () => {
        expect(grid.moveFirst()).toBeFalsy();
        expect(grid.moveUp()).toBeFalsy();
        expect(grid.moveDown()).toBeFalsy();
        expect(grid.moveLeft()).toBeFalsy();
        expect(grid.moveRight()).toBeFalsy();
      });

      it('cannot create any DOM element without receiving previews', () => {
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
        it('without any preview does not create any DOM element', async done => {
          const receivedPreviews = await grid.receiveSearchResultPreviews([]);
          expect(root.children.length).toEqual(0);
          expect(receivedPreviews.length).toEqual(0);
          done();
        });

        describe('with a single preview', () => {
          const previewId = 'test-element';
          let originalPreview: SearchResultPreview = {
            dom: $$('div', { className: 'test', id: previewId }).el,
            onSelect: jasmine.createSpy('onSelect')
          };
          let copiedPreview: SearchResultPreview;
          beforeEach(() => {
            copiedPreview = {
              ...originalPreview,
              dom: originalPreview.dom.cloneNode(true) as HTMLElement
            };
          });

          describe('synchronously', () => {
            let receivePromise: Promise<SearchResultPreview[]>;
            beforeEach(() => {
              receivePromise = grid.receiveSearchResultPreviews([[copiedPreview]]);
            });

            it('does not alter the received preview', async done => {
              const [receivedPreview] = await receivePromise;
              const appendedChild = $$(root.children()[0]).findId(previewId);
              expect(receivedPreview.dom.outerHTML).not.toBe(copiedPreview.dom.outerHTML);
              expect(originalPreview.dom.outerHTML).toBe(copiedPreview.dom.outerHTML);
              expect(receivedPreview.dom.outerHTML).toBe(appendedChild.outerHTML);
              done();
            });

            it('only appends and returns an unmodified copy of the received preview', async done => {
              await receivePromise;
              const appendedChild = $$(root.children()[0]).findId(previewId);
              expect(appendedChild.parentElement.children.length).toEqual(1);
              done();
            });

            it('only returns an unmodified copy of the received preview', async done => {
              const receivedPreviews = await receivePromise;
              expect(receivedPreviews.length).toEqual(1);
              done();
            });

            it(`only allows moving to the first element after it's received`, async done => {
              expect(grid.moveFirst()).toBeFalsy();
              expect(grid.moveUp()).toBeFalsy();
              expect(grid.moveDown()).toBeFalsy();
              expect(grid.moveLeft()).toBeFalsy();
              expect(grid.moveRight()).toBeFalsy();
              await receivePromise;
              expect(grid.moveUp()).toBeFalsy();
              expect(grid.moveDown()).toBeFalsy();
              expect(grid.moveLeft()).toBeFalsy();
              expect(grid.moveRight()).toBeFalsy();
              expect(grid.moveFirst()).toBeTruthy();
              expect(grid.moveUp()).toBeFalsy();
              expect(grid.moveDown()).toBeFalsy();
              expect(grid.moveLeft()).toBeFalsy();
              expect(grid.moveRight()).toBeFalsy();
              done();
            });

            it('has no selection until moveFirst is called', async done => {
              expect(grid.getSelectedPreviewElement()).toBeNull();
              grid.moveFirst();
              await receivePromise;
              expect(grid.getSelectedPreviewElement()).toBeNull();
              grid.moveFirst();
              expect(grid.getSelectedPreviewElement()).not.toBeNull();
              done();
            });

            it('can clear selection', async done => {
              await receivePromise;
              grid.moveFirst();
              grid.clearSelection();
              expect(grid.getSelectedPreviewElement()).toBeNull();
              done();
            });

            it('can select an element by hovering it', async done => {
              const [receivedPreview] = await receivePromise;
              expect(grid.getSelectedPreviewElement()).toBeNull();
              $$(receivedPreview.dom).trigger('mouseover');
              expect(grid.getSelectedPreviewElement()).not.toBeNull();
              done();
            });

            it('can deselect an element by moving the mouse out of it', async done => {
              const [receivedPreview] = await receivePromise;
              $$(receivedPreview.dom).trigger('mouseover');
              expect(grid.getSelectedPreviewElement()).not.toBeNull();
              $$(receivedPreview.dom).trigger('mouseout');
              expect(grid.getSelectedPreviewElement()).toBeNull();
              done();
            });
          });

          describe('asynchronously', () => {
            let receivePromise: Promise<SearchResultPreview[]>;
            beforeEach(() => {
              receivePromise = grid.receiveSearchResultPreviews([deferPromise(50, [copiedPreview])]);
            });

            it('does not create any DOM element until received', async done => {
              expect(root.children().length).toEqual(0);
              await receivePromise;
              expect(root.children().length).toEqual(1);
              done();
            });
          });
        });

        describe('with multiple previews', () => {
          let originalPreviews: SearchResultPreview[] = [
            {
              dom: $$('div', { ...previewElementProperties, id: 'test-element-1' }).el,
              onSelect: jasmine.createSpy('onSelect')
            },
            {
              dom: $$('div', { ...previewElementProperties, id: 'test-element-2' }).el,
              onSelect: jasmine.createSpy('onSelect')
            },
            {
              dom: $$('div', { ...previewElementProperties, id: 'test-element-3' }).el,
              onSelect: jasmine.createSpy('onSelect')
            },
            {
              dom: $$('div', { ...previewElementProperties, id: 'test-element-4' }).el,
              onSelect: jasmine.createSpy('onSelect')
            },
            {
              dom: $$('div', { ...previewElementProperties, id: 'test-element-5' }).el,
              onSelect: jasmine.createSpy('onSelect')
            }
          ];
          let previewCopies: SearchResultPreview[];
          let previewCopiesSlices: {
            addedFirst: SearchResultPreview[];
            addedSecond: SearchResultPreview[];
            addedThird: SearchResultPreview[];
          };
          let previewCopiesInResolvedOrder: SearchResultPreview[];
          beforeEach(() => {
            previewCopies = originalPreviews.map(
              originalPreview =>
                <SearchResultPreview>{
                  ...originalPreview,
                  dom: originalPreview.dom.cloneNode(true)
                }
            );
            previewCopiesSlices = {
              addedFirst: previewCopies.slice(3, 5),
              addedSecond: previewCopies.slice(1, 3),
              addedThird: [previewCopies[0]]
            };
            previewCopiesInResolvedOrder = [
              ...previewCopiesSlices.addedFirst,
              ...previewCopiesSlices.addedSecond,
              ...previewCopiesSlices.addedThird
            ];
          });

          describe('synchronously', () => {
            let receivePromise: Promise<SearchResultPreview[]>;
            beforeEach(() => {
              receivePromise = grid.receiveSearchResultPreviews([
                previewCopiesSlices.addedFirst,
                previewCopiesSlices.addedSecond,
                previewCopiesSlices.addedThird
              ]);
            });

            it('appends copies of received previews in the order they are received', async done => {
              const receivedPreviews = await receivePromise;
              const firstAppendedChild = root.children()[0].querySelector(`#${originalPreviews[0].dom.id}`);
              expect(firstAppendedChild).not.toBeNull();
              $$(firstAppendedChild.parentElement)
                .children()
                .forEach((appendedChild, position) => {
                  expect(appendedChild.id).toEqual(previewCopiesInResolvedOrder[position].dom.id);
                  expect(appendedChild.outerHTML).toEqual(receivedPreviews[position].dom.outerHTML);
                  expect(appendedChild.id).not.toEqual(receivedPreviews[(position + 1) % receivedPreviews.length].dom.id);
                });
              done();
            });

            describe('with a small grid and awaiting', () => {
              let receivedPreviews: SearchResultPreview[];
              beforeEach(async done => {
                receivedPreviews = await grid.receiveSearchResultPreviews([
                  previewCopiesSlices.addedFirst,
                  previewCopiesSlices.addedSecond,
                  previewCopiesSlices.addedThird
                ]);
                root.findClass(previewClassName)[0].parentElement.style.cssText = containerElementProperties.style;
                done();
              });

              it('allows keyboard navigation', () => {
                const columns = Math.floor(containerWidth / (previewSize + previewMargin * 2));
                Assert.isLargerOrEqualsThan(2, columns); // We need to test with at-least two columns
                const columnsInLastRow = previewCopiesInResolvedOrder.length % columns;
                Assert.isLargerThan(0, columnsInLastRow); // We need to test a grid with a lesser amount of items on the last row.
                const rows = Math.ceil(previewCopiesInResolvedOrder.length / columns);
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
                previewCopiesInResolvedOrder.forEach((preview, i) => {
                  if (i === 1) {
                    expect(preview.onSelect).toHaveBeenCalledTimes(1);
                  } else {
                    expect(preview.onSelect).not.toHaveBeenCalled();
                  }
                });
              });
            });
          });

          describe('asynchronously', () => {
            let receivePromise: Promise<SearchResultPreview[]>;
            let subPromises: {
              resolvedFirst: SearchResultPreview[];
              resolvedSecond: Promise<SearchResultPreview[]>;
              resolvedThird: Promise<SearchResultPreview[]>;
            };
            beforeEach(() => {
              subPromises = {
                resolvedFirst: previewCopiesSlices.addedFirst,
                resolvedSecond: deferPromise(25, previewCopiesSlices.addedSecond),
                resolvedThird: deferPromise(50, previewCopiesSlices.addedThird)
              };
              receivePromise = grid.receiveSearchResultPreviews([
                subPromises.resolvedThird,
                subPromises.resolvedFirst,
                subPromises.resolvedSecond
              ]);
            });

            it('resolves once all given promises are resolved', async done => {
              let receivePromiseIsResolved = false;
              receivePromise.then(() => (receivePromiseIsResolved = true));

              await deferPromise();
              const { addedFirst, addedSecond, addedThird } = previewCopiesSlices;
              expect(root.findClass(previewClassName).length).toEqual(addedFirst.length);
              expect(receivePromiseIsResolved).toBeFalsy();
              await subPromises.resolvedSecond;
              expect(root.findClass(previewClassName).length).toEqual(addedFirst.length + addedSecond.length);
              expect(receivePromiseIsResolved).toBeFalsy();
              await subPromises.resolvedThird;
              expect(root.findClass(previewClassName).length).toEqual(addedFirst.length + addedSecond.length + addedThird.length);
              await deferPromise();
              expect(receivePromiseIsResolved).toBeTruthy();
              done();
            });

            it('rejects and aborts if called again during resolution and process new call', async done => {
              // Spy on resolve and reject
              const resolveSpy = jasmine.createSpy('resolve');
              const rejectSpy = jasmine.createSpy('reject');
              const receiveResolvedPromise = new Promise(resolve =>
                receivePromise.then(() => {
                  resolveSpy();
                  resolve();
                })
              );
              const receiveRejectedPromise = new Promise(resolve =>
                receivePromise.catch(message => {
                  rejectSpy(message);
                  resolve();
                })
              );

              // Wait for some previews to be resolved then interrupt with another request
              await subPromises.resolvedSecond;
              const { addedFirst, addedSecond } = previewCopiesSlices;
              const [newAddedFirst, newAddedSecond] = [previewCopies.slice(1, 3), previewCopies.slice(3, 5)];
              const newReceivePromise = grid.receiveSearchResultPreviews([
                deferPromise(25, newAddedFirst),
                deferPromise(50, newAddedSecond)
              ]);

              // Wait for receivePromise rejection
              await Promise.race([receiveResolvedPromise, receiveRejectedPromise]);
              expect(resolveSpy).not.toHaveBeenCalled();
              expect(rejectSpy).toHaveBeenCalledWith('new request queued');

              // Check that the grid doesn't remove previews until new ones are received
              expect(root.findClass(previewClassName).length).toEqual(addedFirst.length + addedSecond.length);

              // Check that the new call was processed
              await newReceivePromise;
              expect(root.findClass(previewClassName).length).toEqual(newAddedFirst.length + newAddedSecond.length);
              done();
            });

            it('appends copies of received previews in the order they are received', async done => {
              const receivedPreviews = await receivePromise;
              const firstAppendedChild = root.children()[0].querySelector(`#${originalPreviews[0].dom.id}`);
              expect(firstAppendedChild).not.toBeNull();
              $$(firstAppendedChild.parentElement)
                .children()
                .forEach((appendedChild, position) => {
                  expect(appendedChild.id).toEqual(previewCopiesInResolvedOrder[position].dom.id);
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
