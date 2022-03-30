import { basicSearchInterfaceSetup, IBasicComponentSetup, mock } from '../MockEnvironment';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { ResponsiveFacetColumn } from '../../src/ui/ResponsiveComponents/ResponsiveFacetColumn';
import { $$, Dom } from '../../src/utils/Dom';
import { FacetsMobileMode, IFacetsMobileModeOptions } from '../../src/ui/FacetsMobileMode/FacetsMobileMode';
import { ResponsiveDropdownContent } from '../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import { ResponsiveDropdownModalContent } from '../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownModalContent';
import { ResponsiveComponents, MEDIUM_SCREEN_WIDTH } from '../../src/ui/ResponsiveComponents/ResponsiveComponents';
import { ResponsiveDropdown, ResponsiveComponentsManager } from '../../src/Core';
import { ResponsiveComponentsUtils } from '../../src/ui/ResponsiveComponents/ResponsiveComponentsUtils';
import { FacetsMobileModeEvents } from '../../src/events/FacetsMobileModeEvents';

const TEST_SCREEN_WIDTH_MOBILE = MEDIUM_SCREEN_WIDTH;
const TEST_SCREEN_WIDTH_DESKTOP = MEDIUM_SCREEN_WIDTH + 1;

export function ResponsiveFacetColumnTest() {
  let test: IBasicComponentSetup<SearchInterface>;
  let root: Dom;
  let column: ResponsiveFacetColumn;
  let dropdown: ResponsiveDropdown;
  let eventRoot: Dom;

  function createResponsiveComponents() {
    test.cmp.responsiveComponents = mock<ResponsiveComponents>(ResponsiveComponents);
    test.cmp.responsiveComponents.getResponsiveMode = () => 'auto';
    test.cmp.responsiveComponents.getMediumScreenWidth = () => TEST_SCREEN_WIDTH_MOBILE;
  }

  function appendFacetColumnElement() {
    root.append($$('div', { className: 'coveo-facet-column' }).el);
  }

  function appendHeaderWrapper() {
    root.append($$('div', { className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS }).el);
  }

  function setScreenWidth(width: number) {
    root.width = () => width;
  }

  function mockSearchInterface() {
    test = basicSearchInterfaceSetup(SearchInterface);
    root = $$(test.cmp.root);
    createResponsiveComponents();
    appendFacetColumnElement();
    appendHeaderWrapper();
    setScreenWidth(TEST_SCREEN_WIDTH_MOBILE);
  }

  function createResponsiveFacetColumn() {
    column = new ResponsiveFacetColumn(root, 'bogus', {});
    dropdown = column['dropdown'];
  }

  function createFacetsMobileMode(options?: IFacetsMobileModeOptions) {
    root.append((eventRoot = $$('div')).el);
    return new FacetsMobileMode(eventRoot.el, options);
  }

  function prepareTestWithMobileMode(facetsMobileModeOptions?: IFacetsMobileModeOptions) {
    mockSearchInterface();
    test.cmp.attachComponent(FacetsMobileMode.ID, createFacetsMobileMode(facetsMobileModeOptions));
    createResponsiveFacetColumn();
  }

  function prepareTestWithoutMobileMode() {
    spyOn(ResponsiveFacetColumn['logger'], 'warn');
    mockSearchInterface();
    createResponsiveFacetColumn();
  }

  describe('ResponsiveFacetColumn', () => {
    describe('without a FacetsMobileMode component', () => {
      beforeEach(() => {
        prepareTestWithoutMobileMode();
      });

      it('should log a warning', () => {
        expect(ResponsiveFacetColumn['logger'].warn).toHaveBeenCalled();
      });

      it('should instantiate a normal dropdown', () => {
        expect(dropdown.dropdownContent instanceof ResponsiveDropdownContent).toBeTruthy();
      });

      it('should show the background', () => {
        expect(dropdown['popupBackgroundIsEnabled']).toBeTruthy();
      });

      describe('when opened', () => {
        beforeEach(() => {
          column.handleResizeEvent();
          dropdown.open();
        });

        it('should allow scrolling on the body', () => {
          expect(root.el.style.overflow).toBeFalsy();
        });
      });
    });

    describe('with a FacetsMobileMode component', () => {
      describe('with a breakpoint', () => {
        it('is in small mode if the breakpoint is equal to the screen width', () => {
          prepareTestWithMobileMode({ breakpoint: TEST_SCREEN_WIDTH_MOBILE });
          column.handleResizeEvent();

          expect(ResponsiveComponentsUtils.isSmallFacetActivated(root)).toBeTruthy();
        });

        it("isn't in small mode if the breakpoint is under the screen width", () => {
          prepareTestWithMobileMode({ breakpoint: TEST_SCREEN_WIDTH_MOBILE - 1 });
          column.handleResizeEvent();

          expect(ResponsiveComponentsUtils.isSmallFacetActivated(root)).toBeFalsy();
        });
      });

      describe('with isModal enabled', () => {
        beforeEach(() => {
          prepareTestWithMobileMode({ isModal: true });
        });

        it('should instantiate a modal dropdown', () => {
          expect(dropdown.dropdownContent instanceof ResponsiveDropdownModalContent).toBeTruthy();
        });

        it("shouldn't show the background", () => {
          expect(dropdown['popupBackgroundIsEnabled']).toBeFalsy();
        });
      });

      describe('with isModal disabled', () => {
        beforeEach(() => {
          prepareTestWithMobileMode({ isModal: false });
        });

        it('should instantiate a normal dropdown', () => {
          expect(dropdown.dropdownContent instanceof ResponsiveDropdownContent).toBeTruthy();
        });

        it('should show the background', () => {
          expect(dropdown['popupBackgroundIsEnabled']).toBeTruthy();
        });
      });

      describe('with displayOverlayWhileOpen disabled', () => {
        beforeEach(() => {
          prepareTestWithMobileMode({ displayOverlayWhileOpen: false });
        });

        it("shouldn't show the background", () => {
          expect(dropdown['popupBackgroundIsEnabled']).toBeFalsy();
        });
      });

      describe('with preventScrolling enabled', () => {
        describe('without a scroll container', () => {
          beforeEach(() => {
            prepareTestWithMobileMode({ preventScrolling: true });
          });

          describe('when opened', () => {
            beforeEach(() => {
              column.handleResizeEvent();
              dropdown.open();
            });

            it("shouldn't allow scrolling on the body", () => {
              expect(root.el.style.overflow).toEqual('hidden');
            });

            describe('then closed', () => {
              beforeEach(() => {
                dropdown.close();
              });

              it('should re-allow scrolling on the body', () => {
                expect(root.el.style.overflow).toBeFalsy();
              });
            });
          });
        });

        describe('with a scroll container', () => {
          let container: HTMLElement;

          beforeEach(() => {
            container = $$('div').el;
            prepareTestWithMobileMode({ preventScrolling: true, scrollContainer: container });
          });

          describe('when opened', () => {
            beforeEach(() => {
              column.handleResizeEvent();
              dropdown.open();
            });

            it("shouldn't allow scrolling on the container", () => {
              expect(container.style.overflow).toEqual('hidden');
            });

            describe('then closed', () => {
              beforeEach(() => {
                dropdown.close();
              });

              it('should re-allow scrolling on the container', () => {
                expect(container.style.overflow).toBeFalsy();
              });
            });
          });
        });
      });

      describe('with bound events', () => {
        let popupOpened: jasmine.Spy;
        let popupClosed: jasmine.Spy;

        beforeEach(() => {
          prepareTestWithMobileMode();
          eventRoot.on(FacetsMobileModeEvents.popupOpened, (popupOpened = jasmine.createSpy(FacetsMobileModeEvents.popupOpened)));
          eventRoot.on(FacetsMobileModeEvents.popupClosed, (popupClosed = jasmine.createSpy(FacetsMobileModeEvents.popupClosed)));
        });

        it('should trigger the closed event when small mode is activated', () => {
          expect(popupOpened).not.toHaveBeenCalled();
          expect(popupClosed).not.toHaveBeenCalled();
          column.handleResizeEvent();
          expect(popupOpened).not.toHaveBeenCalled();
          expect(popupClosed).toHaveBeenCalledTimes(1);
        });

        describe('after small mode is activated', () => {
          beforeEach(() => {
            column.handleResizeEvent();
            popupClosed.calls.reset();
          });

          it('should trigger the opened event when opening the popup', () => {
            dropdown.open();
            expect(popupOpened).toHaveBeenCalledTimes(1);
            expect(popupClosed).not.toHaveBeenCalled();
          });

          describe('after being opened', () => {
            beforeEach(() => {
              dropdown.open();
              popupOpened.calls.reset();
            });

            it('should trigger the closed event when closing the popup', () => {
              dropdown.close();
              expect(popupOpened).not.toHaveBeenCalled();
              expect(popupClosed).toHaveBeenCalledTimes(1);
            });

            it('should trigger the closed event when large mode is activated', () => {
              setScreenWidth(TEST_SCREEN_WIDTH_DESKTOP);
              column.handleResizeEvent();
              expect(popupOpened).not.toHaveBeenCalled();
              expect(popupClosed).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });
}
