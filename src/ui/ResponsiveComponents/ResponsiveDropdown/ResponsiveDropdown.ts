import { ResponsiveDropdownHeader } from './ResponsiveDropdownHeader';
import { IResponsiveDropdownContent, ResponsiveDropdownContent } from './ResponsiveDropdownContent';
import { $$, Dom } from '../../../utils/Dom';
import * as _ from 'underscore';
import { AccessibleButton } from '../../../utils/AccessibleButton';
import { Assert } from '../../../misc/Assert';
import { l } from '../../../strings/Strings';
import { AccessibleModal } from '../../../utils/AccessibleModal';

export enum ResponsiveDropdownEvent {
  OPEN = 'responsiveDropdownOpen',
  CLOSE = 'responsiveDropdownClose'
}

type HandlerCall = { handler: Function; context: any };

export class ResponsiveDropdown {
  public isOpened: boolean = false;
  private onOpenHandlers: HandlerCall[] = [];
  private onCloseHandlers: HandlerCall[] = [];
  private scrollableContainerToLock: HTMLElement = null;
  private previousSibling: Dom;
  private parent: Dom;
  private modal: AccessibleModal;

  constructor(public dropdownContent: IResponsiveDropdownContent, public dropdownHeader: ResponsiveDropdownHeader, public coveoRoot: Dom) {
    Assert.exists(dropdownContent);
    Assert.exists(dropdownHeader);
    Assert.exists(coveoRoot);

    this.modal = new AccessibleModal(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME, this.coveoRoot.el);
    this.saveContentPosition();
    this.enableScrollLocking(this.coveoRoot.el);
    this.bindOnClickDropdownHeaderEvent();
  }

  private set scrollLocked(lock: boolean) {
    if (!this.scrollableContainerToLock) {
      return;
    }
    this.scrollableContainerToLock.style.overflow = lock ? 'hidden' : '';
  }

  public registerOnOpenHandler(handler: Function, context) {
    Assert.exists(handler);
    this.onOpenHandlers.push({ handler: handler, context: context });
  }

  public registerOnCloseHandler(handler: Function, context) {
    Assert.exists(handler);
    this.onCloseHandlers.push({ handler: handler, context: context });
  }

  public cleanUp() {
    this.close();
    this.dropdownHeader.cleanUp();
    this.dropdownContent.cleanUp();
    this.restoreContentPosition();
  }

  public open() {
    this.isOpened = true;
    this.dropdownHeader.open();
    this.dropdownContent.positionDropdown();
    _.each(this.onOpenHandlers, handlerCall => {
      handlerCall.handler.apply(handlerCall.context);
    });
    this.lockScroll();

    const title = $$('p');
    title.text(this.dropdownHeader.element.text());
    this.modal.open({
      content: this.dropdownContent.element.el,
      origin: this.dropdownHeader.element.el,
      title: title.el,
      validation: () => {
        this.close();
        return true;
      }
    });

    $$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.OPEN);
  }

  public close() {
    this.isOpened = false;
    _.each(this.onCloseHandlers, handlerCall => {
      handlerCall.handler.apply(handlerCall.context);
    });

    this.dropdownHeader.close();
    this.dropdownContent.hideDropdown();
    this.unlockScroll();
    this.modal.close();
    $$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.CLOSE);
  }

  public enableScrollLocking(scrollableContainer: HTMLElement) {
    this.scrollableContainerToLock = scrollableContainer;
  }

  private bindOnClickDropdownHeaderEvent() {
    new AccessibleButton()
      .withElement(this.dropdownHeader.element)
      .withSelectAction(() => (this.isOpened ? this.close() : this.open()))
      .withLabel(l(this.isOpened ? 'CloseFiltersDropdown' : 'OpenFiltersDropdown'))
      .build();
  }

  private lockScroll() {
    this.scrollLocked = true;
  }

  private unlockScroll() {
    this.scrollLocked = false;
  }

  private saveContentPosition() {
    let dropdownContentPreviousSibling = this.dropdownContent.element.el.previousSibling;
    let dropdownContentParent = this.dropdownContent.element.el.parentElement;
    this.previousSibling = dropdownContentPreviousSibling ? $$(<HTMLElement>dropdownContentPreviousSibling) : null;
    this.parent = $$(dropdownContentParent);
  }

  private restoreContentPosition() {
    if (this.previousSibling) {
      this.dropdownContent.element.insertAfter(this.previousSibling.el);
    } else {
      this.parent.prepend(this.dropdownContent.element.el);
    }
  }
}
