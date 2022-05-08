import fs from "fs";
import path from "path";

export class CodeWriter {
    outputFileName : string;

    constructor(inputPath : string) {
        const asmFileName = path.basename(inputPath, ".vm") + ".asm";
        this.outputFileName = path.join(path.dirname(inputPath), asmFileName);
    }

    setFileName(fileName: string) {
    }

    close() {
        fs.writeFileSync(this.outputFileName, "");
    }
}