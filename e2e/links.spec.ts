import { expect, test, type Locator } from "@playwright/test";

// T-0008: links e botões que parecem clicáveis.
// T-0009 (prévia com fundo branco): na página o caramelo de texto é #7a5c42 = rgb(122, 92, 66);
// o rodapé continua grafite com o caramelo #c9ab91 = rgb(201, 171, 145); o foco do botão com contorno preenche de grafite.
const CARAMELO = "rgb(122, 92, 66)";
const CARAMELO_RODAPE = "rgb(201, 171, 145)";
const GRAFITE = "rgb(43, 38, 34)";

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
    // T-0013: o painel "Vamos conversar" é grafite; a borda usa o caramelo claro do rodapé.
    expect(await botao.evaluate((el) => getComputedStyle(el).borderTopColor)).toBe(CARAMELO_RODAPE);
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

  test("CA-8: Explore as referências, na abertura da home, é link com seta e leva ao configurador", async ({ page }) => {
    await page.goto("/");
    const link = page.locator(".hero-signature a");
    await expect(link).toHaveText("Explore as referências");
    // A animação entra depois do load; com ela, o link só aparece no fim da abertura: rola até lá.
    const animada = await page.waitForSelector('.prologo[data-enhanced="true"]', { state: "attached", timeout: 8000 }).then(() => true, () => false);
    if (animada) {
      const altura = await page.locator(".prologo").evaluate((el) => el.getBoundingClientRect().height);
      await page.mouse.wheel(0, altura * 0.95);
      await expect(link).toBeVisible();
    }
    const e = await estiloLink(link);
    expect(e).toMatchObject({ cor: CARAMELO, sublinhado: "underline", fonte: 16 });
    expect(e.seta).toContain("→");
    if (animada) {
      await link.click();
      await expect(page).toHaveURL(/#configurador$/);
    }
  });

  test("CA-9: Ver outras formas de contato é link com seta e leva ao contato", async ({ page }) => {
    await page.goto("/galeria/");
    const link = page.locator(".closing-cta").getByRole("link", { name: "Ver outras formas de contato", exact: true });
    await link.scrollIntoViewIfNeeded();
    const e = await estiloLink(link);
    expect(e).toMatchObject({ cor: CARAMELO, sublinhado: "underline", fonte: 16 });
    expect(e.seta).toContain("→");
    expect(e.altura).toBeGreaterThanOrEqual(44);
    await link.click();
    await expect(page).toHaveURL(/\/contato\/$/);
  });

  test("CA-10: os links do rodapé ficam caramelo, sublinham no hover e levam ao destino", async ({ page, isMobile }) => {
    await page.goto("/");
    const rodape = page.locator(".footer-grid");
    for (const nome of ["A empresa", "Materiais", "Chamar no WhatsApp", "Todos os contatos"]) {
      const link = rodape.getByRole("link", { name: nome, exact: true });
      await link.scrollIntoViewIfNeeded();
      expect(await link.evaluate((el) => getComputedStyle(el).color), nome).toBe(CARAMELO_RODAPE);
      if (!isMobile) {
        expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine), nome).toBe("none");
        await link.hover();
        await expect.poll(() => link.evaluate((el) => getComputedStyle(el).textDecorationLine), { message: nome }).toBe("underline");
      }
    }
    const telefone = rodape.locator(".footer-phone");
    expect(await telefone.evaluate((el) => getComputedStyle(el).color)).toBe(CARAMELO_RODAPE);
    await rodape.getByRole("link", { name: "Todos os contatos", exact: true }).click();
    await expect(page).toHaveURL(/\/contato\/$/);
  });

  test("CA-11: no levantamento, nenhum link de texto fica sem sublinhado, borda, fundo e sem reação ao mouse", async ({ page, isMobile }) => {
    test.skip(isMobile, "o hover só existe com mouse; o celular é coberto pelos CA-8 a CA-10");
    for (const caminho of ["/", "/materiais/", "/materiais/granito/", "/galeria/", "/sobre/", "/contato/"]) {
      await page.goto(caminho);
      // Marca os links visíveis antes de mexer no mouse: a barra do WhatsApp aparece com a rolagem e mudaria a contagem.
      const total = await page.locator("a:visible").evaluateAll((els) => { els.forEach((el, i) => el.setAttribute("data-levantamento", String(i))); return els.length; });
      for (let i = 0; i < total; i++) {
        const link = page.locator(`[data-levantamento="${i}"]`);
        const sinal = () => link.evaluate((el) => { const s = getComputedStyle(el); return { decorado: s.textDecorationLine.includes("underline") || parseFloat(s.borderBottomWidth) > 0 || s.backgroundColor !== "rgba(0, 0, 0, 0)", visual: [s.color, s.textDecorationLine, s.backgroundColor].join("|"), imagem: !!el.querySelector("img,picture,svg"), texto: (el as HTMLElement).innerText.trim() }; });
        const antes = await sinal();
        if (antes.decorado || antes.imagem || !antes.texto) continue;
        // T-0013: o botão do WhatsApp fica sempre no canto de baixo; o link é centralizado na tela, como a pessoa faria ao rolar.
        await link.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await link.hover({ force: true });
        await expect.poll(async () => (await sinal()).visual !== antes.visual, { message: `"${antes.texto}" em ${caminho}`, timeout: 1500 }).toBe(true);
        await page.mouse.move(0, 0);
      }
    }
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
    await expect.poll(() => botao.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(GRAFITE);
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
