import { EMPTY_STRING, NEWLINE } from "./RBConstants";

/**
 * Tests for Class RBEnum to handle various enum-like functions.
 *
 * 2024-09-18:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Class RBEnum to handle various enum-like functions.
 */
export class RBEnum {

  /**
   * Returns a string with the complete definition of the enum.
   * If enumName is empty-string, the name "-Definition-" will be used.
   */
  public static getEnumDefinition<T extends Record<string, string | number>>(
    enumObject: T, enumName: string = EMPTY_STRING): string {
    if (!enumObject) {
      return EMPTY_STRING;
    }
    const title = `export enum ${enumName !== EMPTY_STRING ? enumName : "-Definition-"} {`;
    const enumResult: string = RBEnum.getEnum(enumObject).join(`${NEWLINE}   `).toString();
    return `${title}${NEWLINE}   ${enumResult}${NEWLINE}}`;
  }

  /**
   * Returns a string[] containing the contents (key-value-pairs) of the enum.
   * If the enumObject is null or empty, an empty string[] will be returned.
   * If the enumObject contains only numbers, an empty string[] will be returned.
   * If the enumObject contains only keys, an empty string[] will be returned.
   */
  public static getEnum<T extends Record<string, string | number>>(enumObject: T): string[] {
    if (!enumObject) {
      return [];
    }
    return Object.entries(enumObject).
      filter(([key]) => isNaN(Number(key))).
      map(([key, value]): string => `"${key}" = "${value}",`);

  }

  /**
   * Returns a string[] containing the keys of the enum.
   * If the enumObject is null or empty, an empty string[] will be returned.
   * If the enumObject contains only numbers, an empty string[] will be returned.
   * If the enumObject contains only keys, an empty string[] will be returned.
   */
  public static getEnumKeys<T extends Record<string, string | number>>(enumObject: T): string[] {
    if (!enumObject) {
      return [];
    }
    return Object.keys(enumObject).filter((key) => isNaN(Number(key)));

  }

  /**
   * Returns a string[] containing the values of the enum.
   * If the enumObject is null or empty, an empty string[] will be returned.
   * If the enumObject contains only numbers, an empty string[] will be returned.
   * If the enumObject contains only keys, an empty string[] will be returned.
   */
  public static getEnumValues<T extends Record<string, string | number>>(
    enumObject: T): string[] {
    return RBEnum.getEnumKeys(enumObject).map((key) => enumObject[key] as string);
  }

  /**
   * Returns True if the key is present in the enum.
   * If the enumObject is null or empty, False will be returned.
   * If the enumObject contains only numbers, False will be returned.
   * If the enumObject contains only keys, False will be returned.
   */
  public static isInEnum<T extends Record<string, string | number>>(
    key: string, enumObject: T): boolean {
    return RBEnum.getEnumKeys(enumObject).includes(key);
  }

}
