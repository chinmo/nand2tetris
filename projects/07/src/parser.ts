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
  command: string;

  constructor(vmFilePath: string) {
    this.lines = [];
    this.command = "";

    try {
      const buffer = fs.readFileSync(vmFilePath);
      if (buffer) {
        buffer
          .toString()
          .split("\n")
          .map((line) => {
            const input = this.removeComment(line).trim();
            if (input) {
              this.lines.push(input);
            }
          });
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  hasMoreCommands(): boolean {
    return this.lines.length > 0;
  }

  advance(): void {
    if (!this.hasMoreCommands()) {
      throw new Error("Illegal operation.");
    }
    this.command = <string>this.lines.shift();
  }

  private removeComment(text: string): string {
    let removedText = text;
    const i = text.indexOf("//");
    if (i >= 0) removedText = text.substring(0, i);
    return removedText;
  }
}
