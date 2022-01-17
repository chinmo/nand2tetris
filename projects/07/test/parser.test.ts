import { Parser } from "../src/parser";

import fs from "fs";
import path from "path";

const vmPath = path.join(__dirname, "Hoge.vm");

describe("Initial State", () => {
  afterEach(() => {
    deleteVmFile();
  });

  test("When file is not exist", () => {
    // Given
    // When
    const parser = new Parser("FilePathIsNotExist");

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
    expect(typeof parser.hasMoreCommands()).toBe("boolean");
    expect(() => {
      parser.advance();
    }).toThrowError();
  });

  test("Empty file", () => {
    // Given
    fs.writeFileSync(vmPath, "");

    // When
    const parser = new Parser(vmPath);

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
  });

  test("Valid vm file", () => {
    // Given

    // When
    const parser = new Parser("StackArithmetic/SimpleAdd/SimpleAdd.vm");

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });
});

function deleteVmFile() {
  fs.readdirSync(__dirname)
    .filter((f) => f.endsWith(".vm"))
    .map((f) => unlink(path.join(__dirname, f)));
}

function unlink(path: string): void {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.log(err);
  }
}
