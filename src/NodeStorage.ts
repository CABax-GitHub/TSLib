import { EMPTY_STRING, NEWLINE } from "../RBConstants";

/**
 * Class NodeStorage to enhance localStorage (fallback if running outside browser)
 * Class NodeTempStorage to enhance sessionStorage (fallback if running outside browser)
 *
 * 2024-08-26:  eslint + ng test completed
 */

export class NodeStorage {
  private static storage: Record<string, string> = {};

  public static getAllKeysAndValues(): string[] {
    return Object.entries(this.storage).map(([key, value]) => `${key}=${value}`);
  }

  public static getAllKeysAndValuesAsString(): string {
    return this.getAllKeysAndValues().join(NEWLINE);
  }

  public static existsKey(key: string): boolean {
    return key in this.storage;
  }

  public static getValue(key: string, valueDefault: string = EMPTY_STRING): string {
    this.setValue(key, valueDefault);
    return this.storage[key] || EMPTY_STRING;
  }

  public static setValue(key: string, value: string): boolean {
    if (value) {
      this.storage[key] = value;
    }
    return true;
  }

  public static deleteKey(key: string): boolean {
    delete this.storage[key];
    return true;
  }

  public static clear(): void {
    this.storage = {};
  }

  public static length(): number {
    return Object.keys(this.storage).length;
  }
}

export class NodeTempStorage {
  private static storage: Record<string, string> = {};

  public static getAllKeysAndValues(): string[] {
    return Object.entries(this.storage).map(([key, value]) => `${key}=${value}`);
  }

  public static getAllKeysAndValuesAsString(): string {
    return this.getAllKeysAndValues().join(NEWLINE);
  }

  public static existsKey(key: string): boolean {
    return key in this.storage;
  }

  public static getValue(key: string, valueDefault: string = EMPTY_STRING): string {
    this.setValue(key, valueDefault);
    return this.storage[key] || EMPTY_STRING;
  }

  public static setValue(key: string, value: string): boolean {
    if (value) {
      this.storage[key] = value;
    }
    return true;
  }

  public static deleteKey(key: string): boolean {
    delete this.storage[key];
    return true;
  }

  public static clear(): void {
    this.storage = {};
  }

  public static length(): number {
    return Object.keys(this.storage).length;
  }
}
