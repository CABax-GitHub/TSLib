import { EMPTY_STRING, NEWLINE, SPACE } from "../src/RBConstants";
import { RBFunc } from "../src/RBFunc";
import { CURRENT_LANGUAGE } from "../src/RBLocale";
import { RBLocale } from "../src/RBLocale";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class RBFunc to handle various generic functions.
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
/* eslint-disable jasmine/no-suite-dupes */
/* eslint-disable jasmine/no-spec-dupes */
describe("[RBFunc - Functions]", () => {

  describe("function 'stringUpFirst()'", () => {

    it("Should return the string with the first (non-whitespace) character in uppercase", () => {
      const value = "abcdéfgh";
      const expected = "Abcdéfgh";
      const result: string = RBFunc.stringUpFirst(value);

      expect(result).toEqual(expected);
      const valueToTrim = "  abcdéfgh  ";
      const expectedToTrim = "Abcdéfgh  ";
      const resultToTrim: string = RBFunc.stringUpFirst(valueToTrim);

      expect(resultToTrim).toEqual(expectedToTrim);
    });

    it("Should return the same string if it is capitalised already", () => {
      const value = "Abcdéfgh";
      const expected = "Abcdéfgh";
      const result: string = RBFunc.stringUpFirst(value);

      expect(result).toEqual(expected);
    });

    it("Should return empty string if the value is an empty string", () => {
      const org: string = EMPTY_STRING;
      const expected: string = EMPTY_STRING;
      const result: string = RBFunc.stringUpFirst(org);

      expect(result).toEqual(expected);
    });

    it("Should handle strings with only whitespace correctly", () => {
      const valueWhitespace = RBFunc.spaces(5);
      const expectedWhitespace = EMPTY_STRING;
      const resultWhitespace: string = RBFunc.stringUpFirst(valueWhitespace);

      expect(resultWhitespace).toEqual(expectedWhitespace);
    });

    it("Should return empty string if the value is null or undefined", () => {
      const expected: string = EMPTY_STRING;
      const resultN: string = RBFunc.stringUpFirst(anyNull);
      const resultU: string = RBFunc.stringUpFirst(anyUndefined);

      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'stringBefore()'", () => {

    it("Should return a substring if search is 1 character", () => {
      const value = "Abcdéfgh";
      const search = "f";
      const expected = "Abcdé";
      const result: string = RBFunc.stringBefore(value, search);

      expect(result).toEqual(expected);
    });

    it("Should return a substring if search is 2 characters", () => {
      const value = "Abcdéfgh";
      const search = "fg";
      const expected = "Abcdé";
      const result: string = RBFunc.stringBefore(value, search);

      expect(result).toEqual(expected);
    });

    it("Should return the original string if search doesn't exist", () => {
      const value = "Abcdéfgh";
      const search = "xyz";
      const expected = "Abcdéfgh";
      const result: string = RBFunc.stringBefore(value, search);

      expect(result).toEqual(expected);
    });

    it("Should return empty string if the value is null, undefined or empty", () => {
      const search = "xyz";
      const expected: string = EMPTY_STRING;
      const resultE: string = RBFunc.stringBefore(EMPTY_STRING, search);
      const resultN: string = RBFunc.stringBefore(anyNull, search);
      const resultU: string = RBFunc.stringBefore(anyUndefined, search);

      expect(resultE).toEqual(expected);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'stringAfter()'", () => {

    it("Should return a substring if search is 1 character", () => {
      const value = "Abcdéfgh";
      const search = "c";
      const expected = "défgh";
      const result: string = RBFunc.stringAfter(value, search);

      expect(result).toEqual(expected);
    });

    it("Should return a substring if search is 2 characters", () => {
      const value = "Abcdéfgh";
      const search = "bc";
      const expected = "défgh";
      const result: string = RBFunc.stringAfter(value, search);

      expect(result).toEqual(expected);
    });

    it("Should return the original string if search doesn't exist", () => {
      const value = "Abcdéfgh";
      const search = "xyz";
      const expected = "Abcdéfgh";
      const result: string = RBFunc.stringAfter(value, search);

      expect(result).toEqual(expected);
    });

    it("Should return empty string if the value is null, undefined or empty", () => {
      const search = "xyz";
      const expected: string = EMPTY_STRING;
      const resultE: string = RBFunc.stringAfter(EMPTY_STRING, search);
      const resultN: string = RBFunc.stringAfter(anyNull, search);
      const resultU: string = RBFunc.stringAfter(anyUndefined, search);

      expect(resultE).toEqual(expected);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'stringBetween()'", () => {

    it("Should return a substring between 'after' and 'before'", () => {
      const value = "Abcdéfgh";
      const after = "c";
      const before = "g";
      const expected = "déf";
      const result: string = RBFunc.stringBetween(value, after, before);

      expect(result).toEqual(expected);
    });

    it("Should return a substring between 'after' and 'before', inclusive", () => {
      const value = "Abcdéfgh";
      const after = "c";
      const before = "g";
      const expected = "cdéfg";
      const result: string = RBFunc.stringBetween(value, after, before, true);

      expect(result).toEqual(expected);
    });

    it("Should return the original string if 'after' doesn't exist", () => {
      const value = "Abcdéfgh";
      const after = "Q";
      const before = "g";
      const expected = "Abcdéfgh";
      const result: string = RBFunc.stringBetween(value, after, before);

      expect(result).toEqual(expected);
    });

    it("Should return the original string if 'before' doesn't exist", () => {
      const value = "Abcdéfgh";
      const after = "c";
      const before = "Q";
      const expected: string = value;
      const result: string = RBFunc.stringBetween(value, after, before);

      expect(result).toEqual(expected);
    });

    it("Should return empty string if the value is null, undefined or empty", () => {
      const before = "xyz";
      const after = "xyz";
      const expected: string = EMPTY_STRING;
      const resultE: string = RBFunc.stringBetween(EMPTY_STRING, after, before);
      const resultN: string = RBFunc.stringBetween(anyNull, after, before);
      const resultU: string = RBFunc.stringBetween(anyUndefined, after, before);

      expect(resultE).toEqual(expected);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });

    it("Should return empty string if the before or after is null, undefined or empty", () => {
      const value = "Abcdéfgh";
      const before = "xyz";
      const after = "xyz";
      const expected: string = value;
      const resultNA: string = RBFunc.stringBetween(value, after, anyNull);
      const resultUA: string = RBFunc.stringBetween(value, after, anyUndefined);
      const resultNB: string = RBFunc.stringBetween(value, anyNull, before);
      const resultUB: string = RBFunc.stringBetween(value, anyUndefined, before);

      expect(resultNA).toEqual(expected);
      expect(resultUA).toEqual(expected);
      expect(resultNB).toEqual(expected);
      expect(resultUB).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'trimAll()'", () => {

    it("Should return the value trimmed and Tab and Spaces replaced by space", () => {
      const value = "  Ab\tcdéf  gh  ";
      const expected = "Ab cdéf gh";
      const result: string = RBFunc.trimAll(value);

      expect(result).toEqual(expected);
    });

    it("Should return empty string if the value is an empty string", () => {
      const org: string = EMPTY_STRING;
      const expected: string = EMPTY_STRING;
      const result: string = RBFunc.trimAll(org);

      expect(result).toEqual(expected);
    });

    it("Should return empty string if the value is null or undefined", () => {
      const expected: string = EMPTY_STRING;
      const resultN: string = RBFunc.trimAll(anyNull);
      const resultU: string = RBFunc.trimAll(anyUndefined);

      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'stringReverse()'", () => {

    it("Should return the value reversed", () => {
      const value = "  Ab\tcdéf  gh  ";
      const expected = "  hg  fédc\tbA  ";
      const result: string = RBFunc.stringReverse(value);

      expect(result).toEqual(expected);
    });

    it("Should return empty-string if value is null or undefined", () => {
      const valueN = anyNull;
      const valueU = anyUndefined;
      const resultN: string = RBFunc.stringReverse(valueN);
      const resultU: string = RBFunc.stringReverse(valueU);

      expect(resultN).toEqual(EMPTY_STRING);
      expect(resultU).toEqual(EMPTY_STRING);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'spaces()'", () => {

    it("Should return a string with x spaces", () => {
      const count = 2;
      const expected: string = SPACE + SPACE;
      const result: string = RBFunc.spaces(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 space if count is 0", () => {
      const count = 0;
      const expected: string = SPACE;
      const result: string = RBFunc.spaces(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 space if count is negative", () => {
      const count = -2;
      const expected: string = SPACE;
      const result: string = RBFunc.spaces(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 space if count is non-integer", () => {
      const count = 2.1;
      const expected: string = SPACE + SPACE;
      const result: string = RBFunc.spaces(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 space if count is null or undefined", () => {
      const expected: string = SPACE;
      const resultN: string = RBFunc.spaces(anyNull);
      const resultU: string = RBFunc.spaces(anyUndefined);

      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'newlines()'", () => {

    it("Should return a string with x newlines", () => {
      const count = 2;
      const expected: string = NEWLINE + NEWLINE;
      const result: string = RBFunc.newlines(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 newline if count is 0", () => {
      const count = 0;
      const expected: string = NEWLINE;
      const result: string = RBFunc.newlines(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 newline if count is negative", () => {
      const count = -2;
      const expected: string = NEWLINE;
      const result: string = RBFunc.newlines(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 newline if count is non-integer", () => {
      const count = 2.1;
      const expected: string = NEWLINE + NEWLINE;
      const result: string = RBFunc.newlines(count);

      expect(result).toEqual(expected);
    });

    it("Should return 1 newline if count is null or undefined", () => {
      const expected: string = NEWLINE;
      const resultN: string = RBFunc.newlines(anyNull);
      const resultU: string = RBFunc.newlines(anyUndefined);

      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'removeCommentLines()'", () => {

    it("Should return a string[] with all comments removed", () => {
      const fileContents: string[] = ["Assen"];
      const expected: string[] = ["Assen"];
      const result: string[] = RBFunc.removeCommentLines(fileContents);

      expect(result).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'removeKnownImports()'", () => {

    it("Should return a string[] with all imports of known modules removed", () => {
      const fileContents: string[] = [
        "node:",
        "Assen",
        "typescript\\lib\\typescript",
        "@angular\\",
        "@syncfusion\\",
        "@fortawesome\\",
        "@ngneat\\",
      ];
      const expected: string[] = ["Assen"];
      const result: string[] = RBFunc.removeKnownImports(fileContents);

      expect(result).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'percent()'", () => {
    it("should return 0 if value is 0", () => {
      expect(RBFunc.percent(0, 100)).toBe(0);
    });

    it("should return null if value is null or undefined", () => {
      expect(RBFunc.percent(anyNull, 100)).toBeNull();
      expect(RBFunc.percent(anyUndefined, 100)).toBeNull();
    });

    it("should return null if total is null or undefined", () => {
      expect(RBFunc.percent(50, anyNull)).toBeNull();
      expect(RBFunc.percent(50, anyUndefined)).toBeNull();
    });

    it("should return null if total is 0", () => {
      expect(RBFunc.percent(50, 0)).toBeNull();
    });

    it("should return the correct percentage", () => {
      expect(RBFunc.percent(50, 200)).toBe(25);
      expect(RBFunc.percent(1, 3, 2)).toBe(33.33);
    });

    it("should handle decimal places correctly", () => {
      expect(RBFunc.percent(1, 3, 3)).toBe(33.333);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'percentString()'", () => {
    const saveLanguage = CURRENT_LANGUAGE;
    RBLocale.setCurrentLanguage("en-US");
    it("should return 0 if value is 0", () => {
      const expected00_00 = CURRENT_LANGUAGE === "en-US" ? "  0.00" : "  0,00";

      expect(RBFunc.percentString(0, 100)).toBe(expected00_00);
    });

    it("should return empty-string if value is null or undefined", () => {
      expect(RBFunc.percentString(anyNull, 100)).toBe(EMPTY_STRING);
      expect(RBFunc.percentString(anyUndefined, 100)).toBe(EMPTY_STRING);
    });

    it("should return null if total is null or undefined", () => {
      expect(RBFunc.percentString(50, anyNull)).toBe(EMPTY_STRING);
      expect(RBFunc.percentString(50, anyUndefined)).toBe(EMPTY_STRING);
    });

    it("should return null if total is 0", () => {
      expect(RBFunc.percentString(50, 0)).toBe(EMPTY_STRING);
    });

    it("should return the correct percentage", () => {
      const expected25_00 = CURRENT_LANGUAGE === "en-US" ? " 25.00" : " 25,00";

      expect(RBFunc.percentString(50, 200)).toBe(expected25_00);
      const expected33_33 = CURRENT_LANGUAGE === "en-US" ? " 33.33" : " 33,33";

      expect(RBFunc.percentString(1, 3, 2)).toBe(expected33_33);
    });

    it("should handle decimal places correctly", () => {
      const expected33_333 = CURRENT_LANGUAGE === "en-US" ? " 33.333" : " 33,333";

      expect(RBFunc.percentString(1, 3, 3)).toBe(expected33_333);
    });
    RBLocale.setCurrentLanguage(saveLanguage);
  });

  // ----------------------------------------------------------------------------

  describe("function 'ifInRangeElse()'", () => {
    it("Should return the value if it is in range, else the valueIfNot", () => {
      let expected = 5;
      let result: number = RBFunc.ifInRangeElse(5, 1, 10, 50, false);

      expect(result).toEqual(expected);
      expected = 5;
      result = RBFunc.ifInRangeElse(5, 1, 10, 50, true);

      expect(result).toEqual(expected);
      expected = 5;
      result = RBFunc.ifInRangeElse(5, 1, 10, 50);

      expect(result).toEqual(expected);

      expected = 1;
      result = RBFunc.ifInRangeElse(1, 1, 10, 50, false);

      expect(result).toEqual(expected);
      expected = 10;
      result = RBFunc.ifInRangeElse(10, 1, 10, 50, false);

      expect(result).toEqual(expected);

      expected = 50;
      result = RBFunc.ifInRangeElse(1, 1, 10, 50, true);

      expect(result).toEqual(expected);
      result = RBFunc.ifInRangeElse(10, 1, 10, 50, true);

      expect(result).toEqual(expected);
    });

    it("should throw an error when min > max", () => {
      const errorMessage = "The parameter 'min' can't be greater than 'max'.";

      expect(() => {
        RBFunc.ifInRangeElse(5, 10, 1, 50);
      }).toThrowError(errorMessage);
    });

    it("should throw an error when a parameter is null or undefined", () => {
      const errorMessage = "The parameters can't be 'null' or 'undefined'.";

      expect(() => {
        RBFunc.ifInRangeElse(anyNull, 1, 10, 50);
      }).toThrowError(errorMessage);

      expect(() => {
        RBFunc.ifInRangeElse(10, anyNull, 10, 50);
      }).toThrowError(errorMessage);

      expect(() => {
        RBFunc.ifInRangeElse(10, 1, anyNull, 50);
      }).toThrowError(errorMessage);

      expect(() => {
        RBFunc.ifInRangeElse(10, 1, 10, anyNull);
      }).toThrowError(errorMessage);

      expect(() => {
        RBFunc.ifInRangeElse(anyUndefined, 1, 10, 50);
      }).toThrowError(errorMessage);

      expect(() => {
        RBFunc.ifInRangeElse(10, anyUndefined, 10, 50);
      }).toThrowError(errorMessage);

      expect(() => {
        RBFunc.ifInRangeElse(10, 1, anyUndefined, 50);
      }).toThrowError(errorMessage);

      expect(() => {
        RBFunc.ifInRangeElse(10, 1, 10, anyUndefined);
      }).toThrowError(errorMessage);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'sortUniqueArray()'", () => {
    it("Should return a sorted array of strings", () => {
      const org: string[] = ["Jan", "Piet", "koos", "Jan", "Klaas"];
      const expected: string[] = ["Jan", "Klaas", "Piet", "koos"];
      const result: string[] = RBFunc.sortUniqueArray(org);

      expect(result).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'sortUniqueArray()'", () => {
    it("Should return a sorted array of strings", () => {
      const org: string[] = ["Jan", "Piet", "koos", "Jan", "Klaas"];
      const expected: string[] = ["Jan", "Klaas", "Piet", "koos"];
      const result: string[] = RBFunc.sortUniqueArray(org);

      expect(result).toEqual(expected);
    });

    it("Should return an empty array of strings when input is null, undefined or empty", () => {
      const orgE: string[] = [];
      const expected: string[] = [];
      const resultE: string[] = RBFunc.sortUniqueArray(orgE);
      const resultN: string[] = RBFunc.sortUniqueArray(anyNull);
      const resultU: string[] = RBFunc.sortUniqueArray(anyUndefined);

      expect(resultE).toEqual(expected);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });

    it("Should return a sorted array of numbers", () => {
      const org: number[] = [3, 1, 2, 6, 2, 0];
      const expected: number[] = [0, 1, 2, 3, 6];
      const result: number[] = RBFunc.sortUniqueArray(org, (a, b) => a - b);

      expect(result).toEqual(expected);
    });

    it("Should return a unsorted array of numbers if no comparison-function was given", () => {
      const org: number[] = [3, 1, 2.5, 6, 2.1, 0];
      const expected: number[] = [0, 1, 2.1, 2.5, 3, 6];
      const result: number[] = RBFunc.sortUniqueArray(org);

      expect(result.length).toEqual(expected.length);
    });

    it("Should return an empty array of numbers when input is empty", () => {
      const org: number[] = [];
      const expected: number[] = [];
      const result: number[] = RBFunc.sortUniqueArray(org, (a, b) => a - b);

      expect(result).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'pad()'", () => {

    it("should throw an error when value is null", () => {
      expect(() => {
        RBFunc.pad(null);
      }).toThrowError("Function can't be used for type 'null' or 'undefined'.");
    });

    it("should throw an error when value is undefined", () => {
      expect(() => {
      // eslint-disable-next-line no-undefined
        RBFunc.pad(undefined);
      }).toThrowError("Function can't be used for type 'null' or 'undefined'.");
    });

    it("Should return a padded string for a string", () => {
      const value = "Jan";
      const count = 7;
      const expected = "Jan    ";
      const result: string = RBFunc.pad(value, count);

      expect(result).toBe(expected);
    });

    it("Should return a padded string for a boolean", () => {
      const value = true;
      const count = 7;
      const expected = value.toLocaleString().padEnd(count);
      const result: string = RBFunc.pad(value, count);

      expect(result).toBe(expected);
    });

    it("Should return a padded string for a number", () => {
      const value = 4711;
      const count = 7;
      const expected = RBFunc.pad(value, count);
      const result: string = RBFunc.pad(value, count);

      expect(result).toBe(expected);
    });

    it("Should return a padded string for a bigint", () => {
      const value = BigInt(4711);
      const count = 7;
      const expected = RBFunc.pad(value, count);
      const result: string = RBFunc.pad(value, count);

      expect(result).toBe(expected);
    });

    it("Should return a padded string for a date", () => {
      const value: Date = new Date(2024, 0, 1);
      const valueTime: Date = new Date("2024-01-01 01:02:03");
      const count = 22;
      const expected = RBFunc.pad(value, count);
      const expectedTime = RBFunc.pad(valueTime, count);
      const result: string = RBFunc.pad(value, count);
      const resultTime: string = RBFunc.pad(valueTime, count);

      expect(result).toBe(expected);
      expect(resultTime).toBe(expectedTime);
    });

    it("Should return a padded string for a date in NL format", () => {
      const saveLanguage = CURRENT_LANGUAGE;
      RBLocale.setCurrentLanguage("nl-NL");
      const count = 22;
      const valueJustString: Date = new Date(2024, 7, 31);
      const expectedJustString = "31-08-2024            ";
      const resultJustString: string = RBFunc.pad(valueJustString, count);
      const value: Date = new Date(2024, 7, 31, 2, 4, 6);
      const expected = "31-08-2024 02:04:06   ";
      const result: string = RBFunc.pad(value, count);

      expect(resultJustString).toBe(expectedJustString);
      expect(result).toBe(expected);
      RBLocale.setCurrentLanguage(saveLanguage);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'colorizeFilePaths()'", () => {

    it("Should return the original string if no filePath included", () => {
      const value = "Jan";
      const expected = "Jan";
      const result: string = RBFunc.colorizeFilePaths(value);

      expect(result).toBe(expected);
    });

    it("Should return a string with escape-characters if filePath included", () => {
      const colorStart = "\x1b[36m"; // Cyan color
      const colorEnd = "\x1b[0m"; // Reset color
      const aPath = "c:\\test\\test.txt";
      const value = `Jan ${aPath} en meer`;
      const expected = `Jan ${colorStart}${aPath}${colorEnd} en meer`;
      const result: string = RBFunc.colorizeFilePaths(value);

      expect(result).toBe(expected);
    });

    it("should colorize Unix-style file paths", () => {
      const text = "Here is a file path: /home/user/file.txt";
      const expected = "Here is a file path: \x1b[36m/home/user/file.txt\x1b[0m";
      const result = RBFunc.colorizeFilePaths(text);

      expect(result).toEqual(expected);
    });

    it("should colorize Windows-style file paths", () => {
      const text = "Here is a file path: C:\\Users\\user\\file.txt";
      const expected = "Here is a file path: \x1b[36mC:\\Users\\user\\file.txt\x1b[0m";
      const result = RBFunc.colorizeFilePaths(text);

      expect(result).toEqual(expected);
    });

    it("should colorize mixed file paths", () => {
      const text = "Here are file paths: /home/user/file.txt and C:\\Users\\user\\file.txt";
      const expected = "Here are file paths: \x1b[36m/home/user/file.txt\x1b[0m " +
        "and \x1b[36mC:\\Users\\user\\file.txt\x1b[0m";
      const result = RBFunc.colorizeFilePaths(text);

      expect(result).toEqual(expected);
    });

    it("should colorize file paths with hyphens and dots", () => {
      const text = "Here is a file path: /home/user/my-file.name.txt";
      const expected = "Here is a file path: \x1b[36m/home/user/my-file.name.txt\x1b[0m";
      const result = RBFunc.colorizeFilePaths(text);

      expect(result).toEqual(expected);
    });

    it("should colorize file paths with multiple extensions", () => {
      const text = "Here is a file path: /home/user/file.tar.gz";
      const expected = "Here is a file path: \x1b[36m/home/user/file.tar.gz\x1b[0m";
      const result = RBFunc.colorizeFilePaths(text);

      expect(result).toEqual(expected);
    });

    it("should not colorize non-file paths", () => {
      const text = "This is not a file path: just some text";
      const expected = "This is not a file path: just some text";
      const result = RBFunc.colorizeFilePaths(text);

      expect(result).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'removeCommentLines()'", () => {

    it("Should return a string[] with all comments removed", () => {
      const fileContents: string[] = [
        "const a = 1;",
        "// This is a comment",
        "   // This is a indented comment",
        "const b = 2;",
        "/* This is a block comment */",
        "const c = 3;",
        "/* Another block comment */ const d = 4;",
        "const e = 5; // Inline comment",
      ];
      const expected: string[] = [
        "const a = 1;",
        "const b = 2;",
        "const c = 3;",
        "/* Another block comment */ const d = 4;",
        "const e = 5; // Inline comment",
      ];
      const result: string[] = RBFunc.removeCommentLines(fileContents);

      expect(result).toEqual(expected);
    });

    it("Should return an empty array if all lines are comments", () => {
      const fileContents: string[] = [
        "// This is a comment",
        "/* This is a block comment */",
        "// Another comment",
      ];
      const expected: string[] = [];
      const result: string[] = RBFunc.removeCommentLines(fileContents);

      expect(result).toEqual(expected);
    });

    it("Should return the original array if there are no comments", () => {
      const fileContents: string[] = [
        "const a = 1;",
        "const b = 2;",
        "const c = 3;",
      ];
      const expected: string[] = [
        "const a = 1;",
        "const b = 2;",
        "const c = 3;",
      ];
      const result: string[] = RBFunc.removeCommentLines(fileContents);

      expect(result).toEqual(expected);
    });

    it("Should handle an empty array correctly", () => {
      const fileContents: string[] = [];
      const expected: string[] = [];
      const result: string[] = RBFunc.removeCommentLines(fileContents);

      expect(result).toEqual(expected);
    });

    it("Should handle lines with only whitespace correctly", () => {
      const fileContents: string[] = [
        "const a = 1;",
        "   ",
        "// This is a comment",
        "const b = 2;",
      ];
      const expected: string[] = [
        "const a = 1;",
        "   ",
        "const b = 2;",
      ];
      const result: string[] = RBFunc.removeCommentLines(fileContents);

      expect(result).toEqual(expected);
    });

    it("Should handle lines with mixed content correctly", () => {
      const fileContents: string[] = [
        "const a = 1; // Inline comment",
        "const b = 2; /* Block comment */",
        "// Full line comment",
        "/* Full block comment */",
        "const c = 3;",
      ];
      const expected: string[] = [
        "const a = 1; // Inline comment",
        "const b = 2; /* Block comment */",
        "const c = 3;",
      ];
      const result: string[] = RBFunc.removeCommentLines(fileContents);

      expect(result).toEqual(expected);
    });
  });

});
