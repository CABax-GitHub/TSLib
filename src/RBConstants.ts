/**
 * Global constants used in the library.
 *
 * 2024-09-28:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Global constants used in the library.
 * and usable in applications.
 */
export const IS_IN_BROWSER = typeof window !== "undefined";

export const LIB_VERSION = "0.1.1";
export const LIB_NAME = "RBCore" as const;

export const TAB = "\t" as const;
export const SPACE = " " as const;
export const NEWLINE = "\r\n" as const;
export const EMPTY_STRING = "" as const;

/**
 * This value represents the number of milliseconds in a day.
 * [1 second=1000 milliseconds, 1 minute=60 seconds, 1 hour=60 minutes,
 * 1 day=24 hours]  So, the total is: 1000 × 60 × 60 × 24 = 86_400_000 milliseconds.
 */
export const MILLISECONDS_PER_DAY = 86_400_000 as const;

/**
 * UTC Date 01-01-1900 00:00:00 (minimum dateTime).
 */
export const MIN_DATE: Date = new Date(Date.UTC(0, 0, 1));

/**
 * UTC Date 01-01-1970 00:00:00 (minimum getTime()).
 */
export const MIN_DATE_GET_TIME: Date = new Date(Date.UTC(1970, 0, 1));
