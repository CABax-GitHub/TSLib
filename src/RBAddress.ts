import { EMPTY_STRING, NEWLINE, SPACE } from "./RBConstants";
import { CURRENT_LANGUAGE } from "./RBLocale";

/**
 * Class RBAddress to handle various address functions
 *
 * 2024-09-26:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Interface Address to define the address properties.
 */
export interface Address {
  streetName: string;
  addressNumber: string;
  city: string;
  zipCode: string; // Optional with default value
  country: string; // Optional with default value
}

/**
 * Class RBAddress to handle various person functions.
 */
export class RBAddress {
  private _address: Address;
  private _multiLine = false;
  private _language: string = CURRENT_LANGUAGE;

  constructor(address: Address, language: string) {
    this.language = language;
    this._address = address;
    this._address.streetName = address.streetName.trim() || EMPTY_STRING;
    this._address.addressNumber = address.addressNumber.trim() || EMPTY_STRING;
    this._address.city = address.city.trim() || EMPTY_STRING;
    this._address.zipCode = address.zipCode.trim() || EMPTY_STRING;
    this._address.country = address.country.trim() || EMPTY_STRING;
  }

  public static readonly AddressLayout: Record<string, string> = {
    "en-US": "@addressNumber @street, @city_ @zipCode, @Country",
    "nl-NL": "@street @addressNumber, @zipCode  @city, @Country",
    "nl-BE": "@street @addressNumber, @zipCode @city, @Country",
    "fr-BE": "@street @addressNumber, @zipCode @city, @Country",
    "fr-FR": "@street @addressNumber, @zipCode @city, @Country",
    "fr-LU": "@street @addressNumber, @zipCode @city, @Country",
    "de-DE": "@street @addressNumber, @zipCode @city, @Country",
  } as const;

  public static readonly zipCodeMask: Record<string, RegExp> = {
    "en-US": (/^\d{5}(?:[-\s]\d{4})?$/), // 01234 or 01234-5678 or 01234 5678
    "nl-NL": (/^\d{4}\s?[a-zA-Z]{2}$/), // 1234 AB or 1234AB
    "nl-BE": (/^\d{4}$/), // 1234
    "fr-BE": (/^\d{4}$/), // 1234
    "fr-FR": (/^\d{5}$/), // 12345
    "fr-LU": (/^\d{4}$/), // 1234
    "de-DE": (/^\d{5}$/), // 12345
  } as const;

  public static readonly countryNames: Record<string, string> = {
    "en-US": "United States of America",
    "nl-NL": "Nederland",
    "nl-BE": "België",
    "fr-BE": "Belgique",
    "fr-FR": "France",
    "fr-LU": "Luxembourg",
    "de-DE": "Deutschland",
  } as const;

  get streetName(): string {
    return this._address.streetName;
  }
  set streetName(value: string) {
    this._address.streetName = value.trim();
  }
  get addressNumber(): string {
    return this._address.addressNumber;
  }
  set addressNumber(value: string) {
    this._address.addressNumber = value.trim();
  }
  get city(): string {
    return this._address.city;
  }
  set city(value: string) {
    this._address.city = value.trim();
  }
  get zipCode(): string {
    return this._address.zipCode ? this._address.zipCode : EMPTY_STRING;
  }
  set zipCode(value: string) {
    this._address.zipCode =
      RBAddress.checkZipCode(value.trim(), RBAddress.zipCodeMask[this._language]);
  }
  get country(): string {
    return this._address.country ? this._address.country : EMPTY_STRING;
  }
  set country(value: string) {
    if (value.trim() !== EMPTY_STRING) {
      this._address.country = EMPTY_STRING;
      const entry = RBAddress.findLanguageForCountry(value.trim());
      if (!entry) {
        throw new Error(`Country '${value}' not supported`);
      }
    }
    this._address.country = value.trim();
  }
  get multiLine(): boolean {
    return this._multiLine;
  }
  set multiLine(value: boolean) {
    this._multiLine = value;
  }
  get language(): string {
    return this._language;
  }
  set language(value: string) {
    if (!RBAddress.countryNames[value]) {
      throw new Error(`Language '${value}' not supported`);
    }
    this._language = value;
  }
  get fullAddress(): string {
    return RBAddress.makeFullAddress(this._address, this._multiLine, this._language);
  }

  /**
   * Returns a full address based on the input parameters
   * for the language specified.
   */
  public static makeFullAddress(
    address: Address, multiLine?: boolean, language: string = CURRENT_LANGUAGE): string{
    if (!address.streetName || !address.addressNumber || !address.city) {
      throw new Error("Street, address-number and city are mandatory fields");
    }
    const myLanguage = language;
    this.checkZipCode(address.zipCode, RBAddress.zipCodeMask[myLanguage]);
    const addressLayout = RBAddress.AddressLayout[myLanguage];
    // Replace the placeholders with the actual values
    let fullAddress = addressLayout;
    if (address.country === EMPTY_STRING) {
      fullAddress = fullAddress.replace(", @Country", EMPTY_STRING);
    }
    if (address.zipCode === EMPTY_STRING) {
      fullAddress = fullAddress.replace("@zipCode  ", EMPTY_STRING);
      fullAddress = fullAddress.replace(" @zipCode", EMPTY_STRING);
    }
    fullAddress = fullAddress.
      replace("@street", address.streetName).
      replace("@addressNumber", address.addressNumber).
      replace("@city", address.city).
      replace("@zipCode", address.zipCode ? address.zipCode : EMPTY_STRING).
      replace("@Country", address.country ? address.country : EMPTY_STRING);
    if (multiLine) {
      fullAddress = fullAddress.replace((/,/g), NEWLINE);
      fullAddress = fullAddress.split(NEWLINE).map((line) => line.trim()).join(NEWLINE);
    }
    fullAddress = fullAddress.replace((/_/g), ",");
    return fullAddress;
  }

  // ----------------------------------------------------------------------------

  private static findLanguageForCountry(country: string): string {
    const entry = Object.entries(RBAddress.countryNames).find(
      ([, value]) => value === country,
    );
    if (entry) {
      return entry[0];
    }
    return EMPTY_STRING;
  }

  private static checkZipCode(zipCode: string, mask: RegExp): string {
    if (zipCode === EMPTY_STRING) {
      return EMPTY_STRING;
    }
    let tryZipCode = zipCode;
    // Try to add a space to the zip code at the correct position if one is missing
    const lengths = RBAddress.getMatchingStringLength(mask);
    if (lengths.exactLength === zipCode.length + 1 && lengths.spacePos !== 0) {
      tryZipCode =
        `${zipCode.slice(0, lengths.spacePos)}${SPACE}${zipCode.slice(lengths.spacePos)}`;
    }
    if (!mask.test(tryZipCode)) {
      throw new Error(`Zip code '${tryZipCode}' is not valid`);
    }
    return tryZipCode;
  }

  private static getMatchingStringLength(regExp: RegExp):
  { exactLength: number, spacePos: number } {
    const pattern = regExp.source;
    let exactLength = 0;
    let spacePos = 0;
    const digitMatch = pattern.match(/\\d\{(\d*)\}/); // Match exact digits
    if (digitMatch) {
      const count = parseInt(digitMatch[1], 10);
      exactLength += count;
    }
    const spaceMatch = pattern.match(/\\s\?/); // Match optional spaces
    if (spaceMatch) {
      spacePos = exactLength;
      exactLength += 1; // Increment length by 1 for the optional space
    }
    const letterMatch = pattern.match(/\[a-zA-Z\]\{(\d*)\}/); // Match exact letters
    if (letterMatch) {
      const count = parseInt(letterMatch[1], 10);
      exactLength += count;
    }

    // Console.log("regExp.source: ", regExp.source);
    // Console.log("exactLength: ", exactLength);
    // Console.log("spacePos: ", spacePos);
    return { exactLength: exactLength, spacePos: spacePos };
  }

}
