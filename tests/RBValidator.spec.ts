import { EMPTY_STRING, NEWLINE } from "../src/RBConstants";
import { RBLoginCriteria, StandardLoginOptions, RBLoginValidator } from "../src/RBValidator";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class RBLoginValidator to handle various validator functions.
 *
 * 2024-09-23:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
/* eslint-disable jasmine/no-spec-dupes */
describe("[RBLoginCriteria]", () => {

  describe("constructor 'RBLoginCriteria'", () => {

    it("Should create the class", () => {
      const loginCriteria = new RBLoginCriteria();

      expect(loginCriteria).toBeDefined();
    });

    it("Should have the correct properties", () => {
      const loginCriteria = new RBLoginCriteria();

      expect(loginCriteria.options).toEqual(StandardLoginOptions);
    });

    it("Should be able to set/ get the properties correctly, and not change Standard", () => {
      const loginCriteria = new RBLoginCriteria();
      loginCriteria.options.allowedDomains = ["@myOrganisation.nl"];
      loginCriteria.options.minimumLength = 12;
      loginCriteria.options.numLowercase = 2;
      loginCriteria.options.numUppercase = 2;
      loginCriteria.options.numNumbers = 2;
      loginCriteria.options.numSpecial = 2;
      loginCriteria.options.noSameConsecutiveChars = 2;

      expect(loginCriteria.options.allowedDomains).toEqual(["@myOrganisation.nl"]);
      expect(loginCriteria.options.minimumLength).toBe(12);
      expect(loginCriteria.options.numLowercase).toBe(2);
      expect(loginCriteria.options.numUppercase).toBe(2);
      expect(loginCriteria.options.numNumbers).toBe(2);
      expect(loginCriteria.options.numSpecial).toBe(2);
      expect(loginCriteria.options.noSameConsecutiveChars).toBe(2);

      const newLoginCriteria = loginCriteria;
      newLoginCriteria.options.allowedDomains = ["@someOrganisation.nl"];

      expect(newLoginCriteria).toEqual(loginCriteria);
      expect(newLoginCriteria.options.allowedDomains).toEqual(["@someOrganisation.nl"]);

      const newOptions = loginCriteria.options;
      newOptions.allowedDomains = ["@anotherOrganisation.nl"];
      newLoginCriteria.options = newOptions;

      expect(newLoginCriteria.options).toEqual(loginCriteria.options);
      expect(newLoginCriteria.options.allowedDomains).toEqual(["@anotherOrganisation.nl"]);
      expect(newOptions.allowedDomains).toEqual(["@anotherOrganisation.nl"]);

      // Make sure StandardLoginCriteria is not changed
      expect(StandardLoginOptions.allowedDomains).toEqual([]);
      expect(StandardLoginOptions.minimumLength).toBe(10);
      expect(StandardLoginOptions.numLowercase).toBe(1);
      expect(StandardLoginOptions.numUppercase).toBe(1);
      expect(StandardLoginOptions.numNumbers).toBe(1);
      expect(StandardLoginOptions.numSpecial).toBe(1);
      expect(StandardLoginOptions.noSameConsecutiveChars).toBe(3);
    });
  });

});

// ----------------------------------------------------------------------------

describe("[RBLoginValidator]", () => {
  let testloginValidator = new RBLoginValidator();

  beforeEach(() => {
    testloginValidator = new RBLoginValidator();
  });

  describe("constructor 'RBLoginValidator'", () => {

    it("Should create the class", () => {
      expect(testloginValidator).toBeDefined();
    });

    it("Should have an empty array of errorMessages", () => {
      expect(testloginValidator.errorMessages).toEqual([]);
    });

    it("Should be able to set get the properties correctly", () => {
      const newOptions = {
        allowedDomains: [],
        minimumLength: 12,
        numLowercase: 2,
        numUppercase: 2,
        numNumbers: 2,
        numSpecial: 2,
        noSameConsecutiveChars: 2,
      };
      const newCriteria = new RBLoginCriteria(newOptions);
      testloginValidator.loginCriteria = newCriteria;
      testloginValidator.userName = "john.doe@dummy.com";
      testloginValidator.password = "SEcr34!23!";

      expect(testloginValidator.loginCriteria).toEqual(newCriteria);
      expect(testloginValidator.loginCriteria.options).toEqual(newOptions);
      expect(testloginValidator.userName).toBe("john.doe@dummy.com");
      expect(testloginValidator.password).toBe("SEcr34!23!");
      testloginValidator.loginCriteria.options = StandardLoginOptions;
    });
  });

  // --------------------------------------------------------------------------

  describe("function 'CheckLogin()'", () => {

    const errMsgUserNameInvalid = "Invalid Username (";
    const errMsgPasswordInvalid = "Password is not strong enough." + NEWLINE;
    const errMsgUserNameEmpty = "Username cannot be empty.";
    const errMsgPasswordEmpty = "Password cannot be empty.";

    it("Should return True (OK) on a valid user/password", () => {
      expect(testloginValidator.CheckLogin("john@company.com", "123ABcd!org")).toBeTruthy();
    });

    it("Should return False on an invalid username (email-address)", () => {
      expect(testloginValidator.CheckLogin("abc.com", "12ABab!@abc")).toBeFalsy();
      expect(testloginValidator.errorMessages.join(EMPTY_STRING)).toContain(errMsgUserNameInvalid);
      expect(testloginValidator.statusOK).toBeFalsy();
    });

    it("Should return False on an empty username (email-address)", () => {
      expect(testloginValidator.CheckLogin(EMPTY_STRING, "12ABab!@abc")).toBeFalsy();
      expect(testloginValidator.errorMessages.join(EMPTY_STRING)).toContain(errMsgUserNameEmpty);
      expect(testloginValidator.statusOK).toBeFalsy();
    });

    it("Should return False on an invalid password", () => {
      expect(testloginValidator.CheckLogin("john@company.com", "secretSecret")).toBeFalsy();
      expect(testloginValidator.errorMessages.join(EMPTY_STRING)).toContain(errMsgPasswordInvalid);
      expect(testloginValidator.statusOK).toBeFalsy();
    });

    it("Should return False on an empty password", () => {
      expect(testloginValidator.CheckLogin("john@company.com", EMPTY_STRING)).toBeFalsy();
      expect(testloginValidator.errorMessages.join(EMPTY_STRING)).toContain(errMsgPasswordEmpty);
      expect(testloginValidator.statusOK).toBeFalsy();
    });

    it("Should have the correct properties", () => {
      testloginValidator.loginCriteria.options.allowedDomains = [];

      expect(testloginValidator.CheckLogin(
        "john@company.com", "12ABab!@abc", testloginValidator.loginCriteria.options)).toBeTruthy();

      expect(testloginValidator.userName).toBe("john@company.com");
      expect(testloginValidator.password).toBe("12ABab!@abc");
      expect(testloginValidator.loginCriteria.options.allowedDomains.length).toEqual(0);
      expect(testloginValidator.errorMessages.length).toEqual(0);
      expect(testloginValidator.statusOK).toBeTruthy();
    });

    it("Should have the correct properties for myOrganisation", () => {
      const myLoginCriteria = new RBLoginCriteria();
      myLoginCriteria.options.minimumLength = 11;
      myLoginCriteria.options.allowedDomains = ["@myOrganisation.nl"];

      expect(testloginValidator.CheckLogin(
        "abc@myorganisation.nl", "12ABab!@abc", myLoginCriteria.options)).toBeTruthy();

      expect(testloginValidator.userName).toBe("abc@myorganisation.nl");
      expect(testloginValidator.password).toBe("12ABab!@abc");
      expect(testloginValidator.loginCriteria.options.allowedDomains.length).toEqual(1);
      expect(testloginValidator.errorMessages.length).toEqual(0);
      expect(testloginValidator.statusOK).toBeTruthy();
      expect(testloginValidator.loginCriteria).toEqual(myLoginCriteria);
      expect(
        testloginValidator.loginCriteria.options.allowedDomains).toEqual(["@myOrganisation.nl"]);
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'isValidEmailAddress()'", () => {
    const isValidEmail = RBLoginValidator.isValidEmailAddress;

    it("Should return false when email address is empty, null or undefined", () => {
      const emptyEmails = [
        EMPTY_STRING,
        anyNull,
        anyUndefined,
      ];
      emptyEmails.forEach((email) => {
        const result: boolean = isValidEmail(email);

        expect(result).toBeFalsy();
      });
    });

    it("Should return true for a valid email address + Organisation", () => {
      const email = "bax@myOrganisation.nl";
      const resultRB: boolean = isValidEmail(email, ["@myOrganisation.nl"]);
      const result: boolean = isValidEmail(email, []);

      expect(resultRB).toBeTruthy();
      expect(result).toBeTruthy();
    });

    it("should validate correct email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name+tag+sorting@example.com",
        "user.name@example.co.uk",
      ];
      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBeTruthy();
      });
    });

    it("should invalidate incorrect email addresses", () => {
      const invalidEmails = [
        "plainaddress", // Missing @
        "@missingusername.com", // Missing username
        "username@xyz.com abc", // Extra text after domain
        "username@.com", // Missing domain
        "username@domain..com", // Consecutive dots
        "username@domain.com.", // Trailing dot
        "username@domain@domain.com", // Double @ symbols
        " username@domain.com", // Leading space
        "username@domain.com ", // Trailing space
        "user name@domain.com", // Space within the email
        "userjohn@com", // Missing top-level domain
        ".userjohn@domain.com", // Leading dot
        "userjohn@domain,com", // Invalid character
        "userjohn@-domain.com", // Domain starting with a hyphen
        "userjohn@domain-.com", // Domain ending with a hyphen
        "!userjohn@domain.com", // Local part starting with a special character
        "userjohn!@domain.com", // Local part ending with a special character
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBeFalsy();
      });
    });

    it("should invalidate email addresses or its parts are too long", () => {
      const longLocalPart = "ab".repeat(32) + "@example.com";

      expect(isValidEmail(longLocalPart)).toBeTruthy();
      expect(isValidEmail("x" + longLocalPart)).toBeFalsy();
    });

    it("should invalidate email addresses or its parts are too long", () => {
      const longDomain = "abc@" + "ab".repeat(123) + ".com";

      expect(isValidEmail(longDomain)).toBeTruthy();
      expect(isValidEmail(longDomain + "x")).toBeFalsy();
    });

    it("should invalidate email addresses with consecutive dots", () => {
      const consecutiveDots = "user..name@example.com";

      expect(isValidEmail(consecutiveDots)).toBeFalsy();
    });

    it("should validate email addresses ending with a allowed domain", () => {
      const allowedDomains = ["@myOrganisation.nl", "@example.com"];
      const validEmail = "user@example.com";

      expect(isValidEmail(validEmail, allowedDomains)).toBeTruthy();
    });

    it("should invalidate email addresses not ending with allowed domains", () => {
      const allowedDomains = ["@myOrganisation.nl"];
      const invalidEmail = "user@notallowed.com";

      expect(isValidEmail(invalidEmail, allowedDomains)).toBeFalsy();
    });

  });

  // ----------------------------------------------------------------------------

  describe("function 'isStrongPassword()'", () => {

    it("Should return false if password is null, undefined or empty", () => {
      const emptyPasswords = [
        EMPTY_STRING,
        anyNull,
        anyUndefined,
      ];
      emptyPasswords.forEach((password) => {
        const result: boolean = RBLoginValidator.isStrongPassword(password);

        expect(result).toBeFalsy();
      });
    });

    it("Should return false if one or more standard restrictions are not met", () => {
      const validPasswords = [
        "S3cre!P@s5", // OK
        "S3CrE!P@S5", // OK, only 1 lowercase
        "s3cre!P@s5", // OK, only 1 uppercase
        "S3cre!P@sz", // OK, only 1 number
        "S3cre!Pas5", // OK, only 1 special character
        "S3cre!Pass", // OK, only 2 consecutive same characters
      ];
      const invalidPasswords = [
        "s3cr3!Pa", // Too short (8)
        "S3cr3!Pas", // Too short (9)
        "s3cre!pass", // No uppercase
        "S3CRE!PASS", // No lowercase
        "Secret!Pass", // No number
        "S3cr3tPass", // No special character
        "Zeeegels!34", // Consecutive characters
      ];

      validPasswords.forEach((password) => {
        const result: boolean =
          RBLoginValidator.isStrongPassword(password, StandardLoginOptions);

        expect(result).toBeTruthy();
      });
      invalidPasswords.forEach((password) => {
        const result: boolean =
          RBLoginValidator.isStrongPassword(password, StandardLoginOptions);

        expect(result).toBeFalsy();
      });
    });

    it("Should return the correct message for singles if the password is false", () => {
      const myLoginCriteria = new RBLoginCriteria();
      myLoginCriteria.options.minimumLength = 10;
      myLoginCriteria.options.numLowercase = 1;
      myLoginCriteria.options.numUppercase = 1;
      myLoginCriteria.options.numNumbers = 1;
      myLoginCriteria.options.numSpecial = 1;
      myLoginCriteria.options.noSameConsecutiveChars = 1;
      const myLoginValidator = new RBLoginValidator();
      const expected: string =
        "Password is not strong enough." + NEWLINE +
        "A password must be at least 10 characters long and contain " +
        "at least 1 lowercase letter, 1 uppercase letter, 1 number, " +
        "1 special character, and less than 1 consecutive, identical character.";
      const result: boolean =
        myLoginValidator.CheckLogin("john@company.com", "secret", myLoginCriteria.options);

      expect(result).toBeFalsy();
      expect(myLoginValidator.errorMessages).toEqual([expected]);
    });

    it("Should return the correct message for doubles if the password is false", () => {
      const myLoginCriteria = new RBLoginCriteria();
      myLoginCriteria.options.minimumLength = 10;
      myLoginCriteria.options.numLowercase = 2;
      myLoginCriteria.options.numUppercase = 2;
      myLoginCriteria.options.numNumbers = 2;
      myLoginCriteria.options.numSpecial = 2;
      myLoginCriteria.options.noSameConsecutiveChars = 2;
      const myLoginValidator = new RBLoginValidator();
      const expected: string =
      "Password is not strong enough." + NEWLINE +
      "A password must be at least 10 characters long and contain " +
      "at least 2 lowercase letters, 2 uppercase letters, 2 numbers, " +
      "2 special characters, and less than 2 consecutive, identical characters.";
      const result: boolean =
        myLoginValidator.CheckLogin("john@company.com", "!!!!!!@@@@@@", myLoginCriteria.options);

      expect(result).toBeFalsy();
      expect(myLoginValidator.errorMessages).toEqual([expected]);
    });
  });

});
