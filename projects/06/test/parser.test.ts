import { Parser } from "../src/parser";
import stream from "stream";

describe("constructor", () => {
  test("Initial state", () => {
    // Given
    const rs = createMockStream();

    // When
    const parser = new Parser(rs);

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
  });

  test("Initial state when asm file has some command.", () => {
    // Given
    const rs = createMockStream();
    // When
    const parser = new Parser(rs);
    rs.emit("data", "@100\n");

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });

  test("Initial state when asm file has only comments.", () => {
    // Given
    const rs = createMockStream();
    // When
    const parser = new Parser(rs);
    rs.emit("data", "// comments1\n");
    rs.emit("data", " // comments2\n");

    // Then
    expect(rs.isPaused()).toBeFalsy();
    expect(parser.hasMoreCommands()).toBeFalsy();
  });

  test("Initial state when asm file has command with some comments.", () => {
    // Given
    const rs = createMockStream();
    // When
    const parser = new Parser(rs);
    rs.emit("data", "// comments1\n");
    rs.emit("data", "@100\n");

    // Then
    expect(rs.isPaused()).toBeTruthy();
    expect(parser.hasMoreCommands()).toBeTruthy();
  });
});

describe("advance", () => {
  test("When there is no commands, advance() does not any works.", () => {
    // Given
    const rs = createMockStream();

    const parser = new Parser(rs);
    rs.emit("data", "@100\n");
    rs.emit("data", "@200\n");

    // When
    parser.advance();

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });

  test("You must not call when there isn't any commands.", () => {
    // Given
    const rs = createMockStream();

    const parser = new Parser(rs);
    rs.emit("data", "@100\n");
    rs.emit("data", "@200\n");

    // When
    parser.advance();
    parser.advance();
    rs.emit("end");

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
    expect(() => parser.advance()).toThrow(Error);
  });
});

function createMockStream(): stream.Readable {
  const rs = new stream.Readable();
  rs._read = function () {
    /* Do Nothing */
  };

  return rs;
}
