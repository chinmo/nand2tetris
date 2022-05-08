import fs from "fs";
import path from "path";

export class CodeWriter {
    outputFilePath : string;

    constructor(outputPath : string) {
        this.outputFilePath = outputPath;
    }

    setFileName(fileName: string) {
    }

    close() {
        if (path.extname(this.outputFilePath) == ".asm")
            fs.writeFileSync(this.outputFilePath, "");
    }
}