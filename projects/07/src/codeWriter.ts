import fs from "fs";
import { CommandType } from "../src/parser";

export class CodeWriter {
  outputStream: fs.WriteStream;
  fileName: string;

  constructor(outputStream: fs.WriteStream) {
    this.outputStream = outputStream;
    this.outputStream.cork();
    this.fileName = "";

    // Initial code
    this.outputStream.write("@256\nD=A\n@SP\nM=D\n");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setFileName(fileName: string) {
    this.fileName = fileName;
  }

  writePushPop(command: CommandType, segment: string, index: number): void {
    this.outputStream.write("@" + index.toString() + "\n");
    this.outputStream.write("D=A\n");
    this.outputStream.write("@SP\n");
    this.outputStream.write("A=M\n");
    this.outputStream.write("M=D\n");
    this.outputStream.write("@SP\n");
    this.outputStream.write("AM=M+1\n");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeArithmetic(command: string): void {
    this.outputStream.write("@SP\n");
    this.outputStream.write("AM=M-1\n");
    this.outputStream.write("D=M\n");
    this.outputStream.write("A=A-1\n");
    this.outputStream.write("M=M+D\n");
  }

  close(): void {
    this.outputStream.end();
  }
}
