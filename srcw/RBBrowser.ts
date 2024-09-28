/**
 * Class ClientStorage to enhance localStorage
 * Class ClientTempStorage to enhance sessionStorage
 *
 * 2024-08-26:  eslint + ng test completed
 */

import { BrowserBrowser } from "./lib/BrowserBrowser"; // Running inside browser
import { NodeBrowser } from "./lib/NodeBrowser"; // (fallback if outside browser)

export const RBBrowser = typeof window !== "undefined" ? BrowserBrowser : NodeBrowser;
