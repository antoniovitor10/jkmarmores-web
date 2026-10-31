import { expect, test } from "@playwright/test";

const WHATSAPP = /^https:\/\/wa\.me\/5511967976902\?text=/;

test.describe("home", () => {
  test("o CTA da capa abre o WhatsApp oficial com a mensagem da home", async ({ page }) => {
    await page.goto("/");
    const capa = page.getByRole("region", { name: "Apresentação da JK" }).getByRole("link", { name: "Chamar no WhatsApp" });
    await expect(capa).toBeVisible();
    const href = await capa.getAttribute("href");
    expect(href).toMatch(WHATSAPP);
    expect(decodeURIComponent(href!.split("text=")[1])).toBe("Oi, vi o site da JK e quero conversar sobre um orçamento.");
  });

  test("sem JavaScript, o título e o caminho para o orçamento continuam na página", async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const page = await contexto.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Pedra que dá forma\s+ao seu espaço\./);
    await expect(page.getByRole("link", { name: "Chamar no WhatsApp" }).first()).toHaveAttribute("href", WHATSAPP);
    await contexto.close();
  });
});

test.describe("menu do celular", () => {
  test.skip(({ isMobile }) => !isMobile, "o menu só existe abaixo de 800 px");

  test("abre ao tocar em Menu e fecha com Escape, devolvendo o foco", async ({ page }) => {
    // O controle do menu (Escape, foco, inert) monta depois do evento load: src/components/SiteInteractions.tsx.
    await page.goto("/", { waitUntil: "networkidle" });
    const resumo = page.locator(".mobile-nav > summary");
    const navegacao = page.getByRole("navigation", { name: "Navegação móvel" });
    await expect(navegacao).toBeHidden();
    await resumo.click();
    await expect(navegacao).toBeVisible();
    await expect(page.locator("main")).toHaveJSProperty("inert", true);
    await expect(navegacao.getByRole("link", { name: "Materiais" })).toBeVisible();
    await expect(navegacao.getByRole("link", { name: "Chamar no WhatsApp" })).toHaveAttribute("href", WHATSAPP);
    await page.keyboard.press("Escape");
    await expect(navegacao).toBeHidden();
    await expect(resumo).toBeFocused();
  });
});
