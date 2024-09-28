import { EMPTY_STRING, NEWLINE, SPACE, TAB } from "./RBConstants";
import { RBDate as RBDate } from "./RBDate";
import { CURRENT_LANGUAGE } from "./RBLocale";

type AllowedPaddingTypes = string | number | bigint | boolean | Date | null | undefined;

/**
 * Class RBFunc to handle various generic functions.
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Class RBFunc to handle various generic functions.
 */
export class RBFunc {

  /**
   * STRING functions
   */

  /**
   * Returns the string with the first character in Uppercase.
   * If the string is empty, it returns an empty string.
   */
  public static stringUpFirst(value: string = EMPTY_STRING): string {
    if (!value) {
      return EMPTY_STRING;
    }
    return value.trimStart().replace((/./), (char) => char.toUpperCase());
  }

  /**
   * Find the position of 'search' within 'value' and return the string before it.
   * If 'search' is not found, return the original value.
   */
  public static stringBefore(
    value: string = EMPTY_STRING, search: string = EMPTY_STRING): string {
    if (!value) {
      return EMPTY_STRING;
    }
    const index: number = value.indexOf(search);
    return index !== -1 ? value.substring(0, index) : value;
  }

  /**
   * Find the position of 'search' within 'value' and return the string after it.
   * If 'search' is not found, return the original value.
   * If 'search' is an empty string, return the original value.
   */
  public static stringAfter(
    value: string = EMPTY_STRING, search: string = EMPTY_STRING): string {
    if (!value) {
      return EMPTY_STRING;
    }
    const index: number = value.indexOf(search);
    return index !== -1 ? value.substring(index + search.length) : value;
  }

  /**
   * Returns the string between 'after' and 'before' strings.
   * If 'after' or 'before' are not found, return the original value.
   * If 'inclusive' is true, include the 'after' and 'before' strings in the result.
   * If 'value' is empty, return an empty string.
   */
  public static stringBetween(
    value: string, after: string, before: string, inclusive = false): string {
    // Ensure that the value is not null or undefined
    if (!value) {
      return EMPTY_STRING;
    }
    if (!value.includes(after) || !value.includes(before)) {
      return value;
    }
    const prefix: string = inclusive ? after : EMPTY_STRING;
    const suffix: string = inclusive ? before : EMPTY_STRING;
    const afterValue: string = this.stringAfter(value, after);
    const betweenValue: string = this.stringBefore(afterValue, before);
    return this.trimAll(`${prefix}${betweenValue}${suffix}`);
  }

  /**
   * Returns the string with all characters in reverse order.
   */
  public static stringReverse(value: string = EMPTY_STRING): string {
    if (!value) {
      return EMPTY_STRING;
    }
    return value.split(EMPTY_STRING).reverse().join(EMPTY_STRING);
  }

  /**
   * Returns the string with Tabs and Multiple spaces replaced by one space
   * and all leading and trailing spaces removed.
   */
  public static trimAll(value: string = EMPTY_STRING): string {
    if (!value) {
      return EMPTY_STRING;
    }
    return value.replace(TAB, SPACE).replace(/\s+/g, SPACE).trim();
  }

  /**
   * Returns a string containing 'count' spaces.
   * If 'count' is less than 1, it returns a single space.
   */
  public static spaces(count = 1): string {
    return SPACE.repeat(Math.max(1, count));
  }

  /**
   * Returns a string containing 'count' newlines.
   * If 'count' is less than 1, it returns a single newline.
   */
  public static newlines(count = 1): string {
    return NEWLINE.repeat(Math.max(1, count));
  }

  /**
   * Returns a string[] of lines where all comment lines are removed.
   * Comment lines are those that start with "//"
   * or start with "/x" and end with "x/" (where 'x' = '*').
   */
  public static removeCommentLines(lines: string[]): string[] {
    return lines.filter((line) => {
      const trimmedLine = line.trim();
      // Remove lines that start with "//" or start with "/*" and end with "*/"
      return !(trimmedLine.startsWith("//")
        || (trimmedLine.startsWith("/*") && trimmedLine.endsWith("*/")));
    });
  }

  /**
   * Returns a string[] of lines where all comment 'known imports' are removed.
   * Known imports are those that are not part of the project source code.
   * This function is used to remove known imports from library-files (*.ts).
   */
  public static removeKnownImports(lines: string[]): string[] {
    return lines.filter((line) =>
      !line.includes("@angular\\") &&
      !line.includes("@syncfusion\\") &&
      !line.includes("@fortawesome\\") &&
      !line.includes("@ngneat\\") &&
      !line.includes("node:") &&
      !line.includes("typescript\\lib\\typescript"));
  }

  /**
   * NUMBER functions
   */

  /**
   * Returns the percentage of total of value,
   * with the specified number of decimal places.
   * If value is null or undefined, or total is 0, it returns null.
   * If decimalPlaces is not provided, it defaults to 2.
   */
  public static percent(value: number, total: number, decimalPlaces = 2): number | null {
    // eslint-disable-next-line no-undefined
    if (value === null || value === undefined || !total) {
      return null;
    }
    return Number.parseFloat((value * 100 / total).toFixed(decimalPlaces));
  }

  /**
   * Returns a string with the percentage of total of value,
   * with the specified number of decimal places.
   * If value is null or undefined, or total is 0, it returns null.
   * If decimalPlaces is not provided, it defaults to 2.
   */
  public static percentString(value: number, total: number, decimalPlaces = 2): string {
    const percentValue: number | null = this.percent(value, total, decimalPlaces);
    if (!percentValue && percentValue !== 0) {
      return EMPTY_STRING;
    }
    const intl = { maximumFractionDigits: decimalPlaces, minimumFractionDigits: decimalPlaces };
    return percentValue.toLocaleString(CURRENT_LANGUAGE, intl).padStart(decimalPlaces + 4, SPACE);
  }

  public static isInRange(
    value: number, min: number, max: number, excluding?: boolean): boolean {
    // eslint-disable-next-line no-undefined
    if (value === null || value === undefined
      // eslint-disable-next-line no-undefined
      || min === null || min === undefined || max === null || max === undefined) {
      throw new Error("The parameters can't be 'null' or 'undefined'.");
    }
    // Stryker disable next-line all
    if (min > max) {
      throw new Error("The parameter 'min' can't be greater than 'max'.");
    }
    return !excluding ? value >= min && value <= max : value > min && value < max;
  }

  public static ifInRangeElse(
    value: number, min: number, max: number, valueIfNot: number, excluding?: boolean): number {
    // eslint-disable-next-line no-undefined
    if (valueIfNot === null || valueIfNot === undefined) {
      throw new Error("The parameters can't be 'null' or 'undefined'.");
    }
    return this.isInRange(value, min, max, excluding) ? value : valueIfNot;
  }

  /**
   * GENERIC <T> functions
   */

  /**
   * Returns any array sorted, and with unique values
   * For strings, you can leave the comparison-function 'compFn' empty
   * For numbers provide a comparison-function like in:
   *   ... sortUniqueArray(myNumArray, (a, b) => a - b);
   */
  public static sortUniqueArray<T>(source: T[], compFn?: (a: T, b: T) => number): T[] {
    // Use a Set to remove duplicate values and convert back to an array
    // Sort the resulting array using the comparator if provided, otherwise use default sort
    return Array.from(new Set(source)).sort(compFn);
  }

  /**
   * Returns a string with the value padded
   * to the right (string, boolean, date) or left (numbers).
   */
  public static pad<T extends AllowedPaddingTypes>(value: T, count = 0): string {
    // Ensure that the value is not null or undefined
    // eslint-disable-next-line no-undefined
    if (value === null || value === undefined) {
      throw new Error("Function can't be used for type 'null' or 'undefined'.");
    }
    const language: string = CURRENT_LANGUAGE;
    switch (typeof value) {
      case "string":
      case "boolean":
        return value.toLocaleString().padEnd(count);
      case "number":
      case "bigint":
        return value.toLocaleString(language).padStart(count);
      case "object":
        // eslint-disable-next-line no-case-declarations
        const dateString: string = RBDate.toStringDMY(value, language);
        // eslint-disable-next-line no-case-declarations
        const dateTime: string = RBDate.toStringDMYTime(value, language);
        return (dateString + " 00:00:00" === dateTime)
          ? dateString.padEnd(count)
          : dateTime.padEnd(count);
      // Stryker disable next-line all
      default:
        // This should be unreachable due to TypeScript's type checking
        // Stryker disable next-line all
        throw new Error("Function pad() should not ever reach here...");
    }
  }
  // Stryker restore all

  /**
   * Specific functions
   */

  /**
   * Returns a string with all file paths colored in cyan
   * using ANSI escape codes for the console/terminal.
   */
  public static colorizeFilePaths(text: string): string {
    // This regexp matches common file path patterns
    const filePathRegExp = (/(?:\/[\w.-]+)+\.\w+|\w:(?:\\[\w.-]+)+\.\w+/g);
    // ANSI escape codes for colors
    const colorStart = "\x1b[36m"; // Cyan color
    const colorEnd = "\x1b[0m"; // Reset color
    // Replace all file paths with colored versions
    return text.replace(filePathRegExp, (match) => `${colorStart}${match}${colorEnd}`);
  }

}
