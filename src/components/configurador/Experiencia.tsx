"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ambientesConfigurador as ambientes,
  materiaisConfigurador as materiais,
  acabamentosConfigurador as acabamentos,
  orcamentoConfigurador,
  type AmbienteConfigurador,
  type MaterialConfigurador,
  type AcabamentoConfigurador,
} from "@/content/configurador";
import type { ConfiguradorProps } from "./Configurador";
import { FrameCanvas } from "./FrameCanvas";
import { useCamera } from "./useCamera";
import styles from "./Configurador.module.css";

export default function Experiencia({
  compact,
  materialContext,
}: ConfiguradorProps) {
  const stage = useRef<HTMLDivElement>(null),
    hud = useRef<HTMLDivElement>(null),
    fullscreenButton = useRef<HTMLButtonElement>(null);
  const [environment, setEnvironment] =
      useState<AmbienteConfigurador>("cozinha"),
    [material, setMaterial] = useState<MaterialConfigurador>("rosado"),
    [finish, setFinish] = useState<AcabamentoConfigurador>("polido");
  const [tab, setTab] = useState("Material"),
    [detail, setDetail] = useState(false),
    [visible, setVisible] = useState(true),
    [full, setFull] = useState(false),
    [fallback, setFallback] = useState(false),
    [ready, setReady] = useState(false),
    [staticMode, setStaticMode] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    keyboard = useRef(false),
    interrupted = useRef(false),
    demo = useRef(false);
  const wake = useCallback(() => {
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (keyboard.current) return;
      if (hud.current?.contains(document.activeElement))
        (document.activeElement as HTMLElement).blur();
      setVisible(false);
    }, 3500);
  }, []);
  const interact = useCallback(() => {
    interrupted.current = true;
    wake();
  }, [wake]);
  const camera = useCamera(stage, staticMode, interact);
  const { view, glide, stop, current, zoomAt, update } = camera;
  const markReady = useCallback(() => setReady(true), []);
  const combo = `${environment}-${material}`;
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
    timer.current = setTimeout(() => setVisible(false), 3500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!ready || staticMode || demo.current || !stage.current) return;
    let pending: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.intersectionRatio > 0.55) || demo.current)
          return;
        demo.current = true;
        pending = setTimeout(() => {
          if (!interrupted.current) {
            glide({ ...current.current, position: 0.11 }, 1700);
            wake();
          }
        }, 450);
      },
      { threshold: [0.55] },
    );
    observer.observe(stage.current);
    return () => {
      observer.disconnect();
      if (pending) clearTimeout(pending);
    };
  }, [ready, staticMode, glide, current, wake]);
  const exitFull = useCallback(async () => {
    if (document.fullscreenElement)
      await document.exitFullscreen().catch(() => {});
    setFallback(false);
    setFull(false);
    wake();
    requestAnimationFrame(() =>
      fullscreenButton.current?.focus({ preventScroll: true }),
    );
  }, [wake]);
  useEffect(() => {
    const sync = () => {
      setFull(!!document.fullscreenElement);
      wake();
    };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [wake]);
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
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (full || fallback)) {
        e.preventDefault();
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
      className={`${styles.stage} ${compact ? styles.compact : ""} ${fallback ? styles.expanded : ""} ${visible ? "" : styles.quiet}`}
      data-immersive
      data-position={view.position.toFixed(4)}
      data-zoom={view.zoom.toFixed(3)}
      data-pan={`${view.x.toFixed(1)},${view.y.toFixed(1)}`}
      data-fullscreen={full || fallback}
      tabIndex={0}
      role={fallback ? "dialog" : "group"}
      aria-modal={fallback ? true : undefined}
      aria-label="Ambiente interativo. Arraste para explorar, use as setas ou aproxime com dois dedos."
      style={{ touchAction: view.zoom > 1.01 ? "none" : "pan-y" }}
      onPointerDownCapture={() => {
        keyboard.current = false;
        interact();
      }}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") wake();
        camera.move(e);
      }}
      onPointerDown={camera.down}
      onPointerUp={camera.up}
      onPointerCancel={camera.up}
      onFocusCapture={() => wake()}
      onKeyDown={(e) => {
        keyboard.current = true;
        interact();
        if (e.key === "Escape") {
          if (full || fallback) void exitFull();
          else {
            setDetail(false);
            reset();
          }
          return;
        }
        if (e.key === "Tab" && (full || fallback)) {
          const buttons = Array.from(
            e.currentTarget.querySelectorAll<HTMLElement>(
              "button:not(:disabled),a[href]",
            ),
          ).filter(
            (el) =>
              !el.closest("[hidden]") &&
              getComputedStyle(el).visibility !== "hidden",
          );
          if (
            e.shiftKey &&
            (document.activeElement === buttons[0] ||
              document.activeElement === stage.current)
          ) {
            e.preventDefault();
            buttons.at(-1)?.focus();
          } else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {
            e.preventDefault();
            buttons[0]?.focus();
          }
          return;
        }
        if (e.target !== e.currentTarget) return;
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
          ].includes(e.key)
        )
          e.preventDefault();
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          const dir = e.key === "ArrowLeft" ? -1 : 1;
          rotate(dir * 0.055);
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown")
          update({
            ...current.current,
            y: current.current.y + (e.key === "ArrowUp" ? 48 : -48),
          });
        if (e.key === "+" || e.key === "=") zoomAt(current.current.zoom + 0.4);
        if (e.key === "-") zoomAt(current.current.zoom - 0.4);
        if (!staticMode && e.key === "Home")
          glide({ ...current.current, position: 0 });
        if (!staticMode && e.key === "End")
          glide({ ...current.current, position: 1 });
      }}
    >
      <FrameCanvas
        combo={combo}
        view={view}
        staticMode={staticMode}
        onReady={markReady}
        label={`${envName}, referência de ${matName.toLowerCase()}. Visualização ilustrativa gerada por IA.`}
      />
      {!ready && (
        <p className={styles.loadMessage} role="status">
          Entrando no ambiente…
        </p>
      )}
      <div ref={hud} className={styles.hud}>
        <div className={styles.header}>
          <p>
            {envName}
            <span>
              {matName} / {finishItem.nome}
            </span>
          </p>
          <button ref={fullscreenButton} type="button" onClick={toggleFull}>
            {full || fallback ? "Sair da tela cheia" : "Tela cheia"}
          </button>
        </div>
        <div className={styles.picker}>
          <nav className={styles.tabs} aria-label="Personalizar combinação">
            {["Ambiente", "Material", "Acabamento"].map((label) => (
              <button
                type="button"
                key={label}
                aria-pressed={tab === label}
                onClick={() => {
                  interact();
                  setTab(label);
                }}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className={styles.options} role="group" aria-label={tab}>
            {tab === "Ambiente" &&
              ambientes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={environment === item.id}
                  onClick={() => changeSelection(() => setEnvironment(item.id))}
                >
                  {item.nome}
                </button>
              ))}
            {tab === "Material" &&
              materiais.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={material === item.id}
                  onClick={() => changeSelection(() => setMaterial(item.id))}
                >
                  <img
                    src={`/configurador/closes/${item.id}-polido.avif`}
                    width="24"
                    height="24"
                    alt=""
                  />
                  {item.nome}
                </button>
              ))}
            {tab === "Acabamento" &&
              acabamentos.map((item) => (
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
          </div>
        </div>
        <button
          type="button"
          className={`${styles.arrow} ${styles.previous}`}
          aria-label="Girar para a esquerda"
          disabled={staticMode || view.position <= 0}
          onClick={() => rotate(-0.055)}
        >
          <span className={styles.chevron} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          aria-label="Girar para a direita"
          disabled={staticMode || view.position >= 1}
          onClick={() => rotate(0.055)}
        >
          <span className={styles.chevron} aria-hidden="true" />
        </button>
        <div className={styles.tools}>
          <span className={styles.angle}>
            {staticMode
              ? "Vista estática"
              : `Vista ${Math.round(view.position * 100)} / 100`}{" "}
            · {view.zoom.toFixed(1).replace(".", ",")}×
          </span>
          <div>
            <button
              type="button"
              aria-label="Diminuir zoom"
              disabled={view.zoom <= 1.001}
              onClick={() => {
                interact();
                zoomAt(current.current.zoom - 0.4);
              }}
            >
              −
            </button>
            <button
              type="button"
              aria-label="Aumentar zoom"
              disabled={view.zoom >= 2.59}
              onClick={() => {
                interact();
                zoomAt(current.current.zoom + 0.4);
              }}
            >
              +
            </button>
            <button type="button" onClick={reset}>
              Reenquadrar
            </button>
            <button
              type="button"
              aria-expanded={detail}
              onClick={() => {
                interact();
                setDetail(!detail);
              }}
            >
              Superfície
            </button>
          </div>
          <p>
            {staticMode
              ? "Prévia estática. Escolha sua combinação."
              : "Arraste para olhar ao redor. Dois toques para aproximar."}
          </p>
        </div>
      </div>
      {detail && (
        <aside className={styles.detail} aria-label="Detalhe do acabamento">
          <img
            key={`${material}-${finish}`}
            src={`/configurador/closes/${material}-${finish}.avif`}
            width="720"
            height="405"
            alt={`Detalhe ilustrativo: ${matName}, acabamento ${finishItem.nome.toLowerCase()}.`}
          />
          <div>
            <strong>{finishItem.nome}</strong>
            <button
              type="button"
              onClick={() => {
                interact();
                setDetail(false);
              }}
            >
              Fechar detalhe
            </button>
            <p>{finishItem.descricao} O ambiente mantém a vista polida.</p>
          </div>
        </aside>
      )}
      <div className={styles.footer}>
        <p>
          Visualização ilustrativa, gerada por IA.
          <span>Materiais e acabamentos a confirmar com a JK.</span>
        </p>
        <a
          href={orcamentoConfigurador(
            envName,
            matName,
            finishItem.nome,
            materialContext,
          )}
          className={styles.quote}
        >
          Quero esta combinação
        </a>
      </div>
      {(full || fallback) && (
        <button className={styles.exit} type="button" onClick={exitFull}>
          Sair
        </button>
      )}
      <span className={styles.srOnly} role="status" aria-live="polite">
        {envName}, {matName}, {finishItem.nome}. Zoom {view.zoom.toFixed(1)}{" "}
        vezes.{" "}
        {compact
          ? "Referência ilustrativa; não representa o material desta página."
          : ""}
      </span>
    </div>
  );
}
