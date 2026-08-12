import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "data", "hsi.json");
const destDir = join(root, "public", "data");
const dest = join(destDir, "hsi.json");

await mkdir(destDir, { recursive: true });
await copyFile(src, dest);

console.log("synced data/hsi.json -> public/data/hsi.json");
