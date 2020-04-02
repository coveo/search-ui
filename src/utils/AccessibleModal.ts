import { ModalBox as ModalBoxModule } from '../ExternalModulesShim';
import { FocusTrap } from '../ui/FocusTrap/FocusTrap';
import { l } from '../strings/Strings';
import { $$ } from './Dom';
import { KeyboardUtils, KEYBOARD } from './KeyboardUtils';
import { IQuickViewHeaderOptions } from './DomUtils';
import { IQueryResult } from '../rest/QueryResult';
import { IComponentBindings } from '../ui/Base/ComponentBindings';
import { DomUtils } from '../Core';

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

  private get headerElement() {
    return this.element && this.element.querySelector<HTMLElement>('.coveo-modal-header h1');
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

  public openResult(
    result: IQueryResult,
    options: IQuickViewHeaderOptions,
    bindings: IComponentBindings,
    content: HTMLElement,
    validation: () => boolean,
    origin?: HTMLElement
  ) {
    if (this.isOpen) {
      return;
    }
    this.openModalAndTrap(DomUtils.getQuickviewHeader(result, options, bindings).el, content, validation, origin);
    this.makeAccessible(options.title || result.title);
  }

  public open(title: HTMLElement, content: HTMLElement, validation: () => boolean, origin?: HTMLElement) {
    if (this.isOpen) {
      return;
    }
    this.openModalAndTrap(title, content, validation, origin);
    this.makeAccessible();
  }

  private openModalAndTrap(title: HTMLElement, content: HTMLElement, validation: () => boolean, origin?: HTMLElement) {
    this.initiallyFocusedElement = origin || (document.activeElement as HTMLElement);
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
  }

  public close() {
    if (!this.isOpen) {
      return;
    }
    this.activeModal.close();
    this.activeModal = null;
  }

  private makeAccessible(title?: string) {
    this.element.setAttribute('aria-modal', 'true');
    if (title) {
      this.headerElement.setAttribute('aria-label', title);
    }
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
