import fs from "fs";
import { CodeWriter } from "../src/codeWriter";
import { C_PUSH } from "../src/parser";
import { Parser as AsmParser } from "./asmParser";
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

describe("SimpleAdd", () => {
  // eslint-disable-next-line jest/expect-expect
  test("first command", async () => {
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

    // Then ここで、06/src/Parserでテストするのがええんちゃうの！
    const parser = new AsmParser("test/SimpleAdd.asm");
    expect(parser.hasMoreCommands()).toBeTruthy();
  });
});
