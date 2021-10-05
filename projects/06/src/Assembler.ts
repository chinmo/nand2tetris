import fs from "fs";
import path from "path";
import events from "events";
import { L_COMMAND, Parser } from "./parser";
import { A_COMMAND, C_COMMAND } from "../src/parser";
import { dest, comp, jump } from "../src/code";
import { SymbolTable } from "./symbol_table";

const arg_path: string = process.argv[2];
if (arg_path) assembleFromFile(arg_path);

export function assembleFromFile(asm_path: string): Promise<void> {
  return (async () => {
    try {
      if (!fs.existsSync(asm_path)) return;

      const symbolTable = new SymbolTable();

      // 1st pass
      await exec1stPass(asm_path, symbolTable);

      // 2nd pass
      await exec2ndPass(asm_path, symbolTable);
    } catch (err) {
      console.error(err);
    }
  })();
}

async function exec1stPass(path: string, symbolTable: SymbolTable) {
  let addressNo = 0;
  const rs = fs.createReadStream(path);
  const parser = new Parser(rs);
  await events.once(rs, "close");

  while (parser.hasMoreCommands()) {
    parser.advance();
    switch (parser.commandType()) {
      case A_COMMAND:
      case C_COMMAND:
        addressNo += 1;
        break;
      case L_COMMAND:
        symbolTable.addEntry(parser.symbol(), addressNo);
        break;
      default:
        throw new Error("1st Pass: Unknown command type");
    }
  }
}

async function exec2ndPass(asm_path: string, symbolTable: SymbolTable) {
  const HACK_FILE_PATH = path.join(
    path.dirname(asm_path),
    path.basename(asm_path, ".asm") + ".hack"
  );
  const ws = fs.createWriteStream(HACK_FILE_PATH, "utf-8");

  const rs = fs.createReadStream(asm_path);
  const parser = new Parser(rs);
  await events.once(rs, "close");

  while (parser.hasMoreCommands()) {
    parser.advance();
    switch (parser.commandType()) {
      case A_COMMAND: {
        let Xxx = parser.symbol();
        if (symbolTable.contains(Xxx)) {
          Xxx = symbolTable.getAddress(Xxx).toString(10);
        }
        ws.write(parseInt(Xxx, 10).toString(2).padStart(16, "0") + "\n");
        break;
      }
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
        throw new Error("2nd Pass: Unknown command type");
    }
  }

  ws.close();
  await events.once(ws, "close");
}
