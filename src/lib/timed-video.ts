// Movimento em tempo, disparado por um limiar; nunca controla a rolagem.
export function timedVideo(video: HTMLVideoElement) {
  let destination = -1;
  let stopped = false;
  let disposed = false;
  let raf = 0;
  let started = 0;
  let from = 0;
  const durationMs = 1450;
  function tick(now: number) {
    raf = 0;
    if (disposed || stopped) return;
    const end = destination * Math.max(0, video.duration - .05);
    const p = Math.min(1, (now - started) / durationMs);
    if (destination === 0 && !video.seeking) video.currentTime = from + (end - from) * p;
    if (p < 1) raf = requestAnimationFrame(tick);
    else {
      video.pause();
      video.currentTime = end;
      video.dataset.settled = String(destination);
    }
  }
  function run() {
    cancelAnimationFrame(raf);
    video.pause();
    if (disposed || stopped || destination < 0 || video.readyState < 3 || !Number.isFinite(video.duration)) return;
    from = video.currentTime;
    const end = destination * Math.max(0, video.duration - .05);
    if (Math.abs(from - end) < .06) { video.dataset.settled = String(destination); return; }
    delete video.dataset.settled;
    started = performance.now();
    if (destination === 1) {
      video.playbackRate = Math.max(.25, (end - from) / (durationMs / 1000));
      void video.play().catch(() => { video.currentTime = end; });
    }
    raf = requestAnimationFrame(tick);
  }
  return {
    to(value: number) { if (destination !== value) { destination = value; run(); } },
    pause(value: boolean) { if (stopped === value) return; stopped = value; run(); },
    dispose() { disposed = true; cancelAnimationFrame(raf); video.pause(); },
  };
}
