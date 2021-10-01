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

describe("Predifined symbol", () => {
  test.each`
    a           | expected
    ${"SP"}     | ${0}
    ${"LCL"}    | ${1}
    ${"ARG"}    | ${2}
    ${"THIS"}   | ${3}
    ${"THAT"}   | ${4}
    ${"R0"}     | ${0}
    ${"R1"}     | ${1}
    ${"R2"}     | ${2}
    ${"R3"}     | ${3}
    ${"R4"}     | ${4}
    ${"R5"}     | ${5}
    ${"R6"}     | ${6}
    ${"R7"}     | ${7}
    ${"R8"}     | ${8}
    ${"R9"}     | ${9}
    ${"R10"}    | ${10}
    ${"R11"}    | ${11}
    ${"R12"}    | ${12}
    ${"R13"}    | ${13}
    ${"R14"}    | ${14}
    ${"R15"}    | ${15}
    ${"SCREEN"} | ${16384}
    ${"KBD"}    | ${24576}
  `("returns $expected when label is $a", ({ a, expected }) => {
    // Given
    const table = new SymbolTable();
    // When
    // Then
    expect(table.contains(a)).toBeTruthy();
    expect(table.getAddress(a)).toBe(expected);
  });
});
