import { EMPTY_STRING, MIN_DATE_GET_TIME, MILLISECONDS_PER_DAY } from "./RBConstants";
import { RBLocale, CURRENT_LANGUAGE } from "./RBLocale";
import { RBEnum } from "./RBEnum";

/**
 * Class RBDate to handle various DateTime functions
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * TimeUnits is used in:
 * addToDate(date: Date, timeUnit: TimeUnits, value: number): Date
 */
export type TimeUnits = "y" | "m" | "d" | "h" | "n" | "s" | "t" |
  "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";

/**
 * Class RBDate to handle various DateTime functions.
 */
export class RBDate {

  /**
   * Returns the given dateTime in the format "hh:mm:ss" in the given language.
   * If no language or an unsupported language is given, RBDate.getRealLang is used.
   * Non-dates will return EMPTY_STRING.
   */
  public static toStringTime(date: Date, language: string = EMPTY_STRING): string {
    if (!date || isNaN(date.getTime())) {
      return EMPTY_STRING;
    }
    const formatter = this.getFormatter({
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }, this.getLanguageToUse(language));
    return formatter.format(date);
  }

  /**
   * Returns the given dateTime in the format "dd-mm-yyyy hh:mm:ss" in the given language.
   * If no language or an unsupported language is given, RBDate.getRealLang is used.
   * Non-dates will return EMPTY_STRING.
   */
  public static toStringDMYTime(date: Date, language: string = EMPTY_STRING): string {
    if (!date || isNaN(date.getTime())) {
      return EMPTY_STRING;
    }
    const formatter = this.getFormatter({
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }, this.getLanguageToUse(language));
    return formatter.format(date).replace(",", EMPTY_STRING);
  }

  /**
   * Returns the given dateTime in the format "dd-mm-yyyy" in the given language.
   * If no language or an unsupported language is given, RBDate.getRealLang is used.
   * Non-dates will return EMPTY_STRING.
   */
  public static toStringDMY(date: Date, language: string = EMPTY_STRING): string {
    if (!date || isNaN(date.getTime())) {
      return EMPTY_STRING;
    }
    const formatter = this.getFormatter({
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }, this.getLanguageToUse(language));
    return formatter.format(date);
  }

  /**
   * Returns the given dateTime in the format "YYYYMMDDHHMMSS".
   * Non-dates will return EMPTY_STRING.
   */
  public static toStringYMDTime(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return EMPTY_STRING;
    }
    const { year, month, day, hours, minutes, seconds } = this.formatDateParts(date);
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Returns the given dateTime in the format "YYYYMMDD".
   * Non-dates will return EMPTY_STRING.
   */
  public static toStringYMD(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return EMPTY_STRING;
    }
    const { year, month, day } = this.formatDateParts(date);
    return `${year}${month}${day}`;
  }

  /**
   * Returns the ISO-8601 week-number of the given dateTime.
   * Negative results will be in the previous or the next year.
   * Non-dates will return null.
   */
  public static toWeek(date: Date): number | null {
    if (!date || isNaN(date.getTime())) {
      return null;
    }
    // Create a copy of the date object to avoid mutating the original
    const tempDate = new Date(date.getTime());
    // Set the time to the start of the day (00:00:00) for accurate calculations
    tempDate.setUTCHours(0, 0, 0, 0);
    // Set to the nearest Thursday: current date + 4 - current day number (Monday is 1, Sunday is 7)
    const day = tempDate.getUTCDay();
    const nearestThursday = tempDate.getUTCDate() + 4 - (day === 0 ? 7 : day);
    tempDate.setUTCDate(nearestThursday);
    // Jan 1st of the year
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    // Calculate the full weeks between the year start and the given date
    const weekNumber =
      Math.ceil(((tempDate.getTime() - yearStart.getTime()) / MILLISECONDS_PER_DAY + 1) / 7);
    const calculatedYear = tempDate.getUTCFullYear();
    const inputYear = date.getUTCFullYear();
    //Return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    // Return the week number, but if the year is different, return the negative value
    return inputYear === calculatedYear ? weekNumber : -weekNumber;
  }

  /**
   * Returns the ISO-8601 week-number as string, of the given dateTime
   * in the format "yyyy-Www".
   * Note: the year "yyyy" can be in the previous or next year.
   * Non-dates will return EMPTY_STRING.
  */
  public static toWeekString(date: Date): string {
    const weekNumber: number | null = RBDate.toWeek(date);
    if (weekNumber === null) {
      return EMPTY_STRING;
    }
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    // Determine the correct year string based on the week number
    const yearString: string = weekNumber >= 1
      ? year.toString()
      : month === 12 ? (year + 1).toString() : (year - 1).toString();
    // Format the week number with a leading zero if necessary
    const weekString: string = Math.abs(weekNumber).toString().padStart(2, "0");
    // Construct the final ISO week string
    return `${yearString}-W${weekString}`;
  }

  /**
   * Returns the DayName of the given dateTime in the given language.
   * If no language or an unsupported language is given,
   * CURRENT_LANGUAGE is used.
   */
  public static toDayName(date: Date, language: string = EMPTY_STRING): string {
    if (!date || isNaN(date.getTime())) {
      return EMPTY_STRING;
    }
    const result: string =
      date.toLocaleDateString(this.getLanguageToUse(language), { weekday: "long" });
    return result[0].toUpperCase() + result.slice(1);
  }

  /**
   * Returns the MonthName of the given dateTime in the given language.
   * If no language or an unsupported language is given,
   * CURRENT_LANGUAGE is used.
   */
  public static toMonthName(date: Date, language: string = EMPTY_STRING): string {
    if (!date || isNaN(date.getTime())) {
      return EMPTY_STRING;
    }
    const result: string =
      date.toLocaleDateString(this.getLanguageToUse(language), { month: "long" });
    return result[0].toUpperCase() + result.slice(1);
  }

  /**
   * Returns the full year of the given dateTime.
   * Non-dates will return null.
   */
  public static toYear(date: Date): number | null {
    return date ? date.getFullYear() : null;
  }

  /**
   * Returns the month (1-12) of the given dateTime.
   * Non-dates will return null.
   * In javascript, the month-index is 0 based
   */
  public static toMonth(date: Date): number | null {
    return date ? date.getMonth() + 1 : null;
  }

  /**
   * Returns the month-index (0-11) of the given dateTime.
   * Non-dates will return null.
   */
  public static toMonthIndex(date: Date): number | null {
    return date ? date.getMonth() : null;
  }

  /**
   * Returns the day-in-the-month of the given dateTime.
   * Non-dates will return null.
   */
  public static toDay(date: Date): number | null {
    return date ? date.getDate() : null;
  }

  /**
   * Return the TimeStamp of the given dateTime.
   * TimeStamp = number of milliseconds since 1970-01-01.
   */
  public static dateToTimeStamp(date: Date): number {
    return date.getTime();
  }

  /**
   * Return the Date of the given timeStamp.
   * TimeStamp = number of milliseconds since 1970-01-01.
   */

  public static timeStampToDate(timeStamp: number): Date {
    return new Date(timeStamp);
  }

  /**
   * Returns the dateTime + the number of time-units (positive or negative).
   * TimeUnits = "y" | "m" | "d" | "h" | "n" | "s" | "t"
   * Non-dates or non-days will return UTC Date 01-01-1900 00:00:00 (minimum dateTime).
   */
  public static addToDate(date: Date, timeUnit: TimeUnits, value: number): Date {
    if (!date) {
      return new Date(Date.UTC(0));
    }
    const floorValue: number = Math.floor(value);
    const newDate: Date = new Date(date);
    switch (timeUnit) {
      case "y":
      case "year":
        newDate.setFullYear(newDate.getFullYear() + floorValue);
        break;
      case "m":
      case "month":
        newDate.setMonth(newDate.getMonth() + floorValue);
        break;
      case "d":
      case "day":
        newDate.setDate(newDate.getDate() + floorValue);
        break;
      case "h":
      case "hour":
        newDate.setHours(newDate.getHours() + floorValue);
        break;
      case "n":
      case "minute":
        newDate.setMinutes(newDate.getMinutes() + floorValue);
        break;
      case "s":
      case "second":
        newDate.setSeconds(newDate.getSeconds() + floorValue);
        break;
      case "t":
      case "millisecond":
        newDate.setMilliseconds(newDate.getMilliseconds() + floorValue);
        break;
      default:
        throw new Error("Invalid time unit");
    }
    return newDate;
  }

  /**
   * Returns true if two DateTimes have the same value.
   * Non-dates will return false.
   */
  public static compareDates(date1: Date, date2: Date): boolean {
    if ((!date1) || (!date2)) {
      return false;
    }
    return date1.getTime() === date2.getTime();
  }

  /**
   * Returns the date with the time set to 00:00:00, preserving the date components.
   * Non-dates will return UTC Date <today> 00:00:00 (minimum dateTime).
   */
  public static zeroTime(date: Date): Date {
    const myDate: Date = date || new Date();
    return new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 0, 0, 0, 0);
  }

  /**
   * Returns the date with the date set to 01-01-1900, preserving the time components.
   * Non-dates will return UTC Date 01-01-1900 00:00:00 (minimum dateTime).
   */
  public static zeroDate(date: Date): Date {
    const myDate: Date = date || new Date();
    return new Date(1900, 0, 1,
      myDate.getHours(), myDate.getMinutes(), myDate.getSeconds(), myDate.getMilliseconds());
  }

  /**
   * Returns the age of the given dateTime.
   * Non-dates will return 0.
   */
  public static getAge(date1: Date, date2: Date): number {
    // Calc the number of milliseconds since 1970-01-01 for both dates
    // The absolute difference, makes sure the result is always positive
    // Regardless of the order of the dates
    const timeStamp = Math.abs(date1.getTime() - date2.getTime());
    // Convert the milliseconds to a date again
    const date = new Date(timeStamp);
    // Get the year of that date minus the 1970 base
    return date.getFullYear() - MIN_DATE_GET_TIME.getFullYear();
  }

  /**
   * Returns if a year is a leap year
   * That is if the year is divisible by 4 and not by 100,
   * or if it is divisible by 400.
   */
  public static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // ----------------------------------------------------------------------------

  /**
   * Return the language to use, if language is defined in RBLocale.SupportedLanguages.
   * If no language or an unsupported language is given,
   * or if the language is not in RBLocale.SupportedLanguages,
   * CURRENT_LANGUAGE is used.
   */
  private static getLanguageToUse(language: string = CURRENT_LANGUAGE): string {
    return RBEnum.isInEnum(language, RBLocale.SupportedLanguages) ? language : CURRENT_LANGUAGE;
  }

  /**
   * Gets a formatOptions object for the given language.
   */
  private static getFormatter(
    options: Intl.DateTimeFormatOptions, language: string): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.getLanguageToUse(language), {
      timeZone: "europe/amsterdam",
      ...options,
    });
  }

  /**
   * Returns a string from the given number,
   * padded with a "0" if necessary.
   */
  private static padZero(num: number): string {
    return num.toString().padStart(2, "0");
  }

  /**
   * Returns an object with the date parts of the given date.
   */
  private static formatDateParts(date: Date): {
    year: string,
    month: string,
    day: string,
    hours: string,
    minutes: string,
    seconds: string
  } {
    return {
      year: date.getFullYear().toString(),
      month: this.padZero(date.getMonth() + 1),
      day: this.padZero(date.getDate()),
      hours: this.padZero(date.getHours()),
      minutes: this.padZero(date.getMinutes()),
      seconds: this.padZero(date.getSeconds()),
    };
  }

}
