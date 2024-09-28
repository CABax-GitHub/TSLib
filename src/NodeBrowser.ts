import { EMPTY_STRING } from "./RBConstants";

export class NodeBrowser {

  public static getDeviceType(): string {
    return EMPTY_STRING;
  }

  public static getWindowsFormat(): { widthScreen: number, heightScreen: number } {
    return { widthScreen: 0, heightScreen: 0 };
  }

  public static getBrowser(): string {
    return EMPTY_STRING;
  }

  public static isMobileDevice(): boolean {
    return false;
  }

  public static hasTouchScreen(): boolean {
    return false;
  }

}
