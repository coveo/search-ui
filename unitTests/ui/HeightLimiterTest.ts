import { $$ } from '../../src/utils/Dom';
import { HeightLimiter, HeightLimiterClassNames as ClassNames } from '../../src/ui/SmartSnippet/HeightLimiter';
import { SVGIcons } from '../../src/utils/SVGIcons';
import { l } from '../../src/strings/Strings';
import { expectChildren } from '../TestUtils';

const heightLimit = 2;

interface IElementsState {
  containerActive: boolean;
  buttonActive: boolean;
  containerExpanded: boolean;
}

export function HeightLimiterTest() {
  let heightLimiter: HeightLimiter;
  let container: HTMLElement;
  let content: HTMLElement;
  let onToggleSpy: jasmine.Spy;
  let contentHeight: number;

  function createContainer() {
    return (container = $$('div').el);
  }

  function createContent(height: number) {
    contentHeight = height;
    content = $$('div').el;
    Object.defineProperty(content, 'clientHeight', { get: () => contentHeight });
    return content;
  }

  function initializeHeightLimiter(initialHeight: number) {
    heightLimiter = new HeightLimiter(
      createContainer(),
      createContent(initialHeight),
      heightLimit,
      (onToggleSpy = jasmine.createSpy('onToggle'))
    );
  }

  function resizeContainer(newHeight: number) {
    contentHeight = newHeight;
    heightLimiter.onContentHeightChanged();
  }

  function getElementsState(): IElementsState {
    return {
      containerActive: container.classList.contains(ClassNames.CONTAINER_ACTIVE_CLASSNAME),
      buttonActive: heightLimiter.toggleButton.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME),
      containerExpanded: container.classList.contains(ClassNames.CONTAINER_EXPANDED_CLASSNAME)
    };
  }

  function getButtonText() {
    return heightLimiter.toggleButton.querySelector(`.${ClassNames.BUTTON_LABEL_CLASSNAME}`).textContent;
  }

  function getButtonIcon() {
    return heightLimiter.toggleButton.querySelector(`.${ClassNames.BUTTON_ICON_CLASSNAME}`).innerHTML;
  }

  describe('HeightLimiter', () => {
    describe('initialized at the height limit', () => {
      beforeEach(() => {
        initializeHeightLimiter(heightLimit);
      });

      it('should have an inactive container, inactive button and collapsed container', () => {
        expect(getElementsState()).toEqual({ containerActive: false, buttonActive: false, containerExpanded: false });
      });

      it('should not force a height on the container', () => {
        expect(container.style.height).toEqual('');
      });

      it("doesn't call onToggle", () => {
        expect(onToggleSpy).not.toHaveBeenCalled();
      });

      describe('then resized beyond the height limit', () => {
        beforeEach(() => {
          resizeContainer(heightLimit + 1);
        });

        it('makes the container and button active', () => {
          expect(getElementsState()).toEqual({ containerActive: true, buttonActive: true, containerExpanded: false });
        });

        it('should force a height on the container', () => {
          expect(container.style.height).toEqual(`${heightLimit}px`);
        });

        it('should render the toggle button with its label and icon inside', () => {
          expectChildren(heightLimiter.toggleButton, [ClassNames.BUTTON_LABEL_CLASSNAME, ClassNames.BUTTON_ICON_CLASSNAME]);
        });

        it('should have the show more label on the toggle button', () => {
          expect(getButtonText()).toEqual(l('ShowMore'));
        });

        it('should have a down arrow on the toggle button', () => {
          expect(getButtonIcon()).toEqual(SVGIcons.icons.arrowDown);
        });

        it("doesn't call onToggle", () => {
          expect(onToggleSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('initialized beyond the height limit', () => {
      beforeEach(() => {
        initializeHeightLimiter(heightLimit + 1);
      });

      it('should have an active container, active button and collapsed container', () => {
        expect(getElementsState()).toEqual({ containerActive: true, buttonActive: true, containerExpanded: false });
      });

      it('should force a height on the container', () => {
        expect(container.style.height).toEqual(`${heightLimit}px`);
      });

      it('should have the show more label on the toggle button', () => {
        expect(getButtonText()).toEqual(l('ShowMore'));
      });

      it('should have a down arrow on the toggle button', () => {
        expect(getButtonIcon()).toEqual(SVGIcons.icons.arrowDown);
      });

      it("doesn't call onToggle", () => {
        expect(onToggleSpy).not.toHaveBeenCalled();
      });

      describe('then resized to the height limit', () => {
        beforeEach(() => {
          resizeContainer(heightLimit);
        });

        it('makes the container and button inactive', () => {
          expect(getElementsState()).toEqual({ containerActive: false, buttonActive: false, containerExpanded: false });
        });

        it('should not force a height on the container', () => {
          expect(container.style.height).toEqual('');
        });

        it("doesn't call onToggle", () => {
          expect(onToggleSpy).not.toHaveBeenCalled();
        });
      });

      describe('then pressing the toggle button', () => {
        beforeEach(() => {
          heightLimiter.toggleButton.click();
        });

        it('should expand the container', () => {
          expect(getElementsState()).toEqual({ containerActive: true, buttonActive: true, containerExpanded: true });
        });

        it('should force the scrollHeight on the container', () => {
          expect(container.style.height).toEqual(`${contentHeight}px`);
        });

        it('should have the show less label on the toggle button', () => {
          expect(getButtonText()).toEqual(l('ShowLess'));
        });

        it('should have an up arrow on the toggle button', () => {
          expect(getButtonIcon()).toEqual(SVGIcons.icons.arrowUp);
        });

        it('then resized to the height limit, should make the container and button inactive, then collapse the container', () => {
          resizeContainer(heightLimit);
          expect(getElementsState()).toEqual({ containerActive: false, buttonActive: false, containerExpanded: false });
        });

        it('calls onToggle', () => {
          expect(onToggleSpy).toHaveBeenCalledTimes(1);
          expect(onToggleSpy).toHaveBeenCalledWith(true);
        });

        describe('then pressing the toggle button', () => {
          beforeEach(() => {
            onToggleSpy.calls.reset();
            heightLimiter.toggleButton.click();
          });

          it('should collapse the container', () => {
            expect(getElementsState()).toEqual({ containerActive: true, buttonActive: true, containerExpanded: false });
          });

          it('should force the height limit on the container', () => {
            expect(container.style.height).toEqual(`${heightLimit}px`);
          });

          it('should have the show more label on the toggle button', () => {
            expect(getButtonText()).toEqual(l('ShowMore'));
          });

          it('should have a down arrow on the toggle button', () => {
            expect(getButtonIcon()).toEqual(SVGIcons.icons.arrowDown);
          });

          it('calls onToggle', () => {
            expect(onToggleSpy).toHaveBeenCalledTimes(1);
            expect(onToggleSpy).toHaveBeenCalledWith(false);
          });
        });
      });
    });
  });
}
