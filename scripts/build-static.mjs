// Build estático (SPA) para hospedagem em servidores de arquivos, como o GitHub Pages.
// Uso: node scripts/build-static.mjs   (BASE_PATH=/nome-do-repo/ opcional)
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const env = { ...process.env, STATIC_BUILD: "1" };
const result = spawnSync("bunx", ["vite", "build"], { stdio: "inherit", env });
if (result.status !== 0) process.exit(result.status ?? 1);

const clientDir = existsSync(resolve(".output/public")) ? resolve(".output/public") : resolve("dist/client");
const shell = resolve(clientDir, "_shell.html");
const target = resolve(clientDir, "index.html");
if (!existsSync(target)) {
  if (!existsSync(shell)) {
    console.error("Shell não encontrado em dist/client/_shell.html");
    process.exit(1);
  }
  if (existsSync(shell)) copyFileSync(shell, target);
  else { console.error("index.html não gerado"); process.exit(1); }
  console.log("dist/client/index.html criado a partir do shell SPA.");
}
