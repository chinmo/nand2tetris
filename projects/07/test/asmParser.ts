import fs from "fs";

const COMMAND_TYPE = {
  A_COMMAND: 0,
  C_COMMAND: 1,
  L_COMMAND: 2,
} as const;

type COMMAND_TYPE = typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE];

export const A_COMMAND = COMMAND_TYPE.A_COMMAND;
export const C_COMMAND = COMMAND_TYPE.C_COMMAND;
export const L_COMMAND = COMMAND_TYPE.L_COMMAND;

export class Parser {
  lines: string[];
  command: string;

  constructor(asmPath: string) {
    this.lines = [];
    this.command = "";

    if (asmPath) {
      const buffer = fs.readFileSync(asmPath);
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
  }

  hasMoreCommands(): boolean {
    return this.lines.length > 0;
  }

  advance(count = 1): void {
    for (let i = 0; i < count; i++) {
      if (!this.hasMoreCommands())
        throw new Error(
          "advance() can not call when hasMoreCommand() is not true!"
        );

      this.command = <string>this.lines.shift();
    }
  }

  commandType(): COMMAND_TYPE {
    if (!this.command) throw new Error("No commands");

    return this.isA() ? A_COMMAND : this.isL() ? L_COMMAND : C_COMMAND;
  }

  symbol(): string {
    if (this.commandType() == C_COMMAND)
      throw new Error("Command is C_COMMAND!");

    let result = "";
    if (this.isA()) {
      result = this.command.substring(1);
    } else {
      result = this.command.replace(/\(|\)/g, "");
    }
    return result;
  }

  dest(): string {
    if (this.commandType() != C_COMMAND)
      throw new Error("Command is not C_COMMAND");

    return this.command.substring(0, this.command.indexOf("="));
  }

  comp(): string {
    if (this.commandType() != C_COMMAND)
      throw new Error("Command is not C_COMMAND");

    const i = this.command.indexOf("=");
    return i >= 0
      ? this.command.substring(i + 1)
      : this.command.substring(0, this.command.indexOf(";"));
  }

  jump(): string {
    if (this.commandType() != C_COMMAND)
      throw new Error("Command is not C_COMMAND");

    const i = this.command.indexOf(";");
    return i >= 0 ? this.command.substring(i + 1) : "";
  }

  private isA(): boolean {
    return this.command.match(/^@/) != null;
  }

  private isL(): boolean {
    return this.command.match(/^\(.+\)$/) != null;
  }

  private removeComment(text: string): string {
    let removedText = text;
    const i = text.indexOf("//");
    if (i >= 0) removedText = text.substring(0, i);
    return removedText;
  }
}
