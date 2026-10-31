import fs from "node:fs";
import { expect, test } from "@playwright/test";

// HU-0001 · T-0007: nenhum aviso de IA ou de imagem ilustrativa no site (ADR-0001).
// A mesma regra de scripts/check-avisos.mjs.
const AVISOS = /gerad[ao] por (IA|intelig[eê]ncia artificial)|ilustrativ|n[aã]o representa obra/i;

// Páginas publicadas: as do sitemap do build (homologação inclui aplicações e galeria).
function paginas() {
  const xml = fs.readFileSync("out/sitemap.xml", "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

test.describe("avisos de IA", () => {
  test("CA-8: nenhuma página publicada tem aviso de IA no texto ou nos alt", async ({ page }) => {
    const lista = paginas();
    expect(lista.length).toBeGreaterThan(3);
    for (const caminho of lista) {
      await page.goto(caminho, { waitUntil: "networkidle" });
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      const texto = await page.locator("body").innerText();
      const alts = await page.locator("img[alt]").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt") ?? ""));
      expect(texto, `texto de ${caminho}`).not.toMatch(AVISOS);
      for (const alt of alts) expect(alt, `alt em ${caminho}`).not.toMatch(AVISOS);
    }
  });

  test("CA-14: o rodapé mostra só a marca, sem aviso sobre imagens", async ({ page }) => {
    for (const caminho of ["/", "/materiais/"]) {
      await page.goto(caminho);
      const rodape = page.locator(".footer-bottom");
      await rodape.scrollIntoViewIfNeeded();
      await expect(rodape).toHaveText("JK Mármores e Granitos");
    }
  });

  test("CA-15: os textos sem a palavra ilustrativo aparecem com a redação nova", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#configurador")).toContainText("Compare pedras em dois ambientes.");
    await expect(page.locator("#configurador")).toContainText("Consulte pedras específicas, disponibilidade e acabamentos com a JK.");
    await page.goto("/materiais/");
    await expect(page.getByRole("link", { name: "Explorar combinações", exact: true })).toBeVisible();
    // A seção "Veja a amostra real" existe no conteúdo, mas nenhuma página a exibe (nem antes da T-0007):
    // confere a redação nova na fonte, onde ela vive.
    const conteudo = fs.readFileSync("src/content/index.ts", "utf8");
    expect(conteudo).toContain("Imagens de tela servem para explorar possibilidades. A cor e o desenho da chapa real devem ser conferidos antes da aprovação.");
    expect(conteudo).not.toMatch(AVISOS);
    // O conselho de conferir a chapa real, que aparece nas páginas, segue nas páginas de categoria.
    await page.goto("/materiais/marmore/");
    await expect(page.locator("main")).toContainText("Confira a amostra real antes de decidir.");
  });
});
