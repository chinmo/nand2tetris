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

type CommandType = typeof Command[keyof typeof Command];

export const C_ARITHMETIC = Command.Arithmetic;
export const C_PUSH = Command.Push;
export class Parser {
  lines: string[];
  command: string;

  constructor(vmFilePath: string) {
    this.lines = [];
    this.command = "";

    try {
      const buffer = fs.readFileSync(vmFilePath, 'utf-8');
      if (buffer) {
        buffer
          .split(/\r?\n/)
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

  commandType(): CommandType {
    return this.command.match(/push/) ? C_PUSH : C_ARITHMETIC;
  }

  arg1(): string {
    return (this.commandType() == C_ARITHMETIC) ? this.command.split(" ")[0] : this.command.split(" ")[1];
  }

  arg2(): number {
    if (this.commandType() == C_ARITHMETIC) {
      throw new Error("Illegal operation.");
    }
    return +this.command.split(" ")[2];
  }

  private removeComment(text: string): string {
    let removedText = text;
    const i = text.indexOf("//");
    if (i >= 0) removedText = text.substring(0, i);
    return removedText;
  }
}
