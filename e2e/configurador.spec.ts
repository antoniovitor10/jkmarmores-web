import fs from "node:fs";
import { expect, test } from "@playwright/test";

// HU-0001 · T-0006: configurador com Calacatta, Travertino e Preto São Gabriel em dois ambientes.
const AMBIENTES = [["cozinha", "Cozinha com ilha"], ["lavatorio", "Lavatório"]] as const;
const PEDRAS = [["calacatta", "Calacatta"], ["travertino", "Travertino"], ["preto-sao-gabriel", "Preto São Gabriel"]] as const;
const AVISOS = /gerad[ao] por IA|ilustrativ|n[aã]o representa/i;

test.describe("configurador", () => {
  test("CA-7: cada combinação troca a imagem, o nome e o link de orçamento", async ({ page }) => {
    // O seletor é um componente de cliente: espera a hidratação.
    await page.goto("/", { waitUntil: "networkidle" });
    const secao = page.locator("#configurador");
    await secao.scrollIntoViewIfNeeded();
    const img = secao.locator(".selector-image img");
    for (const [ambiente, nomeAmbiente] of AMBIENTES) {
      await secao.getByRole("button", { name: nomeAmbiente, exact: true }).click();
      for (const [pedra, nomePedra] of PEDRAS) {
        await secao.getByRole("button", { name: nomePedra, exact: true }).click();
        await expect(img).toHaveAttribute("src", new RegExp(`/configurador/estatico/${ambiente}-${pedra}-1280\\.avif$`));
        await expect(secao.locator(".selector-caption")).toHaveText(`${nomeAmbiente} / ${nomePedra}`);
        const alt = (await img.getAttribute("alt"))!;
        expect(alt).toBe(`${nomeAmbiente} em ${nomePedra}.`);
        expect(alt).not.toMatch(AVISOS);
        const href = (await secao.getByRole("link", { name: "Chamar no WhatsApp" }).getAttribute("href"))!;
        expect(href).toMatch(/^https:\/\/wa\.me\/5511967976902\?text=/);
        expect(decodeURIComponent(href.split("text=")[1])).toContain(`${nomeAmbiente} / ${nomePedra}`);
      }
    }
    // Volta à combinação inicial por clique, para ela também ser alcançada pela troca.
    await secao.getByRole("button", { name: "Cozinha com ilha", exact: true }).click();
    await secao.getByRole("button", { name: "Calacatta", exact: true }).click();
    await expect(img).toHaveAttribute("src", /\/configurador\/estatico\/cozinha-calacatta-1280\.avif$/);
    await expect(secao.locator(".selector-caption")).toHaveText("Cozinha com ilha / Calacatta");
  });

  test("CA-15: ao carregar, a escolha é Cozinha com ilha / Calacatta e a legenda das pedras é Pedra", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const secao = page.locator("#configurador");
    await expect(secao.getByRole("button", { name: "Cozinha com ilha", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(secao.getByRole("button", { name: "Calacatta", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(secao.locator("legend").nth(1)).toHaveText("Pedra");
  });

  test("CA-16: o build gera só as 12 imagens novas do configurador", async () => {
    const arquivos = fs.readdirSync("out/configurador/estatico").sort();
    const esperados = AMBIENTES.flatMap(([a]) => PEDRAS.flatMap(([p]) => [`${a}-${p}-1280.avif`, `${a}-${p}-720.avif`])).sort();
    expect(arquivos).toEqual(esperados);
    // Cada par de AVIF vem de um original em assets/images/configurador-* (PRD D3).
    const originais = fs.readdirSync("assets/images").filter((n) => n.startsWith("configurador-")).map((n) => n.replace(/^configurador-/, "").replace(/\.png$/, "")).sort();
    expect(originais).toEqual(AMBIENTES.flatMap(([a]) => PEDRAS.map(([p]) => `${a}-${p}`)).sort());
    const manifesto = JSON.parse(fs.readFileSync("src/generated/images.json", "utf8"));
    expect(Object.keys(manifesto).filter((id) => id.startsWith("configurador-"))).toEqual([]);
  });
});
