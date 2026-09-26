import type { ImgHTMLAttributes } from "react";
import { preload } from "react-dom";
import { readFileSync } from "node:fs";
import path from "node:path";
import manifest from "@/generated/images.json";

type FotoProps = { id: string; alt: string; sizes: string; prioridade?: boolean; incorporarAvif?: boolean; className?: string };
type Variante = { width: number; avif: string; webp: string };
type ImagemGerada = { width: number; height: number; placeholder: string; variantes: Variante[] };
const imagens = manifest as Record<string, ImagemGerada>;

export function Foto({ id, alt, sizes, prioridade = false, incorporarAvif = false, className }: FotoProps) {
  const imagem = imagens[id];
  if (!imagem) return null;
  const srcSet = (formato: "avif" | "webp") => imagem.variantes.map((item) => `${item[formato]} ${item.width}w`).join(", ");
  const ultima = imagem.variantes.at(-1);
  if (!ultima) return null;
  const inlineAvif = incorporarAvif ? `data:image/avif;base64,${readFileSync(path.join(process.cwd(), "public", ultima.avif)).toString("base64")}` : undefined;
  if (prioridade && !inlineAvif) preload(ultima.avif, { as: "image", type: "image/avif", imageSrcSet: srcSet("avif"), imageSizes: sizes, fetchPriority: "high" });
  const prioridadeAtributos: ImgHTMLAttributes<HTMLImageElement> = prioridade ? { fetchPriority: "high", loading: "eager" } : { loading: "lazy" };
  return <picture className={className}>
    <source type="image/avif" srcSet={inlineAvif ?? srcSet("avif")} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
    <img src={ultima.webp} alt={alt} width={imagem.width} height={imagem.height} sizes={sizes} style={{ backgroundImage: `url(${imagem.placeholder})` }} {...prioridadeAtributos} />
  </picture>;
}
