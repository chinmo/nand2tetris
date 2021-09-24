import { assembleFromFile } from "../src/Assembler";
import path from "path";
import fs from "fs";

// ファイル作る
const ASM_FILE_NAME = "Prog.asm";
const HACK_FILE_NAME = "Prog.hack";

const ASM_FILE_FULLPATH = path.join(__dirname, ASM_FILE_NAME);
const HACK_FILE_FULLPATH = path.join(__dirname, HACK_FILE_NAME);

describe("Outputs .asm file.", () => {
  // ファイルが作成されているとか
  test("Exists Prog.hack", () => {
    // Given
    fs.writeFileSync(ASM_FILE_FULLPATH, "");

    // When
    return assembleFromFile(ASM_FILE_FULLPATH).then(() => {
      // Then
      expect(fs.existsSync(HACK_FILE_FULLPATH)).toBeTruthy();
    });
  });

  test("Exists Hoge.hack", () => {
    // Given
    const HOGE_ASM_PATH = path.join(__dirname, "Hoge.asm");
    fs.writeFileSync(HOGE_ASM_PATH, "");
    // When
    return assembleFromFile(HOGE_ASM_PATH).then(() => {
      // Then
      expect(fs.existsSync(path.join(__dirname, "Hoge.hack"))).toBeTruthy();
    });
  });

  test("Does not exists any hack files when there is no asm file", () => {
    // Given
    // When
    return assembleFromFile(ASM_FILE_FULLPATH).then(() => {
      // Then
      expect(fs.existsSync(HACK_FILE_FULLPATH)).toBeFalsy();
    });
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
    fs.writeFileSync(ASM_FILE_FULLPATH, "// comment:1\n  // comment:2\n");

    // When
    return assembleFromFile(ASM_FILE_FULLPATH).then(() => {
      const data = fs.readFileSync(HACK_FILE_FULLPATH, "utf-8");
      // Then
      expect(data).toEqual("");
    });
  });

  test("When asm file has comments, they are ignored.", () => {
    // Given
    fs.writeFileSync(ASM_FILE_FULLPATH, "// comment:1\n@0\n// comment:2\n");

    // When
    return assembleFromFile(ASM_FILE_FULLPATH).then(() => {
      const data = fs.readFileSync(HACK_FILE_FULLPATH, "utf-8");
      // Then
      expect(data).toEqual(expect.stringMatching("0000000000000000"));
    });
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
