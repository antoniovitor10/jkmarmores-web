import { expect, test, type Locator } from "@playwright/test";

// HU-0001 · T-0004: imagem de cada categoria no cartão de /materiais/ e no topo da página da categoria.
const CATEGORIAS = ["marmore", "granito", "marmore-dolomitico", "quartzito", "quartzo", "ultracompacto"];

// Id da imagem a partir do arquivo servido (/img/categoria-granito-768.avif → categoria-granito).
async function idDaImagem(img: Locator) {
  await expect(img).toBeVisible();
  await expect.poll(async () => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  const src = await img.evaluate((el: HTMLImageElement) => el.currentSrc);
  return src.split("/").pop()!.replace(/-\d+\.(avif|webp)$/, "");
}

test.describe("imagens das categorias", () => {
  test("CA-12: cada cartão de /materiais/ tem imagem própria e a mesma imagem abre o topo da categoria", async ({ page }) => {
    for (const slug of CATEGORIAS) {
      await page.goto("/materiais/");
      const cartao = page.locator(`[data-categoria="${slug}"]`);
      await cartao.scrollIntoViewIfNeeded();
      const idCartao = await idDaImagem(cartao.locator("img"));
      expect(idCartao).toBe(`categoria-${slug}`);
      expect(await cartao.locator("img").getAttribute("alt")).toBeTruthy();

      await cartao.getByRole("link", { name: /^Conhecer / }).click();
      await expect(page).toHaveURL(new RegExp(`/materiais/${slug}/$`));
      const idTopo = await idDaImagem(page.locator(".intro-image img"));
      expect(idTopo).toBe(idCartao);
    }
  });

  for (const slug of ["marmore-dolomitico", "quartzito"]) {
    test(`CA-3: /materiais/${slug}/ mostra a imagem de topo, nenhum cartão de pedra e a pendência dos nomes`, async ({ page }) => {
      await page.goto(`/materiais/${slug}/`);
      expect(await idDaImagem(page.locator(".intro-image img"))).toBe(`categoria-${slug}`);
      await expect(page.locator("[data-pedra]")).toHaveCount(0);
      // Build de homologação (padrão): a falta dos nomes aparece como pendência (O2).
      await expect(page.locator('[data-pendente*="nomes comerciais de pedras"]').first()).toBeAttached();
    });
  }

  test("CA-12 sem JavaScript: as imagens das categorias continuam no HTML e a home segue sem elas", async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const page = await contexto.newPage();
    await page.goto("/materiais/");
    for (const slug of CATEGORIAS) await expect(page.locator(`[data-categoria="${slug}"] img`)).toHaveAttribute("src", new RegExp(`categoria-${slug}-\\d+\\.webp$`));
    // A home usa os mesmos cartões, mas sem imagem (versão aprovada).
    await page.goto("/");
    await expect(page.locator("[data-categoria]")).toHaveCount(CATEGORIAS.length);
    await expect(page.locator("[data-categoria] img")).toHaveCount(0);
    await contexto.close();
  });
});
