import fs from "fs";
import path from "path";
import { CodeWriter } from "./codeWriter";

vmTranslator(process.argv[2]);

export async function vmTranslator(vmPath: string): Promise<unknown> {
  if (!fs.existsSync(vmPath)) return;

  const asmPath = path.join(
    path.dirname(vmPath),
    path.basename(vmPath, ".vm") + ".asm"
  );

  const stream = fs
    .createWriteStream(asmPath, { encoding: "utf-8" })
    .on("error", (err) => {
      console.log(err);
    });

  const writer = new CodeWriter(stream);
  writer.setFileName(path.basename(vmPath));
  writer.close();

  return await waitWriteStreamFinished(stream);
}

async function waitWriteStreamFinished(
  stream: fs.WriteStream
): Promise<unknown> {
  return new Promise((resolve) => {
    stream.on("finish", () => {
      resolve("finish writeStream");
    });
  });
}
