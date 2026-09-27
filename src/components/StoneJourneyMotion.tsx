"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { timedVideo } from "@/lib/timed-video";
import type { JourneyVideo } from "@/content/stone-journey";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function StoneJourneyMotion({ children, video }: { children: ReactNode; video: JourneyVideo | null }) {
  const root = useRef<HTMLDivElement>(null);
  const [staticView, setStaticView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    let dispose = () => {};
    function configure() {
      dispose();
      if (!el) return;
      delete el.dataset.enhanced;
      if (staticView || reduced.matches || connection?.saveData) return;
      el.dataset.enhanced = "true";
      const frames = [...el.querySelectorAll<HTMLElement>(".journey-frame")];
      const sticky = el.querySelector<HTMLElement>(".journey-sticky")!;
      let raf = 0;
      const media: (HTMLVideoElement | null)[] = frames.map(() => null);
      const motions: (ReturnType<typeof timedVideo> | null)[] = frames.map(() => null);
      const mediaSources: string[] = frames.map(() => "");
      let loaded = false;
      let visible = false;
      const failed = new Set<number>();
      let disposed = false;
      const allowMedia = () => {
        // Duas pinturas depois de load: poster e tipografia ja foram apresentados.
        requestAnimationFrame(() => requestAnimationFrame(() => { if (!disposed) { loaded = true; schedule(); } }));
      };
      function prepareVideo(index: number) {
        if (!video || failed.has(index) || !loaded || !visible || /(^|-)2g|3g/.test(connection?.effectiveType ?? "")) return;
        const clip = video.clips[index];
        if (!clip) return;
        const mobile = innerWidth <= 700;
        const source = mobile ? clip.mobile : clip.desktop;
        if (media[index] && mediaSources[index] !== source.src) {
          motions[index]?.dispose();
          media[index]!.removeAttribute("src");
          media[index]!.load();
          media[index]!.remove();
          media[index] = null;
        }
        if (media[index]) return;
        const totalBytes = video.clips.reduce((sum, item) => sum + (mobile ? item.mobile.bytes : item.desktop.bytes), 0);
        if (totalBytes > (mobile ? 3_000_000 : 8_000_000) || source.bytes <= 0 || clip.durationSeconds <= 0) return;
        const item = document.createElement("video");
        item.muted = true;
        item.playsInline = true;
        item.preload = "none";
        item.setAttribute("aria-hidden", "true");
        item.className = "journey-video";
        item.poster = frames[index].querySelector("img")?.currentSrc ?? "";
        item.addEventListener("error", () => { failed.add(index); item.remove(); media[index] = null; });
        item.addEventListener("loadeddata", schedule);
        item.addEventListener("seeked", schedule);
        mediaSources[index] = source.src;
        item.src = source.src;
        // Cada vídeo pertence ao seu quadro: a transição aprovada continua no figure.
        frames[index].append(item);
        media[index] = item;
        motions[index] = timedVideo(item);
        item.load();
      }
      function render() {
        raf = 0;
        if (visible && loaded) el!.style.setProperty("--mask-image", "url('/img/a1-prova-01-1200.avif')");
        const rect = el!.getBoundingClientRect();
        const travel = Math.max(1, rect.height - sticky.offsetHeight);
        // Preserva o trajeto da máscara aprovada; encurta somente os quatro quadros.
        const maskTravel = (innerHeight * 6.2 - sticky.offsetHeight) * .22;
        const reveal = clamp(-rect.top / maskTravel);
        const story = clamp((-rect.top - maskTravel) / Math.max(1, travel - maskTravel));
        el!.style.setProperty("--mask-scale", String(1 + Math.pow(reveal, 2.4) * 13));
        el!.style.setProperty("--mask-opacity", String(1 - clamp((reveal - .58) / .42)));
        el!.style.setProperty("--mask-copy-opacity", String(1 - clamp(reveal * 4)));
        el!.style.setProperty("--journey-progress", String(story));
        const position = story * 3.65;
        const active = Math.min(3, Math.floor(position + .15));
        frames.forEach((frame, index) => {
          frame.style.setProperty("--frame-opacity", String(index <= active ? 1 : 0));
          frame.dataset.current = String(index === active);
        });
        prepareVideo(active);
        if (position - active > .45 && active < 3) prepareVideo(active + 1);
        if (position - active < .15 && active > 0) prepareVideo(active - 1);
        media.forEach((item, index) => {
          if (!item || item.readyState < 2 || !Number.isFinite(item.duration)) return;
          motions[index]?.pause(!visible || document.hidden || reveal < 1 || index !== active);
          motions[index]?.to(index <= active && reveal === 1 ? 1 : 0);
          item.style.height = `${frames[index].querySelector("picture")!.getBoundingClientRect().height}px`;
          item.style.bottom = "auto";
          item.style.opacity = reveal === 1 ? "1" : "0";
        });
      }
      function schedule() { if (!disposed && !raf) raf = requestAnimationFrame(render); }
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { rootMargin: "0px" });
      observer.observe(el);
      addEventListener("scroll", schedule, { passive: true });
      addEventListener("resize", schedule);
      document.addEventListener("visibilitychange", schedule);
      if (document.readyState === "complete") allowMedia();
      else addEventListener("load", allowMedia, { once: true });
      render();
      dispose = () => {
        disposed = true;
        observer.disconnect();
        removeEventListener("scroll", schedule);
        removeEventListener("resize", schedule);
        document.removeEventListener("visibilitychange", schedule);
        motions.forEach(motion => motion?.dispose());
        removeEventListener("load", allowMedia);
        cancelAnimationFrame(raf);
        media.forEach(item => { item?.pause(); item?.removeAttribute("src"); item?.load(); item?.remove(); });
        delete el.dataset.enhanced;
        el.removeAttribute("style");
        frames.forEach(frame => { frame.removeAttribute("style"); delete frame.dataset.current; });
      };
    }
    configure();
    reduced.addEventListener("change", configure);
    connection?.addEventListener("change", configure);
    return () => { dispose(); reduced.removeEventListener("change", configure); connection?.removeEventListener("change", configure); };
  }, [staticView, video]);

  return <div ref={root} className="journey-track" data-enhanced="true">
    <noscript><style>{`
      .journey-frame noscript { display:contents; }
      .journey-track[data-enhanced] { height:auto; }
      [data-enhanced] .journey-sticky { position:static; display:block; height:auto; }
      [data-enhanced] .journey-frame { position:static; display:block; opacity:1; }
      [data-enhanced] .journey-frame figcaption { visibility:visible; }
      [data-enhanced] .journey-frame img { height:auto; aspect-ratio:16/9; }
      [data-enhanced] .journey-mask,[data-enhanced] .journey-progress,[data-enhanced] .journey-controls { display:none; }
      @media(max-width:700px) { [data-enhanced] .journey-frame img { aspect-ratio:4/5; } }
    `}</style></noscript>
    <div className="journey-controls">
      <button type="button" onClick={() => setStaticView(true)}>Ver imagens sem movimento</button>
      <a href="#configurador">Pular para combinações</a>
    </div>
    {children}
  </div>;
}
