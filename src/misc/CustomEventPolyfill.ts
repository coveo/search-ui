interface Window {
  Event: any;
  CustomEvent: any; 
}

export function customEventPolyfill() {
  if (typeof window.CustomEvent === 'function') {
    return;
  }

  let CustomEvent = (event, params) => {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    let customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return customEvent;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}