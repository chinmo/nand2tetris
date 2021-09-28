import { SymbolTable } from "../src/symbol_table";

describe("initialize", () => {
  test("When you create an instance, there is no symbol", () => {
    // Given
    const table = new SymbolTable();
    // When
    // Then
    expect(table.contains("test")).toBeFalsy();
  });
});

describe("Create table", () => {
  test("When you add an entry, you can get it", () => {
    // Given
    const table = new SymbolTable();
    // When
    table.addEntry("test", 123);
    // Then
    expect(table.contains("test")).toBeTruthy();
    expect(table.getAddress("test")).toBe(123);
  });
});
