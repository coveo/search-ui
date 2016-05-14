import {escapeRegexCharacter} from './Utils';
import {IQueryResult} from '../rest/QueryResult';
import {IResultsComponentBindings} from '../ui/Base/ResultsComponentBindings';
import {StringUtils} from '../utils/StringUtils';

declare var Coveo;

export interface PopUpPosition {
  vertical: VerticalAlignment;
  horizontal: HorizontalAlignment;
  verticalOffset?: number;
  horizontalOffset?: number;
  horizontalClip?:boolean;
}

export enum VerticalAlignment {
  top,
  middle,
  bottom,
  innerTop,
  innerBottom
}

export enum HorizontalAlignment {
  left,
  center,
  right,
  innerLeft,
  innerRight
}

interface JQueryOffset {
  left: number;
  top: number;
}

interface ElementBoundary {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function positionPopup(popUp: JQuery, nextTo: JQuery, appendTo: JQuery, boundary: JQuery, desiredPosition: PopUpPosition, checkForBoundary = 0) {
  popUp.appendTo(appendTo);
  desiredPosition.verticalOffset = desiredPosition.verticalOffset ? desiredPosition.verticalOffset : 0;
  desiredPosition.horizontalOffset = desiredPosition.horizontalOffset ? desiredPosition.horizontalOffset : 0;

  var popUpPosition = nextTo.offset();
  basicVerticalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
  basicHorizontalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
  finalAdjustement(popUp.offset(), popUpPosition, popUp, desiredPosition);

  var popUpBoundary = getBoundary(popUp)
  var boundaryPosition = getBoundary(boundary);
  if (checkForBoundary < 2) {
    var checkBoundary = checkForOutOfBoundary(popUpBoundary, boundaryPosition);
    if (checkBoundary.horizontal != "ok" && desiredPosition.horizontalClip === true) {
      var width = popUp.width();
      if (popUpBoundary.left < boundaryPosition.left) {
        width -= boundaryPosition.left - popUpBoundary.left;
      }
      if (popUpBoundary.right > boundaryPosition.right) {
        width -= popUpBoundary.right - boundaryPosition.right;
      }
      popUp.width(width);
      checkBoundary.horizontal = "ok";
    }
    if (checkBoundary.vertical != "ok" || checkBoundary.horizontal != "ok") {
      var newDesiredPosition = alignInsideBoundary(desiredPosition, checkBoundary);
      positionPopup(popUp, nextTo, appendTo, boundary, newDesiredPosition, checkForBoundary + 1);
    }
  }
}

function finalAdjustement(popUpOffSet: JQueryOffset, popUpPosition: JQueryOffset, popUp: JQuery, desiredPosition: PopUpPosition) {
  var position = popUp.position();
  popUp.css({
    "position": "absolute",
    "top": (position.top + desiredPosition.verticalOffset) - (popUpOffSet.top - popUpPosition.top) + "px",
    "left": (position.left + desiredPosition.horizontalOffset) - (popUpOffSet.left - popUpPosition.left) + "px"
  })
}

function basicVerticalAlignment(popUpPosition: JQueryOffset, popUp: JQuery, nextTo: JQuery, desiredPosition: PopUpPosition) {
  switch (desiredPosition.vertical) {
    case VerticalAlignment.top:
      popUpPosition.top -= popUp.outerHeight();
      break;
    case VerticalAlignment.bottom:
      popUpPosition.top += nextTo.outerHeight();
      break;
    case VerticalAlignment.middle:
      popUpPosition.top -= popUp.outerHeight() / 3;
    case VerticalAlignment.innerTop:
      break; //Nothing to do, it's the default alignment normally
    case VerticalAlignment.innerBottom:
      popUpPosition.top -= popUp.outerHeight() - nextTo.outerHeight();
      break;
    default:
      break;
  }
}

function basicHorizontalAlignment(popUpPosition: JQueryOffset, popUp: JQuery, nextTo: JQuery, desiredPosition: PopUpPosition) {
  switch (desiredPosition.horizontal) {
    case HorizontalAlignment.left:
      popUpPosition.left -= popUp.outerWidth();
      break;
    case HorizontalAlignment.right:
      popUpPosition.left += nextTo.outerWidth();
      break;
    case HorizontalAlignment.center:
      popUpPosition.left += offSetToAlignCenter(popUp, nextTo);
      break;
    case HorizontalAlignment.innerLeft:
      break; //Nothing to do, it's the default alignment normally
    case HorizontalAlignment.innerRight:
      popUpPosition.left -= popUp.outerWidth() - nextTo.outerWidth();
      break;
    default:
      break;
  }
}

function alignInsideBoundary(oldPosition: PopUpPosition, checkBoundary) {
  var newDesiredPosition = oldPosition;
  if (checkBoundary.horizontal == "left") {
    newDesiredPosition.horizontal = HorizontalAlignment.right;
  }
  if (checkBoundary.horizontal == "right") {
    newDesiredPosition.horizontal = HorizontalAlignment.left;
  }
  if (checkBoundary.vertical == "top") {
    newDesiredPosition.vertical = VerticalAlignment.bottom;
  }
  if (checkBoundary.vertical == "bottom") {
    newDesiredPosition.vertical = VerticalAlignment.top;
  }
  return newDesiredPosition;
}

function offSetToAlignCenter(popUp: JQuery, nextTo: JQuery) {
  return (nextTo.outerWidth() - popUp.outerWidth()) / 2;
}

function getBoundary(element: JQuery) {
  var boundaryOffset = element.offset();
  var toAddVertically;
  if (element.is('body')) {
    toAddVertically = Math.max($(element).get(0).scrollHeight, $(element).get(0).offsetHeight);
  } else if (element.is('html')) {
    toAddVertically = Math.max($(element).get(0).clientHeight, $(element).get(0).scrollHeight, $(element).get(0).offsetHeight);
  } else {
    toAddVertically = element.outerHeight();
  }
  return {
    top: boundaryOffset.top,
    left: boundaryOffset.left,
    right: boundaryOffset.left + element.outerWidth(),
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

export function getQuickviewHeader(result: IQueryResult, options: { showDate: boolean; title: string }, bindings: IResultsComponentBindings) {
  var date = "";
  if (options.showDate) {
    date = Coveo['DateUtils'].dateTimeToString(new Date(result.raw.date));
  }
  var fileType = Coveo['FileTypes'].get(result);
  var header = $(`<div class='coveo-quickview-right-header'>
        <span class='coveo-quickview-time'>${date}</span>
        <span class='coveo-quickview-close-button'>
          <span class='coveo-icon coveo-sprites-common-clear'></span>
        </span>
      </div>
      <div class='coveo-quickview-left-header'>
        <span class='coveo-quickview-icon coveo-small ${fileType.icon}'></span>
        <span class='coveo-quickview-pop-up-reminder'> ${options.title || ''}</span>
      </div>`);
  new Coveo[Coveo['Salesforce'] ? 'SalesforceResultLink' : 'ResultLink'](header.find('.coveo-quickview-pop-up-reminder').get(0), undefined, bindings, result);
  return header;
}

export function getPopUpCloseButton(captionForClose: string, captionForReminder: string) {
  return "<span class='coveo-close-button'>" +
      "<span class='coveo-icon coveo-sprites-quickview-close'></span>" +
      captionForClose +
      "</span>" +
      "<span class='coveo-pop-up-reminder' >" + captionForReminder + "</span>"
}

export function getBasicLoadingAnimation() {
  var loadDotClass = 'coveo-loading-dot';
  var dom = document.createElement('div');
  dom.className = 'coveo-first-loading-animation';
  dom.innerHTML = `<div class='coveo-logo' ></div>
    <div class='coveo-loading-container'>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
    </div>`;
  return dom;
}

export function getBasicLoadingDots() {
  var dom = getBasicLoadingAnimation();
  dom.className = 'coveo-generic-loading-animation coveo-loading-animation';
  return dom;
}

export function getLoadingSpinner() {
  return $('<div class="coveo-loading-spinner"/>');
}

export function highlightElement(initialString: string, valueToSearch: string): string {
  var regex = new RegExp(escapeRegexCharacter(valueToSearch), "i");
  var firstChar = initialString.search(regex);
  var lastChar = firstChar + valueToSearch.length;
  return StringUtils.htmlEncode(initialString.slice(0, firstChar)) +
      "<span class='coveo-highlight'>" + StringUtils.htmlEncode(initialString.slice(firstChar, lastChar)) + "</span>" +
      StringUtils.htmlEncode(initialString.slice(lastChar));
}

export function findScrollingParent(element: HTMLElement): HTMLElement {
  var currentElement = $(element);
  while (!(currentElement.is(document)) && (currentElement.length != 0)) {
    if (isElementScrollable(currentElement)) {
      if (!currentElement.is("body")) {
        return currentElement.get(0);
      }
      return $(window).get(0);
    }
    currentElement = currentElement.parent();
  }
  return $(window).get(0);
}

function isElementScrollable(element: JQuery) {
  return (element.css("overflow-y") == "scroll");
}
/*
$.fn.fastToggle = function (visible: boolean): JQuery {
  return this.css('display', visible ? '' : 'none');
}*/
