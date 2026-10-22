import { expect, test, type Locator, type Page } from "@playwright/test";

// HU-0001 · T-0005: capa nova em Calacatta e jornada só com imagens, sem vídeo.
const QUADROS = ["sequencia-01-chapa", "sequencia-02-borda", "sequencia-03-acabamento", "sequencia-04-aplicada"];
const AVISOS = /gerad[ao] por IA|ilustrativ|n[aã]o representa obra/i;

// Id da imagem a partir do arquivo servido (/img/capa-calacatta-mobile-768.avif → capa-calacatta-mobile).
async function idCarregado(img: Locator) {
  await expect.poll(async () => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0 && el.currentSrc !== "")).toBe(true);
  const src = await img.evaluate((el: HTMLImageElement) => el.currentSrc);
  return src.split("/").pop()!.replace(/-\d+\.(avif|webp)$/, "");
}

function registrarVideos(page: Page) {
  const videos: string[] = [];
  page.on("request", (req) => { if (/\.mp4(\?|$)/.test(req.url())) videos.push(req.url()); });
  return videos;
}

test.describe("capa e jornada", () => {
  test("CA-6: a capa mostra a imagem nova em Calacatta e a página não tem vídeo", async ({ page, isMobile }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const capa = page.getByRole("region", { name: "Apresentação da JK" }).locator("img").first();
    expect(await idCarregado(capa)).toBe(isMobile ? "capa-calacatta-mobile" : "capa-calacatta");
    await expect(page.locator("video")).toHaveCount(0);
  });

  test("CA-15: rolando a jornada, os 4 quadros novos aparecem um a um e nenhum vídeo é baixado", async ({ page }) => {
    const videos = registrarVideos(page);
    // O movimento da jornada monta depois do evento load (src/components/SiteInteractions.tsx).
    await page.goto("/", { waitUntil: "networkidle" });
    // A home mostra a jornada em src/components/StoneEditorial.tsx: 4 painéis com imagem lazy, que carregam ao rolar.
    const quadros = page.locator(".stone-editorial .stone-panel");
    await expect(quadros).toHaveCount(QUADROS.length);
    for (const [i, id] of QUADROS.entries()) {
      await quadros.nth(i).scrollIntoViewIfNeeded();
      await expect(quadros.nth(i).locator("img")).toBeInViewport();
      expect(await idCarregado(quadros.nth(i).locator("img"))).toMatch(new RegExp(`^${id}(-mobile)?$`));
      // Os ids não mudaram (E3); a largura do original prova que é o quadro novo (1672 px; os de setembro tinham 2752).
      await expect(quadros.nth(i).locator("img")).toHaveAttribute("width", "1672");
    }
    await expect(page.locator("video")).toHaveCount(0);
    expect(videos).toEqual([]);
  });

  test("CA-16: /sobre/ e /materiais/ mostram os quadros novos da jornada", async ({ page }) => {
    for (const [caminho, id] of [["/sobre/", "sequencia-04-aplicada"], ["/materiais/", "sequencia-01-chapa"]]) {
      await page.goto(caminho);
      const img = page.locator(`.editorial-image img[alt]`).first();
      await img.scrollIntoViewIfNeeded();
      expect(await idCarregado(img)).toBe(id);
      // Os quadros novos têm 1672 px de largura no original (os de setembro tinham 2752).
      await expect(img).toHaveAttribute("width", "1672");
    }
  });

  test("CA-17: os alt da capa e da jornada descrevem a imagem sem aviso de IA", async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const page = await contexto.newPage();
    await page.goto("/");
    const alts = await page.locator(".home-hero img, .stone-editorial img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt") ?? ""));
    expect(alts.length).toBeGreaterThan(0);
    for (const alt of alts) { expect(alt.length).toBeGreaterThan(10); expect(alt).not.toMatch(AVISOS); }
    expect(alts.join(" ")).toMatch(/Calacatta/);
    await contexto.close();
  });
});
