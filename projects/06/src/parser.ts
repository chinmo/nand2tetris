import readline from "readline";
import stream from "stream";

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
  rl: readline.Interface;
  lines: string[];
  command: string;

  constructor(rs: stream.Readable) {
    this.rl = readline.createInterface({
      input: rs,
      crlfDelay: Infinity,
    });
    this.lines = [];
    this.command = "";

    this.rl.on("line", (line) => {
      const input = this.removeComment(line).trim();
      if (input) {
        this.lines.push(input);
      }
    });
  }

  hasMoreCommands(): boolean {
    return this.lines.length > 0;
  }

  advance(): void {
    if (!this.hasMoreCommands())
      throw new Error(
        "advance() can not call when hasMoreCommand() is not true!"
      );

    this.command = <string>this.lines.shift();
  }

  commandType(): COMMAND_TYPE {
    if (!this.command) throw new Error("No commands");
    if (this.isA()) return A_COMMAND;
    return C_COMMAND;
  }

  symbol(): string {
    if (this.commandType() != A_COMMAND)
      throw new Error("Command is not A_COMMAND");

    return this.command.substring(1);
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

  private removeComment(text: string): string {
    let removedText = text;
    const i = text.indexOf("//");
    if (i >= 0) removedText = text.substring(0, i);
    return removedText;
  }

  private isA(): boolean {
    return this.command.match(/^@/) != null;
  }
}
