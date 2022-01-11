import { Parser } from "../src/parser";

describe("constructor", () => {
  test("Initial state", () => {
    // Given

    // When
    const parser = new Parser();

    // Then
    expect(parser).not.toBeNull();
  });
});
