import { CodeWriter } from "../src/codeWriter"

import fs from "fs";

describe("File creation", () => {
    test("When there is no .vm file, then CodeWrite do not create any .asm file", () => {
        // Given
        // When
        const writer = new CodeWriter("");
        writer.setFileName("FileDoesNotExist.vm");

        // Then
        expect(fs.existsSync("FileDoesNotExist.asm")).toBeFalsy();
    })
})