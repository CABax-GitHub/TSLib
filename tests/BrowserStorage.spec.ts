import { BrowserStorage, BrowserTempStorage } from "../srcw/BrowserStorage";
import { RBLocalStorage, RBLocalTempStorage } from "../src/RBLocalStorage";
import { EMPTY_STRING } from "../src/RBConstants";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class BrowserStorage en zijn functions:
 * Tests for Class BrowserTempStorage en zijn functions:
 *
 * 2024-08-26:  eslint + ng test completed
 */

const testKey = "unitTestKey";
const testValue = "test-value";
const languageKey = "Language";
const languageValue = "nl-NL";

/* eslint-disable max-lines-per-function */
/* eslint-disable jasmine/no-suite-dupes */
/* eslint-disable jasmine/no-spec-dupes */
describe("[BrowserStorage]", () => {

  beforeEach(() => {
    BrowserStorage.clear();
  });

  describe("RBLocalStorage present", () => {

    it("should return the RBLocalStorage", () => {
      expect(RBLocalStorage).toBeTruthy();
    });
  });

  // --------------------------------------------------------------------------

  describe("function 'getAllKeysAndValuesAsString()'", () => {

    it("should return everything stored in localStorage", () => {
      let bool = BrowserStorage.setValue(testKey, testValue);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue(testKey)).toEqual(testValue);
      bool = BrowserStorage.setValue("Lang", "nl-NL");

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue("Lang")).toEqual("nl-NL");
      expect(BrowserStorage.getValue("Lang")).not.toEqual(testKey);
      const expected = 2; // Two values to test
      const expectedLength: number =
      testKey.length + testValue.length + languageKey.length + languageValue.length;
      const resultLength: number = BrowserStorage.length();
      const result: string = BrowserStorage.getAllKeysAndValuesAsString();

      expect(resultLength).toEqual(expected);
      expect(result.length).toEqual(expectedLength);
    });
  });

  describe("function 'existsKey()'", () => {

    it("should return true for an existing key", () => {
      const bool = BrowserStorage.setValue(testKey, testValue);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.existsKey(testKey)).toBe(true);
    });

    it("should return false for a non-existing key", () => {
      expect(BrowserStorage.existsKey(testKey)).toBe(false);
    });
  });

  describe("function 'getValue()'", () => {

    it("should return an value-as-string if value is empty, null or undefined", () => {
      let bool = BrowserStorage.setValue(testKey, EMPTY_STRING);

      expect(bool).toBeFalsy();
      expect(BrowserStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserStorage.setValue(testKey, anyNull);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserStorage.setValue(testKey, anyUndefined);

      expect(bool).toBeFalsy();
      expect(BrowserStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserStorage.setValue(EMPTY_STRING, testValue);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserStorage.setValue(anyNull, testValue);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserStorage.setValue(anyUndefined, testValue);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue(testKey)).toEqual(EMPTY_STRING);
    });

    it("should return the stored value", () => {
      const bool = BrowserStorage.setValue(testKey, testValue);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue(testKey)).toEqual(testValue);
    });
  });

  describe("function 'setValue()'", () => {

    it("should store a value", () => {
      const bool = BrowserStorage.setValue(testKey, testValue);

      expect(bool).toBeTruthy();
      expect(BrowserStorage.getValue(testKey)).toEqual(testValue);
    });
  });

  describe("function 'deleteKey()'", () => {

    it("should return true if key is deleted", () => {
      const bool = BrowserStorage.setValue(testKey, testValue);

      expect(bool).toBeTruthy();
      const result: boolean = BrowserStorage.deleteKey(testKey);

      expect(result).toBeTruthy();
    });
  });

  describe("function 'clear()'", () => {

    it("should return true if cleared", () => {
      const bool = BrowserStorage.setValue(testKey, testValue);

      expect(bool).toBeTruthy();
      BrowserStorage.clear();

      expect(BrowserStorage.length()).toBe(0);
    });
  });

  describe("function 'length()'", () => {

    it("should return 1 if 1 value present", () => {
      BrowserStorage.clear();
      const bool = BrowserStorage.setValue(testKey, testValue);

      expect(bool).toBeTruthy();
      const result: number = BrowserStorage.length();

      expect(result).toEqual(1);
    });

  });

});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

/* eslint-disable max-lines-per-function */
describe("[BrowserTempStorage]", () => {

  beforeEach(() => {
    BrowserTempStorage.clear();
  });

  describe("RBLocalTempStorage present", () => {

    it("should return the RBLocalTempStorage", () => {
      expect(RBLocalTempStorage).toBeTruthy();
    });
  });

  // --------------------------------------------------------------------------

  describe("function 'getAllKeysAndValuesAsString()'", () => {

    it("should return everything stored in sessionStorage", () => {
      let bool = BrowserTempStorage.setValue(testKey, testValue);
      //      Expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(testValue);
      bool = BrowserTempStorage.setValue("Lang", "nl-NL");

      expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue("Lang")).toEqual("nl-NL");
      expect(BrowserTempStorage.getValue("Lang")).not.toEqual(testKey);
      const expected = 2; // Two values to test
      const expectedLength: number =
      testKey.length + testValue.length + languageKey.length + languageValue.length;
      const resultLength: number = BrowserTempStorage.length();
      const result: string = BrowserTempStorage.getAllKeysAndValuesAsString();

      expect(resultLength).toEqual(expected);
      expect(result.length).toEqual(expectedLength);
    });
  });

  describe("function 'existsKey()'", () => {

    it("should return true for an existing key", () => {
      BrowserTempStorage.setValue(testKey, testValue);
      //      Expect(bool).toBeFalsy();
      expect(BrowserTempStorage.existsKey(testKey)).toBe(true);
    });

    it("should return false for a non-existing key", () => {
      expect(BrowserTempStorage.existsKey(testKey)).toBe(false);
    });
  });

  describe("function 'getValue()'", () => {

    it("should return an value-as-string if value is empty, null or undefined", () => {
      let bool = BrowserTempStorage.setValue(testKey, EMPTY_STRING);

      expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserTempStorage.setValue(testKey, anyNull);
      //      Expect(bool).toBeTruthy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserTempStorage.setValue(testKey, anyUndefined);

      expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserTempStorage.setValue(EMPTY_STRING, testValue);

      expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserTempStorage.setValue(anyNull, testValue);

      expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(EMPTY_STRING);
      bool = BrowserTempStorage.setValue(anyUndefined, testValue);

      expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(EMPTY_STRING);
    });

    it("should return the stored value", () => {
      BrowserTempStorage.setValue(testKey, testValue);
      //      Expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(testValue);
    });
  });

  describe("function 'setValue()'", () => {

    it("should store a value", () => {
      BrowserTempStorage.setValue(testKey, testValue);
      //      Expect(bool).toBeFalsy();
      expect(BrowserTempStorage.getValue(testKey)).toEqual(testValue);
    });
  });

  describe("function 'deleteKey()'", () => {

    it("should return true if key is deleted", () => {
      BrowserTempStorage.setValue(testKey, testValue);
      //      Expect(bool).toBeFalsy();
      const result: boolean = BrowserTempStorage.deleteKey(testKey);

      expect(result).toBeTruthy();
    });
  });

  describe("function 'clear()'", () => {

    it("should return true if cleared", () => {
      BrowserTempStorage.setValue(testKey, testValue);
      //      Expect(bool).toBeFalsy();
      BrowserTempStorage.clear();

      expect(BrowserTempStorage.length()).toBe(0);
    });
  });

  describe("function 'length()'", () => {

    it("should return 1 if 1 value present", () => {
      BrowserTempStorage.clear();
      BrowserTempStorage.setValue(testKey, testValue);
      //      Expect(bool).toBeFalsy();
      const result: number = BrowserTempStorage.length();

      expect(result).toEqual(1);
    });

  });

});

