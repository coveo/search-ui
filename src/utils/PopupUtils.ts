import { $$, IOffset } from './Dom';

export interface IPopupPosition {
  vertical: PopupVerticalAlignment;
  horizontal: PopupHorizontalAlignment;
  verticalOffset?: number;
  horizontalOffset?: number;
  horizontalClip?: boolean;
}

export enum PopupVerticalAlignment {
  TOP,
  MIDDLE,
  BOTTOM,
  INNERTOP,
  INNERBOTTOM
}

export enum PopupHorizontalAlignment {
  LEFT,
  CENTER,
  RIGHT,
  INNERLEFT,
  INNERRIGHT
}

interface IPopupElementBoundary {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export class PopupUtils {
  static positionPopup(
    popUp: HTMLElement,
    nextTo: HTMLElement,
    boundary: HTMLElement,
    desiredPosition: IPopupPosition,
    appendTo?: HTMLElement,
    checkForBoundary = 0
  ) {
    popUp.style.position = 'absolute';
    if (appendTo) {
      $$(appendTo).append(popUp);
    }
    desiredPosition.verticalOffset = desiredPosition.verticalOffset ? desiredPosition.verticalOffset : 0;
    desiredPosition.horizontalOffset = desiredPosition.horizontalOffset ? desiredPosition.horizontalOffset : 0;

    let popUpPosition = $$(nextTo).offset();
    PopupUtils.basicVerticalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
    PopupUtils.basicHorizontalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
    PopupUtils.finalAdjustement($$(popUp).offset(), popUpPosition, popUp, desiredPosition);

    let popUpBoundary = PopupUtils.getBoundary(popUp);
    let boundaryPosition = PopupUtils.getBoundary(boundary);
    if (checkForBoundary < 2) {
      let checkBoundary = PopupUtils.checkForOutOfBoundary(popUpBoundary, boundaryPosition);
      if (checkBoundary.horizontal != 'ok' && desiredPosition.horizontalClip === true) {
        let width = popUp.offsetWidth;
        if (popUpBoundary.left < boundaryPosition.left) {
          width -= boundaryPosition.left - popUpBoundary.left;
        }
        if (popUpBoundary.right > boundaryPosition.right) {
          width -= popUpBoundary.right - boundaryPosition.right;
        }
        popUp.style.width = width + 'px';
        checkBoundary.horizontal = 'ok';
      }
      if (checkBoundary.vertical != 'ok' || checkBoundary.horizontal != 'ok') {
        let newDesiredPosition = PopupUtils.alignInsideBoundary(desiredPosition, checkBoundary);
        PopupUtils.positionPopup(popUp, nextTo, boundary, newDesiredPosition, appendTo, checkForBoundary + 1);
      }
    }
  }

  private static finalAdjustement(popUpOffSet: IOffset, popUpPosition: IOffset, popUp: HTMLElement, desiredPosition: IPopupPosition) {
    let position = $$(popUp).position();
    popUp.style.top = position.top + desiredPosition.verticalOffset - (popUpOffSet.top - popUpPosition.top) + 'px';
    popUp.style.left = position.left + desiredPosition.horizontalOffset - (popUpOffSet.left - popUpPosition.left) + 'px';
  }

  private static basicVerticalAlignment(popUpPosition: IOffset, popUp: HTMLElement, nextTo: HTMLElement, desiredPosition: IPopupPosition) {
    switch (desiredPosition.vertical) {
      case PopupVerticalAlignment.TOP:
        popUpPosition.top -= popUp.offsetHeight;
        break;
      case PopupVerticalAlignment.BOTTOM:
        popUpPosition.top += nextTo.offsetHeight;
        break;
      case PopupVerticalAlignment.MIDDLE:
        popUpPosition.top -= popUp.offsetHeight / 3;
      case PopupVerticalAlignment.INNERTOP:
        break; // Nothing to do, it's the default alignment normally
      case PopupVerticalAlignment.INNERBOTTOM:
        popUpPosition.top -= popUp.offsetHeight - nextTo.offsetHeight;
        break;
      default:
        break;
    }
  }

  private static basicHorizontalAlignment(
    popUpPosition: IOffset,
    popUp: HTMLElement,
    nextTo: HTMLElement,
    desiredPosition: IPopupPosition
  ) {
    switch (desiredPosition.horizontal) {
      case PopupHorizontalAlignment.LEFT:
        popUpPosition.left -= popUp.offsetWidth;
        break;
      case PopupHorizontalAlignment.RIGHT:
        popUpPosition.left += nextTo.offsetWidth;
        break;
      case PopupHorizontalAlignment.CENTER:
        popUpPosition.left += PopupUtils.offSetToAlignCenter(popUp, nextTo);
        break;
      case PopupHorizontalAlignment.INNERLEFT:
        break; // Nothing to do, it's the default alignment normally
      case PopupHorizontalAlignment.INNERRIGHT:
        popUpPosition.left -= popUp.offsetWidth - nextTo.offsetWidth;
        break;
      default:
        break;
    }
  }

  private static alignInsideBoundary(oldPosition: IPopupPosition, checkBoundary) {
    let newDesiredPosition = oldPosition;
    if (checkBoundary.horizontal == 'left') {
      newDesiredPosition.horizontal = PopupHorizontalAlignment.RIGHT;
    }
    if (checkBoundary.horizontal == 'right') {
      newDesiredPosition.horizontal = PopupHorizontalAlignment.LEFT;
    }
    if (checkBoundary.vertical == 'top') {
      newDesiredPosition.vertical = PopupVerticalAlignment.BOTTOM;
    }
    if (checkBoundary.vertical == 'bottom') {
      newDesiredPosition.vertical = PopupVerticalAlignment.TOP;
    }
    return newDesiredPosition;
  }

  private static offSetToAlignCenter(popUp: HTMLElement, nextTo: HTMLElement) {
    return (nextTo.offsetWidth - popUp.offsetWidth) / 2;
  }

  private static getBoundary(element: HTMLElement) {
    let boundaryOffset = $$(element).offset();
    let toAddVertically;
    if (element.tagName.toLowerCase() == 'body') {
      toAddVertically = Math.max(element.scrollHeight, element.offsetHeight);
    } else if (element.tagName.toLowerCase() == 'html') {
      toAddVertically = Math.max(element.clientHeight, element.scrollHeight, element.offsetHeight);
    } else {
      toAddVertically = element.offsetHeight;
    }
    return {
      top: boundaryOffset.top,
      left: boundaryOffset.left,
      right: boundaryOffset.left + element.offsetWidth,
      bottom: boundaryOffset.top + toAddVertically
    };
  }

  private static checkForOutOfBoundary(popUpBoundary: IPopupElementBoundary, boundary: IPopupElementBoundary) {
    let ret = {
      vertical: 'ok',
      horizontal: 'ok'
    };
    if (popUpBoundary.top < boundary.top) {
      ret.vertical = 'top';
    }
    if (popUpBoundary.bottom > boundary.bottom) {
      ret.vertical = 'bottom';
    }
    if (popUpBoundary.left < boundary.left) {
      ret.horizontal = 'left';
    }
    if (popUpBoundary.right > boundary.right) {
      ret.horizontal = 'right';
    }
    return ret;
  }
}
