"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./HomeHero.module.css";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

export function HeroScrub({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    let dispose = () => {};
    function configure() {
      dispose();
      delete el.dataset.motion;
      if (reduced.matches || connection?.saveData || /(^|-)2g|3g/.test(connection?.effectiveType ?? "")) return;
      el.dataset.motion = "true";
      const stage = el.querySelector<HTMLElement>("[data-hero-stage]")!;
      const intro = el.querySelector<HTMLElement>("[data-hero-intro]")!;
      const figure = el.querySelector<HTMLElement>("figure")!;
      const poster = figure.querySelector<HTMLImageElement>("img")!;
      const button = el.querySelector<HTMLButtonElement>("button")!;
      let media: HTMLVideoElement | null = null;
      let raf = 0;
      let paused = false;
      let failed = false;
      let ready = false;
      let scrolled = false;
      let disposed = false;
      const allowMedia = async () => {
        try { await poster.decode(); } catch { return; }
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (!disposed) { ready = true; schedule(); }
        }));
      };
      function prepare() {
        // Apenas o vídeo espera a primeira rolagem e a pintura do pôster.
        // A hidratação de menu, links e formulário continua nativa do Next.
        if (media || failed || !ready || !scrolled || paused) return;
        media = document.createElement("video");
        media.muted = true;
        media.playsInline = true;
        media.preload = "none";
        media.setAttribute("aria-hidden", "true");
        media.className = styles.video;
        const mobile = innerWidth <= 700;
        const av1 = !!media.canPlayType('video/mp4; codecs="av01.0.04M.08"');
        media.src = `/video/capa-${mobile ? "mobile" : "desktop"}-${av1 ? "av1" : "h264"}.mp4`;
        media.addEventListener("loadeddata", schedule);
        media.addEventListener("seeked", schedule);
        media.addEventListener("error", () => {
          failed = true;
          media?.remove();
          media = null;
          button.hidden = true;
          el.dataset.failed = "true";
        });
        figure.prepend(media);
        media.load();
      }
      function render() {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - stage.offsetHeight)));
        const focused = intro.contains(document.activeElement);
        const opacity = focused ? 1 : Math.max(0, 1 - progress / .19);
        // Retira o painel por corte, sem reduzir o contraste do texto visível.
        intro.style.clipPath = `inset(0 ${100 * (1 - opacity)}% 0 0)`;
        intro.style.transform = `translateX(${-24 * (1 - opacity)}px)`;
        intro.inert = opacity === 0;
        el.style.setProperty("--cover-progress", String(progress));
        if (rect.bottom > 0 && rect.top < innerHeight) prepare();
        if (media && media.readyState >= 2 && Number.isFinite(media.duration)) {
          media.style.opacity = "1";
          if (!paused && !media.seeking) {
            const target = progress * Math.max(0, media.duration - .05);
            if (Math.abs(media.currentTime - target) > .035) media.currentTime = target;
          }
        }
      }
      function schedule() { if (!raf) raf = requestAnimationFrame(render); }
      function scroll() { scrolled = true; schedule(); }
      function toggle() {
        paused = !paused;
        button.textContent = paused ? "Retomar movimento" : "Pausar movimento";
        button.setAttribute("aria-pressed", String(paused));
        schedule();
      }
      button.hidden = false;
      button.addEventListener("click", toggle);
      intro.addEventListener("focusin", schedule);
      intro.addEventListener("focusout", schedule);
      addEventListener("scroll", scroll, { passive: true });
      addEventListener("resize", schedule);
      if (document.readyState === "complete") void allowMedia();
      else addEventListener("load", allowMedia, { once: true });
      schedule();
      dispose = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        removeEventListener("scroll", scroll);
        removeEventListener("resize", schedule);
        removeEventListener("load", allowMedia);
        button.removeEventListener("click", toggle);
        intro.removeEventListener("focusin", schedule);
        intro.removeEventListener("focusout", schedule);
        intro.removeAttribute("style");
        intro.inert = false;
        button.textContent = "Pausar movimento";
        button.setAttribute("aria-pressed", "false");
        button.hidden = true;
        media?.removeAttribute("src");
        media?.load();
        media?.remove();
        delete el.dataset.failed;
        el.style.removeProperty("--cover-progress");
      };
    }
    configure();
    reduced.addEventListener("change", configure);
    connection?.addEventListener("change", configure);
    return () => { dispose(); reduced.removeEventListener("change", configure); connection?.removeEventListener("change", configure); };
  }, []);

  return <div ref={root} className={styles.track} data-motion="true">
    <noscript><style>{`.${styles.track}[data-motion] { height:auto; } .${styles.stage} { position:relative; } .${styles.controls} { display:none; }`}</style></noscript>
    <div className={styles.stage} data-hero-stage>
      {children}
      <div className={styles.controls}>
        <span className={styles.scrollHint}>Role para se aproximar</span>
        <button type="button" aria-pressed="false" hidden>Pausar movimento</button>
        <a href="#jornada-pedra">Continuar pela pedra</a>
      </div>
      <div className={styles.progress} aria-hidden="true" />
    </div>
  </div>;
}
