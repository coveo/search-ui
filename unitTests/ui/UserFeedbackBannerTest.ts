import { UserFeedbackBanner, UserFeedbackBannerClassNames as ClassNames } from '../../src/ui/SmartSnippet/UserFeedbackBanner';
import { expectChildren } from '../TestUtils';
import { l } from '../../src/strings/Strings';
import { SVGIcons } from '../../src/utils/SVGIcons';

export function UserFeedbackBannerTest() {
  describe('UserFeedbackBanner', () => {
    let rootElement: HTMLElement;
    let sendUsefulnessAnalyticsSpy: jasmine.Spy;

    function getFirstChild(className: string) {
      return rootElement.getElementsByClassName(className)[0] as HTMLElement;
    }

    beforeEach(() => {
      rootElement = new UserFeedbackBanner((sendUsefulnessAnalyticsSpy = jasmine.createSpy('sendUsefulnessAnalytics'))).build();
    });

    it('builds a root element with the root classname', () => {
      expect(rootElement.classList.contains(ClassNames.ROOT_CLASSNAME)).toBeTruthy();
    });

    it('builds a root element with the top container and bottom thank you banner', () => {
      const [, banner] = expectChildren(rootElement, [ClassNames.CONTAINER_CLASSNAME, ClassNames.THANK_YOU_BANNER_CLASSNAME]);

      expect(banner.classList.contains(ClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)).toBeFalsy();
    });

    it('builds the top container with a label and buttons', () => {
      const [label] = expectChildren(getFirstChild(ClassNames.CONTAINER_CLASSNAME), [
        ClassNames.LABEL_CLASSNAME,
        ClassNames.BUTTONS_CONTAINER_CLASSNAME
      ]);

      expect(label.innerText).toEqual(l('UsefulnessFeedbackRequest'));
    });

    it('builds the buttons container with both buttons', () => {
      const [yesButton, noButton] = expectChildren(getFirstChild(ClassNames.BUTTONS_CONTAINER_CLASSNAME), [
        ClassNames.YES_BUTTON_CLASSNAME,
        ClassNames.NO_BUTTON_CLASSNAME
      ]);

      expect(yesButton.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeFalsy();
      expect(noButton.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeFalsy();
    });

    it('builds the yes button with an icon and text', () => {
      const [icon, label] = expectChildren(getFirstChild(ClassNames.YES_BUTTON_CLASSNAME), [ClassNames.ICON_CLASSNAME, null]);

      expect(icon.innerHTML).toEqual(SVGIcons.icons.checkYes);
      expect(label.innerText).toEqual(l('Yes'));
    });

    it('builds the no button with an icon and text', () => {
      const [icon, label] = expectChildren(getFirstChild(ClassNames.NO_BUTTON_CLASSNAME), [ClassNames.ICON_CLASSNAME, null]);

      expect(icon.innerHTML).toEqual(SVGIcons.icons.clearSmall);
      expect(label.innerText).toEqual(l('No'));
    });

    it('builds the thank you banner with a label and a button', () => {
      const [label, button] = expectChildren(getFirstChild(ClassNames.THANK_YOU_BANNER_CLASSNAME), [
        null,
        ClassNames.EXPLAIN_WHY_CLASSNAME
      ]);

      expect(label.innerText).toEqual(l('UsefulnessFeedbackThankYou'));
      expect(button.innerHTML).toEqual(l('UsefulnessFeedbackExplainWhy'));
      expect(button.classList.contains(ClassNames.EXPLAIN_WHY_ACTIVE_CLASSNAME)).toBeFalsy();
    });

    describe('after clicking on the yes button', () => {
      let button: HTMLElement;
      beforeEach(() => {
        button = getFirstChild(ClassNames.YES_BUTTON_CLASSNAME);
        button.click();
      });

      it('gives the active class to the button', () => {
        expect(button.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeTruthy();
      });

      it('gives the active class to the thank you banner', () => {
        expect(
          getFirstChild(ClassNames.THANK_YOU_BANNER_CLASSNAME).classList.contains(ClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)
        ).toBeTruthy();
      });

      it("doesn't give the active class to the explain why button", () => {
        expect(getFirstChild(ClassNames.EXPLAIN_WHY_CLASSNAME).classList.contains(ClassNames.EXPLAIN_WHY_ACTIVE_CLASSNAME)).toBeFalsy();
      });

      it('sends analytics', () => {
        expect(sendUsefulnessAnalyticsSpy).toHaveBeenCalledWith(true);
      });

      describe('then clicking on the no button', () => {
        let nextButton: HTMLElement;
        beforeEach(() => {
          sendUsefulnessAnalyticsSpy.calls.reset();
          nextButton = getFirstChild(ClassNames.NO_BUTTON_CLASSNAME);
          nextButton.click();
        });

        it('removes the active class from the yes button', () => {
          expect(button.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeFalsy();
        });

        it('gives the active class to the no button', () => {
          expect(nextButton.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeTruthy();
        });

        it('gives the active class to the thank you banner', () => {
          expect(
            getFirstChild(ClassNames.THANK_YOU_BANNER_CLASSNAME).classList.contains(ClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)
          ).toBeTruthy();
        });

        it('gives the active class to the explain why button', () => {
          expect(getFirstChild(ClassNames.EXPLAIN_WHY_CLASSNAME).classList.contains(ClassNames.EXPLAIN_WHY_ACTIVE_CLASSNAME)).toBeTruthy();
        });

        it('sends analytics', () => {
          expect(sendUsefulnessAnalyticsSpy).toHaveBeenCalledWith(false);
        });
      });

      describe('then clicking on the yes button again', () => {
        beforeEach(() => {
          sendUsefulnessAnalyticsSpy.calls.reset();
          button.click();
        });

        it('keeps the active class on the button', () => {
          expect(button.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeTruthy();
        });

        it('keeps the active class on the thank you banner', () => {
          expect(
            getFirstChild(ClassNames.THANK_YOU_BANNER_CLASSNAME).classList.contains(ClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)
          ).toBeTruthy();
        });

        it("doesn't give the active class to the explain why button", () => {
          expect(getFirstChild(ClassNames.EXPLAIN_WHY_CLASSNAME).classList.contains(ClassNames.EXPLAIN_WHY_ACTIVE_CLASSNAME)).toBeFalsy();
        });

        it("doesn't send analytics", () => {
          expect(sendUsefulnessAnalyticsSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('after clicking on the no button', () => {
      let button: HTMLElement;
      beforeEach(() => {
        button = getFirstChild(ClassNames.NO_BUTTON_CLASSNAME);
        button.click();
      });

      it('gives the active class to the button', () => {
        expect(button.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeTruthy();
      });

      it('gives the active class to the thank you banner', () => {
        expect(
          getFirstChild(ClassNames.THANK_YOU_BANNER_CLASSNAME).classList.contains(ClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)
        ).toBeTruthy();
      });

      it('gives the active class to the explain why button', () => {
        expect(getFirstChild(ClassNames.EXPLAIN_WHY_CLASSNAME).classList.contains(ClassNames.EXPLAIN_WHY_ACTIVE_CLASSNAME)).toBeTruthy();
      });

      it('sends analytics', () => {
        expect(sendUsefulnessAnalyticsSpy).toHaveBeenCalledWith(false);
      });

      describe('then clicking on the yes button', () => {
        let nextButton: HTMLElement;
        beforeEach(() => {
          sendUsefulnessAnalyticsSpy.calls.reset();
          nextButton = getFirstChild(ClassNames.YES_BUTTON_CLASSNAME);
          nextButton.click();
        });

        it('removes the active class from the no button', () => {
          expect(button.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeFalsy();
        });

        it('gives the active class to the yes button', () => {
          expect(nextButton.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeTruthy();
        });

        it('gives the active class to the thank you banner', () => {
          expect(
            getFirstChild(ClassNames.THANK_YOU_BANNER_CLASSNAME).classList.contains(ClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)
          ).toBeTruthy();
        });

        it("doesn't give the active class to the explain why button", () => {
          expect(getFirstChild(ClassNames.EXPLAIN_WHY_CLASSNAME).classList.contains(ClassNames.EXPLAIN_WHY_ACTIVE_CLASSNAME)).toBeFalsy();
        });

        it('sends analytics', () => {
          expect(sendUsefulnessAnalyticsSpy).toHaveBeenCalledWith(true);
        });
      });

      describe('then clicking on the no button again', () => {
        beforeEach(() => {
          sendUsefulnessAnalyticsSpy.calls.reset();
          button.click();
        });

        it('keeps the active class on the button', () => {
          expect(button.classList.contains(ClassNames.BUTTON_ACTIVE_CLASSNAME)).toBeTruthy();
        });

        it('keeps the active class on the thank you banner', () => {
          expect(
            getFirstChild(ClassNames.THANK_YOU_BANNER_CLASSNAME).classList.contains(ClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)
          ).toBeTruthy();
        });

        it('keeps the active class on the explain why button', () => {
          expect(getFirstChild(ClassNames.EXPLAIN_WHY_CLASSNAME).classList.contains(ClassNames.EXPLAIN_WHY_ACTIVE_CLASSNAME)).toBeTruthy();
        });

        it("doesn't send analytics", () => {
          expect(sendUsefulnessAnalyticsSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
}
