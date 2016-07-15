import {$$} from './Dom'

export interface IPosition {
  vertical: VerticalAlignment;
  horizontal: HorizontalAlignment;
  verticalOffset?: number;
  horizontalOffset?: number;
  horizontalClip?: boolean;
}

export enum VerticalAlignment {
  TOP,
  MIDDLE,
  BOTTOM,
  INNERTOP,
  INNERBOTTOM
}

export enum HorizontalAlignment {
  LEFT,
  CENTER,
  RIGHT,
  INNERLEFT,
  INNERRIGHT
}

interface IOffset {
  left: number;
  top: number;
}

interface IElementBoundary {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export class PopupUtils {
  static positionPopup(popUp: HTMLElement, nextTo: HTMLElement, appendTo: HTMLElement, boundary: HTMLElement, desiredPosition: IPosition, checkForBoundary = 0) {
    /*if (nextTo.parentElement) {
      nextTo.parentElement.appendChild(popUp);
    } else {
      document.body.appendChild(popUp);
    }*/
    appendTo.appendChild(popUp);
    desiredPosition.verticalOffset = desiredPosition.verticalOffset ? desiredPosition.verticalOffset : 0;
    desiredPosition.horizontalOffset = desiredPosition.horizontalOffset ? desiredPosition.horizontalOffset : 0;

    let popUpOriginalPosition = this.getOffset(popUp);
    let finalPopUpPosition = this.getOffset(nextTo);
    PopupUtils.basicVerticalAlignment(finalPopUpPosition, popUp, nextTo, desiredPosition);
    PopupUtils.basicHorizontalAlignment(finalPopUpPosition, popUp, nextTo, desiredPosition);
    PopupUtils.finalAdjustement(popUpOriginalPosition, finalPopUpPosition, popUp, desiredPosition);

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
        PopupUtils.positionPopup(popUp, nextTo, boundary, appendTo, newDesiredPosition, checkForBoundary + 1);
      }
    }
  }

  private static finalAdjustement(popUpOffSet: IOffset, popUpPosition: IOffset, popUp: HTMLElement, desiredPosition: IPosition) {
    popUp.style.position = 'absolute';
    popUp.style.top = (desiredPosition.verticalOffset + popUpPosition.top) + 'px';
    popUp.style.left = (desiredPosition.horizontalOffset + popUpPosition.left) + 'px';
  }

  private static basicVerticalAlignment(popUpPosition: IOffset, popUp: HTMLElement, nextTo: HTMLElement, desiredPosition: IPosition) {
    switch (desiredPosition.vertical) {
      case VerticalAlignment.TOP:
        popUpPosition.top -= popUp.offsetHeight;
        break;
      case VerticalAlignment.BOTTOM:
        popUpPosition.top += nextTo.offsetHeight;
        break;
      case VerticalAlignment.MIDDLE:
        popUpPosition.top -= popUp.offsetHeight / 3;
      case VerticalAlignment.INNERTOP:
        break; // Nothing to do, it's the default alignment normally
      case VerticalAlignment.INNERBOTTOM:
        popUpPosition.top -= popUp.offsetHeight - nextTo.offsetHeight;
        break;
      default:
        break;
    }
  }

  private static basicHorizontalAlignment(popUpPosition: IOffset, popUp: HTMLElement, nextTo: HTMLElement, desiredPosition: IPosition) {
    switch (desiredPosition.horizontal) {
      case HorizontalAlignment.LEFT:
        popUpPosition.left -= popUp.offsetWidth;
        break;
      case HorizontalAlignment.RIGHT:
        popUpPosition.left += nextTo.offsetWidth;
        break;
      case HorizontalAlignment.CENTER:
        popUpPosition.left += PopupUtils.offSetToAlignCenter(popUp, nextTo);
        break;
      case HorizontalAlignment.INNERLEFT:
        break; // Nothing to do, it's the default alignment normally
      case HorizontalAlignment.INNERRIGHT:
        popUpPosition.left -= popUp.offsetWidth - nextTo.offsetWidth;
        break;
      default:
        break;
    }
  }

  private static alignInsideBoundary(oldPosition: IPosition, checkBoundary) {
    let newDesiredPosition = oldPosition;
    if (checkBoundary.horizontal == 'left') {
      newDesiredPosition.horizontal = HorizontalAlignment.RIGHT;
    }
    if (checkBoundary.horizontal == 'right') {
      newDesiredPosition.horizontal = HorizontalAlignment.LEFT;
    }
    if (checkBoundary.vertical == 'top') {
      newDesiredPosition.vertical = VerticalAlignment.BOTTOM;
    }
    if (checkBoundary.vertical == 'bottom') {
      newDesiredPosition.vertical = VerticalAlignment.TOP;
    }
    return newDesiredPosition;
  }

  private static offSetToAlignCenter(popUp: HTMLElement, nextTo: HTMLElement) {
    return (nextTo.offsetWidth - popUp.offsetWidth) / 2;
  }

  private static getBoundary(element: HTMLElement) {
    let boundaryOffset = element.getBoundingClientRect();
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
    }
  }

  private static checkForOutOfBoundary(popUpBoundary: IElementBoundary, boundary: IElementBoundary) {
    let ret = {
      vertical: 'ok',
      horizontal: 'ok'
    }
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

  private static getOffset(el: HTMLElement) {
    let rect = el.getBoundingClientRect();
    let doc = el.ownerDocument;
    let docElem = doc.documentElement;

    return {
      top: rect.top + window.pageYOffset - docElem.clientTop,
      left: rect.left + window.pageXOffset - docElem.clientLeft
    };
    //let rect: IOffset = { left: el.offsetLeft, top: el.offsetTop };
    //return rect;
  }
  private static getPosition(el: HTMLElement) {
    // Get *real* offsetParent
    let wrappedElement = $$(el);
    let offsetParent = this.getOffsetParent(el);

    // Get correct offsets
    let offset = this.getOffset(el);
    let parentOffset = {top: 0, left: 0};
			// Add offsetParent borders
    parentOffset = {
      top: parentOffset.top + parseInt(wrappedElement.css('borderTopWidth')),
      left: parentOffset.left + parseInt(wrappedElement.css('borderLeftWidth'))
    };

		// Subtract parent offsets and element margins
    return {
      top: offset.top - parentOffset.top - wrappedElement.css( elem, "marginTop", true ),
      left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
    };
  }

  private static parseCssNumberValue(value): number {
    
  }
  private static getOffsetParent(el: HTMLElement) {
  let offsetParent = el.offsetParent;

  while ( offsetParent && $$(el).css('position') === "static" ) {
    offsetParent = offsetParent.offsetParent;
  }

  return offsetParent || documentElement;

  }
}
