import fs from "fs";
import { vmTranslator } from "../src/vmTranslator";
import { deleteTestFiles } from "./fileUtil";

describe("File Handling", () => {
  afterEach(() => {
    deleteTestFiles();
  });

  test("Invalid path", async () => {
    // Given
    // When
    await vmTranslator("InvalidPath.vm");
    // Then
    expect(fs.existsSync("InvalidPath.asm")).toBeFalsy();
  });

  test("Single file", async () => {
    // Given
    fs.writeFileSync("Hoge.vm", "");
    // When
    await vmTranslator("Hoge.vm");
    // Then
    expect(fs.existsSync("Hoge.asm")).toBeTruthy();
  });
});
