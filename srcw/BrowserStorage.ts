import { EMPTY_STRING, NEWLINE } from "../src/RBConstants";

/**
 * Class BrowserStorage to enhance localStorage
 * Class BrowserTempStorage to enhance sessionStorage
 *
 * 2024-08-26:  eslint + ng test completed
 */

// Same as localStorage, but with a few extra features
export class BrowserStorage {

  // Extra feature to get all values as array
  public static getAllKeysAndValues(): string[] {
    const archive: string[] = [];
    for (const key of Object.keys(localStorage)) {
      archive.push(`${key}=${localStorage.getItem(key)}`);
    }
    return archive;
  }

  // Extra feature to get all values as string
  public static getAllKeysAndValuesAsString(): string {
    return this.getAllKeysAndValues().join(NEWLINE);
  }

  // Extra feature to know if a key exists
  public static existsKey(key: string): boolean {
    return this.getValue(key, EMPTY_STRING) !== EMPTY_STRING;
  }

  // Extra feature to get a value, and if not present set and return valueDefault
  public static getValue(key: string, valueDefault: string = EMPTY_STRING): string {
    this.setValue(key, valueDefault);
    return localStorage[key] || EMPTY_STRING;
  }

  // Extra feature to set a value, and return true if it succeeded
  public static setValue(key: string, value: string): boolean {
    if (value) {
      localStorage.setItem(key, value);
    }
    return localStorage.getItem(key) === value;
  }

  // Extra feature to delete an item, and return true if it is deleted
  public static deleteKey(key: string): boolean {
    localStorage.removeItem(key);
    return !this.existsKey(key);
  }

  // Extra feature to clear all items, and return true if storage is empty now
  public static clear(): void {
    localStorage.clear();
  }

  // Just for compatibility
  public static length(): number {
    return localStorage.length;
  }
}

// Same as sessionStorage, but with a few extra features
export class BrowserTempStorage {

  // Extra feature to get all values as array
  public static getAllKeysAndValues(): string[] {
    const archive: string[] = [];
    for (const key of Object.keys(sessionStorage)) {
      archive.push(`${key}=${sessionStorage.getItem(key)}`);
    }
    return archive;
  }

  // Extra feature to get all values as string
  public static getAllKeysAndValuesAsString(): string {
    return this.getAllKeysAndValues().join(NEWLINE);
  }

  // Extra feature to know if a key exists
  public static existsKey(key: string): boolean {
    return this.getValue(key, EMPTY_STRING) !== EMPTY_STRING;
  }

  // Extra feature to get a value, and if not present set and return valueDefault
  public static getValue(key: string, valueDefault: string = EMPTY_STRING): string {
    this.setValue(key, valueDefault);
    return sessionStorage[key] || EMPTY_STRING;
  }

  // Extra feature to set a value, and return true if it succeeded
  public static setValue(key: string, value: string): boolean {
    if (value) {
      sessionStorage.setItem(key, value);
    }
    return localStorage.getItem(key) === value;
  }

  // Extra feature to delete an item, and return true if it is deleted
  public static deleteKey(key: string): boolean {
    sessionStorage.removeItem(key);
    return !this.existsKey(key);
  }

  // Extra feature to clear all items, and return true if storage is empty now
  public static clear(): void {
    sessionStorage.clear();
  }

  // Just for compatibility
  public static length(): number {
    return sessionStorage.length;
  }

}
