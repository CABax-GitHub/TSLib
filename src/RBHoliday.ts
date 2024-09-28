import { EMPTY_STRING, NEWLINE } from "./RBConstants";
import { RBDate, TimeUnits } from "./RBDate";
import { CURRENT_LANGUAGE, RBLocale } from "./RBLocale";
import { RBEnum } from "./RBEnum";
import { RBFunc } from "./RBFunc";

/**
 * Class RBHoliday to handle various generic functions.
 *
 * 2024-09-19:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Class to hold data in the Holidays.AllHolidays collection
 */
export class HolidayData {
  private readonly _languageName: string;
  private readonly _active: boolean;
  private readonly _holidayName: string;
  private readonly _daysRelativeToEastern: number;
  private _absoluteDay: number;
  private _absoluteMonth: number;
  private readonly _corrIfOnAMonday: number;
  private readonly _corrIfOnATuesday: number;
  private readonly _corrIfOnAWednesday: number;
  private readonly _corrIfOnAThursday: number;
  private readonly _corrIfOnAFriday: number;
  private readonly _corrIfOnASaturday: number;
  private readonly _corrIfOnASunday: number;
  private readonly _onlyActiveIfYearModX: number;

  // eslint-disable-next-line max-params
  constructor(
    languageName: string = CURRENT_LANGUAGE,
    active = false,
    holidayName: string = EMPTY_STRING,
    daysRelativeToEastern = 0,
    absoluteDay = 0,
    absoluteMonth = 0,
    corrIfOnAMonday = 0,
    corrIfOnATuesday = 0,
    corrIfOnAWednesday = 0,
    corrIfOnAThursday = 0,
    corrIfOnAFriday = 0,
    corrIfOnASaturday = 0,
    corrIfOnASunday = 0,
    onlyActiveIfYearModX = 0,
  ) {
    this._languageName = languageName;
    this._active = active;
    this._holidayName = holidayName;
    this._daysRelativeToEastern = daysRelativeToEastern;
    this._absoluteDay = absoluteDay;
    this._absoluteMonth = absoluteMonth;
    this._corrIfOnAMonday = corrIfOnAMonday;
    this._corrIfOnATuesday = corrIfOnATuesday;
    this._corrIfOnAWednesday = corrIfOnAWednesday;
    this._corrIfOnAThursday = corrIfOnAThursday;
    this._corrIfOnAFriday = corrIfOnAFriday;
    this._corrIfOnASaturday = corrIfOnASaturday;
    this._corrIfOnASunday = corrIfOnASunday;
    this._onlyActiveIfYearModX = onlyActiveIfYearModX;
  }

  get languageName(): string {
    return this._languageName;
  }
  get active(): boolean {
    return this._active;
  }
  get holidayName(): string {
    return this._holidayName;
  }
  get daysRelativeToEastern(): number {
    return this._daysRelativeToEastern;
  }
  get absoluteDay(): number {
    return this._absoluteDay;
  }
  set absoluteDay(value: number) {
    this._absoluteDay = value;
  }
  get absoluteMonth(): number {
    return this._absoluteMonth;
  }
  set absoluteMonth(value: number) {
    this._absoluteMonth = value;
  }
  get corrIfOnAMonday(): number {
    return this._corrIfOnAMonday;
  }
  get corrIfOnATuesday(): number {
    return this._corrIfOnATuesday;
  }
  get corrIfOnAWednesday(): number {
    return this._corrIfOnAWednesday;
  }
  get corrIfOnAThursday(): number {
    return this._corrIfOnAThursday;
  }
  get corrIfOnAFriday(): number {
    return this._corrIfOnAFriday;
  }
  get corrIfOnASaturday(): number {
    return this._corrIfOnASaturday;
  }
  get corrIfOnASunday(): number {
    return this._corrIfOnASunday;
  }
  get onlyActiveIfYearModX(): number {
    return this._onlyActiveIfYearModX;
  }
}

/**
 * Class to hold a single holiday for a given year and language
 */
class SingleHoliday {
  public readonly _year: number;
  public readonly _languageName: string;
  public readonly _dateThisYear: Date;
  public readonly _dayName: string;
  public readonly _holidayName: string;

  constructor(
    year = 0,
    languageName: string = CURRENT_LANGUAGE,
    dateThisYear: Date = new Date(),
    dayName: string = EMPTY_STRING,
    holidayName: string = EMPTY_STRING,
  ) {
    this._year = year;
    this._languageName = languageName;
    this._dateThisYear = dateThisYear;
    this._dayName = dayName;
    this._holidayName = holidayName;
  }

  get year(): number {
    return this._year;
  }
  get languageName(): string {
    return this._languageName;
  }
  get dateThisYear(): Date {
    return this._dateThisYear;
  }
  get dayName(): string {
    return this._dayName;
  }
  get holidayName(): string {
    return this._holidayName;
  }

}

/**
 * Class RBHoliday to handle various holiday-related functions.
 */
export class RBHoliday {
  private readonly _allHolidays: HolidayData[];
  private readonly _minimumYear: number = 1583 as const; // Start of Gregorian calendar
  private readonly _maximumYear: number = 9999 as const; // Largest 4 character year
  private _language: string = CURRENT_LANGUAGE;
  // Caches the year and Easter Sunday dates for a year to avoid recalculating
  private cachedYear = 0;
  private cacheEasterSunday: Record<number, Date> = {};

  constructor(language: string = EMPTY_STRING) {
    this._language = this.getLanguageToUseHere(language);
    if (!RBLocale.areLanguagesSupported(RBLocale.knownLanguages())) {
      throw new Error(
        "Check if all languages in RBHolidays.ts are also defined in RBLocale.ts " +
        "(SupportedLanguages).",
      );
    }
    this._allHolidays = this.initializeHolidays();
  }

  // Get / Set the language used for the holidays calculations
  public get language(): string {
    return this._language;
  }
  public set language(value: string) {
    this._language = this.getLanguageToUseHere(value);
  }
  public get sizeHolidayName(): number {
    return this._allHolidays.reduce((max, holiday) =>
      Math.max(max, holiday.holidayName.length), 0);
  }
  public get allHolidays(): HolidayData[] {
    return this._allHolidays;
  }
  public get totalHolidayRecords(): number {
    return this._allHolidays.length;
  }

  /**
   * Return the number of holidays for the given year and language.
   */
  public holidayCount(language: string, onlyActive = true): number {
    if (onlyActive) {
      return this.allHolidays.filter((item) =>
        item.languageName === language && item.active).length;
    }
    return this.allHolidays.filter((item) =>
      item.languageName === language).length;

  }

  /**
   * Returns a collection of all holidays for the given year and language
   */
  public getHolidaysForYear(year: number, language: string = EMPTY_STRING): SingleHoliday[] {
    const effectiveLanguage: string = this.getLanguageToUseHere(language);
    let thisYear: number = new Date().getFullYear();
    thisYear = RBFunc.ifInRangeElse(year, this._minimumYear, this._maximumYear, thisYear);

    this.updateVariableHolidaysForUSA(this._allHolidays, thisYear);
    const holidaysForYearAndLanguage: SingleHoliday[] = [];
    for (const holiday of this._allHolidays) {
      if (this.isHolidayActive(holiday, thisYear, effectiveLanguage)) {
        const isAbsoluteDay: boolean = RBFunc.isInRange(holiday.absoluteDay, 1, 31);
        const hDay: Date = isAbsoluteDay
          ? new Date(thisYear, holiday.absoluteMonth - 1, holiday.absoluteDay)
          : RBDate.addToDate(this.easterSunday(thisYear), "day", holiday.daysRelativeToEastern);
        const date: Date = this.addForDaysOfWeek(holiday, hDay);
        holidaysForYearAndLanguage.push(
          new SingleHoliday(thisYear, effectiveLanguage, date,
            RBDate.toDayName(date, effectiveLanguage), holiday.holidayName),
        );
      }
    }
    return holidaysForYearAndLanguage;
  }

  /**
   * Returns a collection of all holidays for the given year and language as string
   */
  public getHolidaysForYearAsString(year: number, language: string = EMPTY_STRING): string {
    // eslint-disable-next-line no-undefined
    if (year === null || year === undefined) {
      return EMPTY_STRING;
    }
    const effectiveLanguage: string = this.getLanguageToUseHere(language);
    const holidaysForLanguage: SingleHoliday[] = this.getHolidaysForYear(year, effectiveLanguage);
    let holidaysString: string = EMPTY_STRING;
    for (const singleHoliday of holidaysForLanguage) {
      holidaysString += `${singleHoliday.year} ${singleHoliday.languageName} ` +
        `${singleHoliday.holidayName} ${singleHoliday.dayName} ` +
        `${RBDate.toStringDMY(singleHoliday.dateThisYear, effectiveLanguage)}${NEWLINE}`;
    }
    return holidaysString;
  }

  /**
   * Returns if the given date is a holiday for the given language
   */
  public isHoliday(date: Date, language: string = EMPTY_STRING): boolean {
    if (!date) {
      return false;
    }
    const justDate: Date = RBDate.zeroTime(date);
    const effectiveLanguage: string = this.getLanguageToUseHere(language);
    const holidaysForLanguage: SingleHoliday[] =
      this.getHolidaysForYear(date.getFullYear(), effectiveLanguage);
    return holidaysForLanguage.some((singleHoliday) =>
      RBDate.compareDates(justDate, singleHoliday.dateThisYear),
    );
  }

  /**
   * Returns the holiday-name for the given date and language
   * (or EMPTY_STRING if it's not a holiday)
   */
  public holidayName(date: Date, language: string = EMPTY_STRING): string {
    if (!date) {
      return EMPTY_STRING;
    }
    const effectiveLanguage: string = this.getLanguageToUseHere(language);
    const holidaysForLanguage: SingleHoliday[] =
      this.getHolidaysForYear(date.getFullYear(), effectiveLanguage);
    for (const singleHoliday of holidaysForLanguage) {
      if (RBDate.compareDates(RBDate.zeroTime(date), singleHoliday.dateThisYear)) {
        return singleHoliday.holidayName;
      }
    }
    return EMPTY_STRING;
  }

  /**
   * Calculate the date of Easter Sunday for the given year
   */
  public easterSunday(year: number): Date {
    // Stryker disable all
    let thisYear: number = new Date().getFullYear();
    try {
      thisYear = RBFunc.ifInRangeElse(year, this._minimumYear, this._maximumYear, thisYear);
    } catch {
      // Not relevant here, so ignore
    }

    if (this.cacheEasterSunday[thisYear]) {
      return this.cacheEasterSunday[thisYear];
    }
    const a: number = thisYear % 19;
    const b: number = Math.floor(thisYear / 100);
    const c: number = thisYear % 100;
    const d: number = Math.floor(b / 4);
    const e: number = b % 4;
    const f: number = Math.floor((b + 8) / 25);
    const g: number = Math.floor((b - f + 1) / 3);
    const h: number = ((19 * a) + b - d - g + 15) % 30;
    const i: number = Math.floor(c / 4);
    const j: number = c % 4;
    const k: number = (32 + (2 * e) + (2 * i) - h - j) % 7;
    const l: number = Math.floor((a + (11 * h) + (22 * k)) / 451);
    const m: number = h + k - (7 * l) + 114;
    const month: number = Math.floor(m / 31);
    const day: number = (m % 31) + 1;

    const easterDate: Date = new Date(thisYear, month - 1, day);
    this.cacheEasterSunday[thisYear] = easterDate;
    return easterDate;
    // Stryker restore all
  }

  /**
   * Initializes the holidays data
   */
  private initializeHolidays(): HolidayData[] {
    return [
      ...this.initializeHolidays_enUS(),
      ...this.initializeHolidays_nlNL(),
      ...this.initializeHolidays_nlBE(),
      ...this.initializeHolidays_frBE(),
      ...this.initializeHolidays_frFR(),
      ...this.initializeHolidays_frLU(),
      ...this.initializeHolidays_deDE(),
    ];
  }

  /**
   * Returns the day-number for the nth day of a given month
   */
  private getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): number {
    if (!RBFunc.isInRange(year, this._minimumYear, this._maximumYear)) {
      throw new Error("Invalid nth weekday calculation for year: " +
        `${year}, month: ${month}, weekday: ${weekday}, n: ${n}`);
    }
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Calculate the date of the first occurrence of the weekday
    const firstOccurrence = ((weekday - firstDay + 7) % 7) + 1;
    if (n > 0) {
      // Calculate the date for positive n
      const date = firstOccurrence + (n - 1) * 7;
      if (date <= daysInMonth) {
        return date;
      }
    } else if (n < 0) {
      // Calculate the date for negative n (counting from the end)
      const lastOccurrence = firstOccurrence + Math.floor((daysInMonth - firstOccurrence) / 7) * 7;
      const date = lastOccurrence + (n + 1) * 7;
      if (date > 0) {
        return date;
      }
    }
    throw new Error("Invalid nth weekday calculation for year: " +
      `${year}, month: ${month}, weekday: ${weekday}, n: ${n}`);
  }

  /**
   * Helper function to update variable holidays for a new year
   */
  private updateVariableHolidaysForUSA(
    holidays: HolidayData[], newYear: number): HolidayData[] {
    if (this.cachedYear === newYear) {
      return holidays;
    }
    this.cachedYear = newYear;

    /* eslint-disable @stylistic/comma-spacing */
    /* eslint-disable no-multi-spaces */
    // Stryker disable all

    // Update variable holidays, for US holidays only
    for (const holiday of holidays) {
      if (holiday.languageName === "en-US") {
        if (holiday.holidayName === "Martin Luther King Day" ) {
          holiday.absoluteDay = this.getNthWeekdayOfMonth(newYear,  0, 1, 3);
        } else if (holiday.holidayName === "Presidents Day" ) {
          holiday.absoluteDay = this.getNthWeekdayOfMonth(newYear,  1, 1, 3);
        } else if (holiday.holidayName === "Memorial Day" ) {
          holiday.absoluteDay = this.getNthWeekdayOfMonth(newYear,  4, 1,-1);
        } else if (holiday.holidayName === "Labor Day" ) {
          holiday.absoluteDay = this.getNthWeekdayOfMonth(newYear,  8, 1, 1);
        } else if (holiday.holidayName === "Columbus Day" ) {
          holiday.absoluteDay = this.getNthWeekdayOfMonth(newYear,  9, 1, 2);
        } else if (holiday.holidayName === "Thanksgiving Day") {
          holiday.absoluteDay = this.getNthWeekdayOfMonth(newYear, 10, 4, 4);
        }
      }
    }
    return holidays;
  }

  private initializeHolidays_enUS(): HolidayData[] {
    const enUS = "en-US";
    return [
      // Relative to a certain month
      new HolidayData(enUS, true , "Martin Luther King Day" , 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0), // 3rd Monday in January
      new HolidayData(enUS, true , "Presidents Day"         , 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0), // 3rd Monday in February
      new HolidayData(enUS, true , "Memorial Day"           , 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0), // Last Monday in May
      new HolidayData(enUS, true , "Labor Day"              , 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0), // 1st Monday in September
      new HolidayData(enUS, true , "Columbus Day"           , 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0), // 2nd Monday in October
      new HolidayData(enUS, true , "Thanksgiving Day"       , 0, 0,11, 0, 0, 0, 0, 0, 0, 0, 0), // 4th Thursday in November
      // Absolute days
      new HolidayData(enUS, true , "New Year's Day"         , 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0), // January 1st
      new HolidayData(enUS, true , "Independence Day"       , 0, 4, 7, 0, 0, 0, 0, 0, 0, 0, 0), // July 4th
      new HolidayData(enUS, true , "Veterans Day"           , 0,11,11, 0, 0, 0, 0, 0, 0, 0, 0), // November 11th
      new HolidayData(enUS, true , "Christmas Day"          , 0,25,12, 0, 0, 0, 0, 0, 0, 0, 0), // December 25th
    ];
  }

  private initializeHolidays_nlNL(): HolidayData[] {
    const nlNL = "nl-NL";
    return [
      // Relative to Easter Sunday
      new HolidayData(nlNL, false, "Goede Vrijdag"          ,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "1e Paasdag"             , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "2e Paasdag"             , 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "Hemelvaart"             ,39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "1e Pinksterdag"         ,49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "2e Pinksterdag"         ,50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      // Absolute days
      new HolidayData(nlNL, true , "Nieuwjaar"              , 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "Koningsdag"             , 0,27, 4, 0, 0, 0, 0, 0, 0,-1, 0),
      new HolidayData(nlNL, false, "Dag vd Arbeid"          , 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "Bevrijdingsdag"         , 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5),
      new HolidayData(nlNL, false, "OLV hemelvaart"         , 0,15, 8, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, false, "Aller heiligen"         , 0, 1,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "1e Kerstdag"            , 0,25,12, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlNL, true , "2e Kerstdag"            , 0,26,12, 0, 0, 0, 0, 0, 0, 0, 0),
    ];
  }

  private initializeHolidays_nlBE(): HolidayData[] {
    const nlBE = "nl-BE";
    return [
      // Relative to Easter Sunday
      new HolidayData(nlBE, false, "Goede Vrijdag"          ,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "1e Paasdag"             , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "2e Paasdag"             , 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "Hemelvaart"             ,39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "1e Pinksterdag"         ,49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "2e Pinksterdag"         ,50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      // Absolute days
      new HolidayData(nlBE, true , "Nieuwjaar"              , 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "Dag vd Arbeid"          , 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "Nationale feestdag"     , 0,21, 7, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "OLV hemelvaart"         , 0,15, 8, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "Allerheiligen"          , 0, 1,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "Wapenstilstand 1918"    , 0,11,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, true , "1e Kerstdag"            , 0,25,12, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(nlBE, false, "2e Kerstdag"            , 0,26,12, 0, 0, 0, 0, 0, 0, 0, 0),
    ];
  }

  private initializeHolidays_frBE(): HolidayData[] {
    const frBE = "fr-BE";
    return [
      // Relative to Easter Sunday
      new HolidayData(frBE, false, "Vendredi saint"         ,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Pàques 1"               , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Pàques 2"               , 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Ascension"              ,39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Pentecôte 1"            ,49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Pentecôte 2"            ,50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      // Absolute days
      new HolidayData(frBE, true , "Nouvel an"              , 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Travail"                , 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Fête Nationale"         , 0,21, 7, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Assomption"             , 0,15, 8, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Toussaint"              , 0, 1,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Jour de l'Armistice"    , 0,11,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, true , "Noël"                   , 0,25,12, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frBE, false, "Noël 2"                 , 0,26,12, 0, 0, 0, 0, 0, 0, 0, 0),
    ];
  }

  private initializeHolidays_frFR(): HolidayData[] {
    const frFR = "fr-FR";
    return [
      // Relative to Easter Sunday
      new HolidayData(frFR, false, "Vendredi saint"         ,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Pàques"                 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Lundi de Pâques"        , 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Ascension"              ,39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Pentecôte"              ,49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Lundi de Pentecôte"     ,50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      // Absolute days
      new HolidayData(frFR, true , "Nouvel an"              , 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Fête du Travail"        , 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Fête de la Victoire"    , 0, 8, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Fête Nationale"         , 0,14, 7, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Assomption"             , 0,15, 8, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Toussaint"              , 0, 1,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Jour de l'Armistice"    , 0,11,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, true , "Noël"                   , 0,25,12, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frFR, false, "Saint Etienne"          , 0,26,12, 0, 0, 0, 0, 0, 0, 0, 0),
    ];
  }

  private initializeHolidays_frLU(): HolidayData[] {
    const frLU = "fr-LU";
    return [
      // Relative to Easter Sunday
      new HolidayData(frLU, false, "Vendredi saint"         ,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Pàques"                 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Lundi de Pâques"        , 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Ascension"              ,39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Pentecôte"              ,49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Lundi de Pentecôte"     ,50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      // Absolute days
      new HolidayData(frLU, true , "Jour de l'an"           , 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Fête du Travail"        , 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Journée de l'Europe"    , 0, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Fête Nationale"         , 0,23, 6, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Assomption"             , 0,15, 8, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Toussaint"              , 0, 1,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Noël"                   , 0,25,12, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(frLU, true , "Saint Etienne"          , 0,26,12, 0, 0, 0, 0, 0, 0, 0, 0),
    ];
  }

  private initializeHolidays_deDE(): HolidayData[] {
    const deDE = "de-DE";
    return [
      // Relative to Easter Sunday
      new HolidayData(deDE, true , "Karfreitag"             ,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Ostersonntag"           , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Ostermontag"            , 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Christi Himmelfahrt"    ,39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Pfingstsonntag"         ,49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Pfingstmontag"          ,50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      // Absolute days
      new HolidayData(deDE, true , "Neujahr"                , 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Tag der Arbeit"         , 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, false, "Maria Himmelfahrt"      , 0,15, 8, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Deutschen Einheit"      , 0, 3,10, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "Allerheiligen"          , 0, 1,11, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "1. Weihnachtstag"       , 0,25,12, 0, 0, 0, 0, 0, 0, 0, 0),
      new HolidayData(deDE, true , "2. Weihnachtstag"       , 0,26,12, 0, 0, 0, 0, 0, 0, 0, 0),
    ];
  }
  /* eslint-enable no-multi-spaces */
  /* eslint-enable @stylistic/comma-spacing */
  // Stryker restore all

  /**
   * Determines the language to use in the Holiday calculations
   */
  private getLanguageToUseHere(language: string = EMPTY_STRING): string {
    const tempLanguage: string = language || CURRENT_LANGUAGE;
    return RBEnum.isInEnum(tempLanguage, RBLocale.SupportedLanguages)
      ? tempLanguage : CURRENT_LANGUAGE;
  }

  /**
   * Determines if the holiday is active based on year and language
   */
  private isHolidayActive(holiday: HolidayData, year: number, language: string): boolean {
    const isActive: boolean = holiday.active &&
     (holiday.onlyActiveIfYearModX === 0 || year % holiday.onlyActiveIfYearModX === 0);
    const isThisLanguage: boolean = holiday.languageName.localeCompare(language) === 0;
    return isActive && isThisLanguage;
  }

  /**
   * Adjusts the holiday date for days of the week
   */
  private addForDaysOfWeek(holiday: HolidayData, date: Date): Date {
    const dayOfWeek: number = date.getDay();
    const corrections: number[] = [
      holiday.corrIfOnASunday,
      holiday.corrIfOnAMonday,
      holiday.corrIfOnATuesday,
      holiday.corrIfOnAWednesday,
      holiday.corrIfOnAThursday,
      holiday.corrIfOnAFriday,
      holiday.corrIfOnASaturday,
    ];
    return RBDate.addToDate(date, "day" as TimeUnits, corrections[dayOfWeek]);
  }
}

