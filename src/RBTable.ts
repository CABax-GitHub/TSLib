import { EMPTY_STRING, NEWLINE } from "./RBConstants";
import { RBFunc } from "./RBFunc";

export type DataTable = { data: (string | number)[] }[];

/**
 * Class RBTable to handle various functions to create a DataTable
 * To be added to a txt-file or outputted on the terminal.
 *
 * 2024-09-20:
 *   - documented (JSDoc comment)
 *   - checked & formatted with eslint
 *   - complete test present for 'ng test'
 *   - stryker mutation test: 100% coverage
 */

const IDX_TITLE: string = "index" as const;
const IDX_WIDTH: number = IDX_TITLE.length;

/**
 * Class to handle table formatting for exporting to file or terminal-screen.
 */
export class RBTable {

  /**
   * Return true if the dataTable has any data
   */
  public static hasData(dataTable: DataTable): boolean {
    if (!(dataTable && dataTable.length)){
      return false;
    }
    return dataTable.some((row) => row.data.some((val) => val));
  }

  /**
   * Return a string representation of the dataTable.
   * Each row will be followed by a newline character.
   * If a cell is a number, it will be right-padded with numPad spaces.
   */
  public static dataTableToString(dataTable: DataTable, numPad = 10): string {
    if (!this.hasData(dataTable)) {
      return EMPTY_STRING;
    }
    const myDataTable = this.fillEmptyFields(dataTable);
    const header: string[] = [IDX_TITLE, ...myDataTable[0].data.map((data) => data.toString())];
    const maxColWidths: number[] = this.getMaxColWidths(header, myDataTable);
    const tableParts: string[] = [
      this.getFrameLine (myDataTable, "┌", "┬", "┐", maxColWidths),
      this.getHeaderLine(myDataTable, numPad, maxColWidths),
      this.getFrameLine (myDataTable, "├", "┼", "┤", maxColWidths),
      this.getDataLines (myDataTable, numPad, maxColWidths),
      this.getFrameLine (myDataTable, "└", "┴", "┘", maxColWidths),
    ];
    return tableParts.join(EMPTY_STRING);
  }

  // ----------------------------------------------------------------------------

  /**
   * Return a string with a horizontal frame-line followed by NEWLINE.
   */
  private static getFrameLine(dataTable: DataTable,
    start: string, separator: string, end: string, maxColWidths: number[]): string {
    let result: string = this.fillWithHorizontalDashes(IDX_TITLE.length);
    for (const width of maxColWidths.slice(1, -1)) {
      result += separator + this.fillWithHorizontalDashes(width);
    }
    return start + result + end + NEWLINE;
  }

  /**
   * Return the maximum column-widths for each column in the dataTable.
   * and return that as a number array.
   */
  private static getMaxColWidths(header: string[], dataTable: DataTable): number[] {
    const initialWidths = [IDX_WIDTH, ...header.map((col) => col.length)];
    return initialWidths.map((maxLen, col) =>
      dataTable.reduce((max, row) =>
        Math.max(max, row.data[col - 1]?.toString().length || 0), maxLen),
    );
  }
  /*
  Private static getMaxColWidths(header: string[], dataTable: DataTable): number[] {
    const initialWidths = [IDX_WIDTH, ...header.map((col) => col.length)];
    return initialWidths.map((maxLen, col) =>
      dataTable.slice(1).reduce((max, row) =>
        Math.max(max, row.data[col - 1]?.toString().length || 0), maxLen),
    );
  }
*/

  /**
   * Return a new dataTable with all rows having the same number of columns
   * by filling empty fields with an empty string.
   */
  private static fillEmptyFields(dataTable: DataTable): DataTable {
    const totalFields: number = dataTable[0].data.length;
    return dataTable.map((row) => {
      const filledData = row.data.concat(Array(totalFields - row.data.length).fill(EMPTY_STRING));
      return { ...row, data: filledData };
    });
  }

  /**
   * Return the header-row as a string, including a NEWLINE.
   */
  private static getHeaderLine(
    dataTable: DataTable, numPad: number, maxColWidths: number[]): string {
    const headerRow = dataTable[0];
    return `│ ${IDX_TITLE} │ ${headerRow.data.map((val, col) => {
      return this.isNumber(val) ? val.toString().padStart(numPad)
        : val.toString().padEnd(maxColWidths[col + 1]);
    }).join(" │ ")} │${NEWLINE}`;
  }

  /**
   * Return all data-rows as a single string,
   * where each row is followed by a NEWLINE.
   */
  private static getDataLines(
    dataTable: DataTable, numPad: number, maxColWidths: number[]): string {
    let indexCounter = 0; // Initialize a separate row index-counter
    return dataTable.slice(1).map((row) => {
      let indexValue: string = EMPTY_STRING.padStart(IDX_WIDTH);
      if (row.data.some((val) => this.rowHasData(val))) {
        indexCounter++; // Increment the row index-counter if the row has data
        indexValue = indexCounter.toString().padStart(IDX_WIDTH);
      }
      const rowData: string = row.data.map((val, col) => {
        if (!val) {
          return EMPTY_STRING.padEnd(maxColWidths[col + 1]);
        }
        return (this.isNumber(val) ? RBFunc.pad(val, numPad) : val.toString()).
          padEnd(maxColWidths[col + 1])
        ;
      }).join(" │ ");
      return `│ ${indexValue} │ ${rowData} │${NEWLINE}`;
    }).join(EMPTY_STRING);
  }

  /**
   * Return if the row has any non-empty values in columns 2 and onwards.
   * Column 1 is the index column and will be empty too if the row is empty.
   */
  private static rowHasData(value: string | number): boolean {
    // eslint-disable-next-line no-undefined
    return value !== null && value !== undefined && value.toString().trim() !== EMPTY_STRING;
  }

  /**
   * Return if the value is a number
   */
  private static isNumber(value: string | number): boolean {
    return typeof value === "number";
  }

  /**
   * Return a string of 'length' horizontal dashes
   */
  private static fillWithHorizontalDashes(length: number): string {
    return "─".repeat(length + 2); // +2 for spaces (cell-padding)
  }

}
