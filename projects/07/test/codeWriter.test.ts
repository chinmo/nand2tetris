import fs from "fs";
import { CodeWriter } from "../src/codeWriter";
import { deleteTestFiles } from "./fileUtil";

describe("File creation", () => {
  afterEach(() => {
    deleteTestFiles();
  });

  test("When there is no output file, then CodeWriter do not create any .asm file", () => {
    // Given
    // When
    const writer = new CodeWriter("");
    writer.setFileName("FileDoesNotExist.vm");
    writer.close();

    // Then
    expect(fs.existsSync("FileDoesNotExist.asm")).toBeFalsy();
  });

  test("When there is a .vm file, the CodeWriter create one .asm file", () => {
    // Given
    fs.writeFileSync("test.vm", "");

    // When
    const writer = new CodeWriter("test.asm");
    writer.setFileName("test.vm");
    writer.close();

    // Then
    expect(fs.existsSync("test.asm")).toBeTruthy();
  });

  test("When CodeWriter is passed a directory path, then it create one .asm file", () => {
    // Given
    fs.mkdirSync("test/testVM", { recursive: true });
    fs.writeFileSync("test/test.vm", "");

    // When
    const writer = new CodeWriter("test/testVM.asm");
    writer.setFileName("test.vm");
    writer.close();

    // Then
    expect(fs.existsSync("test/testVM.asm")).toBeTruthy();
  });
});

describe("SimpleAdd", () => {
  // eslint-disable-next-line jest/expect-expect
  test("a", () => {
    // Given
    // When
    // Then
  });
});
