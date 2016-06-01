export class Cache<Type> {
  constructor(public onEmpty?: () => Type) {
  }

  private cache: Type[] = [];

  public get(): Type {
    if (this.cache.length == 0) {
      return this.onEmpty();
    } else {
      return this.cache.pop();
    }
  }

  public push(value: Type) {
    this.cache.push(value);
  }
}
