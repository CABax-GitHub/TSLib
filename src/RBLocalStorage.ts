/**
 * Class ClientStorage to enhance localStorage
 * Class ClientTempStorage to enhance sessionStorage
 *
 * 2024-08-26:  eslint + ng test completed
 */

import { NodeStorage, NodeTempStorage } from "./NodeStorage"; // (fallback if outside browser)
import { BrowserStorage, BrowserTempStorage } from "../srcw/BrowserStorage"; // Running inside browser

export const RBLocalStorage =
  typeof window !== "undefined" ? BrowserStorage : NodeStorage;
export const RBLocalTempStorage =
  typeof window !== "undefined" ? BrowserTempStorage : NodeTempStorage;
