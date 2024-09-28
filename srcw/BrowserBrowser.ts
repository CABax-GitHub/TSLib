import { RBFunc } from "../src/RBFunc";
import { IS_IN_BROWSER, EMPTY_STRING } from "../src/RBConstants";
import { deviceTypes, DeviceTypeRange } from "./Shared";

export class BrowserBrowser {

  public static getDeviceType(): string {
    const maxWidthScreen: number = this.getWindowsFormat().widthScreen;
    const device: DeviceTypeRange | undefined = deviceTypes.
      find((d) => RBFunc.isInRange(maxWidthScreen, d.minWidthScreen, d.maxWidthScreen));
    return device ? device.type : EMPTY_STRING;
  }

  public static getWindowsFormat(): { widthScreen: number, heightScreen: number } {
    try {
      return {
        widthScreen: screen.availWidth || 0,
        heightScreen: screen.availHeight || 0,
      };
    } catch {
      return { widthScreen: 0, heightScreen: 0 };
    }
  }

  private static readonly UA_CHROME = "Chrome/";
  private static readonly UA_EDGE = "Edg/";
  private static readonly UA_SAFARI = "Safari/";
  private static readonly UA_FIREFOX = "Firefox/";

  public static getBrowser(): string {

    function getBrowserVersion(userAgent: string, browser: string): string {
      return RBFunc.stringBetween(userAgent, browser, ".");
    }

    const userAgent: string =
      (typeof navigator !== "undefined") ? navigator.userAgent : EMPTY_STRING;
    if (userAgent.includes(this.UA_EDGE)) {
      return `MS-Edge ${getBrowserVersion(userAgent, this.UA_EDGE)}`;
    }
    if (userAgent.includes(this.UA_CHROME)) {
      return `Chrome ${getBrowserVersion(userAgent, this.UA_CHROME)}`;
    }
    if (userAgent.includes(this.UA_SAFARI)) {
      return `Safari ${getBrowserVersion(userAgent, this.UA_SAFARI)}`;
    }
    if (userAgent.includes(this.UA_FIREFOX)) {
      return `Firefox ${getBrowserVersion(userAgent, this.UA_FIREFOX)}`;
    }
    return EMPTY_STRING;
  }

  public static isMobileDevice(): boolean {
    if (typeof navigator === "undefined") {
      return false;
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.
      test(navigator.userAgent);
  }

  public static hasTouchScreen(): boolean {
    if (IS_IN_BROWSER) {
      return (
        "ontouchstart" in window || navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
      );
    }
    return false;
  }
}
