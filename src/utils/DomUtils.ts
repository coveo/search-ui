/// <reference path="../Base.ts" />

/**
 * @nodoc
 */
module Coveo.DomUtils {
  // http://jsperf.com/nodelist-to-array/72
  export function nodeListToArray(nodeList: NodeList): HTMLElement[] {
    var i = nodeList.length;
    var arr:HTMLElement[] = new Array(i);
    while (i--) {
      arr[i] = <HTMLElement>nodeList.item(i);
    }
    return arr;
  }

  export function find(element: NodeSelector, selector: string) {
    return element.querySelector(selector);
  }

  export function findAll(element: NodeSelector, selector: string) {
    return nodeListToArray(element.querySelectorAll(selector));
  }

  export function findClass(element: HTMLElement, className: string) {
    if('getElementsByClassName' in element){
      return nodeListToArray(element.getElementsByClassName(className))
    }
    // For ie 8
    return nodeListToArray(element.querySelectorAll('.'+className));
  }

  export function findId(id: string) {
    return document.getElementById(id);
  }

  export function addClass(element: HTMLElement, className: string) {
    if (!hasClass(element, className)) {
      element.className += ' ' + className;
    }
  }

  export function removeClass(element: HTMLElement, className: string) {
    element.className = element.className.replace(new RegExp(`\\b${className}\\b`, 'g'), '');
  }

  var classNameRegex = /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;

  export function getClass(element: HTMLElement): string[] {
    return element.className.match(classNameRegex) || []
  }

  export function hasClass(element: HTMLElement, className: string) {
    return _.contains(getClass(element), className);
  }

  export function detach(element: HTMLElement) {
    element.parentElement && element.parentElement.removeChild(element);
  }



  export function attachEvent(element: HTMLElement, type: string, eventHandle: (evt: Event) => void) {
    if (element.addEventListener) {
      element.addEventListener(type, eventHandle, false);

    } else if (element['on']) {
      element['on']("on" + type, eventHandle);
    }
  }

  export function detachEvent(element: HTMLElement, type: string, eventHandle: (evt: Event) => void) {
    if (element.removeEventListener) {
      element.removeEventListener(type, eventHandle, false);

    } else if (element['off']) {
      element['off']("on" + type, eventHandle);
    }
  }

  export function attachEvents(element: HTMLElement, types: string[], eventHandle: (evt: Event) => void) {
    for (var i = 0; i < types.length; i++) {
      attachEvent(element, types[i], eventHandle);
    }
  }

  export function detachEvents(element: HTMLElement, types: string[], eventHandle: (evt: Event) => void) {
    for (var i = 0; i < types.length; i++) {
      detachEvent(element, types[i], eventHandle);
    }
  }

  var onlyWhiteSpace = /\s*/;

  export function isEmpty(element: HTMLElement) {
    return onlyWhiteSpace.test(element.innerHTML);
  }

  export function getPopUpCloseButton(captionForClose: string, captionForReminder: string): string {
    var container = document.createElement('span');

    var closeButton = document.createElement('span');
    $$(closeButton).addClass('coveo-close-button');
    container.appendChild(closeButton);

    var iconClose = document.createElement('span');
    $$(iconClose).addClass('coveo-icon');
    $$(iconClose).addClass('coveo-sprites-quickview-close');
    closeButton.appendChild(iconClose);

    $$(closeButton).text(captionForClose);

    var closeReminder = document.createElement('span');
    $$(closeReminder).addClass('coveo-pop-up-reminder');
    $$(closeReminder).text(captionForReminder);
    container.appendChild(closeReminder);

    return container.outerHTML;
  }
}