#!/usr/bin/env node
"use strict";
const path = require("path");
const { spawn } = require("child_process");

require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, ".env.local"), override: true });
require("dotenv").config({ path: path.join(__dirname, ".env.production.local"), override: true });

const port = process.env.PORT || "3010";
const child = spawn("npx", ["next", "start", "-p", port], {
  cwd: __dirname,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || "production" },
});
child.on("exit", (code) => process.exit(code ?? 0));
