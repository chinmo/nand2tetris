import { assembleFromFile } from "../src/Assembler";
import path from "path";
import fs from "fs";

// ファイル作る
const asmFileName = "Prog.asm";
const hackFileName = "Prog.hack";

const asmFilePath = path.join(__dirname, asmFileName);
const hackFilePath = path.join(__dirname, hackFileName);

describe("Outputs .asm file.", () => {
  // ファイルが作成されているとか
  test("Exists Prog.hack", () => {
    // Given
    fs.writeFileSync(asmFilePath, "");

    // When
    assembleFromFile(asmFilePath);
    // Then
    expect(fs.existsSync(hackFilePath)).toBeTruthy();
  });

  test("Exists Hoge.hack", () => {
    // Given
    const hogeAsmPath = path.join(__dirname, "Hoge.asm");
    fs.writeFileSync(hogeAsmPath, "");
    // When
    assembleFromFile(hogeAsmPath);
    // Then
    expect(fs.existsSync(path.join(__dirname, "Hoge.hack"))).toBeTruthy();
  });

  test("Does not exists any hack files when there is no asm file", () => {
    // Given
    // When
    assembleFromFile(asmFilePath);
    // Then
    expect(fs.existsSync(hackFilePath)).toBeFalsy();
  });

  afterEach(() => {
    // *.asm, *.hack ファイルを消す
    fs.readdirSync(__dirname)
      .filter((f) => f.endsWith(".asm") || f.endsWith(".hack"))
      .map((f) => unlink(path.join(__dirname, f)));
  });
});

describe("Comments", () => {
  test("When asm file has only comments, hack file is empty.", () => {
    // Given
    fs.writeFileSync(asmFilePath, "// comment:1\n  // comment:2\n");

    // When
    assembleFromFile(asmFilePath);
    const data = fs.readFileSync(hackFilePath, "utf-8");
    // Then
    expect(data).toEqual("");
  });

  test("When asm file has comments, they are ignored.", () => {
    // Given
    fs.writeFileSync(asmFilePath, "// comment:xxx\n@0\n// comment:yyy\n");

    // When
    assembleFromFile(asmFilePath);
    const data = fs.readFileSync(hackFilePath, "utf-8");
    // Then
    expect(data).toEqual(expect.stringMatching("0000000000000000"));
  });

  afterEach(() => {
    // *.asm, *.hack ファイルを消す
    fs.readdirSync(__dirname)
      .filter((f) => f.endsWith(".asm") || f.endsWith(".hack"))
      .map((f) => unlink(path.join(__dirname, f)));
  });
});

describe("Codes", () => {
  test("A_COMMAND(value)", () => {
    // Given
    fs.writeFileSync(asmFilePath, "@2\n");

    // When
    assembleFromFile(asmFilePath);
    const data = fs.readFileSync(hackFilePath, "utf-8");
    // Then
    expect(data).toEqual(expect.stringMatching("0000000000000010"));
  });

  test("C_COMMAND", () => {
    // Given
    fs.writeFileSync(asmFilePath, "D=A\n");

    // When
    assembleFromFile(asmFilePath);
    const data = fs.readFileSync(hackFilePath, "utf-8");
    // Then
    expect(data).toEqual(expect.stringMatching("1110110000010000"));
  });

  afterEach(() => {
    // *.asm, *.hack ファイルを消す
    fs.readdirSync(__dirname)
      .filter((f) => f.endsWith(".asm") || f.endsWith(".hack"))
      .map((f) => unlink(path.join(__dirname, f)));
  });
});

describe("Symbol Table version", () => {
  test("Predefined symbol", () => {
    // Given
    fs.writeFileSync(asmFilePath, "@R0\n");

    // When
    assembleFromFile(asmFilePath);
    const data = fs.readFileSync(hackFilePath, "utf-8");
    // Then
    expect(data).toEqual(expect.stringMatching("0000000000000000"));
  });

  test("Label symbol", () => {
    // Given
    fs.writeFileSync(asmFilePath, "@TEST\n@0\n(TEST)\n@1");

    // When
    assembleFromFile(asmFilePath);
    const data = fs.readFileSync(hackFilePath, "utf-8");
    // Then
    expect(data).toEqual(
      expect.stringMatching(
        "0000000000000010\n0000000000000000\n0000000000000001\n"
      )
    );
  });

  afterEach(() => {
    // *.asm, *.hack ファイルを消す
    fs.readdirSync(__dirname)
      .filter((f) => f.endsWith(".asm") || f.endsWith(".hack"))
      .map((f) => unlink(path.join(__dirname, f)));
  });
});

function unlink(path: string): void {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.log(err);
  }
}
