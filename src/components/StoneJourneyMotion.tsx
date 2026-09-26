"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
      let media: HTMLVideoElement | null = null;
      let mediaSource = "";
      let loaded = false;
      let visible = false;
      let videoFailed = false;
      let disposed = false;
      const allowMedia = () => {
        // Duas pinturas depois de load: poster e tipografia ja foram apresentados.
        requestAnimationFrame(() => requestAnimationFrame(() => { if (!disposed) { loaded = true; schedule(); } }));
      };
      function prepareVideo() {
        if (!video || videoFailed || !loaded || !visible || /(^|-)2g|3g/.test(connection?.effectiveType ?? "")) return;
        const source = innerWidth <= 700 ? video.mobile : video.desktop;
        if (media && mediaSource !== source.src) {
          media.removeAttribute("src");
          media.load();
          media.remove();
          media = null;
        }
        if (media) return;
        const limit = innerWidth <= 700 ? 3_000_000 : 8_000_000;
        if (source.bytes > limit || source.bytes <= 0 || video.durationSeconds <= 0) return;
        media = document.createElement("video");
        media.muted = true;
        media.playsInline = true;
        media.preload = "none";
        media.setAttribute("aria-hidden", "true");
        media.className = "journey-video";
        media.poster = frames[0].querySelector("img")?.currentSrc ?? "";
        media.addEventListener("error", () => { videoFailed = true; media?.remove(); media = null; });
        media.addEventListener("loadeddata", schedule);
        media.addEventListener("seeked", schedule);
        mediaSource = source.src;
        media.src = source.src;
        el!.querySelector(".journey-frames")!.append(media);
        media.load();
      }
      function render() {
        raf = 0;
        if (visible && loaded) el!.style.setProperty("--mask-image", "url('/img/a1-prova-01-1200.avif')");
        const rect = el!.getBoundingClientRect();
        const travel = Math.max(1, rect.height - sticky.offsetHeight);
        const p = clamp(-rect.top / travel);
        const reveal = clamp(p / .22);
        const story = clamp((p - .22) / .78);
        el!.style.setProperty("--mask-scale", String(1 + Math.pow(reveal, 2.4) * 13));
        el!.style.setProperty("--mask-opacity", String(1 - clamp((reveal - .58) / .42)));
        el!.style.setProperty("--mask-copy-opacity", String(1 - clamp(reveal * 4)));
        el!.style.setProperty("--journey-progress", String(story));
        const position = story * 3.65;
        frames.forEach((frame, index) => {
          frame.style.setProperty("--frame-opacity", String(index === 0 ? 1 : clamp((position - index + .3) / .3)));
          frame.dataset.current = String(index === Math.min(3, Math.floor(position + .15)));
        });
        prepareVideo();
        if (media && media.readyState >= 2 && Number.isFinite(media.duration)) {
          const target = story * Math.max(0, media.duration - .04);
          if (!media.seeking && Math.abs(media.currentTime - target) > .035) media.currentTime = target;
          media.style.opacity = reveal === 1 ? "1" : "0";
        }
      }
      function schedule() { if (!raf) raf = requestAnimationFrame(render); }
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { rootMargin: "0px" });
      observer.observe(el);
      addEventListener("scroll", schedule, { passive: true });
      addEventListener("resize", schedule);
      if (document.readyState === "complete") allowMedia();
      else addEventListener("load", allowMedia, { once: true });
      render();
      dispose = () => {
        disposed = true;
        observer.disconnect();
        removeEventListener("scroll", schedule);
        removeEventListener("resize", schedule);
        removeEventListener("load", allowMedia);
        cancelAnimationFrame(raf);
        media?.pause();
        media?.removeAttribute("src");
        media?.load();
        media?.remove();
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
      <a href="#materiais">Pular para materiais</a>
    </div>
    {children}
  </div>;
}
