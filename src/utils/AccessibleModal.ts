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
  focusOnOpen?(): HTMLElement;
}

export interface IAccessibleModalOpenParameters {
  content: HTMLElement;
  validation: () => boolean;
  origin: HTMLElement;
}

export interface IAccessibleModalOpenResultParameters extends IAccessibleModalOpenParameters {
  result: IQueryResult;
  options: IQuickViewHeaderOptions;
  bindings: IComponentBindings;
}

export interface IAccessibleModalOpenNormalParameters extends IAccessibleModalOpenParameters {
  title: HTMLElement;
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
    private ownerElement: HTMLElement,
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

  public openResult(parameters: IAccessibleModalOpenResultParameters) {
    if (this.isOpen) {
      return;
    }
    this.openModalAndTrap({
      content: parameters.content,
      validation: parameters.validation,
      origin: parameters.origin,
      title: DomUtils.getQuickviewHeader(parameters.result, parameters.options, parameters.bindings).el
    });
    this.makeAccessible(parameters.options.title || parameters.result.title);
  }

  public open(parameters: IAccessibleModalOpenNormalParameters) {
    if (this.isOpen) {
      return;
    }
    this.openModalAndTrap(parameters);
    this.makeAccessible();
  }

  private openModalAndTrap(parameters: IAccessibleModalOpenNormalParameters) {
    this.initiallyFocusedElement = parameters.origin || (document.activeElement as HTMLElement);
    this.activeModal = this.modalboxModule.open(parameters.content, {
      title: parameters.title,
      className: this.className,
      validation: () => {
        this.onModalClose();
        return parameters.validation();
      },
      body: this.ownerElement,
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
    this.updateFocus();
  }

  private get closeButton(): HTMLElement {
    return this.element.querySelector('.coveo-small-close');
  }

  private makeCloseButtonAccessible() {
    const closeButton = this.closeButton;
    closeButton.setAttribute('aria-label', l('Close'));
    closeButton.setAttribute('role', 'button');
    closeButton.tabIndex = 0;
    $$(closeButton).on(
      'keyup',
      KeyboardUtils.keypressAction(KEYBOARD.ENTER, () => closeButton.click())
    );
  }

  private updateFocus() {
    const focusOnElement: HTMLElement = (this.options.focusOnOpen && this.options.focusOnOpen()) || this.closeButton;
    focusOnElement.focus();
  }

  private onModalClose() {
    this.focusTrap.disable();
    this.focusTrap = null;
    if (this.initiallyFocusedElement && document.body.contains(this.initiallyFocusedElement)) {
      this.initiallyFocusedElement.focus();
    }
  }
}
