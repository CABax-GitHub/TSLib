import { EMPTY_STRING, SPACE, MIN_DATE } from "./RBConstants";
import { RBDate } from "./RBDate";
import { RBFunc } from "./RBFunc";

/**
 * Class RBPerson to handle various person (name, birthday) functions
 *
 * 2024-09-18:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Class RBPerson to handle various person functions.
 */
export class RBPerson {
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;
  private _birthDate: Date;

  constructor() {
    this._firstName = EMPTY_STRING;
    this._middleName = EMPTY_STRING;
    this._lastName = EMPTY_STRING;
    this._birthDate = MIN_DATE;
  }

  get firstName(): string {
    return this._firstName;
  }
  set firstName(name: string) {
    this._firstName = name ? name : EMPTY_STRING;
  }
  get middleName(): string {
    return this._middleName;
  }
  set middleName(name: string) {
    this._middleName = name ? name : EMPTY_STRING;
  }
  get lastName(): string {
    return this._lastName;
  }
  set lastName(name: string) {
    this._lastName = name ? name : EMPTY_STRING;
  }
  get birthDate(): Date {
    return this._birthDate;
  }
  set birthDate(date: Date) {
    this._birthDate = date ? date : MIN_DATE;
  }

  get fullName(): string {
    return RBPerson.getFullName(this._firstName, this._middleName, this._lastName);
  }
  set fullName(name: string) {
    if (!name) {
      this._firstName = EMPTY_STRING;
      this._middleName = EMPTY_STRING;
      this._lastName = EMPTY_STRING;
      return;
    }
    const reverse = RBFunc.stringReverse(name);
    this._firstName = RBFunc.stringBefore(name, SPACE);
    this._lastName = RBFunc.stringReverse(RBFunc.stringBefore(reverse, SPACE));
    this._middleName =
      name.replace(this._firstName, EMPTY_STRING).replace(this._lastName, EMPTY_STRING).trim();
  }

  get age(): number {
    return !RBDate.compareDates(this._birthDate, MIN_DATE)
      ? RBDate.getAge(this._birthDate, new Date()) : 0;
  }

  /**
   * Combine the first, middle and last name to a full name.
   * Return an empty string if any of the names is null or undefined.
   */
  public static getFullName(
    firstName: string = EMPTY_STRING,
    middleName: string = EMPTY_STRING,
    lastName: string = EMPTY_STRING): string {
    if (!firstName || !middleName || !lastName) {
      return EMPTY_STRING;
    }
    const fullName = [firstName, middleName, lastName].join(SPACE);
    return RBFunc.trimAll(fullName);
  }

}
