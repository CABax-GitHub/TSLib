import { NodeStorage, NodeTempStorage } from "../src/lib/NodeStorage";
import { RBLocalStorage, RBLocalTempStorage } from "../src/RBLocalStorage";

/**
 * Tests for Class NodeStorage en zijn functions:
 * Tests for Class NodeTempStorage en zijn functions:
 *
 * 2024-08-26:  eslint + ng test completed
 */

const testKey = "unitTestKey";
const testValue = "test-value";
const languageKey = "Language";
const languageValue = "nl-NL";
beforeEach(() => {
  NodeStorage.clear();
  NodeTempStorage.clear();
});

/* eslint-disable max-lines-per-function */

describe("[NodeStorage]", () => {

  describe("RBLocalStorage present", () => {

    it("should return the RBLocalStorage", () => {
      expect(RBLocalStorage).toBeTruthy();
    });
  });

  // --------------------------------------------------------------------------

  describe("RBLocalTempStorage present", () => {

    it("should return the RBLocalTempStorage", () => {
      expect(RBLocalTempStorage).toBeTruthy();
    });
  });

  // --------------------------------------------------------------------------

  describe("function 'getAllKeysAndValuesAsString()'", () => {

    it("should return everything stored in localStorage", () => {
      NodeStorage.clear();
      let bool = NodeStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      expect(NodeStorage.getValue(testKey)).toEqual(testValue);
      bool = NodeStorage.setValue("Lang", "nl-NL");
      expect(bool).toBeTruthy();
      expect(NodeStorage.getValue("Lang")).toEqual("nl-NL");
      expect(NodeStorage.getValue("Lang")).not.toEqual(testKey);
      const expected = 2; // Two values to test
      const expectedLength: number =
        testKey.length + testValue.length + languageKey.length + languageValue.length;
      const resultLength: number = NodeStorage.length();
      const result: string = NodeStorage.getAllKeysAndValuesAsString();
      expect(resultLength).toEqual(expected);
      expect(result.length).toEqual(expectedLength);
    });
  });

  describe("function 'existsKey()'", () => {

    it("should return true for an existing key", () => {
      NodeStorage.clear();
      const bool = NodeStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      expect(NodeStorage.existsKey(testKey)).toBe(true);
    });

    it("should return false for a non-existing key", () => {
      expect(NodeStorage.existsKey(testKey)).toBe(false);
    });
  });

  describe("function 'getValue()'", () => {

    it("should return the stored value", () => {
      NodeStorage.clear();
      const bool = NodeStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      expect(NodeStorage.getValue(testKey)).toEqual(testValue);
    });

    it("should store a value if it was not present and return the value", () => {
      NodeStorage.clear();
      const notPresentValue = "not_present_value";
      const notPresentKey = "not_present_key";
      const bool = NodeStorage.setValue(notPresentKey, notPresentValue);
      expect(bool).toBeTruthy();
      expect(NodeStorage.getValue(notPresentKey)).toEqual(notPresentValue);
    });
  });

  describe("function 'setValue()'", () => {

    it("should store a value", () => {
      NodeStorage.clear();
      const result = NodeStorage.setValue(testKey, testValue);
      expect(NodeStorage.getValue(testKey)).toEqual(testValue);
      expect(result).toBeTruthy();
    });
  });

  describe("function 'deleteKey()'", () => {

    it("should return true if key is deleted", () => {
      NodeStorage.clear();
      const bool = NodeStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      const result: boolean = NodeStorage.deleteKey(testKey);
      expect(result).toBeTruthy();
    });
  });

  describe("function 'clear()'", () => {

    it("should return true if cleared", () => {
      NodeStorage.clear();
      const bool = NodeStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      NodeStorage.clear();
      expect(NodeStorage.length()).toBe(0);
    });
  });

  describe("function 'length()'", () => {

    it("should return 1 if 1 value present", () => {
      NodeStorage.clear();
      const bool = NodeStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      const result: number = NodeStorage.length();
      expect(result).toEqual(1);
    });

  });
});

describe("[NodeTempStorage]", () => {

  describe("function 'getAllKeysAndValuesAsString()'", () => {

    it("should return everything stored in sessionStorage", () => {
      NodeTempStorage.clear();
      let bool = NodeTempStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      bool = NodeTempStorage.setValue("Lang", "nl-NL");
      expect(bool).toBeTruthy();
      const expected = 2; // Two values to test
      const expectedLength: number =
        testKey.length + testValue.length + languageKey.length + languageValue.length;
      const resultLength: number = NodeTempStorage.length();
      const result: string = NodeTempStorage.getAllKeysAndValuesAsString();
      expect(resultLength).toEqual(expected);
      expect(result.length).toEqual(expectedLength);
    });
  });

  describe("function 'existsKey()'", () => {

    it("should return true for an existing key", () => {
      NodeTempStorage.clear();
      const bool = NodeTempStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      expect(NodeTempStorage.existsKey(testKey)).toBe(true);
    });

    it("should return false for a non-existing key", () => {
      expect(NodeTempStorage.existsKey(testKey)).toBe(false);
    });
  });

  describe("function 'getValue()'", () => {

    it("should return the stored value", () => {
      NodeTempStorage.clear();
      const bool = NodeTempStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      expect(NodeTempStorage.getValue(testKey)).toEqual(testValue);
    });

    it("should store a value if it was not present and return the value", () => {
      NodeTempStorage.clear();
      const notPresentValue = "not_present_value";
      const notPresentKey = "not_present_key";
      const bool = NodeTempStorage.setValue(notPresentKey, notPresentValue);
      expect(bool).toBeTruthy();
      expect(NodeTempStorage.getValue(notPresentKey)).toEqual(notPresentValue);
    });
  });

  describe("function 'setValue()'", () => {

    it("should store a value", () => {
      NodeTempStorage.clear();
      const result = NodeTempStorage.setValue(testKey, testValue);
      expect(result).toBeTruthy();
      expect(NodeTempStorage.getValue(testKey)).toEqual(testValue);
    });
  });

  describe("function 'deleteKey()'", () => {

    it("should return true if key is deleted", () => {
      NodeTempStorage.clear();
      const bool = NodeTempStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      const result: boolean = NodeTempStorage.deleteKey(testKey);
      expect(result).toBeTruthy();
    });
  });

  describe("function 'clear()'", () => {

    it("should return true if cleared", () => {
      NodeTempStorage.clear();
      const bool = NodeTempStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      NodeTempStorage.clear();
      expect(NodeTempStorage.length()).toBe(0);
    });
  });

  describe("function 'length()'", () => {

    it("should return 1 if 1 value present", () => {
      NodeTempStorage.clear();
      const bool = NodeTempStorage.setValue(testKey, testValue);
      expect(bool).toBeTruthy();
      const result: number = NodeTempStorage.length();
      expect(result).toEqual(1);
    });

  });

});
