import { test, expect, type Page } from "@playwright/test";

// T-0013: cabeçalho grafite e fixo, menu grafite do celular, WhatsApp sempre visível, seta de voltar e faixas de cor.
const GRAFITE = "rgb(16, 16, 15)";
const PEDRA = "rgb(239, 231, 221)";

function contraste(a: string, b: string) {
  const lum = (c: string) => {
    const [r, g, bl] = (c.match(/\d+/g) ?? []).slice(0, 3).map((v) => Number(v) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
const fundo = (page: Page, sel: string) => page.locator(sel).first().evaluate((el) => getComputedStyle(el).backgroundColor);

test.describe("T-0013 · navegação e cor", () => {
  test("CA-1: no celular, ao rolar, o topo fica fixo e grafite, com o nome e o botão Menu com ícone", async ({ page, isMobile }) => {
    test.skip(!isMobile, "topo do celular");
    await page.goto("/materiais/granito/");
    await page.mouse.wheel(0, 1500);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(800);
    const topo = page.locator(".site-header");
    await expect.poll(() => topo.evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBe(0);
    expect(await fundo(page, ".site-header")).toBe(GRAFITE);
    await expect(topo.locator(".brand-nome span")).toHaveText(["JK Mármores", "e Granitos"]);
    const botao = topo.locator(".mobile-nav summary");
    await expect(botao).toContainText("Menu");
    await expect(botao.locator('svg[aria-hidden="true"]').first()).toBeVisible();
    expect((await botao.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test("CA-2: o menu grafite abre com links numerados, os 6 materiais, contato e WhatsApp, e leva à categoria", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu do celular");
    await page.goto("/sobre/");
    const menu = page.locator(".mobile-nav");
    await menu.locator("summary").click();
    await expect(menu).toHaveAttribute("open", "");
    const painel = menu.locator("nav");
    expect(await painel.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(GRAFITE);
    await expect(painel.locator(".menu-lista > li > a")).toHaveText(["01A empresa", "02Materiais", "03Contato"]);
    await expect(painel.locator(".menu-materiais a")).toHaveText(["Mármores", "Granitos", "Dolomíticos", "Quartzitos", "Quartzos", "Lâminas"]);
    await expect(painel.locator(".menu-telefone")).toBeVisible();
    await expect(painel.locator("address")).toContainText("Barueri");
    await expect(painel.getByRole("link", { name: "Chamar no WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
    await expect(menu.locator("summary")).toContainText("Fechar");
    // Os links do painel se leem sobre o grafite.
    const cor = await painel.locator(".menu-materiais a").first().evaluate((el) => getComputedStyle(el).color);
    expect(contraste(cor, GRAFITE)).toBeGreaterThanOrEqual(4.5);
    await painel.getByRole("link", { name: "Quartzitos", exact: true }).click();
    await expect(page).toHaveURL(/\/materiais\/quartzito\/$/);
    await page.locator(".mobile-nav summary").click();
    await page.locator(".mobile-nav summary").click();
    await expect(page.locator(".mobile-nav")).not.toHaveAttribute("open", "");
  });

  test("CA-3: o botão do WhatsApp aparece desde a abertura da página, sem rolar, e abre o WhatsApp", async ({ page, context }) => {
    await context.route("https://wa.me/**", (rota) => rota.fulfill({ status: 200, contentType: "text/html", body: "<p>WhatsApp</p>" }));
    for (const caminho of ["/", "/materiais/", "/contato/"]) {
      await page.goto(caminho);
      const botao = page.locator(".mobile-quote-dock .mobile-whatsapp");
      await expect(botao, caminho).toBeVisible();
      await expect(botao.locator('svg[aria-hidden="true"]')).toHaveCount(1);
      const caixa = (await botao.boundingBox())!;
      const tela = page.viewportSize()!;
      expect(caixa.x + caixa.width, caminho).toBeGreaterThan(tela.width - 40);
      expect(caixa.y + caixa.height, caminho).toBeGreaterThan(tela.height - 60);
    }
    await page.locator(".mobile-quote-dock .mobile-whatsapp").click();
    await expect(page).toHaveURL(/wa\.me/);
  });

  test("CA-4: categoria aberta a partir de Materiais mostra \"← Materiais\" e volta para Materiais", async ({ page }) => {
    await page.goto("/materiais/");
    await page.locator('[data-categoria="granito"]').getByRole("link", { name: /^Conhecer / }).click();
    await expect(page).toHaveURL(/\/materiais\/granito\/$/);
    const seta = page.locator(".seta-voltar");
    await expect(seta).toHaveText("← Materiais");
    await expect(seta).toHaveAttribute("data-historico", "true");
    await seta.click();
    await expect(page).toHaveURL(/\/materiais\/$/);
  });

  test("CA-4b: vindo do menu, a seta mostra o nome da página anterior e volta para ela", async ({ page, isMobile }) => {
    await page.goto("/sobre/");
    if (isMobile) await page.locator(".mobile-nav summary").click();
    await page.locator(isMobile ? ".mobile-nav nav" : ".desktop-nav").getByRole("link", { name: "Contato", exact: true }).click();
    await expect(page).toHaveURL(/\/contato\/$/);
    await expect(page.locator(".seta-voltar")).toHaveText("← A empresa");
    await page.locator(".seta-voltar").click();
    await expect(page).toHaveURL(/\/sobre\/$/);
  });

  test("CA-5: aberta direto, a seta vai para a página de cima", async ({ page }) => {
    await page.goto("/materiais/quartzito/");
    await expect(page.locator(".seta-voltar")).toHaveText("← Materiais");
    await expect(page.locator(".seta-voltar")).not.toHaveAttribute("data-historico", "true");
    await page.locator(".seta-voltar").click();
    await expect(page).toHaveURL(/\/materiais\/$/);
    for (const caminho of ["/sobre/", "/contato/"]) {
      await page.goto(caminho);
      await expect(page.locator(".seta-voltar"), caminho).toHaveText("← Início");
      await expect(page.locator(".seta-voltar"), caminho).toHaveAttribute("href", /\/$/);
    }
  });

  test("CA-6: a página inicial não tem seta de voltar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".seta-voltar")).toHaveCount(0);
  });

  test("CA-7: no desktop, o cabeçalho é grafite, mantém menu e botão e continua visível depois de rolar", async ({ page, isMobile }) => {
    test.skip(isMobile, "cabeçalho do desktop");
    await page.goto("/materiais/");
    expect(await fundo(page, ".site-header")).toBe(GRAFITE);
    await expect(page.locator(".desktop-nav a")).toHaveText(["A empresa", "Materiais", "Contato"]);
    await expect(page.locator(".header-cta")).toBeVisible();
    await page.mouse.wheel(0, 2000);
    await expect.poll(() => page.locator(".site-header").evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBe(0);
    await expect(page.locator(".desktop-nav")).toBeInViewport();
    // Na home, o topo começa transparente e fica grafite ao rolar.
    await page.goto("/");
    expect(await fundo(page, ".site-header")).toBe("rgba(0, 0, 0, 0)");
    await page.mouse.wheel(0, 400);
    await expect.poll(() => fundo(page, ".site-header")).toBe(GRAFITE);
  });

  test("CA-8: cada página tem sua faixa pedra na largura total e termina no bloco grafite", async ({ page }) => {
    const faixas: [string, string][] = [["/", "#orcamento"], ["/materiais/", ".warm-section"], ["/materiais/granito/", ".material-detail"], ["/sobre/", ".warm-section"], ["/contato/", ".warm-section"]];
    for (const [caminho, seletor] of faixas) {
      await page.goto(caminho);
      const faixa = page.locator(seletor).first();
      await faixa.scrollIntoViewIfNeeded();
      expect(await faixa.evaluate((el) => getComputedStyle(el).backgroundColor), caminho).toBe(PEDRA);
      // Largura total: a cor cobre a tela de ponta a ponta (sombra de 100vmax no fecho das categorias).
      const cobre = await faixa.evaluate((el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.left <= 1 && r.right >= innerWidth - 1 || s.boxShadow.includes("239, 231, 221"); });
      expect(cobre, `${caminho}: faixa na largura total`).toBe(true);
      const textos = await faixa.locator("h2, p, a").evaluateAll((els) => els.filter((el) => (el as HTMLElement).offsetParent && (el as HTMLElement).innerText.trim() && !el.closest(".pendente, .button")).map((el) => getComputedStyle(el).color));
      for (const cor of textos) expect(contraste(cor, PEDRA), `${caminho}: ${cor} sobre o pedra`).toBeGreaterThanOrEqual(4.5);
      // A página termina em grafite: o bloco "Vamos conversar" (a página de Contato não tem esse bloco) e o rodapé.
      const fim = (await page.locator(".contact-panel").count()) ? page.locator(".contact-panel") : page.locator(".site-footer");
      await fim.scrollIntoViewIfNeeded();
      expect(await fim.evaluate((el) => getComputedStyle(el).backgroundColor), caminho).toBe(GRAFITE);
    }
  });
});
