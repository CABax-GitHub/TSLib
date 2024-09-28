/**
 * Shared enums, types, interfaces and constants
 *
 */

export type DeviceType = "Mobile" | "Tablet" | "Laptop" | "Desktop";

export interface DeviceTypeRange {
  minWidthScreen: number;
  maxWidthScreen: number;
  type: DeviceType;
}

export const deviceTypes: DeviceTypeRange[] = [
  { minWidthScreen: 1, maxWidthScreen: 575, type: "Mobile" },
  { minWidthScreen: 576, maxWidthScreen: 767, type: "Tablet" },
  { minWidthScreen: 768, maxWidthScreen: 992, type: "Laptop" },
  { minWidthScreen: 993, maxWidthScreen: Infinity, type: "Desktop" },
];

export const validDeviceTypes: string[] = deviceTypes.map((device) => device.type);
