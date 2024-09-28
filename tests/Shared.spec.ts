import { DeviceType, deviceTypes, DeviceTypeRange, validDeviceTypes } from "../srcw/Shared";

/**
 * Tests for shared types, classes etc.
 * Also has shared constants and functions for testing.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const anyNull: any = null;
// eslint-disable-next-line no-undefined
export const anyUndefined: any = undefined;
/* eslint-enable @typescript-eslint/no-explicit-any */

describe("[Shared]", () => {

  describe("type 'deviceTypes' array()", () => {

    it("should contain only 4 types", () => {
      expect(deviceTypes.length).toBe(4);
      const expected: DeviceType = "Mobile";

      expect(deviceTypes.map((dt) => dt.type)).toContain(expected);
    });

    it("should have correct range for each device type", () => {
      const expectedRanges: DeviceTypeRange[] = [
        { minWidthScreen: 1, maxWidthScreen: 575, type: "Mobile" },
        { minWidthScreen: 576, maxWidthScreen: 767, type: "Tablet" },
        { minWidthScreen: 768, maxWidthScreen: 992, type: "Laptop" },
        { minWidthScreen: 993, maxWidthScreen: Infinity, type: "Desktop" },
      ];

      expect(deviceTypes).toEqual(expectedRanges);
    });
  });

  describe("const 'validDeviceTypes' array()", () => {

    it("should match the types in DeviceType", () => {
      expect(validDeviceTypes.length).toBe(4);
      expect(validDeviceTypes).toEqual(["Mobile", "Tablet", "Laptop", "Desktop"]);
    });

  });
});
