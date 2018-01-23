// CustomEvent polyfill from MDN
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
/* istanbul ignore next */
export function customEventPolyfill() {
  // window.CustomEvent is missing from the definitions
  if (typeof (<any>window).CustomEvent === 'function') {
    return;
  }

  let CustomEvent = (event, params) => {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    let customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return customEvent;
  };

  // window.Event is specific to IE
  CustomEvent.prototype = (<any>window).Event.prototype;

  (<any>window).CustomEvent = CustomEvent;
}
