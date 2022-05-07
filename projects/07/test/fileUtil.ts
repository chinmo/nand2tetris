import fs from "fs";
import path from "path";

export function deleteTestFiles() {
  fs.readdirSync(__dirname)
    .filter((f) => f.endsWith(".vm"))
    .map((f) => unlink(path.join(__dirname, f)));
}

function unlink(path: string): void {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.log(err);
  }
}
