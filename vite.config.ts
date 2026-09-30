// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isStaticBuild = process.env["STATIC_BUILD"] === "1";
const basePath = process.env["BASE_PATH"];

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // STATIC_BUILD=1 gera um site estático (SPA) para hosts de arquivos, como o GitHub Pages.
    // Não afeta o build padrão do Lovable, que mantém SSR.
    ...(isStaticBuild ? { spa: { enabled: true } } : {}),
  },
  // BASE_PATH=/nome-do-repo/ publicação em subpasta (GitHub Pages de projeto).
  ...(basePath ? { vite: { base: basePath } } : {}),
});
