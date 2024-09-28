import { RBAddress, Address } from "../src/RBAddress";
import { EMPTY_STRING, NEWLINE, SPACE } from "../src/RBConstants";

/**
 * Tests for Class RBAddress to handle various address functions
 *
 * 2024-09-26:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
describe("[RBAddress]", () => {

  let address = new RBAddress({
    streetName: "Dorpsstraat",
    addressNumber: "21",
    city: "Assen",
    zipCode: "1234 AB",
    country: "Nederland",
  }, "nl-NL");
  let addressUSA = new RBAddress({
    streetName: "Mainstreet",
    addressNumber: "21",
    city: "New York",
    zipCode: "12345",
    country: "USA",
  }, "en-US");

  beforeEach(() => {
    address = new RBAddress({
      streetName: "Dorpsstraat ",
      addressNumber: "21 ",
      city: "Assen ",
      zipCode: "1234 AB ",
      country: "Nederland ",
    }, "nl-NL");
    addressUSA = new RBAddress({
      streetName: "Mainstreet ",
      addressNumber: "21 ",
      city: "New York ",
      zipCode: "12345 ",
      country: "USA ",
    }, "en-US");
  });

  describe("RBAddress class", () => {
    it("Should set and get the properties correctly", () => {
      address.streetName = "  Nieuweweg   ";
      expect(address.streetName).toBe("Nieuweweg");
      address.addressNumber = "  22   ";
      expect(address.addressNumber).toBe("22");
      address.city = "  Delft   ";
      expect(address.city).toBe("Delft");
      address.zipCode = "  1234AB    ";
      expect(address.zipCode).toBe("1234 AB");
      address.country = "  Nederland   ";
      expect(address.country).toBe("Nederland");
      address.country = SPACE;
      expect(address.country).toBe(EMPTY_STRING);
      address.language = "en-US";
      expect(address.language).toBe("en-US");
      address.multiLine = true;
      expect(address.multiLine).toBe(true);

      expect(() => { address.country = "some country"; }).
        toThrowError("Country 'some country' not supported");
      expect(() => { address.language = "ab-CD"; } ).
        toThrowError("Language 'ab-CD' not supported");
    });

    it("Should set and get zipCode correctly", () => {
      address.language = "nl-NL";
      address.zipCode = EMPTY_STRING;
      expect(address.zipCode).toBe(EMPTY_STRING);
      address.zipCode = "1234 AB";
      expect(address.zipCode).toBe("1234 AB");
      address.zipCode = "  1234AB";
      expect(address.zipCode).toBe("1234 AB");
      expect(() => { address.zipCode = "1234"; }).toThrowError("Zip code '1234' is not valid");

      addressUSA.language = "en-US";
      addressUSA.country = "  United States of America";
      expect(addressUSA.country).toBe("United States of America");
      addressUSA.zipCode = "01234";
      expect(addressUSA.zipCode).toBe("01234");
      addressUSA.zipCode = "01234-9876";
      expect(addressUSA.zipCode).toBe("01234-9876");
      addressUSA.zipCode = "01234 9876";
      expect(addressUSA.zipCode).toBe("01234 9876");
      expect(() => { addressUSA.zipCode = "1234"; }).toThrowError("Zip code '1234' is not valid");
    });

    it("Should return fullAddress correctly", () => {
      address.language = "nl-NL";
      const expectedNL = "Dorpsstraat 21, 1234 AB  Assen, Nederland";
      const expectedNLMulti = `Dorpsstraat 21${NEWLINE}1234 AB  Assen${NEWLINE}Nederland`;
      expect(address.fullAddress).toBe(expectedNL);
      address.multiLine = true;
      expect(address.multiLine).toBe(true);
      expect(address.fullAddress).toBe(expectedNLMulti);

      addressUSA.language = "en-US";
      const expectedEN = "21 Mainstreet, New York, 12345, USA";
      const expectedENMulti = `21 Mainstreet${NEWLINE}New York, 12345${NEWLINE}USA`;
      addressUSA.multiLine = false;
      expect(addressUSA.fullAddress).toBe(expectedEN);
      addressUSA.multiLine = true;
      expect(addressUSA.fullAddress).toBe(expectedENMulti);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'makeFullAddress()'", () => {

    it("Should return a full address for 'nl-NL'", () => {
      address.language = "nl-NL";
      const expected = "Dorpsstraat 21, 1234 AB  Assen, Nederland";
      const expectedMulti = `Dorpsstraat 21${NEWLINE}1234 AB  Assen${NEWLINE}Nederland`;
      const result: string = RBAddress.makeFullAddress(address, false, "nl-NL");
      expect(result).toBe(expected);
      const resultMulti: string = RBAddress.makeFullAddress(address, true, "nl-NL");
      expect(resultMulti).toBe(expectedMulti);
    });

    it("Should return a full address for 'en-US'", () => {
      addressUSA.language = "en-US";
      const expected = "21 Mainstreet, New York, 12345, USA";
      const result: string = RBAddress.makeFullAddress(addressUSA, false, "en-US");
      expect(result).toBe(expected);
    });

    it("Should return a full address", () => {
      const expected = "Dorpsstraat 21, 1234 AB  Assen, Nederland";
      const result: string = RBAddress.makeFullAddress(address, false, "nl-NL");
      expect(result).toBe(expected);
    });

    it("Should throw an error if any mandatory field is missing", () => {
      const justAddress: Address = {
        streetName: "Dorpsstraat",
        addressNumber: "21",
        zipCode: EMPTY_STRING,
        city: "Assen",
        country: EMPTY_STRING,
      };

      justAddress.streetName = EMPTY_STRING;
      expect(() => RBAddress.makeFullAddress(justAddress, false, "nl-NL")).
        toThrowError("Street, address-number and city are mandatory fields");

      justAddress.streetName = "Dorpsstraat";
      justAddress.addressNumber = EMPTY_STRING;
      expect(() => RBAddress.makeFullAddress(justAddress, false, "nl-NL")).
        toThrowError("Street, address-number and city are mandatory fields");

      justAddress.addressNumber = "21";
      justAddress.city = EMPTY_STRING;
      expect(() => RBAddress.makeFullAddress(justAddress, false, "nl-NL")).
        toThrowError("Street, address-number and city are mandatory fields");
    });

    it("Should return a full address without country if country is empty", () => {
      address.country = EMPTY_STRING;
      const expected = "Dorpsstraat 21, 1234 AB  Assen";
      const result: string = RBAddress.makeFullAddress(address, false, "nl-NL");
      expect(result).toBe(expected);
    });

    it("Should return a full address without zip code if zip code is empty", () => {
      address.language = "nl-NL";
      address.zipCode = EMPTY_STRING;
      const expected = "Dorpsstraat 21, Assen, Nederland";
      const result: string = RBAddress.makeFullAddress(address, false, "nl-NL");
      expect(result).toBe(expected);

      address.language = "de-DE";
      address.zipCode = EMPTY_STRING;
      const expectedDE = "Dorpsstraat 21, Assen, Nederland";
      const resultDE: string = RBAddress.makeFullAddress(address, false, "de-DE");
      expect(resultDE).toBe(expectedDE);
    });
  });

  // ----------------------------------------------------------------------------

  describe("private function 'getMatchingStringLength()'", () => {

    // Access the private static function using bracket notation
    it("Should return the correct values for any given RegExp", () => {
      let mask = (/^\d{4}\s?[a-zA-Z]{2}$/);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result = (RBAddress as any).getMatchingStringLength(mask);
      expect(result.exactLength).toBe(7);
      expect(result.spacePos).toBe(4);

      mask = (/^[a-zA-Z]{12}$/);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = (RBAddress as any).getMatchingStringLength(mask);
      expect(result.exactLength).toBe(12);
      expect(result.spacePos).toBe(0);

      mask = (/^\d{11}$/);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = (RBAddress as any).getMatchingStringLength(mask);
      expect(result.exactLength).toBe(11);
      expect(result.spacePos).toBe(0);
    });
  });

});
