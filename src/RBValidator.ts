import { EMPTY_STRING, NEWLINE, SPACE } from "./RBConstants";

/**
 * Class RBLoginValidator to handle various validator functions.
 *
 * 2024-09-23:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/**
 * Interface RBLoginOptions to define the options for the login criteria.
 */
export interface RBLoginOptions {
  allowedDomains: string[];
  minimumLength: number;
  numLowercase: number;
  numUppercase: number;
  numNumbers: number;
  numSpecial: number;
  noSameConsecutiveChars: number;
}

/**
 * StandardLoginOptions to define the default options for the login criteria.
 */
export const StandardLoginOptions: RBLoginOptions = {
  allowedDomains: [] as const,
  minimumLength: 10 as const,
  numLowercase: 1 as const,
  numUppercase: 1 as const,
  numNumbers: 1 as const,
  numSpecial: 1 as const,
  noSameConsecutiveChars: 3 as const,
} as const;

/**
 * Class RBLoginCriteria to handle LoginCriteria for RBLLoginValidator.
 */
export class RBLoginCriteria {
  private _options: RBLoginOptions = StandardLoginOptions;
  constructor(
    options: RBLoginOptions = StandardLoginOptions,
  ) {
    // Create a deep copy of the options object
    this.options = options;
  }
  get options(): RBLoginOptions {
    return this._options;
  }
  set options(newOptions: RBLoginOptions) {
    this._options = {
      ...newOptions,
      allowedDomains: [...newOptions.allowedDomains],
    };
  }
}

// ----------------------------------------------------------------------------

/**
 * Class RBLoginValidator to handle LoginValidator functions.
 */
export class RBLoginValidator {
  private _userName: string = EMPTY_STRING;
  private _password: string = EMPTY_STRING;
  private _statusUserName: string[] = [];
  private _statusPassword: string[] = [];
  private _loginCriteria = new RBLoginCriteria();

  /**
   * Method CheckLogin to check username and password against the login criteria options.
   */
  public CheckLogin(userName: string, password: string,
    loginCriteriaOptions = StandardLoginOptions): boolean {
    this._loginCriteria.options = loginCriteriaOptions;
    this._userName = userName;
    this.checkUserName(this._userName);
    this._password = password;
    this.checkPassword(this._password);
    return this.statusOK;
  }

  public get userName(): string {
    return this._userName;
  }
  public set userName(value: string) {
    this._userName = value;
    this.checkUserName(value);
  }
  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
    this.checkPassword(value);
  }
  public get errorMessages(): string[] {
    return [...this._statusUserName, ...this._statusPassword];
  }
  public get statusOK(): boolean {
    return this.errorMessages.length === 0;
  }
  public get loginCriteria(): RBLoginCriteria {
    return this._loginCriteria;
  }
  public set loginCriteria(value: RBLoginCriteria) {
    this._loginCriteria = value;
    this.checkUserName(this._userName);
    this.checkPassword(this._password);
  }

  /**
   * Static method isValidEmailAddress to check if an email address is valid.
   */
  public static isValidEmailAddress(emailAddress: string, allowedDomains: string[] = []): boolean {
    // Basic email regexp pattern and Specific domain regexp for @myOrganisation.nl
    const emailRegExp
      = (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if (!emailAddress || !emailRegExp.test(emailAddress)) {
      return false;
    }

    // Additional checks for more robust validation
    const lowerEmail = emailAddress.toLowerCase();
    const myAllowedDomains = allowedDomains.map((domain) => domain.toLowerCase());
    const [localPart, domain]: string[] = lowerEmail.split(/@/);
    // Check length constraints and for consecutive dots
    if (lowerEmail.length > 254
      || localPart.length > 64
      || lowerEmail.includes("..")
      || !domain.includes(".")
      || !(/^[a-z]/).test(localPart)
      || !(/[a-z]$/).test(localPart)
    ) {
      return false;
    }
    // Check domain specific rules
    const domainParts: string[] = domain.split(/\./);
    if (domainParts.some((part) => (!(/^[a-z]/).test(part) || !(/[a-z]$/).test(part)))) {
      return false;
    }
    // If the allowed array is not empty check if 'domain' or '@domain' is in the allowed list
    if (myAllowedDomains.length !== 0) {
      return myAllowedDomains.includes(domain)
        || myAllowedDomains.includes(`@${domain}`);
    }
    return true;
  }

  /**
   * Static method isStrongPassword to check if a password is strong enough.
   */
  public static isStrongPassword(
    password: string, options = StandardLoginOptions): boolean {
    if (!password || password.length < options.minimumLength) {
      return false;
    }
    // Check for at least numLowercase lowercase letters, numUppercase uppercase letters
    // NumNumbers digits and numSpecial special characters, i.e. not a digit, letter, or space.
    const hasLower: boolean =
      (password.match(/[a-z]/g) || []).length >= options.numLowercase;
    const hasUpper: boolean =
      (password.match(/[A-Z]/g) || []).length >= options.numUppercase;
    const hasNumbers: boolean =
      (password.match(/[0-9]/g) || []).length >= options.numNumbers;
    const hasSpecial: boolean =
      (password.match(/[^a-zA-Z0-9\s]/g) || []).length >= options.numSpecial;
    const hasConsecutiveChars: boolean =
      this.hasSameConsecutiveChars(password, options.noSameConsecutiveChars);
    return hasLower && hasUpper && hasNumbers && hasSpecial && !hasConsecutiveChars;
  }

  // ----------------------------------------------------------------------------

  private static hasSameConsecutiveChars(value: string, consecutiveChars: number): boolean {
    const regExp = new RegExp(`(.)\\1{${consecutiveChars - 1},}`);
    return regExp.test(value);
  }

  private checkUserName(value: string) {
    this._statusUserName = [];
    if (!value) {
      this._statusUserName.push("Username cannot be empty.");
      return;
    }
    if (!RBLoginValidator.isValidEmailAddress(
      value, this._loginCriteria.options.allowedDomains)) {
      this._statusUserName.push(`Invalid Username (${value})`);
      return;
    }
    this._userName = value;
  }

  private checkPassword(value: string) {
    this._statusPassword = [];
    if (!value) {
      this._statusPassword.push("Password cannot be empty.");
      return;
    }
    if (!RBLoginValidator.isStrongPassword(value, this._loginCriteria.options)) {
      const multiMinimum =
        this.extraSIfPlural(this._loginCriteria.options.minimumLength, "character");
      const multiLower =
        this.extraSIfPlural(this._loginCriteria.options.numLowercase, "lowercase letter");
      const multiUpper =
        this.extraSIfPlural(this._loginCriteria.options.numUppercase, "uppercase letter");
      const multiNumber =
        this.extraSIfPlural(this._loginCriteria.options.numNumbers, "number");
      const multiSpecial =
        this.extraSIfPlural(this._loginCriteria.options.numSpecial, "special character");
      const multiConsecutive =
        this.extraSIfPlural(this._loginCriteria.options.noSameConsecutiveChars,
          "consecutive, identical character");
      const constraints =
        `A password must be at least ${multiMinimum} long ` +
        `and contain at least ${multiLower}, ` +
        `${multiUpper}, ` +
        `${multiNumber}, ` +
        `${multiSpecial}, ` +
        `and less than ${multiConsecutive}.`;
      this._statusPassword.push(`Password is not strong enough.${NEWLINE}${constraints}`);
    }
    this._password = value;
  }

  private extraSIfPlural(value: number, messagePart: string): string {
    return value.toString() + SPACE + messagePart + (value > 1 ? "s" : EMPTY_STRING);
  }

}
