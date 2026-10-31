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

  // T-0010: as duas categorias que estavam vazias passam a ter cartões de pedra (nomes de pesquisa, exceção ao princípio 1).
  const NOVAS: Record<string, { link: string; pedras: string[] }> = {
    "marmore-dolomitico": { link: "Conhecer mármores dolomíticos", pedras: ["Super White", "Branco Michelangelo", "Lunar", "Biancatto", "Donatello", "Thassos"] },
    quartzito: { link: "Conhecer quartzitos naturais", pedras: ["Taj Mahal", "Perla Venata", "Mont Blanc", "Cristallo", "Sea Pearl", "Fusion", "Azul Macaúbas", "Verde Alexandrita"] },
  };
  for (const [slug, { link, pedras }] of Object.entries(NOVAS)) {
    test(`T-0010 CA-1/CA-2: /materiais/${slug}/ mostra os cartões das pedras, com foto, nome e WhatsApp`, async ({ page }) => {
      await page.goto("/materiais/");
      const cartaoCategoria = page.locator(`[data-categoria="${slug}"]`);
      await cartaoCategoria.scrollIntoViewIfNeeded();
      await cartaoCategoria.getByRole("link", { name: link, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/materiais/${slug}/$`));
      const cartoes = page.locator("[data-pedra]");
      await expect(cartoes).toHaveCount(pedras.length);
      for (const [i, nome] of pedras.entries()) {
        const cartao = cartoes.nth(i);
        await cartao.scrollIntoViewIfNeeded();
        await expect(cartao.locator("h3")).toHaveText(nome);
        const img = cartao.locator("img");
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        const alt = (await img.getAttribute("alt")) ?? "";
        expect(alt.startsWith("Close da chapa de "), alt).toBe(true);
        expect(alt.endsWith(`${nome}.`), alt).toBe(true);
        await expect(cartao.getByRole("link", { name: `Chamar no WhatsApp sobre ${nome}`, exact: true })).toBeVisible();
      }
    });
  }

  test("T-0010 CA-3: o botão de uma pedra nova abre o WhatsApp com o nome dela", async ({ page, context }) => {
    // Não sai para a internet: o wa.me responde localmente.
    await context.route("https://wa.me/**", (rota) => rota.fulfill({ status: 200, contentType: "text/html", body: "<p>WhatsApp</p>" }));
    await page.goto("/materiais/quartzito/");
    const botao = page.locator('[data-pedra="quartzito-mont-blanc"]').getByRole("link", { name: "Chamar no WhatsApp sobre Mont Blanc", exact: true });
    await botao.scrollIntoViewIfNeeded();
    const href = decodeURIComponent((await botao.getAttribute("href")) ?? "");
    expect(href).toMatch(/^https:\/\/wa\.me\/5511967976902\?text=/);
    expect(href).toContain("Mont Blanc");
    // Taj Mahal existe também em lâminas: a mensagem leva a categoria para não confundir.
    const taj = decodeURIComponent((await page.locator('[data-pedra="quartzito-taj-mahal"] a').getAttribute("href")) ?? "");
    expect(taj).toContain("Taj Mahal (quartzito)");
    const [destino] = await Promise.all([page.waitForURL(/wa\.me/).then(() => page.url()), botao.click()]);
    expect(decodeURIComponent(destino)).toContain("Mont Blanc");
  });

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
