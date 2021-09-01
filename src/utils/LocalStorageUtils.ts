var localStorage: Storage;

// This check must be made in a try/catch. If cookies are disabled for a
// browser then window.localStorage will throw an undefined exception.
try {
  localStorage = window.localStorage;
} catch (error) {
  localStorage = null;
}

export const localStorageExists = !!localStorage;

export class LocalStorageUtils<T> {
  constructor(public id: string) {}

  public save(data: T) {
    try {
      if (localStorage != null) {
        localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(data));
      }
    } catch (error) {}
  }

  public load(): T {
    try {
      if (localStorage == null) {
        return null;
      }
      var value = localStorage.getItem(this.getLocalStorageKey());
      return value && JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  public remove(key?: string) {
    try {
      if (localStorage != null) {
        if (key == undefined) {
          localStorage.removeItem(this.getLocalStorageKey());
        } else {
          var oldObj = this.load();
          delete oldObj[key];
          this.save(oldObj);
        }
      }
    } catch (error) {}
  }

  private getLocalStorageKey() {
    return 'coveo-' + this.id;
  }
}

export class SafeLocalStorage implements Storage {
  public getItem(key: string) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  public removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  public setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  public clear() {
    try {
      localStorage.clear();
    } catch (e) {}
  }

  public key(index: number) {
    try {
      return localStorage.key(index);
    } catch (e) {
      return null;
    }
  }

  get length() {
    try {
      return localStorage.length;
    } catch (e) {
      return 0;
    }
  }
}
