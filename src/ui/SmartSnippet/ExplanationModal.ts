import { AccessibleModal } from '../../utils/AccessibleModal';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { RadioButton } from '../FormWidgets/RadioButton';
import 'styling/_ExplanationModal';

export interface IReason {
  label: string;
  id: string;
  onSelect: () => void;
  hasDetails?: boolean;
}

export interface IExplanationModalOptions {
  ownerElement: HTMLElement;
  reasons: IReason[];
  onClosed: () => void;
  modalBoxModule?: Coveo.ModalBox.ModalBox;
}

const ROOT_CLASSNAME = 'coveo-user-explanation-modal';
const CONTENT_CLASSNAME = `${ROOT_CLASSNAME}-content`;
const EXPLANATION_SECTION_CLASSNAME = `${ROOT_CLASSNAME}-explanation-section`;
const REASONS_CLASSNAME = `${ROOT_CLASSNAME}-explanations`;
const REASONS_LABEL_CLASSNAME = `${REASONS_CLASSNAME}-label`;
const DETAILS_SECTION_CLASSNAME = `${ROOT_CLASSNAME}-details`;
const DETAILS_TEXTAREA_CLASSNAME = `${DETAILS_SECTION_CLASSNAME}-textarea`;
const DETAILS_LABEL_CLASSNAME = `${DETAILS_SECTION_CLASSNAME}-label`;
const BUTTONS_SECTION_CLASSNAME = `${ROOT_CLASSNAME}-buttons-section`;
const SEND_BUTTON_CLASSNAME = `${ROOT_CLASSNAME}-send-button`;
const CANCEL_BUTTON_CLASSNAME = `${ROOT_CLASSNAME}-cancel-button`;
const DETAILS_ID = DETAILS_SECTION_CLASSNAME;

export const ExplanationModalClassNames = {
  ROOT_CLASSNAME,
  CONTENT_CLASSNAME,
  EXPLANATION_SECTION_CLASSNAME,
  REASONS_CLASSNAME,
  REASONS_LABEL_CLASSNAME,
  DETAILS_SECTION_CLASSNAME,
  DETAILS_TEXTAREA_CLASSNAME,
  DETAILS_LABEL_CLASSNAME,
  BUTTONS_SECTION_CLASSNAME,
  SEND_BUTTON_CLASSNAME,
  CANCEL_BUTTON_CLASSNAME
};

export class ExplanationModal {
  private modal: AccessibleModal;
  private reasons: RadioButton[];
  private selectedReason: IReason;
  private detailsSection: Dom;
  private detailsTextArea: HTMLTextAreaElement;
  private shouldCallCloseEvent = false;

  constructor(public options: IExplanationModalOptions) {
    this.modal = new AccessibleModal(ROOT_CLASSNAME, this.options.ownerElement, this.options.modalBoxModule, {
      focusOnOpen: () => this.sendButton()
    });
  }

  private sendButton(): HTMLElement {
    return this.modal.element.querySelector(`.${REASONS_CLASSNAME} input`);
  }

  public get details() {
    if (!this.selectedReason || !this.selectedReason.hasDetails) {
      return null;
    }
    return this.detailsTextArea.value;
  }

  public open(origin: HTMLElement) {
    this.modal.open({
      origin,
      title: $$('span', {}, l('UsefulnessFeedbackExplainWhyImperative')).el,
      content: this.buildContent(),
      validation: () => {
        if (this.shouldCallCloseEvent) {
          this.options.onClosed();
          this.shouldCallCloseEvent = false;
        }
        return true;
      }
    });
    this.shouldCallCloseEvent = true;
  }

  private buildContent() {
    return $$(
      'div',
      {
        className: CONTENT_CLASSNAME
      },
      this.buildExplanationSection(),
      this.buildButtonsSection()
    ).el;
  }

  private buildExplanationSection() {
    const detailsSection = this.buildDetailsSection();
    return $$(
      'div',
      {
        className: EXPLANATION_SECTION_CLASSNAME
      },
      this.buildReasons(),
      detailsSection
    ).el;
  }

  private buildButtonsSection() {
    return $$(
      'div',
      {
        className: BUTTONS_SECTION_CLASSNAME
      },
      this.buildSendButton(),
      this.buildCancelButton()
    );
  }

  private buildReasons() {
    const reasonsContainer = $$('fieldset', { className: REASONS_CLASSNAME }, this.buildReasonsLabel()).el;
    this.reasons = this.options.reasons.map(reason => this.buildReasonRadioButton(reason));
    this.reasons[0].select();
    this.reasons.forEach(radioButton => reasonsContainer.appendChild(radioButton.getElement()));
    return reasonsContainer;
  }

  private buildReasonsLabel() {
    return $$('legend', { className: REASONS_LABEL_CLASSNAME }, l('UsefulnessFeedbackReason')).el;
  }

  private buildDetailsSection() {
    return (this.detailsSection = $$(
      'div',
      { className: `coveo-hidden ${DETAILS_SECTION_CLASSNAME}` },
      $$('label', { className: DETAILS_LABEL_CLASSNAME, for: DETAILS_ID }, l('Details')).el,
      (this.detailsTextArea = $$('textarea', { className: DETAILS_TEXTAREA_CLASSNAME, id: DETAILS_ID, disabled: true })
        .el as HTMLTextAreaElement)
    ));
  }

  private buildSendButton() {
    const button = $$('button', { className: SEND_BUTTON_CLASSNAME, type: 'button' }, l('Send'));
    button.on('click', () => {
      this.selectedReason.onSelect();
      this.shouldCallCloseEvent = false;
      this.modal.close();
    });
    return button.el;
  }

  private buildCancelButton() {
    const button = $$('button', { className: CANCEL_BUTTON_CLASSNAME, type: 'button' }, l('Cancel'));
    button.on('click', () => this.modal.close());
    return button.el;
  }

  private buildReasonRadioButton(reason: IReason) {
    return new RadioButton(
      radioButton => {
        if (!radioButton.isSelected()) {
          return;
        }
        this.detailsSection.toggleClass('coveo-hidden', !reason.hasDetails);
        this.detailsTextArea.disabled = !reason.hasDetails;
        this.selectedReason = reason;
      },
      reason.label,
      'reason',
      `coveo-reason-${reason.id}`
    );
  }
}
