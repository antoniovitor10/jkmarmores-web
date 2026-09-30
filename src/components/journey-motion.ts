import { gsap } from 'gsap';

// A galeria acompanha a rolagem nativa, sem seek ou espera de vídeo.
export function mountJourney(root: HTMLElement) {
  const frames = [...root.querySelectorAll<HTMLElement>('.journey-frame')];
  const pictures = frames.map(frame => frame.querySelector<HTMLImageElement>('img')!);
  const segments = [...root.querySelectorAll<HTMLElement>('.journey-progress i')];
  const mask = root.querySelector<HTMLElement>('.journey-mask')!;
  let active = -1;
  root.dataset.enhanced = 'true';
  frames.forEach((frame, i) => { frame.inert = i !== 0; });
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      trigger: root, start: 'top top', end: 'bottom bottom', scrub: .35,
      onToggle: self => {
        pictures.forEach(picture => { picture.style.willChange = self.isActive ? 'transform' : 'auto'; });
      },
      onUpdate: self => {
        const index = Math.min(3, Math.max(0, Math.floor((self.progress * 5.8 - 1) / 1.2)));
        if (index === active) return;
        active = index;
        frames.forEach((frame, i) => { frame.inert = i !== index; frame.dataset.current = String(i === index); });
      },
    } });
    tl.fromTo(mask.querySelector('svg'), { scale: .92, y: 24 }, { scale: 1, y: 0, duration: .65 }, 0)
      .to(mask, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', duration: .65 }, .35);
    frames.forEach((frame, index) => {
      const at = 1 + index * 1.2;
      if (index) tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6 }, at - .3);
      tl.fromTo(pictures[index], { scale: 1.045, yPercent: 1 }, { scale: 1, yPercent: 0, duration: 1.2 }, at);
      tl.to(segments[index], { scaleX: 1, duration: 1.2 }, at);
    });
  }, root);
  return () => {
    ctx.revert();
    pictures.forEach(picture => picture.style.removeProperty('will-change'));
    frames.forEach(frame => { frame.inert = false; delete frame.dataset.current; });
    delete root.dataset.enhanced;
  };
}
