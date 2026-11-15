import { defineConfig } from "@playwright/test";

// Run: pnpm build && pnpm test:e2e   (serves .output on :4173 unless E2E_URL is set)
const PORT = 4173;
const external = process.env.E2E_URL;

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: external || `http://localhost:${PORT}`, launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined } },
  webServer: external ? undefined : { command: "node .output/server/index.mjs", env: { PORT: String(PORT), NITRO_PORT: String(PORT) }, url: `http://localhost:${PORT}`, reuseExistingServer: true, timeout: 60_000 },
});
