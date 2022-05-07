import fs from "fs";
import path from "path";

export class CodeWriter {
    outputFileName : string;

    constructor(inputPath : string) {
        this.outputFileName = path.basename(inputPath, ".vm") + ".asm";
    }

    setFileName(fileName: string) {
    }

    close() {
        fs.writeFileSync(this.outputFileName, "");
    }
}