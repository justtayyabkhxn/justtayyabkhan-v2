import sharp from "sharp";
import { readdir, stat, rename, unlink } from "fs/promises";
import { join } from "path";

const dir = "../public/other";
const files = await readdir(dir);
const images = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

let saved = 0;
for (const file of images) {
  const input = join(dir, file);
  const tmp = input + ".tmp";
  const before = (await stat(input)).size;

  await sharp(input)
    .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(tmp);

  const after = (await stat(tmp)).size;
  if (after < before) {
    await rename(tmp, input);
    saved += before - after;
    console.log(`${file}: ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`);
  } else {
    await unlink(tmp);
    console.log(`${file}: skipped (already optimal)`);
  }
}

console.log(`\nTotal saved: ${(saved / 1e6).toFixed(1)}MB`);
