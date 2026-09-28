"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ambientesConfigurador as ambientes,
  materiaisConfigurador as materiais,
  acabamentosConfigurador as acabamentos,
  orcamentoConfigurador,
  quantidadeQuadros,
  type AmbienteConfigurador,
  type MaterialConfigurador,
  type AcabamentoConfigurador,
} from "@/content/configurador";
import type { ConfiguradorProps } from "./Configurador";
import { FrameCanvas } from "./FrameCanvas";
import { Drawer } from "./Drawer";
import { useCamera } from "./useCamera";
import styles from "./Configurador.module.css";
export { preloadInitialFrames } from "./initialFrames";

export default function Experiencia({
  compact,
  materialContext,
}: ConfiguradorProps) {
  const stage = useRef<HTMLDivElement>(null),
    fullscreenButton = useRef<HTMLButtonElement>(null);
  const [environment, setEnvironment] =
      useState<AmbienteConfigurador>("cozinha"),
    [material, setMaterial] = useState<MaterialConfigurador>("rosado"),
    [finish, setFinish] = useState<AcabamentoConfigurador>("polido");
  const [detail, setDetail] = useState(false),
    [full, setFull] = useState(false),
    [fallback, setFallback] = useState(false),
    [ready, setReady] = useState(false),
    [staticMode, setStaticMode] = useState(true),
    [hint, setHint] = useState(false);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "ready",
  );
  const handleLoadState = useCallback(
    (state: "loading" | "ready" | "error") => setLoadState(state),
    [],
  );
  const interact = useCallback(() => setHint(false), []);
  const combo = `${environment}-${material}`;
  const camera = useCamera(
    stage,
    staticMode,
    interact,
    quantidadeQuadros(combo),
  );
  const { view, glide, stop, current, zoomAt, update } = camera;
  const markReady = useCallback(() => setReady(true), []);
  const instructions = useId(),
    hintSeen = useRef(false);
  const envName = ambientes.find((x) => x.id === environment)!.nome,
    matName = materiais.find((x) => x.id === material)!.nome,
    finishItem = acabamentos.find((x) => x.id === finish)!;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)"),
      connection = (
        navigator as Navigator & {
          connection?: EventTarget & { saveData?: boolean };
        }
      ).connection;
    const sync = () => setStaticMode(media.matches || !!connection?.saveData);
    sync();
    media.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
    };
  }, []);
  useEffect(() => {
    if (!ready || staticMode || hintSeen.current || !stage.current) return;
    try {
      if (localStorage.getItem("jk-configurador-gestos-v1")) return;
    } catch {}
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !entries.some((entry) => entry.intersectionRatio > 0.55) ||
          hintSeen.current
        )
          return;
        hintSeen.current = true;
        try {
          localStorage.setItem("jk-configurador-gestos-v1", "1");
        } catch {}
        setHint(true);
        timer = setTimeout(() => setHint(false), 1200);
      },
      { threshold: [0.55] },
    );
    observer.observe(stage.current);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [ready, staticMode]);
  const exitFull = useCallback(async () => {
    if (document.fullscreenElement)
      await document.exitFullscreen().catch(() => {});
    setFallback(false);
    setFull(false);
    requestAnimationFrame(() =>
      fullscreenButton.current?.focus({ preventScroll: true }),
    );
  }, []);
  useEffect(() => {
    const sync = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  useEffect(() => {
    if (!fallback) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const blocked: HTMLElement[] = [];
    let branch: HTMLElement | null = stage.current;
    while (branch && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement?.children ?? [])) {
        if (
          sibling !== branch &&
          sibling instanceof HTMLElement &&
          !sibling.inert
        ) {
          sibling.inert = true;
          blocked.push(sibling);
        }
      }
      branch = branch.parentElement;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      blocked.forEach((el) => {
        el.inert = false;
      });
    };
  }, [fallback]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (full || fallback)) {
        event.preventDefault();
        void exitFull();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [full, fallback, exitFull]);
  async function toggleFull() {
    interact();
    stop();
    if (full || fallback) {
      await exitFull();
      return;
    }
    const node = stage.current;
    if (!node) return;
    try {
      if (!node.requestFullscreen) throw new Error("Unsupported");
      await node.requestFullscreen();
      setFull(true);
    } catch {
      setFallback(true);
      setFull(true);
    }
    node.focus({ preventScroll: true });
  }
  function rotate(delta: number) {
    interact();
    if (!staticMode)
      glide({ ...current.current, position: current.current.position + delta });
  }
  function reset() {
    interact();
    glide({ ...current.current, zoom: 1, x: 0, y: 0 });
  }
  function changeSelection(action: () => void) {
    interact();
    stop();
    action();
  }
  return (
    <div
      ref={stage}
      className={`${styles.stage} ${compact ? styles.compact : ""} ${fallback ? styles.expanded : ""}`}
      data-immersive
      data-position={view.position.toFixed(4)}
      data-zoom={view.zoom.toFixed(3)}
      data-pan={`${view.x.toFixed(1)},${view.y.toFixed(1)}`}
      data-fullscreen={full || fallback}
      data-static={staticMode}
      tabIndex={0}
      role={fallback ? "dialog" : "group"}
      aria-modal={fallback ? true : undefined}
      aria-label="Explorar ambiente"
      aria-describedby={instructions}
      onPointerMove={camera.move}
      onPointerDown={camera.down}
      onPointerUp={camera.up}
      onPointerCancel={camera.up}
      onKeyDown={(event) => {
        interact();
        if (event.key === "Escape") {
          if (full || fallback) void exitFull();
          else {
            setDetail(false);
            reset();
          }
          return;
        }
        if (event.key === "Tab" && (full || fallback)) {
          const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not(:disabled),a[href]",
            ),
          ).filter(
            (el) =>
              !el.closest("[inert],[hidden]") &&
              el.getClientRects().length &&
              getComputedStyle(el).visibility !== "hidden",
          );
          if (
            event.shiftKey &&
            (document.activeElement === buttons[0] ||
              document.activeElement === stage.current)
          ) {
            event.preventDefault();
            buttons.at(-1)?.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === buttons.at(-1)
          ) {
            event.preventDefault();
            buttons[0]?.focus();
          }
          return;
        }
        if (event.target !== event.currentTarget) return;
        if (
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "+",
            "=",
            "-",
            "Home",
            "End",
          ].includes(event.key)
        )
          event.preventDefault();
        if (event.key === "ArrowLeft" || event.key === "ArrowRight")
          rotate((event.key === "ArrowLeft" ? -1 : 1) * 0.055);
        if (event.key === "ArrowUp" || event.key === "ArrowDown")
          update({
            ...current.current,
            y: current.current.y + (event.key === "ArrowUp" ? 48 : -48),
          });
        if (event.key === "+" || event.key === "=")
          zoomAt(current.current.zoom + 0.4);
        if (event.key === "-") zoomAt(current.current.zoom - 0.4);
        if (!staticMode && event.key === "Home")
          glide({ ...current.current, position: 0 });
        if (!staticMode && event.key === "End")
          glide({ ...current.current, position: 1 });
      }}
    >
      <FrameCanvas
        combo={combo}
        view={view}
        staticMode={staticMode}
        onReady={markReady}
        onLoadState={handleLoadState}
        label={`${envName}, referência de ${matName.toLowerCase()}. Visualização ilustrativa gerada por IA.`}
      />
      {!ready && (
        <p className={styles.loadMessage} role="status">
          Entrando no ambiente...
        </p>
      )}
      <header className={styles.header} data-controls>
        <p>
          {envName}
          <span>
            {matName} / {finishItem.nome}
          </span>
        </p>
        <button ref={fullscreenButton} type="button" onClick={toggleFull}>
          {full || fallback ? "Sair da tela cheia" : "Tela cheia"}
        </button>
      </header>
      {hint && (
        <div className={styles.gestureHint} aria-hidden="true">
          <span />
          Arraste para girar. Dois toques para aproximar.
        </div>
      )}
      <Drawer
        summary={
          <>
            <div
              className={styles.materials}
              role="group"
              aria-label="Material"
            >
              {materiais.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={material === item.id}
                  aria-busy={material === item.id && loadState === "loading"}
                  data-material={item.id}
                  className={styles.sample}
                  onClick={() => changeSelection(() => setMaterial(item.id))}
                >
                  <span className={styles.swatch}>
                    <img
                      src={`/configurador/closes/${item.id}-polido.avif`}
                      width="44"
                      height="44"
                      alt=""
                    />
                    {material === item.id && loadState === "loading" && (
                      <span className={styles.loadingRing} aria-hidden="true" />
                    )}
                  </span>
                  {item.nome}
                </button>
              ))}
            </div>
            <a
              href={orcamentoConfigurador(
                envName,
                matName,
                finishItem.nome,
                materialContext,
              )}
              className={styles.quote}
            >
              Pedir orçamento desta pedra
            </a>
            <p className={styles.disclaimer}>
              Visualização ilustrativa, gerada por IA.
              <span>Materiais e acabamentos a confirmar com a JK.</span>
            </p>
          </>
        }
      >
        <fieldset className={styles.options}>
          <legend>Ambiente</legend>
          {ambientes.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={environment === item.id}
              onClick={() => changeSelection(() => setEnvironment(item.id))}
            >
              {item.nome}
            </button>
          ))}
        </fieldset>
        <fieldset className={styles.options}>
          <legend>Acabamento</legend>
          {acabamentos.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={finish === item.id}
              onClick={() =>
                changeSelection(() => {
                  setFinish(item.id);
                  setDetail(true);
                })
              }
            >
              {item.nome}
            </button>
          ))}
        </fieldset>
        <button
          className={styles.surfaceButton}
          type="button"
          aria-expanded={detail}
          onClick={() => setDetail(!detail)}
        >
          {detail ? "Fechar detalhe" : "Ver detalhe da superfície"}
        </button>
        {detail && (
          <div className={styles.detail}>
            <img
              key={`${material}-${finish}`}
              src={`/configurador/closes/${material}-${finish}.avif`}
              width="720"
              height="405"
              alt={`Detalhe ilustrativo: ${matName}, acabamento ${finishItem.nome.toLowerCase()}.`}
            />
            <p>{finishItem.descricao} O ambiente mantém a vista polida.</p>
          </div>
        )}
        <div
          className={styles.desktopTools}
          role="group"
          aria-label="Explorar a vista"
        >
          <button
            type="button"
            disabled={staticMode || view.position <= 0}
            onClick={() => rotate(-0.055)}
          >
            Girar à esquerda
          </button>
          <button
            type="button"
            disabled={staticMode || view.position >= 1}
            onClick={() => rotate(0.055)}
          >
            Girar à direita
          </button>
          <button
            type="button"
            disabled={view.zoom >= 2.59}
            onClick={() => zoomAt(current.current.zoom + 0.4)}
          >
            Ver de perto
          </button>
          <button type="button" disabled={view.zoom <= 1.001} onClick={reset}>
            Voltar ao enquadramento
          </button>
        </div>
      </Drawer>
      <span id={instructions} className={styles.srOnly}>
        {staticMode ? "Vista estática. " : "Arraste para girar. "}Use pinça ou
        dois toques para aproximar; com zoom, arraste para mover. No teclado,
        use setas para explorar, mais e menos para zoom e Escape para voltar ao
        enquadramento.
      </span>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {loadState === "loading" ? "Carregando a pedra escolhida. " : ""}
        {envName}, {matName}, {finishItem.nome}.
        {compact
          ? "Referência ilustrativa; não representa o material desta página."
          : ""}
      </span>
    </div>
  );
}
