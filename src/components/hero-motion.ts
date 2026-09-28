import { gsap } from 'gsap';
import { hasCompleteClip, loadBufferedClip } from '@/lib/gesture-media';
import { motionNetworkPolicy, type MotionConnection } from '@/lib/motion-network';
import styles from './HomeHero.module.css';

export function mountHero(el: HTMLElement) {
  if (el.getBoundingClientRect().bottom < 0 || scrollY > innerHeight) return () => {};
  const intro = el.querySelector<HTMLElement>('[data-hero-intro]')!;
  const figure = el.querySelector('figure')!;
  const poster = figure.querySelector('img')!;
  const connection = (navigator as Navigator & { connection?: MotionConnection }).connection;
  const policy = motionNetworkPolicy(connection);
  el.dataset.motion = 'true'; el.dataset.mediaPolicy = policy;
  let video: HTMLVideoElement | null = null;
  let release = () => {};
  let frame = 0, progress = 0;
  if (policy === 'allowed') {
    video = document.createElement('video'); video.muted = true; video.playsInline = true;
    video.preload = 'auto'; video.className = styles.video; video.setAttribute('aria-hidden', 'true');
    figure.prepend(video); release = loadBufferedClip(video, '/video/capa-close.mp4');
  }
  const draw = () => {
    frame = 0;
    const ready = hasCompleteClip(video);
    if (video) {
      video.style.opacity = ready ? '1' : '0';
      if (ready && !video.seeking) video.currentTime = progress * Math.max(0, video.duration - .05);
    }
    el.dataset.mediaMode = ready ? 'video' : 'poster';
    poster.style.transform = `scale(${1 + progress * .04})`;
  };
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
    trigger: el, start: 'top top', end: 'bottom bottom', scrub: .25,
    onUpdate: self => { progress = self.progress; if (!frame) frame = requestAnimationFrame(draw); intro.inert = progress >= .95; },
  } });
  tl.to(intro, { yPercent: -30, opacity: 0, duration: .65 }, 0).to([figure.querySelector('picture'), video].filter(Boolean), { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)', duration: 1 }, 0);
  return () => { tl.scrollTrigger?.kill(); tl.revert(); cancelAnimationFrame(frame); release(); video?.remove(); intro.inert = false; poster.style.removeProperty('transform'); delete el.dataset.motion; };
}
