

// In this file we put the *generic* additions we make to the JQuery interface.
// Those should be candidates to be merged in the .d.ts we download from GitHub.

interface JQueryStatic {
  proxy<T1, R>(func: (arg1: T1) => R, context: any): (arg1: T1) => R;
  proxy<T1, T2, R>(func: (arg1: T1, arg2: T2) => R, context: any): (arg1: T1, arg2: T2) => R;
  proxy<T1, T2, T3, R>(func: (arg1: T1, arg2: T2, arg3: T3) => R, context: any): (arg1: T1, arg2: T2, arg3: T3) => R;
  proxy<T1, T2, T3, T4, R>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R, context: any): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R;
  proxy<T1, T2, T3, T4, T5, R>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => R, context: any): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => R;
}

interface JQuery {
  on<T1>(events: string, handler: (JQueryEventObject, arg1: T1) => any);
  on<T1, T2>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2) => any);
  on<T1, T2, T3>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2, arg3: T2) => any);
  on<T1, T2, T3, T4>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2, arg3: T2, arg4: T4) => any);
  on<T1, T2, T3, T4, T5>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2, arg3: T2, arg4: T4, arg5: T5) => any);

  one<T1>(events: string, handler: (JQueryEventObject, arg1: T1) => any);
  one<T1, T2>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2) => any);
  one<T1, T2, T3>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2, arg3: T2) => any);
  one<T1, T2, T3, T4>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2, arg3: T2, arg4: T4) => any);
  one<T1, T2, T3, T4, T5>(events: string, handler: (JQueryEventObject, arg1: T1, arg2: T2, arg3: T2, arg4: T4, arg5: T5) => any);

  focusin();
  focusout();
  off<T1>(events: string, selector: string, handler: (e: JQueryEventObject, arg1: T1) => any);
}