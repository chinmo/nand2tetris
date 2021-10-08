import fs from "fs";
import path from "path";
import { A_COMMAND, C_COMMAND, L_COMMAND, Parser } from "./parser";
import { dest, comp, jump } from "./code";
import { SymbolTable } from "./symbol_table";

const argPath: string = process.argv[2];
if (argPath) assembleFromFile(argPath);

export function assembleFromFile(asmPath: string): void {
  if (!fs.existsSync(asmPath)) return;

  const symbolTable = new SymbolTable();

  exec1stPass(asmPath, symbolTable);
  exec2ndPass(asmPath, symbolTable);
}

function exec1stPass(asmPath: string, symbolTable: SymbolTable) {
  let addressNo = 0;
  const parser = new Parser(asmPath);

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

function exec2ndPass(asmPath: string, symbolTable: SymbolTable) {
  const hackPath = path.join(
    path.dirname(asmPath),
    path.basename(asmPath, ".asm") + ".hack"
  );
  const fd = fs.openSync(hackPath, "w");

  const parser = new Parser(asmPath);
  let allocatableAddress = 16;

  while (parser.hasMoreCommands()) {
    parser.advance();
    switch (parser.commandType()) {
      case A_COMMAND: {
        let address = 0;
        const Xxx = parser.symbol();
        if (symbolTable.contains(Xxx)) {
          address = symbolTable.getAddress(Xxx);
        } else {
          address = parseInt(Xxx);
          if (isNaN(address)) {
            console.log(Xxx);
            address = allocatableAddress;
            symbolTable.addEntry(Xxx, address);
            allocatableAddress++;
          }
        }
        fs.writeSync(fd, address.toString(2).padStart(16, "0") + "\n");
        break;
      }
      case C_COMMAND:
        fs.writeSync(
          fd,
          "111" +
            comp(parser.comp()) +
            dest(parser.dest()) +
            jump(parser.jump()) +
            "\n"
        );
        break;
      case L_COMMAND:
        break;
      default:
        throw new Error("2nd Pass: Unknown command type");
    }
  }

  fs.closeSync(fd);
}
