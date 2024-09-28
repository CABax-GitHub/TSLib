import { EMPTY_STRING, MIN_DATE } from "../src/RBConstants";
import { RBPerson } from "../src/RBPerson";
import { RBDate } from "../src/RBDate";

/**
 * Tests for Class RBPerson to handle various person (name, birthday) functions
 *
 * 2024-09-18:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const valueNull: any = null;
// eslint-disable-next-line no-undefined
const valueUndefined: any = undefined;
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable max-lines-per-function */
describe("[RBPerson]", () => {
  const firstName = "John";
  const lastName = "Doe";
  const middleName = "Jr.";
  const fullName = "John Jr. Doe";
  const birthDate = new Date(2001, 1, 31);

  describe("class 'RBPerson'", () => {
    let person = new RBPerson;

    beforeEach(() => {
      person = new RBPerson();
    });

    it("should create an instance of RBPerson", () => {
      expect(person).toBeTruthy();
    });

    it("should have a default name as EMPTY_STRING", () => {
      expect(person.firstName).toBe(EMPTY_STRING);
      expect(person.middleName).toBe(EMPTY_STRING);
      expect(person.lastName).toBe(EMPTY_STRING);
      expect(person.fullName).toBe(EMPTY_STRING);
    });

    it("should set and get the name correctly on fullName", () => {
      person.fullName = fullName;
      expect(person.firstName).toBe(firstName);
      expect(person.middleName).toBe(middleName);
      expect(person.lastName).toBe(lastName);
      person.firstName = "Jane";
      person.middleName = "Sr.";
      person.lastName = "Smith";
      expect(person.firstName).toBe("Jane");
      expect(person.middleName).toBe("Sr.");
      expect(person.lastName).toBe("Smith");
      expect(person.fullName).toBe("Jane Sr. Smith");
    });

    it("should set and get the name correctly on name-parts", () => {
      person.firstName = firstName;
      person.middleName = middleName;
      person.lastName = lastName;
      expect(person.fullName).toBe(fullName);
    });

    it("should set fullName to be empty-string if either first or last name is empty", () => {
      person.firstName = EMPTY_STRING;
      person.middleName = middleName;
      person.lastName = lastName;
      expect(person.fullName).toBe(EMPTY_STRING);
      person.firstName = firstName;
      person.middleName = middleName;
      person.lastName = EMPTY_STRING;
      expect(person.fullName).toBe(EMPTY_STRING);
    });

    it("should set all names to empty-string if fullName is set to null or undefined", () => {
      person.fullName = valueNull;
      expect(person.firstName).toBe(EMPTY_STRING);
      expect(person.middleName).toBe(EMPTY_STRING);
      expect(person.lastName).toBe(EMPTY_STRING);
      expect(person.fullName).toBe(EMPTY_STRING);
      person.fullName = valueUndefined;
      expect(person.firstName).toBe(EMPTY_STRING);
      expect(person.middleName).toBe(EMPTY_STRING);
      expect(person.lastName).toBe(EMPTY_STRING);
      expect(person.fullName).toBe(EMPTY_STRING);
    });

    it("should have a default birth date as MIN_DATE", () => {
      expect(person.birthDate).toEqual(MIN_DATE);
    });

    it("should set and get the birth date correctly", () => {
      person.birthDate = birthDate;
      expect(person.birthDate).toEqual(birthDate);
    });

    it("should get the age correctly", () => {
      person.birthDate = birthDate;
      const expected = RBDate.getAge(birthDate, new Date());
      expect(person.age).toBe(expected);
    });

    it("should return min_date if birthDay is null or undefined", () => {
      person.birthDate = valueNull;
      expect(person.birthDate).toEqual(MIN_DATE);
      expect(person.age).toBe(0);
      person.birthDate = valueUndefined;
      expect(person.birthDate).toEqual(MIN_DATE);
      expect(person.age).toBe(0);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'getFullName()'", () => {

    it("should return the fullName correctly on name-parts", () => {
      const result = RBPerson.getFullName(firstName, middleName, lastName);
      expect(result).toBe(fullName);
    });

    it("should return empty-string if one of the names is null or undefined", () => {
      let result = RBPerson.getFullName(valueNull, middleName, lastName);
      expect(result).toBe(EMPTY_STRING);
      result = RBPerson.getFullName(firstName, valueNull, lastName);
      expect(result).toBe(EMPTY_STRING);
      result = RBPerson.getFullName(firstName, middleName, valueNull);
      expect(result).toBe(EMPTY_STRING);
    });
  });

});
