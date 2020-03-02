import { ModalBox as ModalBoxModule } from '../ExternalModulesShim';
import { FocusTrap } from '../ui/FocusTrap/FocusTrap';
import { l } from '../strings/Strings';
import { $$ } from './Dom';
import { KeyboardUtils, KEYBOARD } from './KeyboardUtils';

export interface IAccessibleModalOptions {
  overlayClose?: boolean;
  sizeMod: 'small' | 'normal' | 'big';
}

export class AccessibleModal {
  private focusTrap: FocusTrap;
  private activeModal: Coveo.ModalBox.ModalBox;
  private options: IAccessibleModalOptions;
  private initiallyFocusedElement: HTMLElement;

  public get isOpen() {
    return !!this.focusTrap;
  }

  public get element() {
    return this.activeModal && this.activeModal.modalBox;
  }

  public get content() {
    return this.activeModal && this.activeModal.content;
  }

  public get wrapper() {
    return this.activeModal && this.activeModal.wrapper;
  }

  constructor(
    private className: string,
    private ownerBody: HTMLBodyElement,
    private modalboxModule: Coveo.ModalBox.ModalBox = ModalBoxModule,
    options: Partial<IAccessibleModalOptions> = {}
  ) {
    this.options = {
      ...{
        sizeMod: 'big'
      },
      ...options
    };
  }

  public open(title: HTMLElement, content: HTMLElement, validation: () => boolean) {
    if (this.isOpen) {
      return;
    }
    this.initiallyFocusedElement = document.activeElement as HTMLElement;
    this.activeModal = this.modalboxModule.open(content, {
      title,
      className: this.className,
      validation: () => {
        this.onModalClose();
        return validation();
      },
      body: this.ownerBody,
      sizeMod: this.options.sizeMod,
      overlayClose: this.options.overlayClose
    });
    this.focusTrap = new FocusTrap(this.element);
    this.makeAccessible();
  }

  public close() {
    if (!this.isOpen) {
      return;
    }
    this.activeModal.close();
    this.activeModal = null;
  }

  private makeAccessible() {
    this.element.setAttribute('aria-modal', 'true');
    this.makeCloseButtonAccessible();
  }

  private makeCloseButtonAccessible() {
    const closeButton: HTMLElement = this.element.querySelector('.coveo-small-close');
    closeButton.setAttribute('aria-label', l('Close'));
    closeButton.setAttribute('role', 'button');
    closeButton.tabIndex = 0;
    closeButton.focus();
    $$(closeButton).on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, () => closeButton.click()));
  }

  private onModalClose() {
    this.focusTrap.disable();
    this.focusTrap = null;
    if (this.initiallyFocusedElement && document.body.contains(this.initiallyFocusedElement)) {
      this.initiallyFocusedElement.focus();
    }
  }
}
