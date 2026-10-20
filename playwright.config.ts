import { defineConfig, devices } from "@playwright/test";

// Testes de interação do site exportado (out/). Rode `npm run build` antes.
// Usa o Chrome instalado no Windows (channel "chrome"), sem baixar navegador.
const porta = Number(process.env.E2E_PORT ?? 3105);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${porta}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 }, channel: "chrome" } },
  ],
  webServer: {
    command: "node scripts/preview-local.mjs",
    url: `http://127.0.0.1:${porta}/`,
    env: { PORT: String(porta) },
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
