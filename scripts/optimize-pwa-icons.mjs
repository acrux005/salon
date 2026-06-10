#!/usr/bin/env node
/**
 * Optymalizuje ikony PWA: tworzy wersje 96, 180, 192, 512 z dobrej kompresji.
 * Uruchom: node scripts/optimize-pwa-icons.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "..", "public", "images");

const SIZES = [96, 180, 192, 512];

async function main() {
  const files = await readdir(imagesDir);
  const iconFiles = files.filter((f) => f.startsWith("icon-") && f.endsWith(".png"));
  if (iconFiles.length === 0) {
    console.log("Brak plików icon-*.png w public/images");
    return;
  }
  let source = path.join(imagesDir, "icon-512.png");
  const has512 = iconFiles.includes("icon-512.png");
  if (!has512) {
    const largest = iconFiles
      .map((f) => ({
        f,
        size: parseInt(f.replace("icon-", "").replace(".png", ""), 10),
        filePath: path.join(imagesDir, f),
      }))
      .filter((x) => !isNaN(x.size))
      .sort((a, b) => b.size - a.size)[0];
    if (largest) source = largest.filePath;
  }
  console.log("Źródło:", source);
  const buf = await sharp(source)
    .resize(Math.max(...SIZES))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  const meta = await sharp(buf).metadata();
  const base = sharp(buf);

  for (const size of SIZES) {
    const outPath = path.join(imagesDir, `icon-${size}.png`);
    await base
      .clone()
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    const s = await stat(outPath);
    console.log(`icon-${size}.png: ${(s.size / 1024).toFixed(1)} KB`);
  }
  console.log("Gotowe.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
