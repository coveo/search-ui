import { ResultPreviewsGrid, ISearchResultPreview, ResultPreviewsGridDirection } from '../../src/magicbox/ResultPreviewsGrid';
import { $$, Dom } from '../../src/utils/Dom';
import { Assert } from '../../src/Core';

type HTMLTestPreviewElement = HTMLElement & { dataset: { testPosition: string } };

type HTMLProps = Partial<Element & { style: string }>;

const PreviewSize = 50;
const PreviewMargin = 10;
const PreviewElementProperties: HTMLProps = {
  className: 'common-class-name',
  style: `
    width: ${PreviewSize}px;
    height: ${PreviewSize}px;
    margin: ${PreviewMargin}px;
  `
};

function createPreview(id: number): ISearchResultPreview {
  return {
    element: $$('div', { ...PreviewElementProperties, 'data-test-position': id.toString() }).el,
    onSelect: jasmine.createSpy('onSelect')
  };
}

function createPreviews(count, startId = 0) {
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
        const [resultsContainer] = root.findClass(ResultPreviewsGrid.ResultsContainerClassName);
        expect(resultsContainer.children.length).toEqual(0);
      });

      it('creates a container once instantiated', () => {
        expect(root.children().length).toEqual(1);
      });

      it('does not have any hover when instantiated', () => {
        expect(grid.getHoveredItem()).toBeNull();
      });

      it('is not in keyboard selection mode', () => {
        expect(grid.isHoverKeyboardControlled()).toBeFalsy();
      });

      it('returns null when calling keyboardSelect', () => {
        expect(grid.keyboardSelect()).toBeNull();
      });

      it('does not allow navigation in any direction', () => {
        expect(grid.tryHoverOnFirstItem()).toBeFalsy();
        expect(grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Up)).toBeFalsy();
        expect(grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Down)).toBeFalsy();
        expect(grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Left)).toBeFalsy();
        expect(grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Right)).toBeFalsy();
      });
    });

    describe('with previews', () => {
      const hoverClassName = 'abcd';
      const previewsCount = 10;
      let grid: ResultPreviewsGrid;
      let previews: ISearchResultPreview[];
      beforeEach(() => {
        grid = new ResultPreviewsGrid(root.el, { selectedClass: hoverClassName });
        previews = createPreviews(previewsCount);
        grid.setDisplayedItems(previews);
      });

      const hoverFirst = () => grid.tryHoverOnFirstItem();
      const hoverUp = () => grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Up);
      const hoverDown = () => grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Down);
      const hoverLeft = () => grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Left);
      const hoverRight = () => grid.tryHoverOnNextItem(ResultPreviewsGridDirection.Right);

      function getPreviewElements() {
        return root.findClass(PreviewElementProperties.className) as HTMLTestPreviewElement[];
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
          expect(elements[id].outerHTML).not.toEqual(preview.element.outerHTML);
          expect(elements[id].dataset.testPosition).toEqual(id.toString());
        });
      });

      it('replaces previews with newly provided ones', () => {
        const newPreviewsCount = 4;
        const newPreviews = createPreviews(newPreviewsCount, previewsCount);
        grid.setDisplayedItems(newPreviews);

        const elements = getPreviewElements();
        expect(elements.length).toEqual(newPreviewsCount);
        newPreviews.forEach((preview, id) => {
          expect(elements[id].outerHTML).not.toEqual(preview.element.outerHTML);
          expect(elements[id].dataset.testPosition).toEqual((id + previewsCount).toString());
        });
      });

      it('does not have any hover when instantiated', () => {
        expect(root.findClass(hoverClassName).length).toEqual(0);
        expect(grid.getHoveredItem()).toBeNull();
      });

      it('is not in keyboard selection mode', () => {
        expect(grid.isHoverKeyboardControlled()).toBeFalsy();
      });

      it('returns null when calling keyboardSelect', () => {
        expect(grid.keyboardSelect()).toBeNull();
      });

      it('switches to keyboard selection mode when hovering a preview with tryHover', () => {
        hoverFirst();
        expect(grid.isHoverKeyboardControlled()).toBeTruthy();
      });

      it('switches to mouse selection mode when selecting a preview', () => {
        hoverFirst();
        grid.keyboardSelect();
        expect(grid.isHoverKeyboardControlled()).toBeFalsy();
      });

      describe('using the mouse', () => {
        function mouseOver(element: HTMLTestPreviewElement) {
          $$(element).trigger('mouseover');
        }

        function mouseOut(element: HTMLTestPreviewElement) {
          $$(element).trigger('mouseout');
        }

        it('switches to mouse selection mode when the mouse enters a preview', () => {
          hoverFirst();
          mouseOver(getPreviewElements()[0]);
          expect(grid.isHoverKeyboardControlled()).toBeFalsy();
        });

        it('does not return a keyboard selection after the mouse enters a preview', () => {
          mouseOver(getPreviewElements()[0]);
          expect(grid.keyboardSelect()).toBeNull();
        });

        it('returns the preview hovered by the mouse when calling getHoveredItem', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            const returnedPreview = grid.getHoveredItem();
            expect(returnedPreview).not.toBeNull();
            expect(returnedPreview.element).toBe(element);
          });
        });

        it('returns null when calling getHoveredItem after the mouse exit a preview', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            mouseOut(element);
            expect(grid.getHoveredItem()).toBeNull();
          });
        });

        it('only gives the hovered class to the preview hovered by the mouse', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            expect(root.findClass(hoverClassName).length).toEqual(1);
            expect(element.classList).toContain(hoverClassName);
          });
        });

        it('removes the hovered class when the mouse exits a preview', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            mouseOut(element);
            expect(root.findClass(hoverClassName).length).toEqual(0);
          });
        });

        it('removes the hover when calling clearHover', () => {
          getPreviewElements().forEach(element => {
            mouseOver(element);
            grid.clearHover();
            expect(root.findClass(hoverClassName).length).toEqual(0);
          });
        });
      });

      describe('with an active grid using tryHover', () => {
        const containerWidth = 300;
        const maxColumns = Math.floor(containerWidth / (PreviewSize + PreviewMargin * 2));
        const columnsInLastRow = previewsCount % maxColumns;
        const rows = Math.ceil(previewsCount / maxColumns);
        const columns = (row: number) => (row === rows - 1 ? columnsInLastRow : maxColumns);
        // We should test with a last row of a different length.
        Assert.check(maxColumns !== columnsInLastRow);
        // We should test with at-least three rows.
        Assert.isLargerOrEqualsThan(3, rows);
        beforeEach(() => {
          root.findClass(ResultPreviewsGrid.ResultsContainerClassName)[0].style.cssText = `
            width: ${containerWidth}px;
            height: 600px;
            display: flex;
            flex-wrap: wrap;
          `;
          document.body.appendChild(root.el);
        });

        afterEach(() => {
          document.body.removeChild(root.el);
        });

        function hoverAt(column: number, row: number) {
          hoverFirst();
          for (let x = 0; x < column; x++) {
            hoverRight();
          }
          for (let y = 0; y < row; y++) {
            hoverDown();
          }
        }

        function compareSelectionWith(column: number, row: number) {
          const expectedId = row * maxColumns + column;
          const expectedTestPosition = expectedId.toString();
          const strCoordinates = `(col: ${column}, row: ${row})`;

          // Test if the currently hovered preview is the one at `column`, `row`
          const hoveredPreview = grid.getHoveredItem();
          expect(hoveredPreview).not.toBeNull(`No hover returned at ${strCoordinates}`);
          expect((hoveredPreview.element as HTMLTestPreviewElement).dataset.testPosition).toEqual(
            expectedTestPosition,
            `Wrong preview returned at ${strCoordinates}`
          );
          const hoveredItems = root.findClass(hoverClassName);
          expect(hoveredItems.length).toEqual(1, `Multiple hovers found at ${strCoordinates}`);
          expect(hoveredItems[0].dataset.testPosition).toEqual(expectedTestPosition, `Wrong preview hovered at ${strCoordinates}`);

          // Test keyboard selection
          const selection = grid.keyboardSelect();
          expect(selection).not.toBeNull(`No selection returned at ${strCoordinates}`);
          expect((selection.element as HTMLTestPreviewElement).dataset.testPosition).toEqual(
            expectedTestPosition,
            `Wrong preview selected at ${strCoordinates}`
          );
          expect(previews[expectedId].onSelect).toHaveBeenCalledTimes(1);

          // Hover the original position, since keyboardSelect removes the hover.
          hoverAt(column, row);
        }

        it('can hover the first item', () => {
          expect(hoverFirst()).toBeTruthy();
          compareSelectionWith(0, 0);
        });

        it('cannot hover the next item when none is selected', () => {
          expect(hoverUp()).toBeFalsy('Was not prevented from moving up');
          expect(hoverDown()).toBeFalsy('Was not prevented from moving down');
          expect(hoverLeft()).toBeFalsy('Was not prevented from moving left');
          expect(hoverRight()).toBeFalsy('Was not prevented from moving right');
        });

        it('can hover all items from left to right', () => {
          for (let y = 0; y < rows; y++) {
            hoverAt(0, y);
            compareSelectionWith(0, y);
            for (let x = 1; x < columns(y); x++) {
              expect(hoverRight()).toBeTruthy(`Could not move to (${x}, ${y})`);
              compareSelectionWith(x, y);
            }
          }
        });

        it('can hover all items right to left', () => {
          for (let y = 0; y < rows; y++) {
            hoverAt(columns(y) - 1, y);
            compareSelectionWith(columns(y) - 1, y);
            for (let x = columns(y) - 2; x > 0; x--) {
              expect(hoverLeft()).toBeTruthy(`Could not move to (${x}, ${y})`);
              compareSelectionWith(x, y);
            }
          }
        });

        it('can hover all items from top to bottom', () => {
          for (let x = 0; x < maxColumns; x++) {
            const rowsAtColumn = rows - (x < columnsInLastRow ? 0 : 1);
            hoverAt(x, 0);
            compareSelectionWith(x, 0);
            for (let y = 1; y < rowsAtColumn; y++) {
              expect(hoverDown()).toBeTruthy(`Could not move to (${x}, ${y})`);
              compareSelectionWith(x, y);
            }
          }
        });

        it('can hover all items from bottom to top', () => {
          for (let x = 0; x < maxColumns; x++) {
            const startingRow = rows - (x < columnsInLastRow ? 1 : 2);
            hoverAt(x, startingRow);
            compareSelectionWith(x, startingRow);
            for (let y = startingRow - 1; y > 0; y--) {
              expect(hoverUp()).toBeTruthy(`Could not move to (${x}, ${y})`);
              compareSelectionWith(x, y);
            }
          }
        });

        it('cannot go up from the first row', () => {
          hoverFirst();
          expect(hoverUp()).toBeFalsy();
          for (let x = 1; x < maxColumns; x++) {
            hoverRight();
            expect(hoverUp()).toBeFalsy(`Was not prevented from moving up from (${x}, 0)`);
          }
        });

        it('cannot go down from the last row', () => {
          hoverAt(0, rows - 1);
          expect(hoverDown()).toBeFalsy();
          for (let x = 1; x < columns(rows - 1); x++) {
            hoverRight();
            expect(hoverDown()).toBeFalsy(`Was not prevented from moving down from (${x}, ${rows - 1})`);
          }
        });

        it('cannot go down onto unexisting cells from the last row', () => {
          hoverAt(columnsInLastRow - 1, rows - 2);
          for (let x = columnsInLastRow; x < maxColumns; x++) {
            hoverRight();
            expect(hoverDown()).toBeFalsy(`Was not prevented from moving down from (${x}, ${rows - 2})`);
          }
        });

        it('cannot go left from the first column', () => {
          hoverFirst();
          expect(hoverLeft()).toBeFalsy();
          for (let y = 1; y < rows; y++) {
            hoverDown();
            expect(hoverLeft()).toBeFalsy(`Was not prevented from moving left from (0, ${y})`);
          }
        });

        it('cannot go right from the first column', () => {
          hoverAt(maxColumns - 1, 0);
          expect(hoverRight()).toBeFalsy();
          for (let y = 1; y < rows - 1; y++) {
            hoverDown();
            expect(hoverRight()).toBeFalsy(`Was not prevented from moving right from (${maxColumns - 1}, ${y})`);
          }
        });

        it('cannot go right onto the first unexisting cell from the last row', () => {
          hoverAt(columnsInLastRow - 1, rows - 1);
          expect(hoverRight()).toBeFalsy(`Was not prevented from moving right from (${columnsInLastRow - 1}, ${rows - 1})`);
        });
      });
    });
  });
}
