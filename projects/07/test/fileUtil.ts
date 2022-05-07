import fs from "fs";
import path from "path";

export function deleteTestFiles() {
  fs.readdirSync("./")
    .filter((f) => f.endsWith(".vm") || f.endsWith(".asm"))
    .map((f) => unlink(path.join("./", f)));
}

function unlink(path: string): void {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.log(err);
  }
}
