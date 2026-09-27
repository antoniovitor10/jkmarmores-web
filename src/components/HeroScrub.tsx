"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { timedVideo } from "@/lib/timed-video";
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
      const intro = el.querySelector<HTMLElement>("[data-hero-intro]")!;
      const figure = el.querySelector<HTMLElement>("figure")!;
      const poster = figure.querySelector<HTMLImageElement>("img")!;
      let media: HTMLVideoElement | null = null;
      let motion: ReturnType<typeof timedVideo> | null = null;
      let advanced = false;
      let raf = 0;
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
        if (media || failed || !ready || !scrolled) return;
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
          el.dataset.failed = "true";
        });
        motion = timedVideo(media);
        figure.prepend(media);
        media.load();
      }
      function render() {
        raf = 0;
        // O estado inicial já vem do CSS; evita layout e escrita de estilos no LCP.
        if (!scrolled && scrollY < 12) return;
        const rect = el.getBoundingClientRect();
        const focused = intro.contains(document.activeElement);
        if (scrollY > 32) advanced = true;
        if (scrollY < 12) advanced = false;
        const opacity = focused || !advanced ? 1 : 0;
        el.style.setProperty("--hero-veil", String(opacity));
        el.style.setProperty("--hero-veil-duration", opacity ? "0ms" : "200ms");
        el.style.setProperty("--hero-veil-delay", opacity ? "0ms" : "250ms");
        // Retira o painel por corte, sem reduzir o contraste do texto visível.
        intro.style.clipPath = `inset(0 ${100 * (1 - opacity)}% 0 0)`;
        intro.style.transform = `translateX(${-24 * (1 - opacity)}px)`;
        intro.inert = opacity === 0;
        el.style.setProperty("--cover-progress", String(advanced ? 1 : 0));
        if (rect.bottom > 0 && rect.top < innerHeight) prepare();
        if (media && media.readyState >= 2 && Number.isFinite(media.duration)) {
          media.style.opacity = "1";
          motion?.pause(rect.bottom <= 0 || rect.top >= innerHeight || document.hidden);
          motion?.to(advanced ? 1 : 0);
        }
      }
      function schedule() { if (!disposed && !raf) raf = requestAnimationFrame(render); }
      function scroll() { scrolled = true; schedule(); }
      intro.addEventListener("focusin", schedule);
      intro.addEventListener("focusout", schedule);
      addEventListener("scroll", scroll, { passive: true });
      addEventListener("resize", schedule);
      document.addEventListener("visibilitychange", schedule);
      if (document.readyState === "complete") void allowMedia();
      else addEventListener("load", allowMedia, { once: true });
      schedule();
      dispose = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        removeEventListener("scroll", scroll);
        removeEventListener("resize", schedule);
        document.removeEventListener("visibilitychange", schedule);
        motion?.dispose();
        removeEventListener("load", allowMedia);
        intro.removeEventListener("focusin", schedule);
        intro.removeEventListener("focusout", schedule);
        intro.removeAttribute("style");
        intro.inert = false;
        media?.removeAttribute("src");
        media?.load();
        media?.remove();
        delete el.dataset.failed;
        el.style.removeProperty("--cover-progress");
        el.style.removeProperty("--hero-veil");
        el.style.removeProperty("--hero-veil-duration");
        el.style.removeProperty("--hero-veil-delay");
      };
    }
    configure();
    reduced.addEventListener("change", configure);
    connection?.addEventListener("change", configure);
    return () => { dispose(); reduced.removeEventListener("change", configure); connection?.removeEventListener("change", configure); };
  }, []);

  return <div ref={root} className={styles.track} data-motion="true">
    <noscript><style>{`.${styles.track}[data-motion] { height:auto; } .${styles.stage} { position:relative; }`}</style></noscript>
    <div className={styles.stage} data-hero-stage>
      {children}
      <div className={styles.progress} aria-hidden="true" />
    </div>
  </div>;
}
