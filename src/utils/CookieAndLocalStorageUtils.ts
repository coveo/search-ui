import { Cookie } from './CookieUtils';
import { SafeLocalStorage } from './LocalStorageUtils';

// Copied from https://github.com/coveo/coveo.analytics.js/blob/master/src/storage.ts
export class CookieAndLocalStorage implements Partial<Storage> {
  private safeLocalStorage = new SafeLocalStorage();

  getItem(key: string): string | null {
    return this.safeLocalStorage.getItem(key) || Cookie.get(key);
  }

  removeItem(key: string): void {
    this.safeLocalStorage.removeItem(key);
    Cookie.erase(key);
  }

  setItem(key: string, data: string): void {
    this.safeLocalStorage.setItem(key, data);
    Cookie.set(key, data, 31556926000); // 1 year first party cookie
  }
}
