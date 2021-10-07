import { Parser } from "../src/parser";
import { A_COMMAND, C_COMMAND, L_COMMAND } from "../src/parser";
import fs from "fs";
import path from "path";

const asmPath = path.join(__dirname, "Prog.asm");

describe("constructor", () => {
  afterEach(() => {
    deleteAsmFile();
  });

  test("Initial state", () => {
    // Given
    fs.writeFileSync(asmPath, "");
    // When
    const parser = new Parser(asmPath);

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
  });

  test("Initial state when asm file has some command.", () => {
    // Given
    fs.writeFileSync(asmPath, "@111\n");
    // When
    const parser = new Parser(asmPath);

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });
});

describe("advance", () => {
  afterEach(() => {
    deleteAsmFile();
  });

  test("When there is some commands, it works.", () => {
    // Given
    fs.writeFileSync(asmPath, "@100\n@200\n");

    const parser = new Parser(asmPath);

    // When
    parser.advance();

    // Then
    expect(parser.hasMoreCommands()).toBeTruthy();
  });

  test("You must not call when there isn't any commands.", () => {
    // Given
    fs.writeFileSync(asmPath, "@300\n@400\n");

    const parser = new Parser(asmPath);

    // When
    parser.advance();
    parser.advance();

    // Then
    expect(parser.hasMoreCommands()).toBeFalsy();
    expect(() => parser.advance()).toThrow(Error);
  });
});

describe("commandType", () => {
  afterEach(() => {
    deleteAsmFile();
  });

  test("You must not call when there isn't any commands.", () => {
    // Given
    fs.writeFileSync(asmPath, "");

    const parser = new Parser(asmPath);
    // When
    // Then
    expect(() => parser.commandType()).toThrow(Error);
  });

  test("When a command is '@Xxx', returns A_COMMAND.", () => {
    // Given
    fs.writeFileSync(asmPath, "@500\n");

    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
  });

  test("When a command is 'D=A', returns C_COMMAND.", () => {
    // Given
    fs.writeFileSync(asmPath, "D=A\n");

    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(C_COMMAND);
  });

  test("When a command is 'M=D', returns C_COMMAND.", () => {
    // Given
    fs.writeFileSync(asmPath, "M=D\n");

    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(C_COMMAND);
  });

  test("When a command is '(END)', returns L_COMMAND.", () => {
    // Given
    fs.writeFileSync(asmPath, "(END)\n");

    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(L_COMMAND);
  });
});

describe("symbol", () => {
  afterEach(() => {
    deleteAsmFile();
  });

  test("You must not call when command is C_COMMAND", () => {
    // Given
    fs.writeFileSync(asmPath, "M=D\n");

    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(() => parser.symbol()).toThrow(Error);
  });

  test("When command is A_COMMAND and Xxx is a number, return number", () => {
    // Given
    fs.writeFileSync(asmPath, "@600\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("600");
  });

  test("When command is L_COMMAND, return symbol string", () => {
    // Given
    fs.writeFileSync(asmPath, "(END)\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(L_COMMAND);
    expect(parser.symbol()).toBe("END");
  });
});

describe("dest", () => {
  afterEach(() => {
    deleteAsmFile();
  });

  test("You must not call when command is not C_COMMAND", () => {
    // Given
    fs.writeFileSync(asmPath, "@0\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(() => parser.dest()).toThrow(Error);
  });

  test("When a command is 'D=A', returns 'D'", () => {
    // Given
    fs.writeFileSync(asmPath, "D=A\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.dest()).toBe("D");
  });

  test("When dest area has omitted in the command, returns null(empty string)", () => {
    // Given
    fs.writeFileSync(asmPath, "D;JGT\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.dest()).toBe("");
  });
});

describe("comp", () => {
  afterEach(() => {
    deleteAsmFile();
  });

  test("You must not call when command is not C_COMMAND", () => {
    // Given
    fs.writeFileSync(asmPath, "@0\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(() => parser.comp()).toThrow(Error);
  });

  test("When a command is 'D=A', returns 'A'", () => {
    // Given
    fs.writeFileSync(asmPath, "D=A\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.comp()).toBe("A");
  });

  test("When a command is 'D;JGT', returns 'D'", () => {
    // Given
    fs.writeFileSync(asmPath, "D;JGT\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.comp()).toBe("D");
  });
});

describe("jump", () => {
  afterEach(() => {
    deleteAsmFile();
  });

  test("You must not call when command is not C_COMMAND", () => {
    // Given
    fs.writeFileSync(asmPath, "@0\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(() => parser.jump()).toThrow(Error);
  });

  test("When a command is 'D;JGT', returns 'JGT'", () => {
    // Given
    fs.writeFileSync(asmPath, "D;JGT\n");
    // When
    const parser = new Parser(asmPath);
    // When
    parser.advance();
    // Then
    expect(parser.jump()).toBe("JGT");
  });

  test("When a command is 'D=A', returns ''", () => {
    // Given

    fs.writeFileSync(asmPath, "D=A\n");
    // When
    const parser = new Parser(asmPath);
    // When

    //const parser = initParser("D=A\n");
    parser.advance();
    // Then
    expect(parser.jump()).toBe("");
  });
});

function deleteAsmFile() {
  fs.readdirSync(__dirname)
    .filter((f) => f.endsWith(".asm"))
    .map((f) => unlink(path.join(__dirname, f)));
}

function unlink(path: string): void {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.log(err);
  }
}
