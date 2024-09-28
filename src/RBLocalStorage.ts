/**
 * Class ClientStorage to enhance localStorage
 * Class ClientTempStorage to enhance sessionStorage
 *
 * 2024-08-26:  eslint + ng test completed
 */

import { BrowserStorage, BrowserTempStorage } from "./lib/BrowserStorage"; // Running inside browser
import { NodeStorage, NodeTempStorage } from "./lib/NodeStorage"; // (fallback if outside browser)

export const RBLocalStorage =
  typeof window !== "undefined" ? BrowserStorage : NodeStorage;
export const RBLocalTempStorage =
  typeof window !== "undefined" ? BrowserTempStorage : NodeTempStorage;
