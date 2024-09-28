import { EMPTY_STRING, SPACE } from "../src/RBConstants";
import { RBTable, DataTable } from "../src/RBTable";
import { anyNull, anyUndefined } from "./Shared.spec";

/**
 * Tests for Class RBTable to handle various functions to create a DataTable
 * To be added to a txt-file or outputted on the terminal.
 *
 * 2024-09-20:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

/* eslint-disable max-lines-per-function */
describe("[RBTable]", () => {

  describe("function 'hasData()'", () => {

    it("Should return false for empty table, otherwise true", () => {
      const dataTable: DataTable = [];
      let result = RBTable.hasData(dataTable);

      expect(result).toBeFalsy();

      dataTable.push({ data: ["Name", "Value", "Note"] });
      result = RBTable.hasData(dataTable);

      expect(result).toBeTruthy();
      dataTable.push({ data: ["ID", "21"] });
      result = RBTable.hasData(dataTable);

      expect(result).toBeTruthy();
      dataTable.push({ data: ["Filename", "test.txt", "fake"] });
      result = RBTable.hasData(dataTable);

      expect(result).toBeTruthy();
    });

    it("Should return false if all rows are empty", () => {
      const dataTable: DataTable = [
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
      ];
      const result = RBTable.hasData(dataTable);

      expect(result).toBeFalsy();
    });

    it("Should return true if at least one row has data", () => {
      const dataTable: DataTable = [
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
        { data: ["ID", EMPTY_STRING, EMPTY_STRING] },
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
      ];
      const result = RBTable.hasData(dataTable);

      expect(result).toBeTruthy();
    });

    it("Should return true if at least one cell has data", () => {
      const dataTable: DataTable = [
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
        { data: [EMPTY_STRING, "21", EMPTY_STRING] },
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
      ];
      const result = RBTable.hasData(dataTable);

      expect(result).toBeTruthy();
    });

    it("Should return false if all cells are empty strings", () => {
      const dataTable: DataTable = [
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] },
      ];
      const result = RBTable.hasData(dataTable);

      expect(result).toBeFalsy();
    });

    it("Should return false if all cells are null or undefined", () => {
      const dataTable: DataTable = [
        { data: [anyNull, anyNull, anyNull] },
        { data: [anyUndefined, anyUndefined, anyUndefined] },
        { data: [anyNull, anyUndefined, anyNull] },
      ];
      const result = RBTable.hasData(dataTable);

      expect(result).toBeFalsy();
    });

  });

  // ----------------------------------------------------------------------------

  describe("private function 'rowHasData()'", () => {

    it("should correctly if a number or string has data (using Reflexion!!)", () => {

      // Access the private method using reflection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasData = (RBTable as any).rowHasData;

      expect(hasData(123)).toBe(true);
      expect(hasData("123")).toBe(true);
      expect(hasData(0)).toBe(true);
      expect(hasData("0")).toBe(true);
      expect(hasData(-123)).toBe(true);
      expect(hasData(EMPTY_STRING)).toBe(false);
      expect(hasData(SPACE)).toBe(false);
      expect(hasData(" 123 ")).toBe(true);
    });
  });

  // ----------------------------------------------------------------------------

  describe("private function 'isNumber()'", () => {

    it("should correctly identify numbers using isNumber (using Reflexion!!)", () => {
      // Access the private method using reflection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isNumberMethod = (RBTable as any).isNumber;

      expect(isNumberMethod(123)).toBe(true);
      expect(isNumberMethod("123")).toBe(false);
      expect(isNumberMethod(0)).toBe(true);
      expect(isNumberMethod("0")).toBe(false);
      expect(isNumberMethod(-123)).toBe(true);
      expect(isNumberMethod(EMPTY_STRING)).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------

  describe("function 'dataTableToString()'", () => {
    let dataTable: DataTable = [];
    dataTable.push({ data: ["Name", "Value", "Note"] });
    dataTable.push({ data: ["ID", "21"] });
    dataTable.push({ data: ["Filename", "test.txt", "fake"] });

    it("Should return a formatted table as string", () => {
      const expectedStrings = [
        "┌───────┬──────────┬──────────┬───────┐",
        "│ index │ Name     │ Value    │ Note  │",
        "├───────┼──────────┼──────────┼───────┤",
        "│     1 │ ID       │ 21       │       │",
        "│     2 │ Filename │ test.txt │ fake  │",
        "└───────┴──────────┴──────────┴───────┘",
      ];
      const result: string = RBTable.dataTableToString(dataTable);
      expectedStrings.forEach((expected) => {
        expect(result).toContain(expected);
      });
    });

    it("Should return an empty string if dataTable is []", () => {
      const saveDataTable: DataTable = dataTable;
      dataTable = [];
      const expected: string = EMPTY_STRING;
      const result: string = RBTable.dataTableToString(dataTable);

      expect(result).toBe(expected);
      dataTable = saveDataTable;
    });

    it("Should return an empty string if dataTable is null or undefined", () => {
      const expected: string = EMPTY_STRING;
      const resultN: string = RBTable.dataTableToString(anyNull);
      const resultU: string = RBTable.dataTableToString(anyUndefined);

      expect(resultN).toBe(expected);
      expect(resultU).toBe(expected);
    });

    it("should add empty lines for rows without data", () => {
      const myDataTable: DataTable = [
        { data: ["Name", "Value", "Note"] },
        { data: ["ID", "21"] },
        { data: ["Filename", "test.txt", "fake"] },
        { data: [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING] }, // Empty row
        { data: [anyNull, anyNull, anyNull] }, // Row with null values
        { data: [anyUndefined, anyUndefined, anyUndefined] }, // Row with undefined values
      ];
      const result: string = RBTable.dataTableToString(myDataTable);
      // Check that the result contains the rows with data
      expect(result).toContain("│ index │ Name     │ Value    │ Note  │");
      expect(result).toContain("│     1 │ ID       │ 21       │       │");
      expect(result).toContain("│     2 │ Filename │ test.txt │ fake  │");
      // Check that the result contains exactly 3 empty rows
      const emptyRow = "│       │          │          │       │";

      expect(result.split(emptyRow).length - 1).toBe(3); // Ensure there are
    });
  });

});
