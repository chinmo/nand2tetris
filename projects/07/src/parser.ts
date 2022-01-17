import fs from "fs";

const Command = {
  Arithmetic: 0,
  Push: 1,
  Pop: 2,
  Label: 3,
  Goto: 4,
  If: 5,
  Function: 6,
  Return: 7,
  Call: 8,
} as const;

export class Parser {
  lines: string[];

  constructor(vmFilePath: string) {
    this.lines = [];

    try {
      const buffer = fs.readFileSync(vmFilePath);
      if (buffer) {
        buffer
          .toString()
          .split("\n")
          .map((line) => {
            if (line) {
              this.lines.push(line);
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  hasMoreCommands(): boolean {
    return this.lines.length > 0;
  }

  advance(): any {
    throw new Error("Illegal operation.");
  }
}
