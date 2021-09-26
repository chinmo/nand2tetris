import fs from "fs";
import path from "path";
import events from "events";
import { Parser } from "./parser";
import { A_COMMAND, C_COMMAND } from "../src/parser";

const asm_path: string = process.argv[2];
assembleFromFile(asm_path);

export function assembleFromFile(asm_path: string): Promise<void> {
  const HACK_FILE_NAME = path.basename(asm_path, ".asm") + ".hack";

  const DIR_PATH = path.dirname(asm_path);

  const HACK_FILE_FULLPATH = path.join(DIR_PATH, HACK_FILE_NAME);

  return (async () => {
    try {
      if (!fs.existsSync(asm_path)) return;

      const rs = fs.createReadStream(asm_path);
      const ws = fs.createWriteStream(HACK_FILE_FULLPATH, "utf-8");
      const parser = new Parser(rs);
      await events.once(rs, "close");

      while (parser.hasMoreCommands()) {
        parser.advance();
        switch (parser.commandType()) {
          case A_COMMAND:
            console.log(parser.symbol());
            ws.write(parser.symbol().padStart(16, "0") + "\n");
            break;
          case C_COMMAND:
            console.log(parser.dest() + parser.comp() + parser.jump());
            if (parser.dest()) {
              ws.write(parser.dest() + "=" + parser.comp() + "\n");
            } else {
              ws.write(parser.comp() + ";" + parser.jump() + "\n");
            }
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
