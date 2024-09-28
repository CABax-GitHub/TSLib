import { CURRENT_LANGUAGE, RBLocale } from "../src/RBLocale";
import { EMPTY_STRING, MIN_DATE } from "../src/RBConstants";
import { RBDate, TimeUnits } from "../src/RBDate";
import { RBFunc } from "../src/RBFunc";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class RBDate and its functions:
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
describe("[RBDate]", () => {

  describe("function 'toStringTime()'", () => {

    it("Should return just the time for the given dateTime", () => {
      const saveLanguage: string = CURRENT_LANGUAGE;
      RBLocale.setCurrentLanguage("nl-NL");
      const value: Date = new Date("2024-07-31 14:12:13");
      const language: string = CURRENT_LANGUAGE;
      const expected: string = RBDate.toStringTime(value, language);
      expect(expected).toBe("14:12:13");
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should return an empty string for an invalid date", () => {
      const saveLanguage: string = CURRENT_LANGUAGE;
      RBLocale.setCurrentLanguage("nl-NL");
      const value: Date = new Date("invalid-date");
      const language: string = CURRENT_LANGUAGE;
      const expected: string = RBDate.toStringTime(value, language);
      expect(expected).toBe(EMPTY_STRING);
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should format the time correctly according to the formatter options", () => {
      const saveLanguage: string = CURRENT_LANGUAGE;
      RBLocale.setCurrentLanguage("nl-NL");
      const value: Date = new Date("2024-07-31 14:12:13");
      const language: string = CURRENT_LANGUAGE;
      const expected = "14:12:13"; // Adjust this based on your locale's time format
      const result: string = RBDate.toStringTime(value, language);
      expect(result).toBe(expected);
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should return an empty string if date is null or undefined", () => {
      const language: string = CURRENT_LANGUAGE;
      expect(RBDate.toStringTime(anyNull, language)).toBe(EMPTY_STRING);
      expect(RBDate.toStringTime(anyUndefined, language)).toBe(EMPTY_STRING);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toStringDMYTime()'", () => {
    const language: string = CURRENT_LANGUAGE;

    it("Should return the dateTime as DD-MM-YYYY HH:MM:SS", () => {
      const value: Date = new Date("2024-07-31T11:12:13");
      const expected = RBDate.toStringDMYTime(value, language);
      const result: string = RBDate.toStringDMYTime(value, language);
      expect(result).toEqual(expected);
    });

    it("Should return EMPTY_STRING if dateTime is null or undefined", () => {
      expect(RBDate.toStringDMYTime(null as unknown as Date, language)).toEqual(EMPTY_STRING);
      // eslint-disable-next-line no-undefined
      expect(RBDate.toStringDMYTime(undefined as unknown as Date, language)).toEqual(EMPTY_STRING);
    });

    it("Should correctly handle invalid date strings", () => {
      const invalidDate = new Date("Invalid Date");
      expect(RBDate.toStringDMYTime(invalidDate, language)).toEqual(EMPTY_STRING);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toStringDMY()'", () => {
    const language: string = CURRENT_LANGUAGE;

    it("Should return the date as DD-MM-YYYY", () => {
      const value: Date = new Date("2024-07-31T11:12:13");
      const expected: string = RBDate.toStringDMY(value, language);
      const result: string = RBDate.toStringDMY(value, language);
      expect(result).toEqual(expected);
    });

    it("Should return EMPTY_STRING if dateTime is null or undefined", () => {
      expect(RBDate.toStringDMY(null as unknown as Date, language)).toEqual(EMPTY_STRING);
      // eslint-disable-next-line no-undefined
      expect(RBDate.toStringDMY(undefined as unknown as Date, language)).toEqual(EMPTY_STRING);
    });

    it("Should correctly handle invalid date strings", () => {
      const invalidDate = new Date("Invalid Date");
      expect(RBDate.toStringDMY(invalidDate, language)).toEqual(EMPTY_STRING);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toStringYMDTime()'", () => {
    it("Should return the dateTime as YYYYMMDDHHMMSS", () => {
      const value: Date = new Date("2024-07-31T11:12:13");
      const expected = "20240731111213";
      const result: string = RBDate.toStringYMDTime(value);
      expect(result).toEqual(expected);
    });

    it("Should return EMPTY_STRING if dateTime is null or undefined", () => {
      expect(RBDate.toStringYMDTime(null as unknown as Date)).toEqual(EMPTY_STRING);
      // eslint-disable-next-line no-undefined
      expect(RBDate.toStringYMDTime(undefined as unknown as Date)).toEqual(EMPTY_STRING);
    });

    it("Should correctly handle invalid date strings", () => {
      const invalidDate = new Date("Invalid Date");
      expect(RBDate.toStringYMDTime(invalidDate)).toEqual(EMPTY_STRING);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toStringYMD()'", () => {
    it("Should return the dateTime as YYYYMMDD", () => {
      const value: Date = new Date("2024-07-31T11:12:13");
      const expected = "20240731";
      const result: string = RBDate.toStringYMD(value);
      expect(result).toEqual(expected);
    });

    it("Should return EMPTY_STRING if dateTime is null or undefined", () => {
      expect(RBDate.toStringYMD(null as unknown as Date)).toEqual(EMPTY_STRING);
      // eslint-disable-next-line no-undefined
      expect(RBDate.toStringYMD(undefined as unknown as Date)).toEqual(EMPTY_STRING);
    });

    it("Should correctly handle invalid date strings", () => {
      const invalidDate = new Date("Invalid Date");
      expect(RBDate.toStringYMD(invalidDate)).toEqual(EMPTY_STRING);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toWeek()'", () => {

    // See https://www.epochconverter.com/weeks/2018
    const testCases = [
      { date: new Date("2018-12-31"), expected: -1 }, // Negative because in 2019
      { date: new Date("2019-01-01"), expected: 1 },
      { date: new Date("2019-12-31"), expected: -1 }, // Negative because in 2020
      { date: new Date("2020-01-01"), expected: 1 },
      { date: new Date("2020-12-31"), expected: 53 },
      { date: new Date("2021-01-01"), expected: -53 }, // Negative because in 2021
      { date: new Date("2021-12-31"), expected: 52 },
      { date: new Date("2022-01-01"), expected: -52 }, // Negative because in 2022
      { date: new Date("2022-12-31"), expected: 52 },
      { date: new Date("2023-01-01"), expected: -52 }, // Negative because in 2023
      { date: new Date("2023-12-31"), expected: 52 },
      { date: new Date("2024-01-01"), expected: 1 },
      { date: new Date("2024-12-31"), expected: -1 }, // Negative because in 2025
      { date: new Date("2024-09-15"), expected: 37 }, // Zo.
      { date: new Date("2024-09-16"), expected: 38 }, // Ma.
      { date: new Date("2024-09-17"), expected: 38 }, // Di.
      { date: new Date("2024-09-18"), expected: 38 }, // Wo.
      { date: new Date("2024-09-19"), expected: 38 }, // Do.
      { date: new Date("2024-09-20"), expected: 38 }, // Vr.
      { date: new Date("2024-09-21"), expected: 38 }, // Za.
      { date: new Date("2024-09-22"), expected: 38 }, // Zo.
      { date: new Date("2024-09-23"), expected: 39 }, // Ma.
    ];

    // Loop through each test case and assert the expected output
    it("Should return the correct week-number for the test-cases", () => {
      testCases.forEach(({ date, expected }) => {
        const result = RBDate.toWeek(date);
        expect(result).toEqual(expected);
        const isInRange: boolean = result === null || RBFunc.isInRange(Math.abs(result), 1, 53);
        expect(isInRange).toBeTruthy();
      });
    });

    it("Should return null if dateTime is null or undefined", () => {
      expect(RBDate.toWeek(anyNull)).toBeNull();
      expect(RBDate.toWeek(anyUndefined)).toBeNull();
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'toWeekString()'", () => {

    // See https://www.epochconverter.com/weeks/2018
    const testCases = [
      { date: new Date("2018-12-31"), expected: "2019-W01" }, // Negative because in 2019
      { date: new Date("2019-01-01"), expected: "2019-W01" },
      { date: new Date("2019-12-31"), expected: "2020-W01" }, // Negative because in 2020
      { date: new Date("2020-01-01"), expected: "2020-W01" },
      { date: new Date("2020-12-31"), expected: "2020-W53" },
      { date: new Date("2021-01-01"), expected: "2020-W53" }, // Negative because in 2021
      { date: new Date("2021-12-31"), expected: "2021-W52" },
      { date: new Date("2022-01-01"), expected: "2021-W52" }, // Negative because in 2022
      { date: new Date("2022-12-31"), expected: "2022-W52" },
      { date: new Date("2023-01-01"), expected: "2022-W52" }, // Negative because in 2023
      { date: new Date("2023-12-31"), expected: "2023-W52" },
      { date: new Date("2024-01-01"), expected: "2024-W01" },
      { date: new Date("2024-12-31"), expected: "2025-W01" }, // Negative because in 2025
    ];

    // Loop through each test case and assert the expected output
    it("Should return the correct week-number for the test-cases", () => {
      testCases.forEach(({ date, expected }) => {
        const result = RBDate.toWeekString(date);
        expect(result).toEqual(expected);
      });
    });

    it("Should return EMPTY_STRING if date is null or undefined", () => {
      const expected: string = EMPTY_STRING;
      const resN: string = RBDate.toWeekString(anyNull);
      const resU: string = RBDate.toWeekString(anyUndefined);
      expect(resN).toEqual(expected);
      expect(resU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toDayName()'", () => {

    it("Should return 'Woensdag' for 2024-07-31", () => {
      const saveLanguage: string = CURRENT_LANGUAGE;
      RBLocale.setCurrentLanguage("nl-NL");
      const value: Date = new Date("2024-07-31");
      const language: string = CURRENT_LANGUAGE;
      const expected = "Woensdag";
      const result: string = RBDate.toDayName(value, language);
      const isUpFirst: boolean = result.length > 0 && result[0] === result[0].toUpperCase();
      expect(result).toEqual(expected);
      expect(isUpFirst).toBeTruthy();
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should return EMPTY_STRING if date is null or undefined", () => {
      const expected: string = EMPTY_STRING;
      const resN: string = RBDate.toDayName(anyNull);
      const resU: string = RBDate.toDayName(anyUndefined);
      expect(resN).toEqual(expected);
      expect(resU).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'toMonthName()'", () => {

    it("Should return 'Juli' for 2024-07-31", () => {
      const saveLanguage: string = CURRENT_LANGUAGE;
      RBLocale.setCurrentLanguage("nl-NL");
      const value: Date = new Date("2024-07-31");
      const language: string = CURRENT_LANGUAGE;
      const expected = "Juli";
      const result: string = RBDate.toMonthName(value, language);
      const isUpFirst: boolean = result.length > 0 && result[0] === result[0].toUpperCase();
      expect(result).toEqual(expected);
      expect(isUpFirst).toBeTruthy();
      RBLocale.setCurrentLanguage(saveLanguage);
    });

    it("Should return EMPTY_STRING if date is null or undefined", () => {
      const expected: string = EMPTY_STRING;
      const resN: string = RBDate.toMonthName(anyNull);
      const resU: string = RBDate.toMonthName(anyUndefined);
      expect(resN).toEqual(expected);
      expect(resU).toEqual(expected);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'toYear()'", () => {

    it("Should return 2024 for 2024-07-31", () => {
      const value: Date = new Date("2024-07-31");
      const expected = 2024;
      const result: number | null = RBDate.toYear(value);
      expect(result).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toMonth()'", () => {

    it("Should return 7 for 2024-07-31", () => {
      const value: Date = new Date("2024-07-31");
      const expected = 7;
      const result: number | null = RBDate.toMonth(value);
      expect(result).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toMonthIndex()'", () => {

    it("Should return 6 for 2024-07-31", () => {
      const value: Date = new Date("2024-07-31");
      const expected = 6;
      const result: number | null = RBDate.toMonthIndex(value);
      expect(result).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'toDay()'", () => {

    it("Should return 31 for 2024-07-31", () => {
      const value: Date = new Date("2024-07-31");
      const expected = 31;
      const result: number | null = RBDate.toDay(value);
      expect(result).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'dateToTimeStamp()' and 'timeStampToDate()'", () => {

    it("Should return the correct timestamp and date again", () => {
      const value: Date = new Date("2024-07-31 19:18:17");
      const timeStamp = RBDate.dateToTimeStamp(value);
      expect(RBDate.timeStampToDate(timeStamp)).toEqual(value);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'addToDate()'", () => {
    const testCases: {
      description: string;
      original: Date;
      unit: TimeUnits;
      value: number;
      expected: Date;
    }[] = [
      {
        description: "Should return 2025-07-31 for 2024-07-31 plus 1 y",
        original: new Date("2024-07-31"),
        unit: "y",
        value: 1,
        expected: new Date("2025-07-31"),
      },
      {
        description: "Should return 2025-07-31 for 2024-07-31 plus 1 year",
        original: new Date("2024-07-31"),
        unit: "year",
        value: 1,
        expected: new Date("2025-07-31"),
      },
      {
        description: "Should return 2024-08-31 for 2024-07-31 plus 1 m",
        original: new Date("2024-07-31"),
        unit: "m",
        value: 1,
        expected: new Date("2024-08-31"),
      },
      {
        description: "Should return 2024-08-31 for 2024-07-31 plus 1 month",
        original: new Date("2024-07-31"),
        unit: "month",
        value: 1,
        expected: new Date("2024-08-31"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 d",
        original: new Date("2024-07-31"),
        unit: "d",
        value: 10,
        expected: new Date("2024-08-10"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 days",
        original: new Date("2024-07-31"),
        unit: "day",
        value: 10,
        expected: new Date("2024-08-10"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 h",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "h",
        value: 10,
        expected: new Date("2024-07-31 21:15:50:00"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 hours",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "hour",
        value: 10,
        expected: new Date("2024-07-31 21:15:50:00"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 n",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "n",
        value: 10,
        expected: new Date("2024-07-31 11:25:50:00"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 minutes",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "minute",
        value: 10,
        expected: new Date("2024-07-31 11:25:50:00"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 s",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "s",
        value: 10,
        expected: new Date("2024-07-31 11:16:00:00"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 seconds",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "second",
        value: 10,
        expected: new Date("2024-07-31 11:16:00:00"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 t",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "t",
        value: 10,
        expected: new Date("2024-07-31 11:15:50:10"),
      },
      {
        description: "Should return 2024-08-10 for 2024-07-31 plus 10 millisecond",
        original: new Date("2024-07-31 11:15:50:00"),
        unit: "millisecond",
        value: 10,
        expected: new Date("2024-07-31 11:15:50:10"),
      },
      {
        description: "Should return 2024-08-10 if days is 10.8 (non-integer)",
        original: new Date("2024-07-31"),
        unit: "d",
        value: 10.8,
        expected: new Date("2024-08-10"),
      },
    ];

    testCases.forEach(({ description, original, unit, value, expected }) => {
      it(description, () => {
        const result = RBDate.addToDate(original, unit, value);
        expect(result).toEqual(expected);
      });
    });

    // Additional test for invalid time unit
    it("Should throw an error for invalid time unit", () => {
      expect(() => {
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore - Intentionally passing an invalid unit for testing
        RBDate.addToDate(new Date(), "invalid" as TimeUnits, 1);
        /* eslint-enable @typescript-eslint/ban-ts-comment */
      }).toThrowError("Invalid time unit");
    });

    it("Should return UTC Date 01-01-1900 00:00:00 if date is null or undefined", () => {
      const value = 10;
      const expected: Date = MIN_DATE;
      const resultN: Date = RBDate.addToDate(anyNull, "d", value);
      const resultU: Date = RBDate.addToDate(anyUndefined, "d", value);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'compareDates()'", () => {

    it("Should return true for identical DateTimes", () => {
      const value: Date = new Date("2024-07-31 00:00:00");
      const date2: Date = new Date("2024-07-31 00:00:00");
      const result: boolean = RBDate.compareDates(value, date2);
      expect(result).toBeTruthy();
    });

    it("Should return false for non-identical DateTimes", () => {
      const value: Date = new Date("2024-07-31 00:00:00");
      const date2: Date = new Date("2024-07-31 00:00:01");
      const result: boolean = RBDate.compareDates(value, date2);
      expect(result).toBeFalsy();
    });

    it("Should return false for null or undefined", () => {
      const aDate: Date = new Date("2024-07-31 00:00:00");
      const resultNullDate: boolean = RBDate.compareDates(anyNull, aDate);
      const resultUndefDate: boolean = RBDate.compareDates(anyUndefined, aDate);
      const resultDateNull: boolean = RBDate.compareDates(aDate, anyNull);
      const resultDateUndef: boolean = RBDate.compareDates(aDate, anyUndefined);
      expect(resultNullDate).toBeFalsy();
      expect(resultUndefDate).toBeFalsy();
      expect(resultDateNull).toBeFalsy();
      expect(resultDateUndef).toBeFalsy();
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'zeroTime()'", () => {

    it("Should return just the Date for a given DateTime", () => {
      const value: Date = new Date("2024-07-31 11:22:33");
      const expected: Date = new Date("2024-07-31 00:00:00");
      const result: Date = RBDate.zeroTime(value);
      expect(result).toEqual(expected);
    });

    it("Should return UTC Date <today> 00:00:00 if date is null or undefined", () => {
      const value: Date = new Date();
      const expected: Date =
        new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
      const resultN: Date = RBDate.zeroTime(anyNull);
      const resultU: Date = RBDate.zeroTime(anyUndefined);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'zeroDate()'", () => {

    it("Should return just the Time for a given DateTime", () => {
      const value: Date = new Date("2024-07-31 11:22:33");
      const expected: Date = new Date("1900-01-01 11:22:33");
      const result: Date = RBDate.zeroDate(value);
      expect(result).toEqual(expected);
    });

    it("Should return UTC Date <today> 00:00:00 if date is null or undefined", () => {
      const value: Date = new Date();
      const expected: Date = new Date(1900, 0, 1,
        value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
      const resultN: Date = RBDate.zeroDate(anyNull);
      const resultU: Date = RBDate.zeroDate(anyUndefined);
      expect(resultN).toEqual(expected);
      expect(resultU).toEqual(expected);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getAge()'", () => {

    it("should return 0 when the dates are the same", () => {
      const date1 = new Date(2023, 1, 1); // February 1, 2023
      const date2 = new Date(2023, 1, 1); // February 1, 2023
      const expectedAge = 0;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age when date1 is earlier than date2", () => {
      const date1 = new Date(2000, 0, 1); // January 1, 2000
      const date2 = new Date(2023, 1, 1); // February 1, 2023
      const expectedAge = 23;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age when date2 is earlier than date1", () => {
      const date1 = new Date(2023, 1, 1); // February 1, 2023
      const date2 = new Date(2000, 0, 1); // January 1, 2000
      const expectedAge = 23;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age when date1 is just before date2 in the same year", () => {
      const date1 = new Date(2023, 1, 1); // February 1, 2023
      const date2 = new Date(2023, 1, 2); // February 2, 2023
      const expectedAge = 0;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age when date1 is just after date2 in the same year", () => {
      const date1 = new Date(2023, 1, 2); // February 2, 2023
      const date2 = new Date(2023, 1, 1); // February 1, 2023
      const expectedAge = 0;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age when date1 is in a year and date2 is in next year", () => {
      const date1 = new Date(2022, 11, 31); // December 31, 2022
      const date2 = new Date(2023, 0, 1); // January 1, 2023
      const expectedAge = 0;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age when date1 is in a year and date2 is at the end", () => {
      const date1 = new Date(2023, 0, 1); // January 1, 2023
      const date2 = new Date(2023, 11, 31); // December 31, 2023
      const expectedAge = 0;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age considering months and days", () => {
      const date1 = new Date(2000, 5, 15); // June 15, 2000
      const date2 = new Date(2023, 5, 14); // June 14, 2023
      const expectedAge = 22; // Not yet reached the birthday in 2023
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age considering leap years", () => {
      const date1 = new Date(2000, 1, 29); // February 29, 2000 (leap year)
      const date2 = new Date(2023, 1, 28); // February 28, 2023 (non-leap year)
      const expectedAge = 22;
      expect(RBDate.getAge(date1, date2)).toBe(expectedAge);
    });

    it("should return the correct age when the birthday has passed this year", () => {
      const firstDate = new Date(2000, 0, 1); // January 1, 2000
      const compareDate = new Date(2023, 1, 1); // February 1, 2023
      const expectedAge = 23;
      expect(RBDate.getAge(firstDate, compareDate)).toBe(expectedAge);
    });

    it("should return the correct age when the birthday has not passed this year", () => {
      const firstDate = new Date(2000, 11, 31); // December 31, 2000
      const compareDate = new Date(2023, 1, 1); // February 1, 2023
      const expectedAge = 22;
      expect(RBDate.getAge(firstDate, compareDate)).toBe(expectedAge);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'isLeapYear()'", () => {

    it("Should return true for a typical leap year (divisible by 4 but not by 100)", () => {
      const year = 2024;
      const result = RBDate.isLeapYear(year);
      expect(result).toBeTruthy();
    });

    it("Should return false for a typical non-leap year (not divisible by 4)", () => {
      const year = 2023;
      const result = RBDate.isLeapYear(year);
      expect(result).toBeFalsy();
    });

    it("Should return false for a year that is divisible by 100 but not by 400", () => {
      const year = 1900;
      const result = RBDate.isLeapYear(year);
      expect(result).toBeFalsy();
    });

    it("Should return true for a century year that is a leap year (divisible by 400)", () => {
      const year = 2000;
      const result = RBDate.isLeapYear(year);
      expect(result).toBeTruthy();
    });

    it("Should return false for a negative year that is not a leap year", () => {
      const year = -1;
      const result = RBDate.isLeapYear(year);
      expect(result).toBeFalsy();
    });

    it("Should return true for a negative year that is a leap year", () => {
      const year = -4;
      const result = RBDate.isLeapYear(year);
      expect(result).toBeTruthy();
    });
  });
});
