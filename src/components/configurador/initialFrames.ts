import { quadroUrl } from "@/content/configurador";

// Only the initial pair is retained here; the viewer owns the bounded orbit cache.
const prepared = new Map<string, Promise<HTMLImageElement>>();

function decode(url: string, priority: "low" | "auto") {
  const image = new Image();
  image.fetchPriority = priority;
  image.src = url;
  return image.decode().then(() => image);
}

export function loadFrame(url: string) {
  return prepared.get(url) ?? decode(url, "auto");
}

export function preloadInitialFrames(width: number, height: number) {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  const staticMode =
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    connection?.saveData;
  for (let frame = 0; frame < (staticMode ? 1 : 2); frame++) {
    const url =
      width < 768 && height > width
        ? `/configurador/orbita-rosado/retrato/${String(frame).padStart(2, "0")}.avif`
        : quadroUrl("cozinha-rosado", frame, width < 768 ? 720 : 1280);
    if (prepared.has(url)) continue;
    const promise = decode(url, "low").catch((error) => {
      prepared.delete(url);
      throw error;
    });
    prepared.set(url, promise);
    while (prepared.size > 2) prepared.delete(prepared.keys().next().value!);
    void promise.catch(() => {}); // A failed warm-up must not prevent a normal load.
  }
}
