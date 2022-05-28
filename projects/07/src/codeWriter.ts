import fs from "fs";
import { CommandType } from "../src/parser";

export class CodeWriter {
  outputStream: fs.WriteStream;
  fileName: string;

  constructor(outputStream: fs.WriteStream) {
    this.outputStream = outputStream;
    this.outputStream.cork();
    this.fileName = "";

    // @256
    // D=A
    // @SP
    // M=D
    this.outputStream.write("@256\nD=A\n@SP\nM=D\n");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setFileName(fileName: string) {
    this.fileName = fileName;
  }

  writePushPop(command: CommandType, segment: string, index: number): void {
    this.outputStream.write("hoge");
  }
  close(): void {
    this.outputStream.end();
  }
}
