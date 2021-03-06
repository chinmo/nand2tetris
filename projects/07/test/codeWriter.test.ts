import fs from "fs";
import { CodeWriter } from "../src/codeWriter";
import { C_PUSH } from "../src/parser";
import { A_COMMAND, C_COMMAND, Parser as AsmParser } from "./asmParser";
import { deleteTestFiles, waitWriteStreamFinished } from "./fileUtil";

describe("File creation", () => {
  afterEach(() => {
    deleteTestFiles();
  });

  test("When there is no output file, then CodeWriter do not create any .asm file", () => {
    // Given
    const stream = fs
      .createWriteStream("", { encoding: "utf-8" })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .on("error", () => {});
    // When
    const writer = new CodeWriter(stream);
    writer.setFileName("FileDoesNotExist.vm");
    writer.close();

    // Then
    expect(fs.existsSync("FileDoesNotExist.asm")).toBeFalsy();
  });

  test("When there is a .vm file, the CodeWriter create one .asm file", async () => {
    // Given
    const stream = fs
      .createWriteStream("test.asm", { encoding: "utf-8" })
      .on("error", (err) => {
        console.log(err);
      });

    // When
    const writer = new CodeWriter(stream);
    writer.setFileName("test.vm");
    writer.close();
    await waitWriteStreamFinished(stream);

    // Then
    expect(fs.existsSync("test.asm")).toBeTruthy();
  });

  test("When CodeWriter is passed a directory path, then it create one .asm file", async () => {
    // Given
    fs.mkdirSync("test/testVM", { recursive: true });
    fs.writeFileSync("test/test.vm", "");

    const stream = fs
      .createWriteStream("test/testVM.asm", { encoding: "utf-8" })
      .on("error", (err) => {
        console.log(err);
      });

    // When
    const writer = new CodeWriter(stream);
    writer.setFileName("test.vm");
    writer.close();
    await waitWriteStreamFinished(stream);

    // Then
    expect(fs.existsSync("test/testVM.asm")).toBeTruthy();
  });
});

describe("Initial asm code", () => {
  afterEach(() => {
    deleteTestFiles();
  });

  test("Whether right initial code", async () => {
    // Given
    const stream = fs
      .createWriteStream("test/Empty.asm", { encoding: "utf-8" })
      .on("error", (err) => {
        console.log(err);
      });

    // When
    const writer = new CodeWriter(stream);
    writer.setFileName("Empty.vm");
    writer.close();
    await waitWriteStreamFinished(stream);

    // Then
    const parser = new AsmParser("test/Empty.asm");
    expect(parser.hasMoreCommands()).toBeTruthy();

    // @256
    parser.advance();
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("256");

    // D=A
    parser.advance();
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(parser.dest()).toBe("D");
    expect(parser.comp()).toBe("A");

    // @SP
    parser.advance();
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("SP");

    // M=D
    parser.advance();
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(parser.dest()).toBe("M");
    expect(parser.comp()).toBe("D");

    // No More Commands
    expect(parser.hasMoreCommands()).toBeFalsy();
  });
});

describe("SimpleAdd", () => {
  afterEach(() => {
    deleteTestFiles();
  });

  test("first command", async () => {
    // vm: push constant 7

    // Given
    const stream = fs
      .createWriteStream("test/SimpleAdd.asm", { encoding: "utf-8" })
      .on("error", (err) => {
        console.log(err);
      });

    // When
    const writer = new CodeWriter(stream);
    writer.setFileName("SimpleAdd.vm");
    writer.writePushPop(C_PUSH, "constant", 7);
    writer.close();
    await waitWriteStreamFinished(stream);
    const parser = new AsmParser("test/SimpleAdd.asm");

    // Then
    parser.advance(4);

    // @7
    parser.advance();
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("7");

    // D=A
    parser.advance();
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(parser.dest()).toBe("D");
    expect(parser.comp()).toBe("A");

    // @SP
    // A=M
    // M=D
    // @SP
    // AM=M+1 // 257
    parser.advance(5);
    expect(parser.hasMoreCommands()).toBeFalsy();
  });

  test("second command", async () => {
    // vm: push constant 8

    // Given
    const stream = fs
      .createWriteStream("test/SimpleAdd.asm", { encoding: "utf-8" })
      .on("error", (err) => {
        console.log(err);
      });

    // When
    const writer = new CodeWriter(stream);
    writer.setFileName("SimpleAdd.vm");
    writer.writePushPop(C_PUSH, "constant", 8);
    writer.close();
    await waitWriteStreamFinished(stream);
    const parser = new AsmParser("test/SimpleAdd.asm");

    // Then
    parser.advance(4);

    // @8
    parser.advance();
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("8");
  });

  test("third command", async () => {
    // Given
    const stream = fs
      .createWriteStream("test/SimpleAdd.asm", { encoding: "utf-8" })
      .on("error", (err) => {
        console.log(err);
      });

    // When
    const writer = new CodeWriter(stream);
    writer.setFileName("SimpleAdd.vm");
    writer.writePushPop(C_PUSH, "constant", 7);
    writer.writePushPop(C_PUSH, "constant", 8);
    writer.writeArithmetic("add");
    writer.close();
    await waitWriteStreamFinished(stream);
    const parser = new AsmParser("test/SimpleAdd.asm");

    // Then
    parser.advance(18);

    // @SP // R0(258)
    parser.advance();
    expect(parser.commandType()).toBe(A_COMMAND);
    expect(parser.symbol()).toBe("SP");

    // AM=M-1 // A, SP = 257
    parser.advance();
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(parser.dest()).toBe("AM");
    expect(parser.comp()).toBe("M-1");

    // D=M // D = RAM[257](=8)
    parser.advance();
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(parser.dest()).toBe("D");
    expect(parser.comp()).toBe("M");

    // A=A-1 // A = 256
    parser.advance();
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(parser.dest()).toBe("A");
    expect(parser.comp()).toBe("A-1");

    // M=M+D // RAM[256] = RAM[256] + 8
    parser.advance();
    expect(parser.commandType()).toBe(C_COMMAND);
    expect(parser.dest()).toBe("M");
    expect(parser.comp()).toBe("M+D");
  });
});
