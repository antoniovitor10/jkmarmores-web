"use client";

// T-0013: seta de voltar acima do título das páginas internas.
// Sem JavaScript (e para quem chega de fora do site), é um link para a página de cima.
// Vindo de outra página do site, volta como o botão do navegador e mostra o nome dela.
// O SiteLink navega de forma nativa, então document.referrer sempre aponta a página anterior.
import { useSyncExternalStore, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { asset, basePath } from "@/lib/base-path";
import { nomeRota, paiRota } from "@/lib/rotas";

const semAssinatura = () => () => {};
// No servidor e na hidratação não há página anterior: vale a página de cima.
const anteriorNoServidor = () => "";
function anteriorNoNavegador() {
  try {
    if (!document.referrer || history.length < 2) return "";
    const anterior = new URL(document.referrer);
    if (anterior.origin !== location.origin) return "";
    let rota = anterior.pathname;
    if (basePath) {
      if (rota !== basePath && !rota.startsWith(`${basePath}/`)) return "";
      rota = rota.slice(basePath.length) || "/";
    }
    return rota;
  } catch {
    return "";
  }
}

export function SetaVoltar() {
  const caminho = usePathname() ?? "/";
  const pai = paiRota(caminho);
  const rotaAnterior = useSyncExternalStore(semAssinatura, anteriorNoNavegador, anteriorNoServidor);
  const nomeAnterior = rotaAnterior && rotaAnterior !== caminho ? nomeRota(rotaAnterior) : null;
  const historico = Boolean(nomeAnterior);

  const voltar = (evento: MouseEvent<HTMLAnchorElement>) => {
    if (!historico || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.button !== 0) return;
    evento.preventDefault();
    history.back();
  };

  return <a className="seta-voltar" href={asset(pai.href)} onClick={voltar} data-historico={historico ? "true" : undefined}>
    <span aria-hidden="true">←</span> {nomeAnterior ?? pai.nome}
  </a>;
}
