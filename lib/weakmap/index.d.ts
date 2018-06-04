interface WeakMap<K extends object, V> {
  delete(key: K): boolean;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): void; //match the behaviour of IE11
}

interface WeakMapConstructor {
  new (): WeakMap<object, any>;
  readonly prototype: WeakMap<object, any>;
}
declare var WeakMap: WeakMapConstructor;
