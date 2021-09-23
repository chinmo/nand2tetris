import { Parser } from "../src/parser";
import stream from "stream";

describe("constructor", () => {
  test("Initial state", () => {
    // Given
    const rs = new stream.Readable();
    rs._read = function () {
      /* Do Nothing */
    };
    // When
    const parser = new Parser(rs);

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
  });

  test("Initial state when asm file has some command.", () => {
    // Given
    const rs = new stream.Readable();
    rs._read = function () {
      /* Do Nothing */
    };
    // When
    const parser = new Parser(rs);
    rs.emit("data", "0000000000000000\n");

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });
});

describe("advance", () => {
  test("When there is no commands, advance() does not any works.", () => {
    // Given
    const rs = new stream.Readable();
    rs._read = function () {
      /* Do Nothing */
    };

    const parser = new Parser(rs);
    rs.emit("data", "0000000000000000\n");
    rs.emit("data", "0000000000000000\n");

    // When
    parser.advance();

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });

  test("You must not call when there isn't any commands.", () => {
    // Given
    const rs = new stream.Readable();
    rs._read = function () {
      /* Do Nothing */
    };

    const parser = new Parser(rs);
    rs.emit("data", "0000000000000000\n");
    rs.emit("data", "0000000000000000\n");

    // When
    parser.advance();
    parser.advance();
    rs.emit("end");

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
    expect(() => parser.advance()).toThrow(Error);
  });
});
