import { getCurrentNodeLanguage } from "../src/NodeLanguage";
import { DEFAULT_LANGUAGE } from "../src/RBLocale";

describe("[RBLocale]", () => {
  describe("function 'getCurrentNodeLanguage()'", () => {
    it("should return the default language", () => {
      const result = getCurrentNodeLanguage(DEFAULT_LANGUAGE);

      expect(result.length).toBe(5);
    });
  });
});
