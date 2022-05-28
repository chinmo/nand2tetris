import fs from "fs";

export class CodeWriter {
  outputStream: fs.WriteStream;
  fileName: string;

  constructor(outputStream: fs.WriteStream) {
    this.outputStream = outputStream;
    this.outputStream.cork();
    this.fileName = "";
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setFileName(fileName: string) {
    this.fileName = fileName;
  }

  close(): void {
    this.outputStream.end();
  }
}
