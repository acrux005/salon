#!/usr/bin/env node
import { cpSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");

if (!existsSync(path.join(standalone, "server.js"))) {
  console.warn("[copy-standalone-assets] Brak .next/standalone — pomijam kopiowanie.");
  process.exit(0);
}

cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), { recursive: true });
cpSync(path.join(root, "public"), path.join(standalone, "public"), { recursive: true });
console.log("[copy-standalone-assets] Skopiowano static + public do standalone.");
