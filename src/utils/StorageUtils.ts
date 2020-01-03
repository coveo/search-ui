export type ValidStorageProvider = 'local' | 'session';

export class StorageUtils<T> {
  private storage: Storage;

  constructor(private id: string, storageProvider: ValidStorageProvider = 'local') {
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
    if (!this.storage) {
      return;
    }
    try {
      this.storage.setItem(this.getStorageKey(), JSON.stringify(data));
    } catch (error) {}
  }

  public load(): T {
    if (!this.storage) {
      return null;
    }

    try {
      const value = this.storage.getItem(this.getStorageKey());
      return value && JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  public remove(key?: string) {
    if (!this.storage) {
      return;
    }

    try {
      if (key == undefined) {
        this.storage.removeItem(this.getStorageKey());
      } else {
        const oldObj = this.load();
        delete oldObj[key];
        this.save(oldObj);
      }
    } catch (error) {}
  }

  private getStorageKey() {
    return 'coveo-' + this.id;
  }
}
