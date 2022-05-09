import fs from "fs";
import path from "path";

export class CodeWriter {
  outputFilePath: string;

  constructor(outputPath: string) {
    this.outputFilePath = outputPath;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
  setFileName(fileName: string) {}

  close(): void {
    if (path.extname(this.outputFilePath) == ".asm")
      fs.writeFileSync(this.outputFilePath, "");
  }
}
