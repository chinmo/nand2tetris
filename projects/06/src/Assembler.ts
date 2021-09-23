import fs from "fs";
import path from "path";
import readline from "readline";
import events from "events";

export function assembleFromFile(asm_path: string): Promise<void> {
  const HACK_FILE_NAME = path.basename(asm_path, ".asm") + ".hack";

  const DIR_PATH = path.dirname(asm_path);

  const HACK_FILE_FULLPATH = path.join(DIR_PATH, HACK_FILE_NAME);

  return (async () => {
    try {
      if (!fs.existsSync(asm_path)) return;

      const ws = fs.createWriteStream(HACK_FILE_FULLPATH, "utf-8");
      const rl = readline.createInterface({
        input: fs.createReadStream(asm_path),
        output: ws,
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        if (!line.includes("//")) {
          ws.write("0000000000000000" + "\n");
        }
      });

      await events.once(rl, "close");
    } catch (err) {
      console.error(err);
    }
  })();
}
