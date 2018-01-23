/**
 * A JSON which contains type T.
 *
 * eg :
 * ```
 * IStringMap<boolean> -> {'foo' : true, 'bar' : false};
 * IStringMap<number> -> {'foo' : 1 , 'bar' : 123}
 * ```
 *
 */
export interface IStringMap<T> {
  [paramName: string]: T;
}
