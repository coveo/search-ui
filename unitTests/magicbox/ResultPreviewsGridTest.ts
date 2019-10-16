import {
  ResultPreviewsGrid,
  ISearchResultPreview,
  ResultPreviewsGridDirection,
  ResultPreviewsGridEvents
} from '../../src/magicbox/ResultPreviewsGrid';
import { $$, Dom } from '../../src/utils/Dom';
import { Assert } from '../../src/Core';

type HTMLTestPreviewElement = HTMLElement & { dataset: { testPosition: string } };

type HTMLProps = Partial<Element & { style: string }>;

const previewSize = 50;
const previewMargin = 10;
const previewElementProperties: HTMLProps = {
  className: 'common-class-name',
  style: `
    width: ${previewSize}px;
    height: ${previewSize}px;
    margin: ${previewMargin}px;
  `
};

function createPreview(id: number): ISearchResultPreview {
  return {
    element: $$('div', { ...previewElementProperties, 'data-test-position': id.toString() }).el,
    onSelect: jasmine.createSpy('onSelect')
  };
}

function createPreviews(count: number, startId = 0) {
  const previews: ISearchResultPreview[] = [];
  for (let i = startId; i < startId + count; i++) {
    previews.push(createPreview(i));
  }
  return previews;
}

export function ResultPreviewsGridTest() {
  describe('ResultPreviewsGrid', () => {
    let root: Dom;
    beforeEach(() => {
      root = $$('div', {
        id: 'resultPreviewsGridContainer',
        style: `
            position: absolute;
          `
      });
    });

    describe('without any previews', () => {
      let grid: ResultPreviewsGrid;
      beforeEach(() => {
        grid = new ResultPreviewsGrid(root.el);
      });

      it(`doesn't append any preview`, () => {
        const [resultsContainer] = root.findClass('coveo-preview-results');
        expect(resultsContainer.children.length).toEqual(0);
      });

      it('creates a container once instantiated', () => {
        expect(root.children().length).toEqual(1);
      });

      it('does not have any focused preview when instantiated', () => {
        expect(grid.focusedPreview).toBeNull();
      });

      it('is not in keyboard selection mode', () => {
        expect(grid.isFocusKeyboardControlled).toBeFalsy();
      });

      it('returns null when calling keyboardSelect', () => {
        expect(grid.selectKeyboardFocusedPreview()).toBeNull();
      });
    });

    describe('with previews', () => {
      const focusClassName = 'abcd';
      const previewsCount = 10;
      let grid: ResultPreviewsGrid;
      let previews: ISearchResultPreview[];
      beforeEach(() => {
        grid = new ResultPreviewsGrid(root.el, { selectedClass: focusClassName });
        previews = createPreviews(previewsCount);
        grid.setDisplayedPreviews(previews);
      });

      const focusFirst = () => {
        const oldSelection = grid.focusedPreview;
        grid.focusFirstPreview();
        return grid.focusedPreview !== oldSelection;
      };
      const focusUp = () => {
        const oldSelection = grid.focusedPreview;
        grid.focusNextPreview(ResultPreviewsGridDirection.Up);
        return grid.focusedPreview !== oldSelection;
      };
      const focusDown = () => {
        const oldSelection = grid.focusedPreview;
        grid.focusNextPreview(ResultPreviewsGridDirection.Down);
        return grid.focusedPreview !== oldSelection;
      };
      const focusLeft = () => {
        const oldSelection = grid.focusedPreview;
        grid.focusNextPreview(ResultPreviewsGridDirection.Left);
        return grid.focusedPreview !== oldSelection;
      };
      const focusRight = () => {
        const oldSelection = grid.focusedPreview;
        grid.focusNextPreview(ResultPreviewsGridDirection.Right);
        return grid.focusedPreview !== oldSelection;
      };

      function getPreviewElements() {
        return root.findClass(previewElementProperties.className) as HTMLTestPreviewElement[];
      }

      it(`doesn't alter the provided previews`, () => {
        previews.forEach((preview, id) => {
          expect(preview.element.outerHTML).toEqual(createPreview(id).element.outerHTML);
        });
      });

      it('appends as many previews as provided', () => {
        expect(getPreviewElements().length).toEqual(previewsCount);
      });

      it('appends copies of the provided previews in the original order', () => {
        const elements = getPreviewElements();
        previews.forEach((preview, id) => {
          expect(elements[id].dataset.testPosition).toEqual(id.toString());
        });
      });

      it('replaces previews with newly provided ones', () => {
        const newPreviewsCount = 4;
        const newPreviews = createPreviews(newPreviewsCount, previewsCount);
        grid.setDisplayedPreviews(newPreviews);

        const elements = getPreviewElements();
        expect(elements.length).toEqual(newPreviewsCount);
        newPreviews.forEach((preview, id) => {
          expect(elements[id].outerHTML).not.toEqual(preview.element.outerHTML);
          expect(elements[id].dataset.testPosition).toEqual((id + previewsCount).toString());
        });
      });

      it('does not have any focused preview when instantiated', () => {
        expect(root.findClass(focusClassName).length).toEqual(0);
        expect(grid.focusedPreview).toBeNull();
      });

      it('is not in keyboard selection mode', () => {
        expect(grid.isFocusKeyboardControlled).toBeFalsy();
      });

      it('returns null when calling keyboardSelect', () => {
        expect(grid.selectKeyboardFocusedPreview()).toBeNull();
      });

      it('switches to keyboard selection mode when focusing a preview with focusFirstPreview', () => {
        focusFirst();
        expect(grid.isFocusKeyboardControlled).toBeTruthy();
      });

      it('switches to mouse selection mode when selecting a preview', () => {
        focusFirst();
        grid.selectKeyboardFocusedPreview();
        expect(grid.isFocusKeyboardControlled).toBeFalsy();
      });

      describe('using the mouse', () => {
        function mouseOver(element: HTMLTestPreviewElement) {
          $$(element).trigger('mouseover');
        }

        function mouseOut(element: HTMLTestPreviewElement) {
          $$(element).trigger('mouseout');
        }

        it('switches to mouse selection mode when the mouse enters a preview', () => {
          focusFirst();
          mouseOver(getPreviewElements()[0]);
          expect(grid.isFocusKeyboardControlled).toBeFalsy();
        });

        it('does not return a keyboard selection after the mouse enters a preview', () => {
          mouseOver(getPreviewElements()[0]);
          expect(grid.selectKeyboardFocusedPreview()).toBeNull();
        });

        it('returns the preview focused by the mouse when accessing focusedPreview', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            const returnedPreview = grid.focusedPreview;
            expect(returnedPreview).not.toBeNull();
            expect(returnedPreview.element).toBe(element);
          });
        });

        it('returns null when accessing focusedPreview after the mouse exit a preview', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            mouseOut(element);
            expect(grid.focusedPreview).toBeNull();
          });
        });

        it('only gives the focused class to the preview focused by the mouse', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            expect(root.findClass(focusClassName).length).toEqual(1);
            expect(element.classList).toContain(focusClassName);
          });
        });

        it('removes the focused class when the mouse exits a preview', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            mouseOut(element);
            expect(root.findClass(focusClassName).length).toEqual(0);
          });
        });

        it('removes the focus when calling blurFocusedPreview', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            grid.blurFocusedPreview();
            expect(root.findClass(focusClassName).length).toEqual(0);
          });
        });
      });

      describe('with an active grid', () => {
        let previewFocusedSpy: jasmine.Spy;
        let previewBlurredSpy: jasmine.Spy;
        const containerWidth = 300;
        const maxColumns = Math.floor(containerWidth / (previewSize + previewMargin * 2));
        const columnsInLastRow = previewsCount % maxColumns;
        const rows = Math.ceil(previewsCount / maxColumns);
        const columns = (row: number) => (row === rows - 1 ? columnsInLastRow : maxColumns);
        // We should test with a last row of a different length.
        Assert.check(maxColumns !== columnsInLastRow);
        // We should test with at-least three rows.
        Assert.isLargerOrEqualsThan(3, rows);
        beforeEach(() => {
          root.findClass('coveo-preview-results')[0].style.cssText = `
            width: ${containerWidth}px;
            height: 600px;
            display: flex;
            flex-wrap: wrap;
          `;
          document.body.appendChild(root.el);
          previewFocusedSpy = jasmine.createSpy(ResultPreviewsGridEvents.PreviewFocused);
          grid.bindOnPreviewFocused((_, preview) => previewFocusedSpy(preview));
          previewBlurredSpy = jasmine.createSpy(ResultPreviewsGridEvents.PreviewBlurred);
          grid.bindOnPreviewBlurred((_, preview) => previewBlurredSpy(preview));
        });

        afterEach(() => {
          document.body.removeChild(root.el);
        });

        function focusOn(column: number, row: number) {
          focusFirst();
          for (let x = 0; x < column; x++) {
            focusRight();
          }
          for (let y = 0; y < row; y++) {
            focusDown();
          }
        }

        function testCompareSelectionWith(column: number, row: number) {
          const expectedId = row * maxColumns + column;
          const expectedTestPosition = expectedId.toString();
          const strCoordinates = `(col: ${column}, row: ${row})`;

          // Test if the currently focused preview is the one at `column`, `row`
          const focusedPreview = grid.focusedPreview;
          expect(focusedPreview).not.toBeNull(`No focused preview returned at ${strCoordinates}`);
          expect((focusedPreview.element as HTMLTestPreviewElement).dataset.testPosition).toEqual(
            expectedTestPosition,
            `Wrong preview returned at ${strCoordinates}`
          );
          const focusedItems = root.findClass(focusClassName) as HTMLTestPreviewElement[];
          expect(focusedItems.length).toEqual(1, `Multiple focused elements found at ${strCoordinates}`);
          expect(focusedItems[0].dataset.testPosition).toEqual(expectedTestPosition, `Wrong preview focused at ${strCoordinates}`);

          // Test that the PreviewFocused event was called.
          const [preview] = <[ISearchResultPreview]>previewFocusedSpy.calls.mostRecent().args;
          expect(preview).toBe(focusedPreview, `previewFocused event called with wrong preview at ${strCoordinates}`);

          // Test keyboard selection
          const selection = grid.selectKeyboardFocusedPreview();
          expect(selection).not.toBeNull(`No selection returned at ${strCoordinates}`);
          expect((selection.element as HTMLTestPreviewElement).dataset.testPosition).toEqual(
            expectedTestPosition,
            `Wrong preview selected at ${strCoordinates}`
          );
          expect(previews[expectedId].onSelect).toHaveBeenCalledTimes(1);

          // Focus on the original position, since selectKeyboardFocusedPreview blurs the preview.
          focusOn(column, row);
        }

        it('can focus on the first preview', () => {
          expect(focusFirst()).toBeTruthy();
          testCompareSelectionWith(0, 0);
        });

        it('can blur the focused preview', () => {
          focusFirst();
          grid.blurFocusedPreview();
          expect(grid.focusedPreview).toBeNull();
        });

        it('calls the previewBlurred event on the previously focused preview', () => {
          focusFirst();
          const focusedPreview = grid.focusedPreview;
          grid.blurFocusedPreview();
          const [lastFocusedPreview] = <[ISearchResultPreview]>previewBlurredSpy.calls.mostRecent().args;
          expect(lastFocusedPreview).toBe(focusedPreview);
        });

        it('cannot focus on the next preview when none is focused', () => {
          expect(focusUp()).toBeFalsy('Was not prevented from moving up');
          expect(focusDown()).toBeFalsy('Was not prevented from moving down');
          expect(focusLeft()).toBeFalsy('Was not prevented from moving left');
          expect(focusRight()).toBeFalsy('Was not prevented from moving right');
        });

        it('can focus on all previews from left to right', () => {
          for (let y = 0; y < rows; y++) {
            focusOn(0, y);
            testCompareSelectionWith(0, y);
            for (let x = 1; x < columns(y); x++) {
              expect(focusRight()).toBeTruthy(`Could not move to (${x}, ${y})`);
              testCompareSelectionWith(x, y);
            }
          }
        });

        it('can focus on all previews right to left', () => {
          for (let y = 0; y < rows; y++) {
            focusOn(columns(y) - 1, y);
            testCompareSelectionWith(columns(y) - 1, y);
            for (let x = columns(y) - 2; x > 0; x--) {
              expect(focusLeft()).toBeTruthy(`Could not move to (${x}, ${y})`);
              testCompareSelectionWith(x, y);
            }
          }
        });

        it('can focus on all previews from top to bottom', () => {
          for (let x = 0; x < maxColumns; x++) {
            const rowsAtColumn = rows - (x < columnsInLastRow ? 0 : 1);
            focusOn(x, 0);
            testCompareSelectionWith(x, 0);
            for (let y = 1; y < rowsAtColumn; y++) {
              expect(focusDown()).toBeTruthy(`Could not move to (${x}, ${y})`);
              testCompareSelectionWith(x, y);
            }
          }
        });

        it('can focus all previews from bottom to top', () => {
          for (let x = 0; x < maxColumns; x++) {
            const startingRow = rows - (x < columnsInLastRow ? 1 : 2);
            focusOn(x, startingRow);
            testCompareSelectionWith(x, startingRow);
            for (let y = startingRow - 1; y > 0; y--) {
              expect(focusUp()).toBeTruthy(`Could not move to (${x}, ${y})`);
              testCompareSelectionWith(x, y);
            }
          }
        });

        it('cannot go up from the first row', () => {
          focusFirst();
          expect(focusUp()).toBeFalsy();
          for (let x = 1; x < maxColumns; x++) {
            focusRight();
            expect(focusUp()).toBeFalsy(`Was not prevented from moving up from (${x}, 0)`);
          }
        });

        it('cannot go down from the last row', () => {
          focusOn(0, rows - 1);
          expect(focusDown()).toBeFalsy();
          for (let x = 1; x < columns(rows - 1); x++) {
            focusRight();
            expect(focusDown()).toBeFalsy(`Was not prevented from moving down from (${x}, ${rows - 1})`);
          }
        });

        it('cannot go down onto unexisting cells from the last row', () => {
          focusOn(columnsInLastRow - 1, rows - 2);
          for (let x = columnsInLastRow; x < maxColumns; x++) {
            focusRight();
            expect(focusDown()).toBeFalsy(`Was not prevented from moving down from (${x}, ${rows - 2})`);
          }
        });

        it('cannot go left from the first column', () => {
          focusFirst();
          expect(focusLeft()).toBeFalsy();
          for (let y = 1; y < rows; y++) {
            focusDown();
            expect(focusLeft()).toBeFalsy(`Was not prevented from moving left from (0, ${y})`);
          }
        });

        it('cannot go right from the first column', () => {
          focusOn(maxColumns - 1, 0);
          expect(focusRight()).toBeFalsy();
          for (let y = 1; y < rows - 1; y++) {
            focusDown();
            expect(focusRight()).toBeFalsy(`Was not prevented from moving right from (${maxColumns - 1}, ${y})`);
          }
        });

        it('cannot go right onto the first unexisting cell from the last row', () => {
          focusOn(columnsInLastRow - 1, rows - 1);
          expect(focusRight()).toBeFalsy(`Was not prevented from moving right from (${columnsInLastRow - 1}, ${rows - 1})`);
        });
      });
    });
  });
}
