"use client";
import { useEffect, useRef, useState } from "react";
import { quadroUrl, quantidadeQuadros } from "@/content/configurador";
import type { Camera } from "./useCamera";
import styles from "./Configurador.module.css";

type Props = {
  combo: string;
  view: Camera;
  staticMode: boolean;
  onReady: () => void;
  label: string;
};
export function FrameCanvas({
  combo,
  view,
  staticMode,
  onReady,
  label,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null),
    cache = useRef(new Map<string, Promise<HTMLImageElement>>());
  const snapshot = useRef<HTMLCanvasElement | null>(null),
    lastCombo = useRef(""),
    fadeStart = useRef(0),
    previousKey = useRef("");
  const [size, setSize] = useState({ width: 0, height: 0 }),
    [high, setHigh] = useState(false),
    [error, setError] = useState(false),
    [settled, setSettled] = useState(0);
  const ready = useRef(false);
  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ width: r.width, height: r.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setHigh(view.zoom > 1.06), 140);
    return () => clearTimeout(timer);
  }, [view.zoom]);
  // Blend while moving; rest on a single native frame to keep stone edges crisp.
  useEffect(() => {
    const timer = setTimeout(() => setSettled(view.position), 90);
    return () => clearTimeout(timer);
  }, [view.position]);
  useEffect(() => {
    const node = canvas.current;
    if (!node || !size.width) return;
    const ctx = node.getContext("2d", { alpha: false });
    if (!ctx) return;
    let disposed = false,
      raf = 0;
    const count = quantidadeQuadros(combo),
      rawPosition = view.position * (count - 1),
      position = staticMode
        ? 0
        : settled === view.position
          ? Math.round(rawPosition)
          : rawPosition,
      first = Math.floor(position),
      second = Math.min(count - 1, first + 1),
      blend = position - first;
    const width = high ? 2560 : size.width < 768 ? 720 : 1280;
    const dpr = Math.min(devicePixelRatio, 1.5);
    const w = Math.round(size.width * dpr),
      h = Math.round(size.height * dpr);
    if (node.width !== w || node.height !== h) {
      node.width = w;
      node.height = h;
    }
    function load(url: string) {
      let entry = cache.current.get(url);
      if (!entry) {
        const img = new Image();
        img.src = url;
        entry = img
          .decode()
          .then(() => img)
          .catch((e) => {
            cache.current.delete(url);
            throw e;
          });
        cache.current.set(url, entry);
        // A decoded 2560 px frame uses about 14 MB; cap high-resolution retention.
        const capacity = url.includes("/2560/") ? 4 : 18;
        while (cache.current.size > capacity)
          cache.current.delete(cache.current.keys().next().value!);
      }
      return entry;
    }
    const portrait =
      combo === "cozinha-rosado" &&
      size.width < 768 &&
      size.height > size.width &&
      !high;
    const frameUrl = (index: number) =>
      portrait
        ? `/configurador/orbita-rosado/retrato/${String(index).padStart(2, "0")}.avif`
        : quadroUrl(combo, index, width);
    const url = frameUrl(first),
      nextUrl = frameUrl(second);
    const key = `${combo}:${first}:${width}`;
    Promise.all([
      load(url),
      staticMode || blend <= 0.001 || first === second ? load(url) : load(nextUrl),
    ])
      .then(([a, b]) => {
        if (disposed) return;
        if (lastCombo.current && lastCombo.current !== combo && !staticMode) {
          const old = document.createElement("canvas");
          old.width = w;
          old.height = h;
          old.getContext("2d")?.drawImage(node, 0, 0);
          snapshot.current = old;
          fadeStart.current = performance.now();
        }
        lastCombo.current = combo;
        const paintImage = (img: HTMLImageElement, alpha: number) => {
          const base = Math.max(w / img.naturalWidth, h / img.naturalHeight),
            scale = base * view.zoom;
          const iw = img.naturalWidth * scale,
            ih = img.naturalHeight * scale;
          ctx!.globalAlpha = alpha;
          ctx!.drawImage(
            img,
            (w - iw) / 2 + view.x * dpr,
            (h - ih) / 2 + view.y * dpr,
            iw,
            ih,
          );
        };
        const paint = (time: number) => {
          if (disposed) return;
          ctx!.globalAlpha = 1;
          paintImage(a, 1);
          if (a !== b && blend > 0.001) paintImage(b, blend);
          const opacity = snapshot.current
            ? Math.max(0, 1 - (time - fadeStart.current) / 260)
            : 0;
          if (opacity > 0) {
            ctx!.globalAlpha = opacity;
            ctx!.drawImage(snapshot.current!, 0, 0);
            ctx!.globalAlpha = 1;
            raf = requestAnimationFrame(paint);
          } else snapshot.current = null;
        };
        paint(performance.now());
        node.dataset.frame = String(first);
        node.dataset.quality =
          width === 2560 && combo === "cozinha-rosado"
            ? "native-2560"
            : "standard";
        node.dataset.combo = combo;
        setError(false);
        if (!ready.current) {
          ready.current = true;
          onReady();
        }
        if (!staticMode && !high && key !== previousKey.current) {
          previousKey.current = key;
          const neighbor = Math.min(count - 1, blend > 0.001 ? second + 1 : second);
          void load(frameUrl(neighbor)).catch(() => {});
        }
      })
      .catch(() => {
        if (!disposed) setError(true);
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [combo, view, size, high, staticMode, onReady, settled]);
  return (
    <>
      <canvas
        ref={canvas}
        className={styles.canvas}
        role="img"
        aria-label={label}
      />
      {error && (
        <p className={styles.loadMessage} role="status">
          Esta vista não carregou. A última imagem permanece disponível;
          experimente outro ângulo.
        </p>
      )}
    </>
  );
}
