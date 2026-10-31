import fs from "node:fs";
import { expect, test } from "@playwright/test";

// HU-0001 · T-0002: catálogo por pedra nas páginas de categoria. Lê os mesmos dados do site para não fixar contagens.
type Pedra = { slug: string; nome: string; categoria: string; grupo?: string; oculta?: boolean };
const pedras: Pedra[] = JSON.parse(fs.readFileSync("src/content/pedras.json", "utf8"));
const manifesto = JSON.parse(fs.readFileSync("src/generated/images.json", "utf8"));
const visiveis = (categoria: string) => pedras.filter((p) => p.categoria === categoria && !p.oculta && manifesto[`pedra-${p.slug}`]);
const CATEGORIAS = ["granito", "marmore", "quartzo", "ultracompacto"];
const WHATSAPP = /^https:\/\/wa\.me\/5511967976902\?text=/;
const texto = (href: string) => decodeURIComponent(href.split("text=")[1]);

test.describe("catálogo por pedra", () => {
  test("CA-1: cada categoria mostra um cartão com imagem, nome e WhatsApp para cada pedra da lista", async ({ page }) => {
    for (const categoria of CATEGORIAS) {
      await page.goto(`/materiais/${categoria}/`);
      const esperadas = visiveis(categoria);
      const cartoes = page.locator("[data-pedra]");
      await expect(cartoes).toHaveCount(esperadas.length);
      for (const pedra of esperadas) {
        const cartao = page.locator(`[data-pedra="${pedra.slug}"]`);
        await expect(cartao.getByRole("heading", { level: 3 })).toHaveText(pedra.nome);
        await expect(cartao.locator("img")).toHaveAttribute("alt", /.{10,}/);
        await expect(cartao.getByRole("link", { name: /Chamar no WhatsApp/ })).toHaveAttribute("href", WHATSAPP);
      }
      const nomes = await cartoes.locator("h3").allTextContents();
      for (const nome of nomes) expect(pedras.map((p) => p.nome)).toContain(nome);
    }
  });

  test("CA-2: o WhatsApp do cartão leva a mensagem da pedra, com a categoria quando o nome se repete", async ({ page }) => {
    await page.goto("/materiais/granito/");
    const psg = page.locator('[data-pedra="granito-preto-sao-gabriel"]').getByRole("link", { name: /Chamar no WhatsApp/ });
    await psg.scrollIntoViewIfNeeded();
    expect(texto((await psg.getAttribute("href"))!)).toBe("Olá, JK! Tenho interesse no(a) Preto São Gabriel. Vi no site.");
    // Toque de verdade no link, interceptando a navegação para o wa.me (sem sair para a internet).
    await page.route(/wa\.me/, (rota) => rota.abort());
    const [pedido] = await Promise.all([page.waitForRequest(/wa\.me/), psg.click()]);
    expect(texto(pedido.url())).toBe("Olá, JK! Tenho interesse no(a) Preto São Gabriel. Vi no site.");
    await page.goto("/materiais/marmore/");
    const calacatta = page.locator('[data-pedra="marmore-calacatta"]').getByRole("link", { name: /Chamar no WhatsApp/ });
    expect(texto((await calacatta.getAttribute("href"))!)).toBe("Olá, JK! Tenho interesse no(a) Calacatta (mármore). Vi no site.");
    await page.goto("/materiais/quartzo/");
    const quartzo = page.locator('[data-pedra="quartzo-calacatta"]').getByRole("link", { name: /Chamar no WhatsApp/ });
    expect(texto((await quartzo.getAttribute("href"))!)).toBe("Olá, JK! Tenho interesse no(a) Calacatta (quartzo). Vi no site.");
    await page.goto("/materiais/ultracompacto/");
    const lamina = page.locator('[data-pedra="lamina-calacatta"]').getByRole("link", { name: /Chamar no WhatsApp/ });
    expect(texto((await lamina.getAttribute("href"))!)).toBe("Olá, JK! Tenho interesse no(a) Calacatta (lâmina). Vi no site.");
  });

  test("CA-5: no fim de cada lista aparece a linha de outras pedras com link de WhatsApp", async ({ page }) => {
    for (const categoria of CATEGORIAS) {
      await page.goto(`/materiais/${categoria}/`);
      const linha = page.getByRole("link", { name: "Trabalhamos com outras pedras; pergunte pelo WhatsApp." });
      await linha.scrollIntoViewIfNeeded();
      await expect(linha).toBeVisible();
      await expect(linha).toHaveAttribute("href", WHATSAPP);
      // No fim da lista: abaixo do último cartão.
      const yLinha = (await linha.boundingBox())!.y;
      const ultimo = (await page.locator("[data-pedra]").last().boundingBox())!;
      expect(yLinha).toBeGreaterThan(ultimo.y + ultimo.height - 1);
    }
  });

  test("CA-9: sem JavaScript, os cartões, imagens e links de WhatsApp estão no HTML", async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const page = await contexto.newPage();
    await page.goto("/materiais/granito/");
    await expect(page.locator("[data-pedra]")).toHaveCount(visiveis("granito").length);
    await expect(page.locator("[data-pedra] img").first()).toHaveAttribute("alt", /granito/);
    await expect(page.locator("[data-pedra] a").first()).toHaveAttribute("href", WHATSAPP);
    await contexto.close();
  });

  test("CA-13: nas lâminas, a linha de acabamentos aparece acima dos cartões", async ({ page }) => {
    await page.goto("/materiais/ultracompacto/");
    const nota = page.getByText("Acabamentos polido e acetinado.", { exact: true });
    await expect(nota).toBeVisible();
    const yNota = (await nota.boundingBox())!.y;
    const yCartao = (await page.locator("[data-pedra]").first().boundingBox())!.y;
    expect(yNota).toBeLessThan(yCartao);
  });

  test("CA-14: os mármores ficam em dois grupos, cada um só com as suas pedras", async ({ page }) => {
    await page.goto("/materiais/marmore/");
    for (const grupo of ["Mármores nacionais", "Mármores importados"]) {
      const bloco = page.locator(".pedra-catalogo > div").filter({ has: page.getByRole("heading", { level: 2, name: grupo }) });
      const slugs = await bloco.locator("[data-pedra]").evaluateAll((els) => els.map((e) => e.getAttribute("data-pedra")));
      expect(slugs).toEqual(visiveis("marmore").filter((p) => p.grupo === grupo).map((p) => p.slug));
    }
  });
});
