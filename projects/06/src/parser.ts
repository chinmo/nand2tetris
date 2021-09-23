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

    rs.on("end", () => {
      this.buffer = "";
      this.isEnd = true;
    });
  }
  hasMoreCommands(): boolean {
    return this.buffer != "";
  }
}
