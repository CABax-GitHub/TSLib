import { EMPTY_STRING } from "../src/RBConstants";
import { NodeBrowser } from "../src/NodeBrowser";
import { RBBrowser } from "../srcw/RBBrowser";

/**
 * Tests for Class NodeBrowser en zijn functions:
 *
 * 2024-09-13:  eslint
 */

/* eslint-disable max-lines-per-function */
describe("[NodeBrowser]", () => {

  describe("RBBrowser present", () => {

    it("should return the RBBrowser", () => {
      expect(RBBrowser).toBeTruthy();
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getDeviceType()'", () => {
    it("should return the device-type as EMPTY_STRING", () => {
      const result: string = NodeBrowser.getDeviceType();

      expect(result).toBe(EMPTY_STRING);
    });
  });

  describe("function 'getWindowsFormat()'", () => {
    it("should return the widthScreen and heightScreen, both as 0", () => {
      const result = NodeBrowser.getWindowsFormat();

      expect(result.widthScreen).toBe(0);
      expect(result.heightScreen).toBe(0);
    });
  });

  describe("function 'getBrowser()'", () => {
    it("should return the Browser as EMPTY_STRING", () => {
      const result: string = NodeBrowser.getBrowser();

      expect(result).toBe(EMPTY_STRING);
    });
  });

  describe("function 'isMobileDevice()'", () => {
    it("should return isMobileDevice = false", () => {
      const result: boolean = NodeBrowser.isMobileDevice();

      expect(result).toBe(false);
    });
  });

  describe("function 'hasTouchScreen()'", () => {
    it("should return hasTouchScreen = false", () => {
      const result: boolean = NodeBrowser.hasTouchScreen();

      expect(result).toBe(false);
    });
  });

});
