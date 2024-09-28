import { EMPTY_STRING, NEWLINE } from "../src/RBConstants";
import { RBLocale } from "../src/RBLocale";
import { RBEnum } from "../src/RBEnum";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class RBEnum to handle various enum-like functions.
 *
 * 2024-09-18:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
/* eslint-disable jasmine/no-spec-dupes */
describe("[RBEnum]", () => {

  describe("function 'getEnumDefinition()'", () => {

    it("Should return the definition of the enum (no name)", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const name: string = EMPTY_STRING;
      const exp = 100;
      const res: string = RBEnum.getEnumDefinition(org, name);

      expect(res.length).toBeGreaterThan(exp);
      expect(res).toContain("export enum -Definition-");
      const newlines = res.split(`${NEWLINE}   `).length - 1;

      expect(newlines).toBeGreaterThan(1);
    });

    it("Should return the definition of the enum (with name)", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const name = "SupportedLanguages";
      const exp = 100;
      const res: string = RBEnum.getEnumDefinition(org, name);

      expect(res.length).toBeGreaterThan(exp);
      expect(res).toContain("export enum " + name);
      const newlines = res.split(`${NEWLINE}   `).length - 1;

      expect(newlines).toBeGreaterThan(1);
    });

    it("Should return the definition of the inline-enum", () => {
      const org: Record<string, string | number> = { JustAKey: "\"just a value\"" };
      const name = "SomeName";
      const res: string = RBEnum.getEnumDefinition(org, name);
      const expected: string = `export enum SomeName {${NEWLINE}   ` +
        `"JustAKey" = ""just a value"",${NEWLINE}}`;

      expect(res).toBe(expected);
    });

    it("Should return an empty string if enum is null or undefined", () => {
      const resU: string = RBEnum.getEnumDefinition(anyNull);
      const resN: string = RBEnum.getEnumDefinition(anyUndefined);
      const exp: string = EMPTY_STRING;

      expect(resN).toBe(exp);
      expect(resU).toBe(exp);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getEnum()'", () => {

    it("Should return the requested enum value", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const exp = "\"nl-NL\" = ";
      const res: string = RBEnum.getEnum(org).join(NEWLINE);

      expect(res).toContain(exp);
    });

    it("Should return the enum value of the inline enum", () => {
      const org: Record<string, string | number> = { JustAKey: "\"just a value\"" };
      const res: string = RBEnum.getEnum(org).join(NEWLINE);
      const expected = "\"JustAKey\" = \"\"just a value\"\",";

      expect(res).toContain(expected);
    });

    it("should return an empty array when enumObject is null or undefined", () => {
      expect(RBEnum.getEnum(anyNull)).toEqual([]);
      expect(RBEnum.getEnum(anyUndefined)).toEqual([]);
    });

    it("should return an array of string representations of the enum", () => {
      const enumObject = {
        FIRST: "first",
        SECOND: "second",
      };
      const expected = ["\"FIRST\" = \"first\",", "\"SECOND\" = \"second\","];

      expect(RBEnum.getEnum(enumObject)).toEqual(expected);
    });

    it("should exclude numeric keys from the enum", () => {
      const enumObject = {
        0: "zero",
        1: "one",
        FIRST: "first",
        SECOND: "second",
      };
      const expected = ["\"FIRST\" = \"first\",", "\"SECOND\" = \"second\","];

      expect(RBEnum.getEnum(enumObject)).toEqual(expected);
    });

    it("should handle mixed string and numeric keys correctly", () => {
      const enumObject = {
        0: "zero",
        FIRST: "first",
        1: "one",
        SECOND: "second",
      };
      const expected = ["\"FIRST\" = \"first\",", "\"SECOND\" = \"second\","];

      expect(RBEnum.getEnum(enumObject)).toEqual(expected);
    });

    it("should handle an empty enum object", () => {
      const enumObject: Record<string, string> = {};
      const expected: string[] = [];

      expect(RBEnum.getEnum(enumObject)).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getEnumKeys()'", () => {

    it("Should return the requested enum value", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const exp = "nl-NL";
      const res: string = RBEnum.getEnumKeys(org).join(NEWLINE);

      expect(res).toContain(exp);
    });

    it("Should return the enum value of the inline enum", () => {
      const org: Record<string, string | number> = { JustAKey: "\"just a value\"" };
      const res: string = RBEnum.getEnumKeys(org).join(NEWLINE);
      const expected = "JustAKey";

      expect(res).toContain(expected);
    });

    it("should return an empty string-array if enum is null or undefined", () => {
      const resN: string[] = RBEnum.getEnumKeys(anyNull);
      const resU: string[] = RBEnum.getEnumKeys(anyUndefined);
      const exp: string[] = [];

      expect(Array.isArray(resN)).toBe(true);
      expect(resN).toEqual(exp);
      expect(Array.isArray(resU)).toBe(true);
      expect(resU).toEqual(exp);
    });

    it("should return an array of string representations of the enum", () => {
      const enumObject = {
        FIRST: "first",
        SECOND: "second",
      };
      const expected = ["FIRST", "SECOND"];

      expect(RBEnum.getEnumKeys(enumObject)).toEqual(expected);
    });

    it("should exclude numeric keys from the enum", () => {
      const enumObject = {
        0: "zero",
        1: "one",
        FIRST: "first",
        SECOND: "second",
      };
      const expected = ["FIRST", "SECOND"];

      expect(RBEnum.getEnumKeys(enumObject)).toEqual(expected);
    });

    it("should return an array of string keys excluding numeric keys", () => {
      const enumObject = {
        0: "zero",
        FIRST: "first",
        1: "one",
        SECOND: "second",
      };
      const expected = ["FIRST", "SECOND"];
      const result = RBEnum.getEnumKeys(enumObject);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(expected);
    });

    it("should handle an empty enum object", () => {
      const enumObject = {};
      const expected: string[] = [];
      const result = RBEnum.getEnumKeys(enumObject);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getEnumValues()'", () => {

    it("Should return a string-array with the Values of the enum", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const exp = "Nederlands";
      const res: string = RBEnum.getEnumValues(org).join(NEWLINE);

      expect(res).toContain(exp);
    });

    it("Should return an empty array if enum is null or undefined", () => {
      const resN: string = RBEnum.getEnumValues(anyNull).join(NEWLINE);
      const resU: string = RBEnum.getEnumValues(anyUndefined).join(NEWLINE);
      const exp: string = EMPTY_STRING;

      expect(resU).toBe(exp);
      expect(resN).toBe(exp);
    });

    it("Should return an empty array when passed an empty object", () => {
      const emptyObject = {};
      const result = RBEnum.getEnumValues(emptyObject);

      expect(result).toEqual([]);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'isInEnum()'", () => {

    it("Should return true for an existing Key in the enum", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const key = "nl-NL";
      const res: boolean = RBEnum.isInEnum(key, org);

      expect(res).toBeTruthy();
    });

    it("Should return false for an non-existing Key in the enum", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const key = "non-existent-key";
      const res: boolean = RBEnum.isInEnum(key, org);

      expect(res).toBeFalsy();
    });

    it("Should return false if Key is null or undefined", () => {
      const org: Record<string, string | number> = RBLocale.SupportedLanguages;
      const resN: boolean = RBEnum.isInEnum(anyNull, org);
      const resU: boolean = RBEnum.isInEnum(anyUndefined, org);

      expect(resN).toBeFalsy();
      expect(resU).toBeFalsy();
    });
  });

});
