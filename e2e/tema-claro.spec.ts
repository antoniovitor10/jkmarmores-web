import { test, expect, type Page } from "@playwright/test";

// T-0009: prévia com fundo branco; desde a T-0012 é o tema do site principal. Vale para os builds de homologação e de produção.
const BRANCO = "rgb(255, 255, 255)";
const TEXTO = "rgb(31, 27, 24)";
const PAGINAS = ["/", "/materiais/", "/materiais/granito/", "/aplicacoes/", "/galeria/", "/sobre/", "/contato/"];

// Contraste WCAG entre duas cores "rgb(r, g, b)".
function contraste(a: string, b: string) {
  const lum = (c: string) => {
    const [r, g, bl] = (c.match(/\d+/g) ?? []).slice(0, 3).map((v) => Number(v) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

async function corDe(page: Page, seletor: string) {
  return page.locator(seletor).first().evaluate((el) => getComputedStyle(el).color);
}

test.describe("T-0009 · prévia com fundo branco", () => {
  test("CA-1: todas as páginas têm fundo branco e texto escuro, navegando pelo menu", async ({ page, isMobile }) => {
    await page.goto("/");
    for (const caminho of PAGINAS) {
      if (caminho !== "/") {
        const nome = { "/materiais/": "Materiais", "/sobre/": "A empresa", "/contato/": "Contato" }[caminho];
        if (nome) {
          // Chega pelo menu de verdade quando o link está no menu; as demais pelo endereço.
          if (isMobile) await page.locator(".mobile-nav summary").click();
          await page.locator(isMobile ? ".mobile-nav nav" : ".desktop-nav").getByRole("link", { name: nome, exact: true }).click();
          await expect(page).toHaveURL(new RegExp(`${caminho.replace(/\//g, "\\/")}$`));
        } else {
          await page.goto(caminho);
        }
      }
      const fundo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(fundo, caminho).toBe(BRANCO);
      if (caminho !== "/") expect(await corDe(page, "main h1"), caminho).not.toBe("rgb(238, 229, 220)");
      expect(await page.evaluate(() => getComputedStyle(document.body).color), caminho).toBe(TEXTO);
    }
  });

  test("CA-2: textos e links sobre o branco têm contraste de pelo menos 4,5:1", async ({ page }) => {
    for (const caminho of ["/materiais/", "/materiais/granito/", "/sobre/", "/contato/"]) {
      await page.goto(caminho);
      const pares = await page.locator("main :is(p, a, h1, h2, h3, li, dd, dt, address, span)").evaluateAll((els) =>
        els
          .filter((el) => (el as HTMLElement).offsetParent && (el as HTMLElement).innerText.trim() && !el.closest(".stone-panel, .home-hero, .selector-image, .pendente"))
          .map((el) => {
            // Sobe até o primeiro fundo opaco.
            let n: Element | null = el, fundo = "rgb(255, 255, 255)";
            while (n) { const b = getComputedStyle(n).backgroundColor; if (b && !b.startsWith("rgba(0, 0, 0, 0)") && !b.endsWith(", 0)")) { fundo = b; break; } n = n.parentElement; }
            return { texto: (el as HTMLElement).innerText.trim().slice(0, 40), cor: getComputedStyle(el).color, fundo };
          })
      );
      for (const p of pares) expect(contraste(p.cor, p.fundo), `"${p.texto}" em ${caminho} (${p.cor} sobre ${p.fundo})`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("CA-3: o logo do cabeçalho é a versão transparente, sem caixa preta", async ({ page }) => {
    await page.goto("/sobre/");
    const logo = page.locator(".site-header .brand-monogram");
    await expect(logo).toHaveAttribute("src", /jk-monograma-240-transparente\.webp$/);
    const cantoTransparente = await logo.evaluate(async (img: HTMLImageElement) => {
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(1, 1, 1, 1).data[3];
    });
    expect(cantoTransparente).toBe(0);
  });

  test("CA-4: no celular, o menu abre legível (grafite desde a T-0013) e fecha", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu do celular");
    await page.goto("/materiais/");
    const menu = page.locator(".mobile-nav");
    await menu.locator("summary").click();
    await expect(menu).toHaveAttribute("open", "");
    const link = menu.locator("nav").getByRole("link", { name: /A empresa/ });
    await expect(link).toBeVisible();
    const fundo = await menu.locator("nav").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(fundo).toBe("rgb(16, 16, 15)");
    expect(contraste(await link.evaluate((el) => getComputedStyle(el).color), fundo)).toBeGreaterThanOrEqual(4.5);
    await menu.locator("summary").click();
    await expect(menu).not.toHaveAttribute("open", "");
  });

  test("CA-5: o cartão da pedra fica legível e o botão abre o WhatsApp com a pedra", async ({ page }) => {
    await page.goto("/materiais/granito/");
    const cartao = page.locator('[data-pedra="granito-dallas"]');
    await cartao.scrollIntoViewIfNeeded();
    const nome = cartao.locator("h3");
    expect(contraste(await nome.evaluate((el) => getComputedStyle(el).color), BRANCO)).toBeGreaterThanOrEqual(4.5);
    const botao = cartao.getByRole("link", { name: /Chamar no WhatsApp/ });
    expect(contraste(await botao.evaluate((el) => getComputedStyle(el).color), BRANCO)).toBeGreaterThanOrEqual(4.5);
    const href = await botao.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(href ?? "")).toContain("Dallas");
    await botao.hover();
  });

  // T-0012: o branco virou o site principal. A indexação segue o modo do build:
  // homologação (robots.txt com Disallow: /) fica com noindex; produção fica indexável.
  test("CA-8 (T-0009) / CA-4 (T-0012): a indexação segue o modo do build", async ({ page, request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    const homolog = /Disallow: \/\s*$/m.test(robots);
    for (const caminho of ["/", "/materiais/granito/"]) {
      await page.goto(caminho);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", homolog ? /noindex/ : /^index, follow$/);
    }
  });
});
