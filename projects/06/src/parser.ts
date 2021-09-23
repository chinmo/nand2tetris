import stream from "stream";

export class Parser {
  rs: stream.Readable;
  buffer: string;
  isEnd: boolean;

  constructor(rs: stream.Readable) {
    this.rs = rs;
    this.buffer = "";
    this.isEnd = false;

    rs.on("data", (chunk) => {
      this.buffer = chunk;
      rs.pause();
    });

    rs.once("end", () => {
      this.buffer = "";
      this.isEnd = true;
    });
  }

  hasMoreCommands(): boolean {
    return this.buffer != "" && !this.isEnd;
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
}
