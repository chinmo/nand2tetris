import { Parser } from "../src/parser";
import { A_COMMAND, C_COMMAND, L_COMMAND } from "../src/parser";
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
    rs.emit("data", "@111\n");

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });
});

describe("advance", () => {
  test("When there is some commands, it works.", () => {
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
    rs.emit("data", "@300\n@400\n");

    // When
    parser.advance();
    parser.advance();
    rs.emit("end");

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
    expect(() => parser.advance()).toThrow(Error);
  });
});

describe("commandType", () => {
  test("You must not call when there isn't any commands.", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    // Then
    expect(() => parser.commandType()).toThrow(Error);
  });

  test("When a command is '@Xxx', returns A_COMMAND.", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "@500\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
  });

  test("When a command is 'D=A', returns C_COMMAND.", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "D=A\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(C_COMMAND);
  });

  test("When a command is 'M=D', returns C_COMMAND.", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "M=D\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(C_COMMAND);
  });

  test("When a command is '(END)', returns L_COMMAND.", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "(END)\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(L_COMMAND);
  });
});

describe("symbol", () => {
  test("You must not call when command is C_COMMAND", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "M=D\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(() => parser.symbol()).toThrow(Error);
  });

  test("When command is A_COMMAND and Xxx is a number, return number", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "@600\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("600");
  });

  test("When command is A_COMMAND and Xxx is a symbole, return number from symbol table", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "@R0\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("0");
  });

  test("When command is L_COMMAND, return symbol string", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "(END)\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(L_COMMAND);
    expect(parser.symbol()).toBe("END");
  });
});

describe("dest", () => {
  test("You must not call when command is not C_COMMAND", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "@0\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(() => parser.dest()).toThrow(Error);
  });

  test("When a command is 'D=A', returns 'D'", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "D=A\n");
    parser.advance();
    // Then
    expect(parser.dest()).toBe("D");
  });

  test("When dest area has omitted in the command, returns null(empty string)", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "D;JGT\n");
    parser.advance();
    // Then
    expect(parser.dest()).toBe("");
  });
});

describe("comp", () => {
  test("You must not call when command is not C_COMMAND", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "@0\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(() => parser.comp()).toThrow(Error);
  });

  test("When a command is 'D=A', returns 'A'", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "D=A\n");
    parser.advance();
    // Then
    expect(parser.comp()).toBe("A");
  });

  test("When a command is 'D;JGT', returns 'D'", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "D;JGT\n");
    parser.advance();
    // Then
    expect(parser.comp()).toBe("D");
  });
});

describe("jump", () => {
  test("You must not call when command is not C_COMMAND", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "@0\n");
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(() => parser.jump()).toThrow(Error);
  });

  test("When a command is 'D;JGT', returns 'JGT'", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "D;JGT\n");
    parser.advance();
    // Then
    expect(parser.jump()).toBe("JGT");
  });

  test("When a command is 'D=A', returns ''", () => {
    // Given
    const rs = createMockStream();
    const parser = new Parser(rs);
    // When
    rs.emit("data", "D=A\n");
    parser.advance();
    // Then
    expect(parser.jump()).toBe("");
  });
});

function createMockStream(): stream.Readable {
  const rs = new stream.Readable();
  rs._read = function () {
    /* Do Nothing */
  };

  return rs;
}
