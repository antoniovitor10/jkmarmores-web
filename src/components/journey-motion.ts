import { gsap } from 'gsap';
import { stoneJourneyVideo } from '@/content/stone-journey';
import { hasCompleteClip, loadBufferedClip } from '@/lib/gesture-media';
import { motionNetworkPolicy, type MotionConnection } from '@/lib/motion-network';

export function mountJourney(root: HTMLElement) {
  const frames = [...root.querySelectorAll<HTMLElement>('.journey-frame')];
  const pictures = frames.map(frame => frame.querySelector<HTMLImageElement>('img')!);
  const segments = [...root.querySelectorAll<HTMLElement>('.journey-progress i')];
  const connection = (navigator as Navigator & { connection?: MotionConnection }).connection;
  const media: (HTMLVideoElement | null)[] = frames.map(() => null);
  const releases: (() => void)[] = [];
  const failed = new Set<number>();
  const playhead = { position: 0 };
  let active = -1, selected = false, raf = 0, targetTime = 0, lastScroll = 0, choose = true;
  let visible = false;
  root.dataset.enhanced = 'true';

  const seek = () => {
    raf = 0;
    const video = media[active];
    if (document.hidden || !selected || !hasCompleteClip(video)) return;
    if (!video.seeking && Math.abs(video.currentTime - targetTime) > 1 / 30) video.currentTime = targetTime;
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(seek); };
  const prepare = (index: number) => {
    if (index > 3 || media[index] || failed.has(index) || motionNetworkPolicy(connection) !== 'allowed') return;
    const source = stoneJourneyVideo?.clips[index];
    if (!source) return;
    const video = document.createElement('video');
    video.muted = true; video.playsInline = true; video.preload = 'auto';
    video.className = 'journey-video'; video.setAttribute('aria-hidden', 'true');
    video.addEventListener('error', () => { failed.add(index); video.remove(); media[index] = null; });
    video.addEventListener('seeked', () => {
      if (index === active && selected) { video.style.opacity = '1'; schedule(); }
    });
    frames[index].querySelector('.journey-media')!.append(video);
    media[index] = video;
    releases.push(loadBufferedClip(video, innerWidth <= 700 ? source.mobile.src : source.desktop.src));
  };
  const selectGesture = () => {
    const now = performance.now();
    if (now - lastScroll > 180) choose = true;
    lastScroll = now;
  };
  const beginTouch = () => { choose = true; };
  addEventListener('scroll', selectGesture, { passive: true });
  addEventListener('touchstart', beginTouch, { passive: true });

  const ctx = gsap.context(() => {

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      trigger: root, start: 'top top', end: 'bottom bottom', scrub: .18,
      onToggle: self => {
        visible = self.isActive;
        pictures.forEach(picture => { picture.style.willChange = visible ? 'transform' : 'auto'; });
        if (visible) prepare(Math.max(0, active));
      },
    } });

    tl.to(playhead, { position: 4, duration: 4, onUpdate: () => {
      const position = Math.min(3.999, playhead.position);
      const index = Math.floor(position);
      const local = position - index;
      if (active !== index) {
        active = index; choose = true;
        frames.forEach((frame, i) => { frame.inert = i !== active; frame.dataset.current = String(i === active); });
        root.dispatchEvent(new Event('jk-step-change'));
      }
      if (choose) { selected = hasCompleteClip(media[active]); choose = false; }
      frames[active].dataset.mediaMode = selected ? 'video' : 'poster';
      media.forEach((video, i) => { if (video && (i !== active || !selected)) video.style.opacity = '0'; });
      if (visible) { prepare(active); prepare(active + 1); }
      targetTime = Math.round(local * Math.max(0, (media[active]?.duration || 0) - .05) * 24) / 24;
      schedule();
    } }, 0);
    frames.forEach((frame, index) => {
      if (index) tl.fromTo(frame, { clipPath: 'polygon(100% 0,100% 0,0 100%,0 100%)' }, { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', duration: .22 }, index);
      tl.fromTo(pictures[index], { scale: 1, yPercent: 0 }, { scale: 1.025, yPercent: -.5, duration: 1.2 }, index);
      tl.to(segments[index], { scaleX: 1, duration: 1 }, index);
    });
    tl.to(root.querySelector('.journey-exit'), { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', duration: .3 }, 3.9);
    // HTML permanece acessível sem movimento; durante o scrub só a legenda ativa recebe foco.
    frames.forEach((frame, i) => { frame.inert = i !== 0; frame.dataset.current = String(i === 0); });
  }, root);

  return () => {
    ctx.revert(); cancelAnimationFrame(raf);
    removeEventListener('scroll', selectGesture); removeEventListener('touchstart', beginTouch);
    releases.forEach(release => release());
    media.forEach(video => { video?.removeAttribute('src'); video?.load(); video?.remove(); });
    frames.forEach(frame => { frame.inert = false; delete frame.dataset.current; delete frame.dataset.mediaMode; });
    pictures.forEach(picture => picture.style.removeProperty('will-change'));
    delete root.dataset.enhanced;
  };
}
