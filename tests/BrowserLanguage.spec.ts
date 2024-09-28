import { getCurrentBrowserLanguage } from "../src/lib/BrowserLanguage";
import { DEFAULT_LANGUAGE } from "../src/RBLocale";

describe("[RBLocale]", () => {
  describe("function 'getCurrentNodeLanguage()'", () => {
    it("should return the default language", () => {
      const result = getCurrentBrowserLanguage(DEFAULT_LANGUAGE);
      expect(result.length).toBe(5);
      if (navigator) {
        expect(result).toBe(navigator.language);
      } else {
        expect(result).toBe(DEFAULT_LANGUAGE);
      }
    });
  });
});
