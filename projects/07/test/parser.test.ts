import fs from "fs";
import { C_ARITHMETIC, C_PUSH, Parser } from "../src/parser";
import { deleteTestFiles } from "./fileUtil";

describe("Initial State", () => {
  afterEach(() => {
    deleteTestFiles();
  });

  test("When file is not exist", async () => {
    // Given
    const rs = fs.createReadStream("FilePathIsNotExist", {
      encoding: "utf-8",
    });
    // When
    const parser = await Parser.createInstance(rs);

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
    expect(typeof parser.hasMoreCommands()).toBe("boolean");
    expect(() => {
      parser.advance();
    }).toThrowError();
  });

  test("Empty file", async () => {
    // Given
    fs.writeFileSync("Hoge.vm", "");
    const rs = fs.createReadStream("Hoge.vm", { encoding: "utf-8" });

    // When
    const parser = await Parser.createInstance(rs);

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
  });
});

describe("SimpleAdd.vm", () => {
  test("Valid vm file", async () => {
    // Given
    const rs = fs.createReadStream("StackArithmetic/SimpleAdd/SimpleAdd.vm", {
      encoding: "utf-8",
    });

    // When
    const parser = await Parser.createInstance(rs);

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });

  test("First command", async () => {
    // Given
    const rs = fs.createReadStream("StackArithmetic/SimpleAdd/SimpleAdd.vm", {
      encoding: "utf-8",
    });

    const parser = await Parser.createInstance(rs);

    // When
    parser.advance();

    // Then
    expect(parser.commandType()).toBe(C_PUSH);
    expect(parser.arg1()).toBe("constant");
    expect(parser.arg2()).toBe(7);
  });

  test("Second command", async () => {
    // Given
    const rs = fs.createReadStream("StackArithmetic/SimpleAdd/SimpleAdd.vm", {
      encoding: "utf-8",
    });

    const parser = await Parser.createInstance(rs);

    // When
    parser.advance();
    parser.advance();

    // Then
    expect(parser.commandType()).toBe(C_PUSH);
    expect(parser.arg1()).toBe("constant");
    expect(parser.arg2()).toBe(8);
  });

  test("SimpleAdd.vm has 3 commands", async () => {
    // Given
    const rs = fs.createReadStream("StackArithmetic/SimpleAdd/SimpleAdd.vm", {
      encoding: "utf-8",
    });

    const parser = await Parser.createInstance(rs);

    // When
    parser.advance();
    parser.advance();
    parser.advance();

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
    expect(parser.commandType()).toBe(C_ARITHMETIC);
    expect(parser.arg1()).toBe("add");
    expect(() => {
      parser.arg2();
    }).toThrowError();
  });
});
