// Prefixo de publicação em subpasta (ex.: "/1" em jkmarmores.com.br/1/).
// Vazio na raiz. Definido no build por NEXT_PUBLIC_BASE_PATH.
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Prefixa caminhos absolutos do próprio site ("/img/...", "/contato/"). URLs externas e data: passam intactas. */
export function asset<T extends string | undefined>(caminho: T): T {
  if (!caminho || !basePath || !caminho.startsWith("/") || caminho.startsWith("//")) return caminho;
  if (caminho === basePath || caminho.startsWith(`${basePath}/`)) return caminho;
  return `${basePath}${caminho}` as T;
}

/** Prefixa cada URL de um srcset ("url 480w, url 960w"). */
export function assetSrcSet(srcset: string): string {
  return srcset
    .split(",")
    .map((parte) => {
      const [url, ...descritor] = parte.trim().split(/\s+/);
      return [asset(url), ...descritor].join(" ");
    })
    .join(", ");
}
