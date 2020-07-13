import { AccessibleModal } from '../../utils/AccessibleModal';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { RadioButton } from '../FormWidgets/RadioButton';
import 'styling/_ExplanationModal';

export interface IReason {
  label: string;
  onSelect: () => void;
  hasDetails?: boolean;
}

export interface IExplanationModalOptions {
  ownerElement: HTMLElement;
  explanations: IReason[];
  onClosed: () => void;
  modalBoxModule?: Coveo.ModalBox.ModalBox;
}

const ROOT_CLASSNAME = 'coveo-user-explanation-modal';
const CONTENT_CLASSNAME = `${ROOT_CLASSNAME}-content`;
const EXPLANATIONS_CLASSNAME = `${ROOT_CLASSNAME}-explanations`;
const EXPLANATIONS_LABEL_CLASSNAME = `${EXPLANATIONS_CLASSNAME}-label`;
const DETAILS_SECTION_CLASSNAME = `${ROOT_CLASSNAME}-details`;
const DETAILS_TEXTAREA_CLASSNAME = `${DETAILS_SECTION_CLASSNAME}-textarea`;
const DETAILS_LABEL_CLASSNAME = `${DETAILS_SECTION_CLASSNAME}-label`;
const SEND_BUTTON_CLASSNAME = `${ROOT_CLASSNAME}-send-button`;
const DETAILS_ID = DETAILS_SECTION_CLASSNAME;

export const ExplanationModalClassNames = {
  ROOT_CLASSNAME,
  CONTENT_CLASSNAME,
  EXPLANATIONS_CLASSNAME,
  DETAILS_SECTION_CLASSNAME,
  DETAILS_TEXTAREA_CLASSNAME,
  DETAILS_LABEL_CLASSNAME,
  SEND_BUTTON_CLASSNAME
};

export class ExplanationModal {
  private modal: AccessibleModal;
  private reasons: RadioButton[];
  private selectedReason: IReason;
  private detailsTextArea: HTMLTextAreaElement;
  private isOpen = false;

  constructor(public options: IExplanationModalOptions) {
    this.modal = new AccessibleModal(ROOT_CLASSNAME, this.options.ownerElement, this.options.modalBoxModule);
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
      title: l('UsefulnessFeedbackExplainWhyImperative'),
      content: this.buildContent(),
      validation: () => {
        if (this.isOpen) {
          this.options.onClosed();
          this.isOpen = false;
        }
        return true;
      }
    });
    this.isOpen = true;
  }

  private buildContent() {
    const detailsSection = this.buildDetailsSection();
    return $$(
      'div',
      {
        className: CONTENT_CLASSNAME
      },
      this.buildExplanations(),
      detailsSection,
      this.buildSendButton()
    ).el;
  }

  private buildExplanations() {
    const explanationsContainer = $$('fieldset', { className: EXPLANATIONS_CLASSNAME }, this.buildExplanationsLabel()).el;
    this.reasons = this.options.explanations.map(explanation => this.buildExplanationRadioButton(explanation));
    this.reasons[0].select();
    this.reasons.forEach(radioButton => explanationsContainer.appendChild(radioButton.getElement()));
    return explanationsContainer;
  }

  private buildExplanationsLabel() {
    return $$('legend', { className: EXPLANATIONS_LABEL_CLASSNAME }, l('UsefulnessFeedbackReason')).el;
  }

  private buildDetailsSection() {
    return $$(
      'div',
      { className: DETAILS_SECTION_CLASSNAME },
      $$('label', { className: DETAILS_LABEL_CLASSNAME, for: DETAILS_ID }, l('Details')).el,
      (this.detailsTextArea = $$('textarea', { className: DETAILS_TEXTAREA_CLASSNAME, id: DETAILS_ID, disabled: true })
        .el as HTMLTextAreaElement)
    );
  }

  private buildSendButton() {
    const button = $$('button', { className: SEND_BUTTON_CLASSNAME }, l('Send'));
    button.on('click', () => {
      this.selectedReason.onSelect();
      this.isOpen = false;
      this.modal.close();
    });
    return button.el;
  }

  private buildExplanationRadioButton(explanation: IReason) {
    return new RadioButton(
      radioButton => {
        if (!radioButton.isSelected()) {
          return;
        }
        this.detailsTextArea.disabled = !explanation.hasDetails;
        this.selectedReason = explanation;
      },
      explanation.label,
      'explanation'
    );
  }
}
