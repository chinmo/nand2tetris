import { CodeWriter } from "../src/codeWriter"

import fs from "fs";
import { deleteTestFiles } from "./fileUtil";

describe("File creation", () => {
    afterEach(() => {
        deleteTestFiles();
    });
    
    test("When there is no .vm file, then CodeWriter do not create any .asm file", () => {
        // Given
        // When
        const writer = new CodeWriter("");
        writer.setFileName("FileDoesNotExist.vm");
        writer.close();

        // Then
        expect(fs.existsSync("FileDoesNotExist.asm")).toBeFalsy();
    })

    test("When there is a .vm file, the CodeWriter create one .asm file", () => {
        // Given
        fs.writeFileSync("test.vm", "");

        // When
        const writer = new CodeWriter("test.vm");
        writer.setFileName("test.vm");
        writer.close();

        // Then
        expect(fs.existsSync("test.asm")).toBeTruthy();
    })
})