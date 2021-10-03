import fs from "fs";
import path from "path";
import events from "events";
import { L_COMMAND, Parser } from "./parser";
import { A_COMMAND, C_COMMAND } from "../src/parser";
import { dest, comp, jump } from "../src/code";
import readline from "readline";
import stream from "stream";

const arg_path: string = process.argv[2];
if (arg_path) assembleFromFile(arg_path);

export function assembleFromFile(asm_path: string): Promise<void> {
  return (async () => {
    try {
      if (!fs.existsSync(asm_path)) return;

      const HACK_FILE_PATH = path.join(
        path.dirname(asm_path),
        path.basename(asm_path, ".asm") + ".hack"
      );
      const rs = fs.createReadStream(asm_path);
      const ws = fs.createWriteStream(HACK_FILE_PATH, "utf-8");

      // 1st pass

      const rl = readline.createInterface({
        input: rs,
        crlfDelay: Infinity,
      });

      let buffer = "";

      rl.on("line", (line) => {
        buffer += removeComment(line).trim();
      });

      await events.once(rs, "close");

      const bs = stream.Readable.from(buffer);
      const parser = new Parser(bs);
      await events.once(bs, "close");

      // 2nd pass
      while (parser.hasMoreCommands()) {
        parser.advance();
        switch (parser.commandType()) {
          case A_COMMAND:
            ws.write(
              parseInt(parser.symbol(), 10).toString(2).padStart(16, "0") + "\n"
            );
            break;
          case C_COMMAND:
            ws.write(
              "111" +
                comp(parser.comp()) +
                dest(parser.dest()) +
                jump(parser.jump()) +
                "\n"
            );
            break;
          case L_COMMAND:
            console.log("L_COMMAND!");
            break;
          default:
            throw new Error("Unknown command type");
        }
      }

      ws.close();
      await events.once(ws, "close");
    } catch (err) {
      console.error(err);
    }
  })();
}

function removeComment(text: string): string {
  let removedText = text;
  const i = text.indexOf("//");
  if (i >= 0) removedText = text.substring(0, i);
  return removedText;
}
