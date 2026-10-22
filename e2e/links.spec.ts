import { expect, test, type Locator } from "@playwright/test";

// T-0008: links e botões que parecem clicáveis. Caramelo = #c9ab91 = rgb(201, 171, 145).
const CARAMELO = "rgb(201, 171, 145)";

async function estiloLink(link: Locator) {
  return link.evaluate((el) => {
    const s = getComputedStyle(el);
    const seta = getComputedStyle(el, "::after").content;
    return { cor: s.color, sublinhado: s.textDecorationLine, fonte: parseFloat(s.fontSize), altura: el.getBoundingClientRect().height, seta };
  });
}

test.describe("links e botões", () => {
  test("CA-1: na home, Conheça os materiais é botão com contorno e Conheça a JK é link, os dois com seta", async ({ page }) => {
    await page.goto("/");
    const acoes = page.locator(".request-story .actions");
    await acoes.scrollIntoViewIfNeeded();
    const botao = acoes.getByRole("link", { name: "Conheça os materiais", exact: true });
    const link = acoes.getByRole("link", { name: "Conheça a JK", exact: true });
    const b = await botao.evaluate((el) => ({ borda: getComputedStyle(el).borderTopColor, largura: getComputedStyle(el).borderTopWidth, seta: getComputedStyle(el, "::after").content }));
    expect(b).toMatchObject({ borda: CARAMELO, largura: "1px" });
    expect(b.seta).toContain("→");
    const l = await estiloLink(link);
    expect(l).toMatchObject({ cor: CARAMELO, sublinhado: "underline" });
    expect(l.seta).toContain("→");
    await botao.click();
    await expect(page).toHaveURL(/\/materiais\/$/);
    await page.goBack();
    await page.locator(".request-story .actions").getByRole("link", { name: "Conheça a JK", exact: true }).click();
    await expect(page).toHaveURL(/\/sobre\/$/);
  });

  test("CA-2: os links de navegação ficam caramelo, sublinhados, com seta, 16 px e alvo de 44 px", async ({ page }) => {
    const casos: [string, string][] = [
      ["/", "Explorar todos os materiais"],
      ["/", "Conhecer granitos"],
      ["/materiais/", "Explorar combinações"],
      ["/materiais/granito/", "Ver todos os materiais"],
      ["/materiais/granito/", "Trabalhamos com outras pedras; pergunte pelo WhatsApp."],
    ];
    for (const [caminho, nome] of casos) {
      await page.goto(caminho);
      const link = page.getByRole("link", { name: nome, exact: true }).first();
      await link.scrollIntoViewIfNeeded();
      const e = await estiloLink(link);
      expect(e, `${nome} em ${caminho}`).toMatchObject({ cor: CARAMELO, sublinhado: "underline", fonte: 16 });
      expect(e.seta, nome).toContain("→");
      expect(e.altura, nome).toBeGreaterThanOrEqual(44);
    }
    // "Conheça a JK" da assinatura da marca (o mesmo texto existe no par de links).
    await page.goto("/");
    const assinatura = page.locator(".signature-copy").getByRole("link", { name: "Conheça a JK", exact: true });
    await assinatura.scrollIntoViewIfNeeded();
    const e = await estiloLink(assinatura);
    expect(e).toMatchObject({ cor: CARAMELO, sublinhado: "underline", fonte: 16 });
    expect(e.seta).toContain("→");
  });

  test("CA-3: o WhatsApp do cartão é botão com contorno na largura do cartão, com ícone e a mensagem da pedra", async ({ page }) => {
    await page.goto("/materiais/granito/");
    const cartao = page.locator('[data-pedra="granito-preto-sao-gabriel"]');
    await cartao.scrollIntoViewIfNeeded();
    const botao = cartao.getByRole("link", { name: "Chamar no WhatsApp sobre Preto São Gabriel" });
    await expect(botao.locator('svg[aria-hidden="true"]')).toHaveCount(1);
    // Ícone à esquerda do texto: é o primeiro filho do botão.
    expect(await botao.evaluate((el) => el.firstElementChild?.tagName.toLowerCase())).toBe("svg");
    const larguras = await botao.evaluate((el) => ({ botao: el.getBoundingClientRect().width, cartao: el.closest("li")!.getBoundingClientRect().width, borda: getComputedStyle(el).borderTopColor }));
    expect(larguras.borda).toBe(CARAMELO);
    expect(Math.abs(larguras.botao - larguras.cartao)).toBeLessThanOrEqual(1);
    expect(decodeURIComponent((await botao.getAttribute("href"))!.split("text=")[1])).toBe("Olá, JK! Tenho interesse no(a) Preto São Gabriel. Vi no site.");
  });

  test("CA-4: no painel de contato, Chamar no WhatsApp é botão com contorno e ícone", async ({ page }) => {
    await page.goto("/sobre/");
    const botao = page.locator(".contact-panel").getByRole("link", { name: "Chamar no WhatsApp", exact: true });
    await botao.scrollIntoViewIfNeeded();
    await expect(botao.locator('svg[aria-hidden="true"]')).toHaveCount(1);
    expect(await botao.evaluate((el) => getComputedStyle(el).borderTopColor)).toBe(CARAMELO);
    await expect(botao).toHaveAttribute("href", /^https:\/\/wa\.me\/5511967976902\?text=/);
  });

  test("CA-5: o nome acessível dos links e botões é o texto, sem a seta nem o ícone", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".request-story .actions a").first()).toHaveAccessibleName("Conheça os materiais");
    await expect(page.locator(".request-story .actions a").nth(1)).toHaveAccessibleName("Conheça a JK");
    await page.goto("/materiais/granito/");
    await expect(page.locator('[data-pedra="granito-dallas"] a')).toHaveAccessibleName("Chamar no WhatsApp sobre Dallas");
    await expect(page.locator(".pedra-outras a")).toHaveAccessibleName("Trabalhamos com outras pedras; pergunte pelo WhatsApp.");
    await expect(page.locator(".contact-panel .botao-whatsapp")).toHaveAccessibleName("Chamar no WhatsApp");
  });

  test("CA-6: os links e botões novos têm foco visível pelo teclado", async ({ page }) => {
    const contorno = (el: Element) => getComputedStyle(el).outlineStyle + " " + getComputedStyle(el).outlineWidth;
    await page.goto("/");
    const botao = page.locator(".request-story .actions").getByRole("link", { name: "Conheça os materiais", exact: true });
    const link = page.locator(".request-story .actions").getByRole("link", { name: "Conheça a JK", exact: true });
    await botao.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(botao).toBeFocused();
    expect(await botao.evaluate(contorno)).toBe("solid 3px");
    expect(await botao.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(CARAMELO);
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    expect(await link.evaluate(contorno)).toBe("solid 3px");
    await page.goto("/materiais/granito/");
    for (const alvo of [page.locator('[data-pedra="granito-dallas"] a'), page.locator(".contact-panel .botao-whatsapp")]) {
      await alvo.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(alvo).toBeFocused();
      expect(await alvo.evaluate(contorno)).toBe("solid 3px");
    }
  });
});
