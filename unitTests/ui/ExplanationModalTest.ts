import { IExplanation, ExplanationModal, ExplanationModalClassNames as ClassNames } from '../../src/ui/SmartSnippet/ExplanationModal';
import { $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';
import { mock } from '../MockEnvironment';
import { AccessibleModal, IAccessibleModalOpenNormalParameters } from '../../src/utils/AccessibleModal';
import { l } from '../../src/strings/Strings';
import { expectChildren } from '../TestUtils';

export function ExplanationModalTest() {
  const details = 'Hello, World!';
  let explanations: IExplanation[];
  let onClosed: jasmine.Spy;
  let ownerElement: HTMLElement;
  let explanationModal: ExplanationModal;
  let accessibleModal: AccessibleModal;
  let origin: HTMLElement;
  let content: HTMLElement;

  function createExplanations(firstExplanationHasDetails: boolean): IExplanation[] {
    return [
      {
        label: 'Explanation selected by default',
        onSelect: jasmine.createSpy('onSelect1'),
        hasDetails: firstExplanationHasDetails
      },
      {
        label: 'Second explanation implicitly without details',
        onSelect: jasmine.createSpy('onSelect2')
      },
      {
        label: 'Third explanation explicitly without details',
        onSelect: jasmine.createSpy('onSelect3'),
        hasDetails: false
      }
    ];
  }

  function initializeModal(firstExplanationHasDetails = true) {
    explanationModal = new ExplanationModal({
      explanations: (explanations = createExplanations(firstExplanationHasDetails)),
      onClosed: (onClosed = jasmine.createSpy('onClosed')),
      ownerElement: (ownerElement = $$('div').el),
      modalBoxModule: Simulate.modalBoxModule()
    });
    explanationModal['modal'] = accessibleModal = mock(AccessibleModal);
    (accessibleModal.close as jasmine.Spy).and.callFake(() => getAccessibleModalOpenParameters().validation());
  }

  function getAccessibleModalOpenParameters() {
    return ((accessibleModal.open as jasmine.Spy).calls.mostRecent().args as [IAccessibleModalOpenNormalParameters])[0];
  }

  function openModal() {
    explanationModal.open((origin = $$('div').el));
    content = getAccessibleModalOpenParameters().content;
  }

  function getFirstChild(className: string) {
    return content.getElementsByClassName(className)[0] as HTMLElement;
  }

  function pressSendButton() {
    getFirstChild(ClassNames.SEND_BUTTON_CLASSNAME).click();
  }

  function writeDetails() {
    (getFirstChild(ClassNames.DETAILS_TEXTAREA_CLASSNAME) as HTMLTextAreaElement).value = details;
  }

  function selectExplanation(index: number) {
    content
      .querySelectorAll('input')
      .item(index)
      .click();
  }

  describe('ExplanationModal', () => {
    describe('with a first explanation that has details', () => {
      beforeEach(() => {
        initializeModal();
        openModal();
      });

      it('should open the modal with the given origin', () => {
        expect(getAccessibleModalOpenParameters().origin).toEqual(origin);
      });

      it('should give the modal the right title', () => {
        expect(getAccessibleModalOpenParameters().title).toEqual(l('UsefulnessFeedbackExplainWhyImperative'));
      });

      it('should give the root the right class', () => {
        expect(content.classList.contains(ClassNames.CONTENT_CLASSNAME)).toBeTruthy();
      });

      it('builds the root with the explanations list, the details section and the send button', () => {
        expectChildren(content, [
          ClassNames.EXPLANATIONS_CLASSNAME,
          ClassNames.DETAILS_SECTION_CLASSNAME,
          ClassNames.SEND_BUTTON_CLASSNAME
        ]);
      });

      it('builds a radio button for each explanation', () => {
        const inputs = $$(content).findAll('input');
        expect(inputs.length).toEqual(explanations.length, 'Expected as many inputs as explanations.');
        const labels = inputs.map(input => $$(content).find(`label[for="${input.id}"]`));
        expect(labels.length).toEqual(explanations.length, 'Expected a label for each explanation');
        labels.forEach((label, index) => expect(label.innerText).toEqual(explanations[index].label));
      });

      it('builds a details section with a label and a textarea', () => {
        expectChildren(getFirstChild(ClassNames.DETAILS_SECTION_CLASSNAME), [
          ClassNames.DETAILS_LABEL_CLASSNAME,
          ClassNames.DETAILS_TEXTAREA_CLASSNAME
        ]);
      });

      it("doesn't disable the textarea", () => {
        expect((getFirstChild(ClassNames.DETAILS_TEXTAREA_CLASSNAME) as HTMLTextAreaElement).disabled).toBeFalsy();
      });

      it('builds a send button with the right text', () => {
        expect(getFirstChild(ClassNames.SEND_BUTTON_CLASSNAME).innerText).toEqual('Send');
      });

      describe('after selecting the second explanation', () => {
        beforeEach(() => {
          selectExplanation(1);
        });

        it('should disable the details textarea', () => {
          expect((getFirstChild(ClassNames.DETAILS_TEXTAREA_CLASSNAME) as HTMLTextAreaElement).disabled).toBeTruthy();
        });

        describe('then pressing the send button', () => {
          beforeEach(() => {
            pressSendButton();
          });

          it('calls onSelect on the second explanation', () => {
            expect(explanations[1].onSelect).toHaveBeenCalledTimes(1);
          });

          it("doesn't provide details from the textarea", () => {
            writeDetails();
            expect(explanationModal.details).toBeNull();
          });
        });
      });

      describe('after selecting the third explanation', () => {
        beforeEach(() => {
          selectExplanation(2);
        });

        it('should disable the details textarea', () => {
          expect((getFirstChild(ClassNames.DETAILS_TEXTAREA_CLASSNAME) as HTMLTextAreaElement).disabled).toBeTruthy();
        });

        describe('then pressing the send button', () => {
          beforeEach(() => {
            pressSendButton();
          });

          it('calls onSelect on the third explanation', () => {
            expect(explanations[2].onSelect).toHaveBeenCalledTimes(1);
          });

          it("doesn't provide details from the textarea", () => {
            writeDetails();
            expect(explanationModal.details).toBeNull();
          });
        });
      });

      describe('after pressing the send button', () => {
        beforeEach(() => {
          pressSendButton();
        });

        it('calls onSelect on the first explanation', () => {
          expect(explanations[0].onSelect).toHaveBeenCalledTimes(1);
        });

        it('provides details from the textarea', () => {
          writeDetails();
          expect(explanationModal.details).toEqual(details);
        });

        it('closes the modal', () => {
          expect(accessibleModal.close).toHaveBeenCalledTimes(1);
        });

        it("doesn't call onClosed", () => {
          expect(onClosed).not.toHaveBeenCalled();
        });
      });

      describe('after pressing the close button', () => {
        beforeEach(() => {
          accessibleModal.close();
        });

        it('calls onClosed', () => {
          expect(onClosed).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("with a first explanation that doesn't have details", () => {
      beforeEach(() => {
        initializeModal(false);
        openModal();
      });

      it('disables the textarea', () => {
        expect((getFirstChild(ClassNames.DETAILS_TEXTAREA_CLASSNAME) as HTMLTextAreaElement).disabled).toBeTruthy();
      });
    });
  });
}
