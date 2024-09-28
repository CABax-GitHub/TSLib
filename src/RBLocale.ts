import { RBEnum } from "./RBEnum";
import { RBLocalStorage } from "./RBLocalStorage";
import { getCurrentNodeLanguage } from "./lib/NodeLanguage"; // (fallback if outside browser)
import { getCurrentBrowserLanguage } from "./lib/BrowserLanguage"; // Running inside browser
import { IS_IN_BROWSER } from "./RBConstants";

// To prevent circular reference from/to Constants.ts
const EMPTY_STRING = "" as const;

export const DEFAULT_LANGUAGE: string = "nl-NL" as const;
export let CURRENT_LANGUAGE: string = DEFAULT_LANGUAGE;

export function getCurrentEnvironmentLanguage(): string {
  return IS_IN_BROWSER ? getCurrentBrowserLanguage(DEFAULT_LANGUAGE)
    : getCurrentNodeLanguage(DEFAULT_LANGUAGE);
}

/**
 * Class RBLocale to handle various international/local functions.
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Class RBLocale to handle various international/local functions.
 */
export class RBLocale {

  public static readonly SupportedLanguages: Record<string, string> = {
    "en-US": "United States",
    "nl-NL": "Nederlands",
    "nl-BE": "Vlaams",
    "fr-BE": "Wallon",
    "fr-FR": "Français (FR)",
    "fr-LU": "Français (LU)",
    "de-DE": "Deutsch",
  } as const;

  public static readonly DialogButtonStrings = {
    /* eslint-disable @stylistic/object-curly-spacing */
    /* eslint-disable @stylistic/comma-spacing */
    /* eslint-disable no-multi-spaces */
    "en-US": {true: "True", false: "False" , yes: "Yes", no: "No"  , ok: "Ok", cancel: "Cancel"   },
    "nl-NL": {true: "Waar", false: "Onwaar", yes: "Ja" , no: "Nee" , ok: "Ok", cancel: "Annuleer" },
    "nl-BE": {true: "Waar", false: "Onwaar", yes: "Ja" , no: "Nee" , ok: "Ok", cancel: "Annuleer" },
    "fr-BE": {true: "Vrai", false: "Faux"  , yes: "Oui", no: "Non" , ok: "Ok", cancel: "Annule"   },
    "fr-FR": {true: "Vrai", false: "Faux"  , yes: "Oui", no: "Non" , ok: "Ok", cancel: "Annule"   },
    "fr-LU": {true: "Vrai", false: "Faux"  , yes: "Oui", no: "Non" , ok: "Ok", cancel: "Annule"   },
    "de-DE": {true: "Wahr", false: "Falsch", yes: "Ja" , no: "Nein", ok: "Ok", cancel: "Abbrechen"},
    /* eslint-enable no-multi-spaces */
    /* eslint-enable @stylistic/comma-spacing */
    /* eslint-enable @stylistic/object-curly-spacing */
  } as const;

  /**
   * Return an array of all known languages
   */
  public static knownLanguages(): string[] {
    return Object.keys(this.SupportedLanguages);
  }

  /**
   * Return the language to use, if language is defined in RBLocale.SupportedLanguages.
   * If no language or an unsupported language is given,
   * or if the language is not in RBLocale.SupportedLanguages,
   * CURRENT_LANGUAGE is used.
   */
  public static getCurrentLanguage(): string {
    let language: string = getCurrentEnvironmentLanguage();
    const clientStorageKey = "CurrentLanguage";
    const storedLanguage = RBLocalStorage.getValue(clientStorageKey, EMPTY_STRING);
    language = storedLanguage || language;
    language =
      RBEnum.isInEnum(language, RBLocale.SupportedLanguages) ? language : DEFAULT_LANGUAGE;
    // Stryker disable next-line all
    if (language !== storedLanguage) {
      this.setCurrentLanguage(language);
    }
    return language;
  }

  /**
   * Set the language to use, and set CURRENT_LANGUAGE as well.
   * if language is not defined in RBLocale.SupportedLanguages,
   * CURRENT_LANGUAGE is used.
   */
  public static setCurrentLanguage(value: string): void {
    const clientStorageKey = "CurrentLanguage";
    CURRENT_LANGUAGE = this.isLanguageAValidKey(value) ? value : CURRENT_LANGUAGE;
    RBLocalStorage.setValue(clientStorageKey, CURRENT_LANGUAGE);
  }

  /**
   * Return the current culture i.e. the first 2 characters of the current language.
   */
  public static getCurrentCulture(): string {
    return CURRENT_LANGUAGE.substring(0, 2);
  }

  /**
   * Return the value as string of 'True' or 'False' in the given language.
   * If the language is not supported, the default language is used.
   */
  public static toTrueFalse(value: boolean, language: string = EMPTY_STRING): string {
    return this.getValueForLanguageAndItem(value ? "true" : "false", language);
  }

  /**
   * Return the value as string of 'Yes' or 'No' in the given language.
   * If the language is not supported, the default language is used.
   */
  public static toYesNo(value: boolean, language: string = EMPTY_STRING): string {
    return this.getValueForLanguageAndItem(value ? "yes" : "no", language);
  }

  /**
   * Return the value as string of 'Ok' or 'Cancel' in the given language.
   * If the language is not supported, the default language is used.
   */
  public static toOkCancel(value: boolean, language: string = EMPTY_STRING): string {
    return this.getValueForLanguageAndItem(value ? "ok" : "cancel", language);
  }

  /**
   * Method to check if all provided languages are supported
   */
  public static areLanguagesSupported(languages: string[]): boolean {
    if (languages) {
      return languages.every((language) => this.isLanguageAValidKey(language));
    }
    return false ;
  }

  // ----------------------------------------------------------------------------

  private static getValueForLanguageAndItem(
    item: string, language: string = CURRENT_LANGUAGE): string {
    let myLanguage = language;
    if (!language || !this.isLanguageAValidKey(language)) {
      myLanguage = CURRENT_LANGUAGE;
    }
    const languageKey = myLanguage as keyof typeof this.DialogButtonStrings;
    const itemKey = item as keyof typeof this.DialogButtonStrings[typeof languageKey];
    return this.DialogButtonStrings[languageKey][itemKey];
  }

  private static isLanguageAValidKey(language: string = CURRENT_LANGUAGE): boolean {
    return this.LanguageKeys.includes(language as keyof typeof this.DialogButtonStrings);
  }

  // Stryker disable all
  private static readonly LanguageKeys =
    Object.keys(RBLocale.DialogButtonStrings) as (keyof typeof RBLocale.DialogButtonStrings)[];

  // Private method to validate that SupportedLanguages and dialogButtonStrings have the same keys
  private static validateLanguageKeys(): void {
    const supportedLanguagesKeys: string[] = Object.keys(this.SupportedLanguages);
    const dialogButtonStringsKeys: string[] = Object.keys(this.DialogButtonStrings);

    const missingInSupported: string[] = dialogButtonStringsKeys.filter(
      (key) => !supportedLanguagesKeys.includes(key),
    );
    const missingInDialogStrings: string[] = supportedLanguagesKeys.filter(
      (key) => !dialogButtonStringsKeys.includes(key),
    );

    if (missingInSupported.length > 0 || missingInDialogStrings.length > 0) {
      throw new Error(
        "Mismatch between SupportedLanguages and dialogButtonStrings keys in RBLocale. " +
        `Missing in SupportedLanguages: ${missingInSupported.join(", ")}. ` +
        `Missing in dialogButtonStrings: ${missingInDialogStrings.join(", ")}.`,
      );
    }
  }

  // Call to validate keys during class initialization
  public static initializeLocale(): void {
    this.validateLanguageKeys();
  }
  // Stryker restore all

}
