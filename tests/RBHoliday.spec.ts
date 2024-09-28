import { EMPTY_STRING, NEWLINE } from "../src/RBConstants";
import { RBHoliday, HolidayData } from "../src/RBHoliday";
import { RBLocale, CURRENT_LANGUAGE } from "../src/RBLocale";
import { RBDate } from "../src/RBDate";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class RBHoliday to handle various generic functions.
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
describe("[Holidays]", () => {
  let holidays = new RBHoliday;
  const todaysYear = new Date().getFullYear();
  const year2024 = 2024;
  const easter2024: Date = new Date("2024-03-31 00:00:00");
  const christmas2024: Date = new Date("2024-12-26");
  const christmas2024Name = "2e Kerstdag";
  const dayAfterChristmas2024: Date = new Date("2024-12-27");
  const easter2025: Date = new Date("2025-04-20 00:00:00");
  const easterThisYear: Date = new Date("2024-03-31 00:00:00");
  const yearTooSmall = -1;
  const yearTooBig = 10_000;
  const minimumLength = 100;
  const nlHolidays = 14;
  const nlActiveHolidays = 10;

  beforeAll(() => {
    holidays = new RBHoliday();
  });

  describe("constructor 'constructor'", () => {

    it("should throw an error if not all languages in RBHolidays.ts match RBLocale.ts", () => {
      expect(() => new RBHoliday()).toBeDefined();
      spyOn(RBLocale, "areLanguagesSupported").and.returnValue(false);
      // Example known languages
      spyOn(RBLocale, "knownLanguages").and.returnValue(["en", "fr", "de"]);
      expect(() => new RBHoliday()).toThrowError(
        "Check if all languages in RBHolidays.ts are also defined in RBLocale.ts " +
          "(SupportedLanguages).",
      );
    });

    it("should initialize all holidays", () => {
      expect(holidays.allHolidays[0].languageName).toBe("en-US");
      const allHolidayCount = holidays.totalHolidayRecords;
      expect(holidays.allHolidays.length).toBe(allHolidayCount);
    });

  });

  // ----------------------------------------------------------------------------

  describe("property 'language()'", () => {

    it("should get/set the default language", () => {
      holidays.language = "nl-NL";
      expect(holidays.language).toEqual("nl-NL");
      holidays.language = EMPTY_STRING;
      expect(holidays.language).toEqual(CURRENT_LANGUAGE);
      holidays.language = "en-US";
      expect(holidays.language).toEqual("en-US");
      holidays.language = CURRENT_LANGUAGE;
      expect(holidays.language).toEqual(CURRENT_LANGUAGE);
    });

  });

  // ----------------------------------------------------------------------------

  describe("property 'sizeHolidayName()'", () => {

    it("should return the a realistic number", () => {
      expect(holidays.sizeHolidayName).toBeGreaterThan(10);
    });

  });

  // ----------------------------------------------------------------------------

  describe("property 'allHolidays()'", () => {

    it("should contain the correct number of items", () => {
      const knownLanguagesCount = RBLocale.knownLanguages().length;
      const allHolidayCount = holidays.totalHolidayRecords;
      const averageHolidayCount = allHolidayCount / knownLanguagesCount;
      expect(averageHolidayCount).toBeGreaterThan(10);
      expect(averageHolidayCount).toBeLessThan(20);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'getHolidaysForYearAsString()'", () => {

    it("should return a non-null string for 2024 nl-NL and en-US", () => {
      const expected: string =
        "2024 nl-NL 1e Paasdag Zondag 31-03-2024" + NEWLINE +
        "2024 nl-NL 2e Paasdag Maandag 01-04-2024" + NEWLINE +
        "2024 nl-NL Hemelvaart Donderdag 09-05-2024" + NEWLINE +
        "2024 nl-NL 1e Pinksterdag Zondag 19-05-2024" + NEWLINE +
        "2024 nl-NL 2e Pinksterdag Maandag 20-05-2024" + NEWLINE +
        "2024 nl-NL Nieuwjaar Maandag 01-01-2024" + NEWLINE +
        "2024 nl-NL Koningsdag Zaterdag 27-04-2024" + NEWLINE +
        "2024 nl-NL 1e Kerstdag Woensdag 25-12-2024" + NEWLINE +
        "2024 nl-NL 2e Kerstdag Donderdag 26-12-2024" + NEWLINE;
      const resultUS: string = holidays.getHolidaysForYearAsString(todaysYear, "en-US");
      const resultNL: string = holidays.getHolidaysForYearAsString(todaysYear, "nl-NL");
      expect(resultUS.length).toBeGreaterThan(minimumLength);
      expect(resultNL.length).toBeGreaterThan(minimumLength);
      expect(resultNL).toBe(expected);
    });

    it("should return empty-string if year is null or undefined", () => {
      const language: string = CURRENT_LANGUAGE;
      const resultN = holidays.getHolidaysForYearAsString(anyNull, language);
      const resultU = holidays.getHolidaysForYearAsString(anyUndefined, language);
      expect(resultN).toBe(EMPTY_STRING);
      expect(resultU).toBe(EMPTY_STRING);
    });

    it("should use todays date if year < 0 or > 9999", () => {
      const expected = holidays.getHolidaysForYearAsString(todaysYear, CURRENT_LANGUAGE);
      const resultN = holidays.getHolidaysForYearAsString(yearTooSmall, CURRENT_LANGUAGE);
      const resultU = holidays.getHolidaysForYearAsString(yearTooBig, CURRENT_LANGUAGE);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
      expect(resultN.length).toEqual(expected.length);
      expect(resultU.length).toEqual(expected.length);
      expect(resultN.length).toBeGreaterThan(0);
      expect(resultU.length).toBeGreaterThan(0);
    });

    it("should use current-language if language is unsupported or empty", () => {
      const language = "unsupported-lang";
      const expected: string =
        holidays.getHolidaysForYearAsString(todaysYear, CURRENT_LANGUAGE);
      const result =
        holidays.getHolidaysForYearAsString(todaysYear, language);
      expect(result).toEqual(expected);
    });

    it("should return exactly the right list and number of holidays", () => {
      const language = "nl-NL";
      const holidaysCountTotal = holidays.holidayCount(language, false);
      expect(holidaysCountTotal).toBe(nlHolidays);
      const holidaysCount = holidays.holidayCount(language);
      expect(holidaysCount).toBe(nlActiveHolidays);
      const expected: string =
        holidays.getHolidaysForYearAsString(todaysYear, "nl-NL");
      const result =
        holidays.getHolidaysForYearAsString(todaysYear, "nl-NL");
      expect(result).toEqual(expected);
      expect(result.split(NEWLINE).length).toEqual(holidaysCount);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'isHoliday()'", () => {

    it("should return true for 26-12-2024 nl-NL", () => {
      const value: Date = christmas2024;
      const language = "nl-NL";
      const result: boolean = holidays.isHoliday(value, language);
      expect(result).toBeTruthy();
    });

    it("should take into account holiday.onlyActiveIfYearModX", () => {
      const language = "nl-NL";
      const valueTrue: Date = new Date("2020-05-05");
      const result: boolean = holidays.isHoliday(valueTrue, language);
      expect(result).toBeTruthy();
      const valueFalse: Date = new Date("2021-05-05");
      const resultFalse: boolean = holidays.isHoliday(valueFalse, language);
      expect(resultFalse).toBeFalsy();
    });

    it("should return false for 27-12-2024 nl-NL", () => {
      const value: Date = dayAfterChristmas2024;
      const language = "nl-NL";
      const result: boolean = holidays.isHoliday(value, language);
      expect(result).toBeFalsy();
    });

    it("should return false for Date is null or undefined", () => {
      const language: string = CURRENT_LANGUAGE;
      const resultNull: boolean = holidays.isHoliday(anyNull, language);
      const resultUndefined: boolean = holidays.isHoliday(anyUndefined, language);
      expect(resultNull).toBeFalsy();
      expect(resultUndefined).toBeFalsy();
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getHolidayName()'", () => {

    it("should return '2e Kerstdag' for 26-12-2024 nl-NL", () => {
      const value: Date = christmas2024;
      const language = "nl-NL";
      const expected: string = christmas2024Name;
      const result: string = holidays.holidayName(value, language);
      expect(result).toEqual(expected);
    });

    it("should return EmptyString for 27-12-2024 nl-NL", () => {
      const value: Date = dayAfterChristmas2024;
      const language = "nl-NL";
      const expected: string = EMPTY_STRING;
      const result: string = holidays.holidayName(value, language);
      expect(result).toEqual(expected);
    });

    it("should return EmptyString for Date is null or undefined", () => {
      const language: string = CURRENT_LANGUAGE;
      const expected: string = EMPTY_STRING;
      const resultNull: string = holidays.holidayName(anyNull, language);
      const resultUndefined: string = holidays.holidayName(anyUndefined, language);
      expect(resultNull).toEqual(expected);
      expect(resultUndefined).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'easterSunday()'", () => {

    it("should return '31-03-2024' for 2024", () => {
      let result: Date = holidays.easterSunday(year2024);
      expect(result).toEqual(easter2024);
      // And use cashed value now
      result = holidays.easterSunday(year2024);
      expect(result).toEqual(easter2024);
    });

    it("should handle invalid or negative year input gracefully", () => {
      const result: Date = holidays.easterSunday(yearTooSmall);
      expect(result).toBeInstanceOf(Date); // Ensure a Date is returned for invalid input
    });

    it("should handle null or undefined year inputs by returning default value", () => {
      const expected: Date = easter2024;
      const resultNull: Date = holidays.easterSunday(anyNull);
      const resultUndefined: Date = holidays.easterSunday(anyUndefined);
      expect(resultNull).toEqual(expected);
      expect(resultUndefined).toEqual(expected);
    });

    it("should handle boundary years (e.g., 0, 10000, leap years)", () => {
      const expected: Date = holidays.easterSunday(easter2024.getFullYear());
      const resultZeroYear: Date = holidays.easterSunday(0);
      const resultLargeYear: Date = holidays.easterSunday(10_000);
      const resultLeapYear: Date = holidays.easterSunday(2000);
      expect(RBDate.compareDates(resultZeroYear, expected)).toBeTruthy();
      expect(RBDate.compareDates(resultLargeYear, expected)).toBeTruthy();
      expect(resultLeapYear).toBeInstanceOf(Date);
    });

    it("should return '31-03-2024' for 2024", () => {
      const expected: Date = easter2024;
      const result: Date = holidays.easterSunday(year2024);
      expect(result).toEqual(expected);
    });

    it("should return '20-04-2025' for 2025", () => {
      const value: number = easter2025.getFullYear();
      const expected: Date = easter2025;
      const result: Date = holidays.easterSunday(value);
      expect(result).toEqual(expected);
    });

    it("should return '31-03-2024' for wrongYear", () => {
      const value: number = yearTooSmall;
      const expected: Date = easterThisYear;
      const result: Date = holidays.easterSunday(value);
      expect(result).toEqual(expected);
    });

    it("should return '31-03-2024' for Year is null or undefined", () => {
      const expected: Date = new Date("2024-03-31 00:00:00");
      const resultNull: Date = holidays.easterSunday(anyNull);
      const resultUndefined: Date = holidays.easterSunday(anyUndefined);
      expect(resultNull).toEqual(expected);
      expect(resultUndefined).toEqual(expected);
    });

  });

});

// ------------------------------------------------------------------------------

describe("[HolidayData]", () => {

  describe("constructor 'constructor'", () => {

    it("should create a HolidayData", () => {
      const holiday = new HolidayData();
      expect(holiday).toBeDefined();
    });

    it("should set and get the properties where possible", () => {
      const holiday = new HolidayData();
      holiday.absoluteDay = 17;
      holiday.absoluteMonth = 9;
      expect(holiday.languageName).toBe(CURRENT_LANGUAGE);
      expect(holiday.active).toBeFalsy();
      expect(holiday.holidayName).toBe(EMPTY_STRING);
      expect(holiday.daysRelativeToEastern).toBe(0);
      expect(holiday.absoluteDay).toBe(17);
      expect(holiday.absoluteMonth).toBe(9);
      expect(holiday.corrIfOnAMonday).toBe(0);
      expect(holiday.corrIfOnATuesday).toBe(0);
      expect(holiday.corrIfOnAWednesday).toBe(0);
      expect(holiday.corrIfOnAThursday).toBe(0);
      expect(holiday.corrIfOnAFriday).toBe(0);
      expect(holiday.corrIfOnASaturday).toBe(0);
      expect(holiday.corrIfOnASunday).toBe(0);
      expect(holiday.onlyActiveIfYearModX).toBe(0);
    });

    it("should throw an error if not all languages in RBHolidays.ts match RBLocale.ts", () => {
      expect(() => new HolidayData()).toBeDefined();
      spyOn(RBLocale, "areLanguagesSupported").and.returnValue(false);
      // Example known languages
      spyOn(RBLocale, "knownLanguages").and.returnValue(["en", "fr", "de"]);
      expect(() => new RBHoliday()).toThrowError(
        "Check if all languages in RBHolidays.ts are also defined in RBLocale.ts " +
          "(SupportedLanguages).",
      );
    });

  });

});

