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
  rs: stream.Readable;
  command: string;
  isEnd: boolean;

  constructor(rs: stream.Readable) {
    this.rs = rs;
    this.command = "";
    this.isEnd = false;

    rs.on("data", (chunk: string) => {
      this.command = this.removeComment(chunk).trim();
      if (this.command) rs.pause();
    });

    rs.once("end", () => {
      this.command = "";
      this.isEnd = true;
    });
  }

  hasMoreCommands(): boolean {
    return this.command != "" && !this.isEnd;
  }

  advance(): void {
    if (!this.hasMoreCommands())
      throw new Error(
        "advance() can not call when hasMoreCommand() is not true!"
      );

    if (this.rs.isPaused()) {
      this.rs.resume();
    }
  }

  commandType(): COMMAND_TYPE {
    if (!this.command) throw new Error("No commands");
    if (this.isC()) return C_COMMAND;
    return A_COMMAND;
  }

  symbol(): string {
    if (this.commandType() != A_COMMAND)
      throw new Error("command is not A_COMMAND");
    return this.command.substring(1);
  }

  private removeComment(text: string): string {
    let removedText = text;
    const i = text.indexOf("//");
    if (i >= 0) removedText = text.substring(0, i);
    return removedText;
  }

  private isC(): boolean {
    return this.command.match(/^[DM]/) != null;
  }
}
