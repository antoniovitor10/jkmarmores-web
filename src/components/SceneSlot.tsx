"use client";

import { useEffect, useRef, useState } from "react";
import type { Material, Texto } from "@/lib/types";
import type { StoneSelection, StoneSceneProps } from "@/lib/stone";
import { linkWhatsApp } from "@/lib/whatsapp";

type SceneComponent = React.ComponentType<StoneSceneProps>;

export function SceneSlot({ mode, materialSlug, materials, quoteBase, whatsapp }: { mode: "ambiente" | "chapa"; materialSlug?: string; materials: Material[]; quoteBase: string; whatsapp: Texto }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [Scene, setScene] = useState<SceneComponent | null>(null);
  const [carregar, setCarregar] = useState(false);
  const [selection, setSelection] = useState<StoneSelection | null>(null);
  const [erro, setErro] = useState(false);
  const mensagem = selection ? `${quoteBase} Material: ${selection.materialSlug}. Acabamento: ${selection.acabamento}. Ambiente: ${selection.ambiente}.` : quoteBase;
  const poster = mode === "chapa" ? "/3d/poster-chapa.webp" : "/3d/poster-ambiente.webp";

  function pedirOrcamento(escolha: StoneSelection) {
    setSelection(escolha);
    const detalhe = `${quoteBase} Material: ${escolha.materialSlug}. Acabamento: ${escolha.acabamento}. Ambiente: ${escolha.ambiente}.`;
    window.open(linkWhatsApp(detalhe, whatsapp), "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    if (carregar || !sectionRef.current || !('IntersectionObserver' in window)) return;
    const memoria = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || (memoria !== undefined && memoria <= 4) || (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4)) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setCarregar(true); observer.disconnect(); } }, { rootMargin: "200px" });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [carregar]);

  useEffect(() => {
    if (!carregar || Scene || erro) return;
    import("./stone-scene/StoneScene").then((mod) => setScene(() => mod.default)).catch(() => setErro(true));
  }, [carregar, Scene, erro]);

  return <div className="scene-slot" ref={sectionRef}>
    {!Scene && <picture><source srcSet={poster} type="image/webp" /><img className="scene-poster" src={poster} width={900} height={600} loading="lazy" alt={mode === "chapa" ? "Maquete provisória de uma chapa de pedra" : "Maquete provisória de um ambiente com bancada"} /></picture>}
    {Scene && !erro ? <Scene mode={mode} materialSlug={materialSlug} materials={materials} onSelectionChange={setSelection} onQuoteRequest={pedirOrcamento} /> : <button type="button" onClick={() => setCarregar(true)} disabled={carregar && !erro}>{erro ? "Cena indisponível" : carregar ? "Carregando cena" : "Explorar em 3D"}</button>}
    <p>Selecione o material e o acabamento. A cena é opcional; você pode solicitar um orçamento diretamente.</p>
    <a href={linkWhatsApp(mensagem, whatsapp)}>Pedir orçamento desta escolha</a>
  </div>;
}
