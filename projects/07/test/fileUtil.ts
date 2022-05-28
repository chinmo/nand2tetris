import fs from "fs";
import path from "path";

export async function waitWriteStreamFinished(
  stream: fs.WriteStream
): Promise<unknown> {
  return new Promise((resolve) => {
    stream.on("finish", () => {
      resolve("finish writeStream");
    });
  });
}

export function deleteTestFiles(): void {
  fs.readdirSync("./")
    .filter((f) => f.endsWith(".vm") || f.endsWith(".asm"))
    .map((f) => unlink(path.join("./", f)));

  fs.readdirSync("./test")
    .filter((f) => f.endsWith(".vm") || f.endsWith(".asm"))
    .map((f) => unlink(path.join("./test/", f)));

  fs.readdirSync("./test", { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((dir) => removeDir(path.join("./test/", dir.name)));
}

function removeDir(dirPath: string) {
  fs.readdirSync(dirPath).map((f) => unlink(path.join(dirPath, f)));
  fs.rmdirSync(dirPath);
}

function unlink(path: string): void {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.log(err);
  }
}
