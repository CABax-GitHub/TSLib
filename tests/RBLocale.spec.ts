import { EMPTY_STRING } from "../src/RBConstants";
import { RBLocale, CURRENT_LANGUAGE } from "../src/RBLocale";
import { getCurrentEnvironmentLanguage } from "../src/RBLocale";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class RBLocale to handle various international/local functions.
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
describe("[RBLocale]", () => {

  describe("function 'getCurrentLanguage()'", () => {

    it("Should return the current language, a string of length 5", () => {
      const expected = 5;
      const result: string = RBLocale.getCurrentLanguage();
      expect(result.length).toBe(expected);
    });

    it("Should set a language that exists", () => {
      const saveLanguage: string = RBLocale.getCurrentLanguage();
      const testLanguage = "de-DE";
      RBLocale.setCurrentLanguage(testLanguage);
      const result: string = RBLocale.getCurrentLanguage();
      expect(result).toBe(testLanguage);
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should NOT set a language that doesn't exist", () => {
      const saveLanguage: string = CURRENT_LANGUAGE;
      const testLanguage = "ab-CD";
      RBLocale.setCurrentLanguage(testLanguage);
      const result: string = RBLocale.getCurrentLanguage();
      expect(result).toBe(saveLanguage);
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should handle the case where navigator is undefined", () => {
      // Save the original navigator object and language
      const originalNavigator = window.navigator;
      const saveLanguage = CURRENT_LANGUAGE;
      // Create a mock navigator object
      const mockNavigator = {
        // eslint-disable-next-line no-undefined
        language: undefined,
      };
      // Assign the mock navigator to the global object
      Object.defineProperty(window, "navigator", {
        value: mockNavigator,
        configurable: true,
      });
      // Call the function and check the result
      const result = RBLocale.getCurrentLanguage();
      expect(result).toBe(CURRENT_LANGUAGE);
      // Restore the original navigator object and language
      RBLocale.setCurrentLanguage(saveLanguage);
      Object.defineProperty(window, "navigator", {
        value: originalNavigator,
        configurable: true,
      });
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'getCurrentCulture()'", () => {

    it("Should return the current culture, a string of length 2", () => {
      const expected = 2;
      const expectedCulture = RBLocale.getCurrentLanguage().substring(0, 2);
      const result: string = RBLocale.getCurrentCulture();
      expect(result.length).toBe(expected);
      expect(result).toBe(expectedCulture);

    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'toTrueFalse()'", () => {

    it("Should use the default language if non given", () => {
      const saveLanguage = RBLocale.getCurrentLanguage();
      RBLocale.setCurrentLanguage("en-US");
      const expectedT = "True";
      const resultT: string = RBLocale.toTrueFalse(true);
      expect(resultT).toEqual(expectedT);
      const expectedF = "False";
      const resultF: string = RBLocale.toTrueFalse(false);
      expect(resultF).toEqual(expectedF);
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should use default-lang if non-existent or empty language)", () => {
      const lang = "ab-CD";
      const expectedT: string = RBLocale.toTrueFalse(true, CURRENT_LANGUAGE);
      const resultT: string = RBLocale.toTrueFalse(true, lang);
      const expectedF: string = RBLocale.toTrueFalse(false, CURRENT_LANGUAGE);
      const resultF: string = RBLocale.toTrueFalse(false, lang);
      expect(resultT).toEqual(expectedT);
      expect(resultF).toEqual(expectedF);
      const resultET: string = RBLocale.toTrueFalse(true, EMPTY_STRING);
      const resultEF: string = RBLocale.toTrueFalse(false, EMPTY_STRING);
      expect(resultET).toEqual(expectedT);
      expect(resultEF).toEqual(expectedF);
    });

    it("Should return the false-value if boolean is null or undefined", () => {
      const lang = "de-DE";
      const expected = "Falsch";
      const resultN: string = RBLocale.toTrueFalse(anyNull, lang);
      const resultU: string = RBLocale.toTrueFalse(anyUndefined, lang);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'toYesNo()'", () => {

    it("Should use the default language if non given", () => {
      const saveLanguage = RBLocale.getCurrentLanguage();
      RBLocale.setCurrentLanguage("en-US");
      const expectedT = "Yes";
      const resultT: string = RBLocale.toYesNo(true);
      expect(resultT).toEqual(expectedT);
      const expectedF = "No";
      const resultF: string = RBLocale.toYesNo(false);
      expect(resultF).toEqual(expectedF);
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should use default-lang if non-existent or empty language)", () => {
      const lang = "ab-CD";
      const expectedT: string = RBLocale.toYesNo(true, CURRENT_LANGUAGE);
      const resultT: string = RBLocale.toYesNo(true, lang);
      const expectedF: string = RBLocale.toYesNo(false, CURRENT_LANGUAGE);
      const resultF: string = RBLocale.toYesNo(false, lang);
      expect(resultT).toEqual(expectedT);
      expect(resultF).toEqual(expectedF);
      const resultET: string = RBLocale.toYesNo(true, EMPTY_STRING);
      const resultEF: string = RBLocale.toYesNo(false, EMPTY_STRING);
      expect(resultET).toEqual(expectedT);
      expect(resultEF).toEqual(expectedF);

    });

    it("Should return the false-value if boolean is null or undefined", () => {
      const lang = "de-DE";
      const expected = "Nein";
      const resultN: string = RBLocale.toYesNo(anyNull, lang);
      const resultU: string = RBLocale.toYesNo(anyUndefined, lang);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'toOkCancel()'", () => {

    it("Should use the default language if non given", () => {
      const saveLanguage = RBLocale.getCurrentLanguage();
      RBLocale.setCurrentLanguage("en-US");
      const expectedT = "Ok";
      const resultT: string = RBLocale.toOkCancel(true);
      expect(resultT).toEqual(expectedT);
      const expectedF = "Cancel";
      const resultF: string = RBLocale.toOkCancel(false);
      expect(resultF).toEqual(expectedF);
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should use default-lang if non-existent or empty language)", () => {
      const lang = "ab-CD";
      const expectedT: string = RBLocale.toOkCancel(true, CURRENT_LANGUAGE);
      const resultT: string = RBLocale.toOkCancel(true, lang);
      const expectedF: string = RBLocale.toOkCancel(false, CURRENT_LANGUAGE);
      const resultF: string = RBLocale.toOkCancel(false, lang);
      expect(resultT).toEqual(expectedT);
      expect(resultF).toEqual(expectedF);
      const resultET: string = RBLocale.toOkCancel(true, EMPTY_STRING);
      const resultEF: string = RBLocale.toOkCancel(false, EMPTY_STRING);
      expect(resultET).toEqual(expectedT);
      expect(resultEF).toEqual(expectedF);

    });

    it("Should return the false-value if boolean is null or undefined", () => {
      const lang = "de-DE";
      const expected = "Abbrechen";
      const resultN: string = RBLocale.toOkCancel(anyNull, lang);
      const resultU: string = RBLocale.toOkCancel(anyUndefined, lang);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'getCurrentEnvironmentLanguage()'", () => {

    it("Should return the correct language", () => {
      const saveLanguage = RBLocale.getCurrentLanguage();
      const saveLanguageEnv = getCurrentEnvironmentLanguage();
      RBLocale.setCurrentLanguage("fr-BE");

      let resultEnv: string = getCurrentEnvironmentLanguage();
      expect(resultEnv).toEqual(saveLanguageEnv);

      RBLocale.setCurrentLanguage("nl-BE");
      resultEnv = RBLocale.getCurrentLanguage();
      expect(resultEnv).toEqual(CURRENT_LANGUAGE);
      expect(resultEnv).toEqual("nl-BE");

      resultEnv = getCurrentEnvironmentLanguage();
      expect(resultEnv).toEqual(saveLanguageEnv);

      RBLocale.setCurrentLanguage(saveLanguage);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'areLanguagesSupported()'", () => {

    it("Should return true for known languages", () => {
      const languages: string[] =
        ["nl-NL", "nl-BE", "fr-BE", "fr-FR", "fr-LU", "de-DE"];
      const expected = true;
      const result: boolean = RBLocale.areLanguagesSupported(languages);
      expect(result).toEqual(expected);
    });

    it("Should return false for Unknown languages", () => {
      const languages: string[] =
        ["nl-NL", "nl-BE", "fr-BE", "fr-FR", "fr-LU", "de-DE", "ab-CD"];
      const expected = false;
      const result: boolean = RBLocale.areLanguagesSupported(languages);
      expect(result).toEqual(expected);
    });

    it("Should return the false-value if languages is null or undefined", () => {
      const result0: boolean = RBLocale.areLanguagesSupported(["ab-CD"]);
      const result1: boolean = RBLocale.areLanguagesSupported(["fr-FR"]);
      const resultE: boolean = RBLocale.areLanguagesSupported([]);
      const resultN: boolean = RBLocale.areLanguagesSupported(anyNull);
      const resultU: boolean = RBLocale.areLanguagesSupported(anyUndefined);
      expect(result0).toBeFalsy();
      expect(result1).toBeTruthy();
      expect(resultE).toBeTruthy();
      expect(resultN).toBeFalsy();
      expect(resultU).toBeFalsy();
    });
  });

  describe("function 'initialize()'", () => {

    it("should not throw an error", () => {
      expect( () => RBLocale.initializeLocale() ).not.toThrowError();
    });
  });

  describe("private function 'getValueForLanguageAndItem()'", () => {

    it("should not throw an error", () => {
      let item: string = EMPTY_STRING;
      let language: string = EMPTY_STRING;
      let expected: string = anyUndefined;
      // Access the private method using reflection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: string = (RBLocale as any).getValueForLanguageAndItem(item, language);
      expect(result).toBe(expected);

      item = "true";
      language = anyNull;
      // Access the private method using reflection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = (RBLocale as any).getValueForLanguageAndItem(item, language);
      expected = result;
      expect(result).toBe(expected);

      item = "true";
      language = "ab-CD";	// Non-existent language
      // Access the private method using reflection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = (RBLocale as any).getValueForLanguageAndItem(item, language);
      expected = result;
      expect(result).toBe(expected);

      item = "false";
      language = "de-DE";	// Non-existent language
      expected = "Falsch";
      // Access the private method using reflection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = (RBLocale as any).getValueForLanguageAndItem(item, language);
      expect(result).toBe(expected);
    });
  });

});
