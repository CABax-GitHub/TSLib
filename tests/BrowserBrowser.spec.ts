import { EMPTY_STRING } from "../src/RBConstants";
import { RBBrowser } from "../srcw/RBBrowser";
import { BrowserBrowser } from "../srcw/BrowserBrowser";
import { deviceTypes, DeviceTypeRange, validDeviceTypes } from "../srcw/Shared";

/**
 * Tests for Class BrowserBrowser and its functions:
 *
 * 2024-08-26:  eslint + ng test completed
 */

/* eslint-disable max-lines-per-function */
describe("[BrowserBrowser]", () => {

  describe("RBBrowser present", () => {

    it("should return the RBBrowser", () => {
      expect(RBBrowser).toBeTruthy();
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getDeviceType()'", () => {
    let originalScreen: Pick<Screen, "availWidth" | "availHeight"> =
      { availWidth: 0, availHeight: 0 };
    let originalDeviceType: string = EMPTY_STRING;

    beforeAll(() => {
      originalScreen = {
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
      };
      originalDeviceType = BrowserBrowser.getDeviceType();
    });

    beforeEach(() => {
      Object.defineProperty(window, "screen", {
        value: { ...originalScreen },
        writable: true,
        configurable: true,
      });
    });

    afterAll(() => {
      Object.defineProperty(window, "screen", {
        value: originalScreen,
        writable: true,
        configurable: true,
      });
    });

    it("should return a valid device type", () => {
      const result = BrowserBrowser.getDeviceType();

      expect(validDeviceTypes).toContain(result);
    });

    it("should return the original device type for the current screen", () => {
      expect(BrowserBrowser.getDeviceType()).toBe(originalDeviceType);
    });

    deviceTypes.forEach((deviceRange: DeviceTypeRange) => {
      const { minWidthScreen, maxWidthScreen, type } = deviceRange;

      it(`should return "${type}" for width between ${minWidthScreen} ` +
         `and ${maxWidthScreen}`, () => {
        const testWidth = Math.floor((minWidthScreen + maxWidthScreen) / 2);
        Object.defineProperty(
          window.screen, "availWidth", { value: testWidth, configurable: true });

        expect(BrowserBrowser.getDeviceType()).toBe(type);
      });

      it(`should return "${type}" for minimum width ${minWidthScreen}`, () => {
        Object.defineProperty(
          window.screen, "availWidth", { value: minWidthScreen, configurable: true });

        expect(BrowserBrowser.getDeviceType()).toBe(type);
      });

      if (isFinite(maxWidthScreen)) {
        it(`should return "${type}" for maximum width ${maxWidthScreen}`, () => {
          Object.defineProperty(
            window.screen, "availWidth", { value: maxWidthScreen, configurable: true });

          expect(BrowserBrowser.getDeviceType()).toBe(type);
        });
      }
    });

    it("should return an empty string when screen is undefined", () => {
      // eslint-disable-next-line no-undefined
      Object.defineProperty(window, "screen", { value: undefined, configurable: true });

      expect(BrowserBrowser.getDeviceType()).toBe(EMPTY_STRING);
      Object.defineProperty(window, "screen", { value: originalScreen, configurable: true });
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'getWindowsFormat()'", () => {
    let originalScreen: Pick<Screen, "availWidth" | "availHeight"> =
      { availWidth: 0, availHeight: 0 };

    beforeEach(() => {
      originalScreen = {
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
      };
    });

    it("Should return width and height of the current window", () => {
      const result = BrowserBrowser.getWindowsFormat();

      expect(result.widthScreen).toBe(originalScreen.availWidth);
      expect(result.heightScreen).toBe(originalScreen.availHeight);
    });

    it("Should handle errors when accessing screen properties", () => {
      spyOn(console, "error"); // Suppress console.error output in tests
      Object.defineProperty(window, "screen", {
        get: () => {
          throw new Error("Screen access error");
        },
        configurable: true,
      });
      const result = BrowserBrowser.getWindowsFormat();

      expect(result).toEqual({ widthScreen: 0, heightScreen: 0 });
    });

    it("should return zero dimensions when screen is undefined", () => {
      // Simulate screen being undefined
      Object.defineProperty(window, "screen", {
        // eslint-disable-next-line no-undefined
        value: undefined,
        configurable: true,
      });
      const result = BrowserBrowser.getWindowsFormat();

      expect(result).toEqual({ widthScreen: 0, heightScreen: 0 });
    });

    it("Should return zero dimensions when screen is null", () => {
      // Simulate screen being null
      Object.defineProperty(window, "screen", {
        value: null,
        configurable: true,
      });
      const result = BrowserBrowser.getWindowsFormat();

      expect(result).toEqual({ widthScreen: 0, heightScreen: 0 });
    });

    afterEach(() => {
      Object.defineProperty(window, "screen", {
        value: originalScreen,
        writable: true,
        configurable: true,
      });
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'isMobileDevice()'", () => {
    const originalUserAgent = navigator.userAgent;
    const originalNavigator = window.navigator;

    afterEach(() => {
      Object.defineProperty(window, "navigator", {
        value: originalNavigator,
        configurable: true,
      });
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
    });

    it("Should return false for desktop browsers", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        configurable: true,
      });

      expect(BrowserBrowser.isMobileDevice()).toBeFalsy();
    });

    it("Should return true for mobile devices", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) " +
          "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
        configurable: true,
      });

      expect(BrowserBrowser.isMobileDevice()).toBeTruthy();
    });

    it("Should return true for tablet devices", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 " +
          "(KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        configurable: true,
      });

      expect(BrowserBrowser.isMobileDevice()).toBeTruthy();
    });

    // New test case for undefined navigator
    it("Should return false when navigator is undefined", () => {
      // Set navigator to undefined
      Object.defineProperty(window, "navigator", {
        // eslint-disable-next-line no-undefined
        value: undefined,
        configurable: true,
      });

      expect(BrowserBrowser.isMobileDevice()).toBeFalsy();
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'getBrowser()'", () => {
    const originalUserAgent = navigator.userAgent;

    afterEach(() => {
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
    });

    it("Should return Chrome browser info", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        configurable: true,
      });

      expect(BrowserBrowser.getBrowser()).toContain("Chrome 91");
    });

    it("Should return MS-Edge browser info", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
        configurable: true,
      });

      expect(BrowserBrowser.getBrowser()).toContain("MS-Edge 91");
    });

    it("Should return Safari browser info", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
          "(KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        configurable: true,
      });

      expect(BrowserBrowser.getBrowser()).toContain("Safari 605");
    });

    it("Should return Firefox browser info", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        configurable: true,
      });

      expect(BrowserBrowser.getBrowser()).toContain("Firefox 89");
    });

    it("Should return empty string for unknown browsers", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Unknown Browser",
        configurable: true,
      });

      expect(BrowserBrowser.getBrowser()).toBe(EMPTY_STRING);
    });

    it("should return empty string when navigator is undefined", () => {
      // Save the original navigator
      const originalNavigator = window.navigator;
      // Set navigator to undefined
      Object.defineProperty(window, "navigator", {
        // eslint-disable-next-line no-undefined
        value: undefined,
        configurable: true,
      });
      const result = BrowserBrowser.getBrowser();

      expect(result).toBe(EMPTY_STRING);
      // Restore the original navigator
      Object.defineProperty(window, "navigator", {
        value: originalNavigator,
        configurable: true,
      });
    });

  });

});
