module Coveo.PopupUtils {

  export interface Position {
    vertical: VerticalAlignment;
    horizontal: HorizontalAlignment;
    verticalOffset?: number;
    horizontalOffset?: number;
    horizontalClip?:boolean;
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

  interface Offset {
    left: number;
    top: number;
  }

  interface ElementBoundary {
    top: number;
    left: number;
    right: number;
    bottom: number;
  }

  export function positionPopup(popUp: HTMLElement, nextTo: HTMLElement, appendTo: HTMLElement, boundary: HTMLElement, desiredPosition: Position, checkForBoundary = 0) {
    appendTo.appendChild(popUp);
    desiredPosition.verticalOffset = desiredPosition.verticalOffset ? desiredPosition.verticalOffset : 0;
    desiredPosition.horizontalOffset = desiredPosition.horizontalOffset ? desiredPosition.horizontalOffset : 0;

    var popUpPosition = _.clone(nextTo.getBoundingClientRect());
    basicVerticalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
    basicHorizontalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
    finalAdjustement(popUp.getBoundingClientRect(), popUpPosition, popUp, desiredPosition);

    var popUpBoundary = getBoundary(popUp);
    var boundaryPosition = getBoundary(boundary);
    if (checkForBoundary < 2) {
      var checkBoundary = checkForOutOfBoundary(popUpBoundary, boundaryPosition);
      if (checkBoundary.horizontal != 'ok' && desiredPosition.horizontalClip === true) {
        var width = popUp.offsetWidth;
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
        var newDesiredPosition = alignInsideBoundary(desiredPosition, checkBoundary);
        positionPopup(popUp, nextTo, appendTo, boundary, newDesiredPosition, checkForBoundary + 1);
      }
    }
  }

  function finalAdjustement(popUpOffSet: Offset, popUpPosition: Offset, popUp: HTMLElement, desiredPosition: Position) {
    var position = popUp.getBoundingClientRect();
    popUp.style.position = 'absolute';
    popUp.style.top = (position.top + desiredPosition.verticalOffset) - (popUpOffSet.top - popUpPosition.top) + "px";
    popUp.style.left = (position.left + desiredPosition.horizontalOffset) - (popUpOffSet.left - popUpPosition.left) + "px";
  }

  function basicVerticalAlignment(popUpPosition: Offset, popUp: HTMLElement, nextTo: HTMLElement, desiredPosition: Position) {
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
        break; //Nothing to do, it's the default alignment normally
      case VerticalAlignment.INNERBOTTOM:
        popUpPosition.top -= popUp.offsetHeight - nextTo.offsetHeight;
        break;
      default:
        break;
    }
  }

  function basicHorizontalAlignment(popUpPosition: Offset, popUp: HTMLElement, nextTo: HTMLElement, desiredPosition: Position) {
    switch (desiredPosition.horizontal) {
      case HorizontalAlignment.LEFT:
        popUpPosition.left -= popUp.offsetWidth;
        break;
      case HorizontalAlignment.RIGHT:
        popUpPosition.left += nextTo.offsetWidth;
        break;
      case HorizontalAlignment.CENTER:
        popUpPosition.left += offSetToAlignCenter(popUp, nextTo);
        break;
      case HorizontalAlignment.INNERLEFT:
        break; //Nothing to do, it's the default alignment normally
      case HorizontalAlignment.INNERRIGHT:
        popUpPosition.left -= popUp.offsetWidth - nextTo.offsetWidth;
        break;
      default:
        break;
    }
  }

  function alignInsideBoundary(oldPosition: Position, checkBoundary) {
    var newDesiredPosition = oldPosition;
    if (checkBoundary.horizontal == "left") {
      newDesiredPosition.horizontal = HorizontalAlignment.RIGHT;
    }
    if (checkBoundary.horizontal == "right") {
      newDesiredPosition.horizontal = HorizontalAlignment.LEFT;
    }
    if (checkBoundary.vertical == "top") {
      newDesiredPosition.vertical = VerticalAlignment.BOTTOM;
    }
    if (checkBoundary.vertical == "bottom") {
      newDesiredPosition.vertical = VerticalAlignment.TOP;
    }
    return newDesiredPosition;
  }

  function offSetToAlignCenter(popUp: HTMLElement, nextTo: HTMLElement) {
    return (nextTo.offsetWidth - popUp.offsetWidth) / 2;
  }

  function getBoundary(element: HTMLElement) {
    var boundaryOffset = element.getBoundingClientRect();
    var toAddVertically;
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

  function checkForOutOfBoundary(popUpBoundary: ElementBoundary, boundary: ElementBoundary) {
    var ret = {
      vertical: "ok",
      horizontal: "ok"
    }
    if (popUpBoundary.top < boundary.top) {
      ret.vertical = "top";
    }
    if (popUpBoundary.bottom > boundary.bottom) {
      ret.vertical = "bottom";
    }
    if (popUpBoundary.left < boundary.left) {
      ret.horizontal = "left";
    }
    if (popUpBoundary.right > boundary.right) {
      ret.horizontal = "right";
    }
    return ret;
  }
}