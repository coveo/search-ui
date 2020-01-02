export type ValidStorageProviders = 'local' | 'session';

export class StorageUtils<T> {
  private storage: Storage;

  constructor(public id: string, public storageProvider: ValidStorageProviders = 'local') {
    // This check must be made in a try/catch. If cookies are disabled for a
    // browser then window.localStorage will throw an undefined exception.
    try {
      switch (storageProvider) {
        case 'local':
          this.storage = window.localStorage;
          break;
        case 'session':
          this.storage = window.sessionStorage;
          break;
        default:
          this.storage = null;
      }
    } catch (error) {
      this.storage = null;
    }
  }

  public save(data: T) {
    try {
      if (this.storage != null) {
        this.storage.setItem(this.getStorageKey(), JSON.stringify(data));
      }
    } catch (error) {}
  }

  public load(): T {
    try {
      if (this.storage == null) {
        return null;
      }
      var value = this.storage.getItem(this.getStorageKey());
      return value && JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  public remove(key?: string) {
    try {
      if (this.storage != null) {
        if (key == undefined) {
          this.storage.removeItem(this.getStorageKey());
        } else {
          var oldObj = this.load();
          delete oldObj[key];
          this.save(oldObj);
        }
      }
    } catch (error) {}
  }

  private getStorageKey() {
    return 'coveo-' + this.id;
  }
}
