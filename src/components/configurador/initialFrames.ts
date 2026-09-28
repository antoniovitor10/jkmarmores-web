import { quadroUrl } from "@/content/configurador";

// Small shared decode cache for the initial pair and current material previews.
const prepared = new Map<string, Promise<HTMLImageElement>>();

function decode(url: string, priority: "low" | "auto") {
  const image = new Image();
  image.fetchPriority = priority;
  image.src = url;
  return image.decode().then(() => image);
}

export function loadFrame(url: string, priority: "low" | "auto" = "auto") {
  let promise = prepared.get(url);
  if (!promise) {
    promise = decode(url, priority).catch((error) => {
      prepared.delete(url);
      throw error;
    });
    prepared.set(url, promise);
    while (prepared.size > (url.includes("/2560/") ? 4 : 12))
      prepared.delete(prepared.keys().next().value!);
  }
  return promise;
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
        ? quadroUrl("cozinha-rosado", frame, "retrato")
        : quadroUrl("cozinha-rosado", frame, width < 768 ? 720 : 1280);
    void loadFrame(url, "low").catch(() => {});
  }
}
