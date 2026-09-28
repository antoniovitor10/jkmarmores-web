import { gestureMedia, loadBufferedClip } from "@/lib/gesture-media";
import { motionNetworkPolicy, type MotionConnection } from "@/lib/motion-network";
import styles from "./HomeHero.module.css";

export function mountHero(el: HTMLDivElement) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: MotionConnection }).connection;
    let dispose = () => {};
    function configure() {
      dispose();
      delete el.dataset.motion;
      if (reduced.matches || connection?.saveData) return;
      el.dataset.motion = "true";
      const intro = el.querySelector<HTMLElement>("[data-hero-intro]")!;
      const figure = el.querySelector<HTMLElement>("figure")!;
      const poster = figure.querySelector<HTMLImageElement>("img")!;
      let media: HTMLVideoElement | null = null;
      let releaseMedia = () => {};
      const motion = gestureMedia(el, poster, () => media);
      let advanced = false;
      let raf = 0;
      let failed = false;
      let ready = false;
      let scrolled = false;
      let visible = false;
      let disposed = false;
      const allowMedia = async () => {
        try { await poster.decode(); } catch { return; }
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (!disposed) {
            el.dataset.mediaPolicy = motionNetworkPolicy(connection);
            ready = el.dataset.mediaPolicy === "allowed";
            schedule();
          }
        }));
      };
      function prepare() {
        // Aquece o clipe somente depois de load, decode e duas pinturas do pôster.
        // O gesto começa a reprodução; menu e links hidratam normalmente.
        if (media || failed || !ready || !visible) return;
        media = document.createElement("video");
        media.muted = true;
        media.playsInline = true;
        media.preload = "auto";
        media.poster = poster.currentSrc;
        media.setAttribute("aria-hidden", "true");
        media.className = styles.video;
        const mobile = innerWidth <= 700;
        const av1 = !!media.canPlayType('video/mp4; codecs="av01.0.04M.08"');
        const source = `/video/capa-${mobile ? "mobile" : "desktop"}-${av1 ? "av1" : "h264"}.mp4`;
        media.addEventListener("loadeddata", schedule);
        media.addEventListener("seeked", schedule);
        media.addEventListener("error", () => {
          failed = true;
          media?.remove();
          media = null;
          el.dataset.failed = "true";
        });
        figure.prepend(media);
        releaseMedia = loadBufferedClip(media, source);
      }
      function render() {
        raf = 0;
        prepare();
        // O estado inicial já vem do CSS; evita layout e escrita de estilos no LCP.
        if (!scrolled && scrollY < 12) return;
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
        motion.pause(!visible || document.hidden);
        motion.to(advanced ? 1 : 0);
      }
      function schedule() { if (!disposed && !raf) raf = requestAnimationFrame(render); }
      function scroll() { scrolled = true; schedule(); }
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        schedule();
      });
      observer.observe(el);
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
        observer.disconnect();
        cancelAnimationFrame(raf);
        removeEventListener("scroll", scroll);
        removeEventListener("resize", schedule);
        document.removeEventListener("visibilitychange", schedule);
        motion.dispose();
        removeEventListener("load", allowMedia);
        intro.removeEventListener("focusin", schedule);
        intro.removeEventListener("focusout", schedule);
        intro.removeAttribute("style");
        intro.inert = false;
        media?.removeAttribute("src");
        media?.load();
        media?.remove();
        releaseMedia();
        delete el.dataset.failed;
        delete el.dataset.mediaPolicy;
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
}
