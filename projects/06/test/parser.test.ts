import { Parser } from "../src/parser";
import stream from "stream";

test("Initial state", () => {
  // Given
  const rs = new stream.Readable();
  rs._read = function (size: number) {
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
  rs._read = function (size: number) {
    /* Do Nothing */
  };
  // When
  const parser = new Parser(rs);
  rs.emit("data", "0000000000000000\n");

  // Then
  expect(parser.hasMoreCommands()).toBeTruthy();
});
