import { test, expect } from "@playwright/test";

// T-0011: títulos em Source Serif 4 (servida localmente), texto corrido em Source Sans 3.
const PAGINAS: [string, string | null][] = [
  ["/", null],
  ["/materiais/", "Materiais"],
  ["/sobre/", "A empresa"],
  ["/contato/", "Contato"],
];

test.describe("T-0011 · fonte dos títulos", () => {
  test("CA-1 e CA-2: títulos em Source Serif 4 e texto em Source Sans 3, navegando pelo menu", async ({ page, isMobile }) => {
    await page.goto("/");
    for (const [caminho, menu] of PAGINAS) {
      if (menu) {
        if (isMobile) await page.locator(".mobile-nav summary").click();
        await page.locator(isMobile ? ".mobile-nav nav" : ".desktop-nav").getByRole("link", { name: menu, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`${caminho.replace(/\//g, "\\/")}$`));
      }
      await page.evaluate(() => document.fonts.ready);
      const fonte = await page.evaluate(() => {
        const familia = (sel: string) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontFamily : ""; };
        const variavel = getComputedStyle(document.body).getPropertyValue("--fonte-display-a1");
        const carregada = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
        return { h1: familia("main h1, header h1"), h2: familia("main h2"), p: familia("main p"), variavel, carregada, peso: getComputedStyle(document.querySelector("main h1, header h1")!).fontWeight };
      });
      // next/font troca o nome da família por um apelido; a fonte certa é a da variável --fonte-display-a1.
      const apelidoTitulo = fonte.variavel.split(",")[0].trim().replace(/['"]/g, "");
      expect(fonte.h1, caminho).toContain(apelidoTitulo);
      expect(fonte.h2, caminho).toContain(apelidoTitulo);
      expect(fonte.peso, caminho).toBe("500");
      expect(fonte.carregada.some((f) => f.replace(/['"]/g, "") === apelidoTitulo), `${caminho}: fonte dos títulos carregada`).toBe(true);
      expect(fonte.p, caminho).not.toContain(apelidoTitulo);
    }
    // O arquivo servido é o da Source Serif 4.
    const css = await page.evaluate(() => [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules].map((r) => r.cssText); } catch { return []; } }).join("\n"));
    expect(css).toMatch(/source-serif-4-latin[^)]*\.woff2|media\/[^)]*\.woff2/);
  });

  test("CA-3: nenhum título estoura a largura (capa, materiais e cartões de pedra)", async ({ page }) => {
    for (const caminho of ["/", "/materiais/", "/materiais/marmore-dolomitico/", "/materiais/quartzito/", "/materiais/granito/", "/sobre/", "/contato/"]) {
      await page.goto(caminho);
      await page.evaluate(() => document.fonts.ready);
      const estouros = await page.locator("h1, h2, h3").evaluateAll((els) =>
        // Ignora os títulos só para leitor de tela (.pedra-rotulo, 1 px recortado de propósito).
        els.filter((el) => (el as HTMLElement).offsetParent && el.clientWidth > 1 && el.scrollWidth > el.clientWidth + 1).map((el) => (el as HTMLElement).innerText.trim().slice(0, 40))
      );
      expect(estouros, caminho).toEqual([]);
      const rolagem = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(rolagem, `${caminho}: rolagem horizontal`).toBeLessThanOrEqual(0);
    }
  });

  test("CA-5: nenhuma requisição ao Google Fonts", async ({ page }) => {
    const google: string[] = [];
    page.on("request", (r) => { if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) google.push(r.url()); });
    for (const caminho of ["/", "/materiais/granito/"]) {
      await page.goto(caminho, { waitUntil: "networkidle" });
    }
    expect(google).toEqual([]);
  });
});
