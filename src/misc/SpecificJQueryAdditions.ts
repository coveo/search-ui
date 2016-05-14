interface JQuery {
  getCursorPosition(): number;
  fastToggle(visible: boolean): JQuery;


  coveo(): Coveo.Component;
  coveo(method:string): any;
  coveo(method:string, arg1:any): any;
  coveo(method:string, arg1:any, arg2:any): any;
  coveo(method:string, arg1:any, arg2:any, arg3:any): any;
  coveo(method:string, arg1:any, arg2:any, arg3:any, arg4:any): any;
  coveo(method:string, arg1:any, arg2:any, arg3:any, arg4:any, arg5:any): any;

  coveo(componentClass?:any): Coveo.Component;
  coveo(method:'init');
  coveo(method:'patch', methodName?, handler?:(...args:any[]) => any);
}

//http://stackoverflow.com/a/2897510
Coveo.$.fn.getCursorPosition = function () {
  var input = this.get(0);
  if (!input) return; // No (input) element found
  if ('selectionStart' in input) {
    // Standard-compliant browsers
    return input.selectionStart;
  } else if ('selection' in document) {
    // IE
    input.focus();
    var sel = document['selection'].createRange();
    var selLen = document['selection'].createRange().text.length;
    sel.moveStart('character', -input.value.length);
    return sel.text.length - selLen;
  }
};
