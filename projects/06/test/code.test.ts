import { dest } from "../src/code";

describe("dest", () => {
  test("D => 010", () => {
    // Given
    // When
    // Then
    expect(dest("D")).toBe("010");
  });

  test.each`
    a        | expected
    ${""}    | ${"000"}
    ${"M"}   | ${"001"}
    ${"D"}   | ${"010"}
    ${"MD"}  | ${"011"}
    ${"A"}   | ${"100"}
    ${"AM"}  | ${"101"}
    ${"AD"}  | ${"110"}
    ${"AMD"} | ${"111"}
  `("returns $expected when mnemonic is $a", ({ a, expected }) => {
    expect(dest(a)).toBe(expected);
  });
});
