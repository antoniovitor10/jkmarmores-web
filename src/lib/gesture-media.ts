import { timedVideo } from "./timed-video";

// Em rede celular o Chrome pode rebaixar preload=auto para metadata e nunca
// completar um vídeo pausado. Só após a política de rede/LCP, aquece o clipe
// curto inteiro; aborta a busca e libera o Blob ao desmontar/trocar a fonte.
export function loadBufferedClip(video: HTMLVideoElement, source: string) {
  const controller = new AbortController();
  let url = "";
  void fetch(source, { signal: controller.signal, priority: "low" })
    .then(response => { if (!response.ok) throw new Error("Vídeo indisponível"); return response.blob(); })
    .then(blob => {
      if (controller.signal.aborted) return;
      url = URL.createObjectURL(blob);
      video.src = url;
      video.load();
    })
    .catch(() => { if (!controller.signal.aborted) video.dispatchEvent(new Event("error")); });
  return () => { controller.abort(); if (url) URL.revokeObjectURL(url); };
}

export function hasCompleteClip(video: HTMLVideoElement | null): video is HTMLVideoElement {
  if (!video || video.readyState < 3 || !Number.isFinite(video.duration) || video.duration <= 0) return false;
  // Inclui o retorno: nenhum gesto depende da chegada de bytes durante a animação.
  const end = Math.max(0, video.duration - .05);
  for (let i = 0; i < video.buffered.length; i++) {
    if (video.buffered.start(i) <= .01 && video.buffered.end(i) >= end) return true;
  }
  return false;
}

// Escolha fixa por gesto. Eventos loadeddata/canplay nunca promovem pôster a vídeo.
export function gestureMedia(host: HTMLElement, poster: HTMLImageElement, getVideo: () => HTMLVideoElement | null) {
  let destination = 0;
  let selected: HTMLVideoElement | null = null;
  let motion: ReturnType<typeof timedVideo> | null = null;
  let paused = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  return {
    to(value: number) {
      if (value === destination) return;
      destination = value;
      clearTimeout(timer);
      motion?.dispose();
      motion = null;
      selected = null;
      const video = getVideo();
      host.dataset.mediaMode = hasCompleteClip(video) ? "video" : "poster";
      delete host.dataset.mediaSettled;
      if (host.dataset.mediaMode === "video" && video) {
        selected = video;
        video.style.opacity = "1";
        motion = timedVideo(video);
        motion.pause(paused);
        motion.to(value);
      } else {
        if (video) { video.pause(); video.style.opacity = "0"; }
        poster.style.transition = "transform 1450ms linear";
        poster.style.transform = `scale(${1 + value * .08})`;
      }
      timer = setTimeout(() => { host.dataset.mediaSettled = String(value); }, 1450);
    },
    pause(value: boolean) { paused = value; if (selected) motion?.pause(value); },
    dispose() {
      clearTimeout(timer);
      motion?.dispose();
      poster.style.removeProperty("transform");
      poster.style.removeProperty("transition");
      delete host.dataset.mediaMode;
      delete host.dataset.mediaSettled;
    },
  };
}
