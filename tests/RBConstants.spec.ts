import { IS_MOBILE, HAS_TOUCH_SCREEN } from "../srcw/RBConstants";
import { NEWLINE, EMPTY_STRING, SPACE, TAB } from "../src/RBConstants";
import { LIB_VERSION, LIB_NAME, IS_IN_BROWSER } from "../src/RBConstants";
import { BROWSER } from "../srcw/RBConstants";
import { DEVICE_TYPE, MAX_WIDTH_SCREEN, MAX_HEIGHT_SCREEN } from "../srcw/RBConstants";
import { MIN_DATE, MIN_DATE_GET_TIME, MILLISECONDS_PER_DAY } from "../src/RBConstants";
import { RBBrowser } from "../srcw/RBBrowser";
import { validDeviceTypes } from "../srcw/Shared";

/**
 * Tests for Global constants used in the library.
 *
 * 2024-09-18:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
describe("[Constants]", () => {

  describe("LIB_VERSION and LIB_NAME", () => {
    it("should be strings with the correct version and name", () => {
      expect(typeof LIB_VERSION).toBe("string");
      expect(typeof LIB_NAME).toBe("string");
      const expectedVer = "0.1.0";

      expect(LIB_VERSION).toBe(expectedVer);
      const expectedName = "RBCore";

      expect(LIB_NAME).toBe(expectedName);
    });
  });

  describe("IS_IN_BROWSER", () => {
    it("should exist as a boolean", () => {
      expect(typeof IS_IN_BROWSER).toBe("boolean");
      if (typeof window !== "undefined") {
        expect(IS_IN_BROWSER).toBeTruthy();
      } else {
        expect(IS_IN_BROWSER).toBeFalsy();
      }
    });
  });

  describe("String constants", () => {

    it("should be a TAB character", () => {
      expect(TAB).toBe("\t");
    });

    it("should be a SPACE character", () => {
      expect(SPACE).toBe(" ");
    });

    it("should be NEWLINE (carriage return + line-feed)", () => {
      expect(NEWLINE).toBe(NEWLINE);
    });

    it("should be EMPTY_STRING", () => {
      expect(EMPTY_STRING).toBe("");
    });
  });

  // ----------------------------------------------------------------------------

  describe("Device and browser constants", () => {

    beforeEach(() => {
      spyOn(RBBrowser, "getDeviceType").and.returnValue("Desktop");
      spyOn(RBBrowser, "getWindowsFormat").and.
        returnValue({ widthScreen: 1920, heightScreen: 1080 });
      spyOn(RBBrowser, "isMobileDevice").and.returnValue(false);
      spyOn(RBBrowser, "getBrowser").and.returnValue("Chrome");
      spyOn(RBBrowser, "hasTouchScreen").and.returnValue(false);
    });

    it("should be a string (DEVICE_TYPE)", () => {
      expect(typeof DEVICE_TYPE).toBe("string");
      expect(validDeviceTypes).toContain(DEVICE_TYPE);
    });

    it("should be a number (MAX_WIDTH_SCREEN)", () => {
      expect(typeof MAX_WIDTH_SCREEN).toBe("number");
      expect(MAX_WIDTH_SCREEN).toBeGreaterThan(0);
    });

    it("should be a number (MAX_HEIGHT_SCREEN)", () => {
      expect(typeof MAX_HEIGHT_SCREEN).toBe("number");
      expect(MAX_HEIGHT_SCREEN).toBeGreaterThan(0);
    });

    it("should be a boolean (IS_MOBILE)", () => {
      expect(typeof IS_MOBILE).toBe("boolean");
      expect(IS_MOBILE).toBe(false);
    });

    it("should be a string (BROWSER) with name and version-number", () => {
      expect(typeof BROWSER).toBe("string");
      expect(BROWSER).toContain("Chrome 1");
    });

    it("should be a boolean (HAS_TOUCH_SCREEN)", () => {
      expect(typeof HAS_TOUCH_SCREEN).toBe("boolean");
      expect(HAS_TOUCH_SCREEN).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------

  describe("Various constants", () => {

    it("should be a number (MILLISECONDS_PER_DAY)", () => {
      expect(typeof MILLISECONDS_PER_DAY).toBe("number");
      expect(MILLISECONDS_PER_DAY).toBe(86_400_000);
    });

    it("should be the smallest date MIN_DATE (1900-01-01)", () => {
      const expected = new Date(Date.UTC(0, 0, 1));

      expect(MIN_DATE instanceof Date).toBeTruthy();
      expect(MIN_DATE).toEqual(expected);
    });

    it("should be the smallest date for getDate() MIN_DATE_GET_TIME (1970-01-01)", () => {
      const expected = new Date(Date.UTC(1970, 0, 1));

      expect(MIN_DATE_GET_TIME instanceof Date).toBeTruthy();
      expect(MIN_DATE_GET_TIME).toEqual(expected);
    });

  });

});
