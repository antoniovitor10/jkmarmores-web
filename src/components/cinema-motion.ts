import { gsap } from 'gsap';
import { stoneJourneyVideo } from '@/content/stone-journey';
import { loadBufferedClip, hasCompleteClip } from '@/lib/gesture-media';

export function mountCinemaHero(root: HTMLElement) {
  // The scroll space exists in CSS before hydration, avoiding layout shifts.
  root.dataset.motion = 'true';
  const cover = root.querySelector<HTMLElement>('.cinema-cover')!;
  const intro = root.querySelector<HTMLElement>('.cinema-intro')!;
  const foot = root.querySelector<HTMLElement>('.cinema-foot')!;
  const next = root.querySelector<HTMLElement>('.cinema-next')!;
  const video = document.createElement('video');
  video.muted = true; video.playsInline = true; video.preload = 'auto';
  video.className = 'cinema-video'; video.setAttribute('aria-hidden', 'true');
  cover.append(video);
  let target = 0, raf = 0, disposed = false;
  const seek = () => {
    raf = 0;
    if (disposed || !hasCompleteClip(video) || video.seeking) return;
    if (Math.abs(video.currentTime - target) > 1 / 24) video.currentTime = target;
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(seek); };
  video.addEventListener('seeked', schedule);
  video.addEventListener('loadeddata', schedule);
  const release = loadBufferedClip(video, stoneJourneyVideo!.clips[0][innerWidth <= 700 ? 'mobile' : 'desktop'].src);
  const playhead = { progress: 0 };
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .18 } });
    tl.to(playhead, { progress: 1, duration: .4, onUpdate: () => {
      if (!hasCompleteClip(video)) return;
      target = playhead.progress * (video.duration - .05);
      if (playhead.progress > .015) video.style.visibility = 'visible';
      schedule();
    } }, 0);
    tl.to(intro, { y: -48, autoAlpha: 0, duration: .2 }, .1)
      .to(foot, { autoAlpha: 0, duration: .12 }, .15)
      .to(cover, { clipPath: 'polygon(100% 0,100% 0,0 100%,0 100%)', duration: .34 }, .3)
      .fromTo(next, { clipPath: 'polygon(100% 0,100% 0,0 100%,0 100%)' }, { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', duration: .24 }, .76);
  }, root);
  return () => { disposed = true; ctx.revert(); delete root.dataset.motion; cancelAnimationFrame(raf); release(); video.removeEventListener('seeked', schedule); video.removeEventListener('loadeddata', schedule); video.removeAttribute('src'); video.load(); video.remove(); };
}
