"use client";
import { useEffect, useRef, useState } from "react";
import {
  escolhaInicial,
  fontesImagem,
  imagemEscolha,
  tamanhosImagem,
  type Escolha,
} from "@/content/configurador";
import type { ConfiguradorProps } from "./Configurador";
import { Vista } from "./Vista";
export default function Seletor({
  initialChoice,
  materialContext,
}: ConfiguradorProps & { initialChoice: Escolha }) {
  const [escolha, setEscolha] = useState(initialChoice),
    [exibida, setExibida] = useState(escolhaInicial),
    [anterior, setAnterior] = useState<Escolha>(),
    [carregando, setCarregando] = useState(false),
    [erro, setErro] = useState(false);
  const request = useRef(0),
    current = useRef(escolhaInicial);
  useEffect(
    () => () => {
      request.current++;
    },
    [],
  );
  async function choose(next: Escolha) {
    setEscolha(next);
    const id = ++request.current;
    setAnterior(undefined);
    if (
      next.ambiente === current.current.ambiente &&
      next.material === current.current.material
    ) {
      setCarregando(false);
      setErro(false);
      return;
    }
    setCarregando(true);
    setErro(false);
    const image = new Image();
    image.decoding = "async";
    image.sizes = tamanhosImagem;
    image.srcset = fontesImagem(next);
    image.src = imagemEscolha(next, 1280);
    try {
      await image.decode();
      if (request.current !== id) return;
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        setAnterior(current.current);
      current.current = next;
      setExibida(next);
      setCarregando(false);
    } catch {
      if (request.current === id) {
        setCarregando(false);
        setErro(true);
      }
    }
  }
  // Honor a selection made while the deferred module was still loading.
  const initial = useRef(initialChoice);
  useEffect(() => {
    void choose(initial.current);
  }, []);
  return (
    <div
      data-seletor
      onClick={(event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
          "button",
        );
        if (!button) return;
        void choose({
          ambiente:
            (button.dataset.ambiente as Escolha["ambiente"]) ||
            escolha.ambiente,
          material:
            (button.dataset.material as Escolha["material"]) ||
            escolha.material,
        });
      }}
    >
      <Vista
        escolha={escolha}
        exibida={exibida}
        anterior={anterior}
        carregando={carregando}
        erro={erro}
        materialContext={materialContext}
        onFadeEnd={() => setAnterior(undefined)}
      />
    </div>
  );
}
