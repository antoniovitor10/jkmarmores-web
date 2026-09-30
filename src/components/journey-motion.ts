import { gsap } from 'gsap';
export function mountJourney(root: HTMLElement) {
  const frames = [...root.querySelectorAll<HTMLElement>('.journey-frame')];
  const pictures = frames.map(frame => frame.querySelector<HTMLImageElement>('img')!);
  const segments = [...root.querySelectorAll<HTMLElement>('.journey-progress i')];
  const playhead = { position: 0 };
  let active = -1;
  root.dataset.enhanced = 'true';
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      trigger: root, start: 'top top', end: 'bottom bottom', scrub: .12,
      onToggle: self => pictures.forEach(picture => { picture.style.willChange = self.isActive ? 'transform' : 'auto'; }),
    } });
    tl.to(playhead, { position: 3.999, duration: 4, onUpdate: () => {
      const index = Math.floor(playhead.position);
      if (active === index) return;
      active = index;
      frames.forEach((frame, i) => { frame.inert = i !== index; frame.dataset.current = String(i === index); });
      root.dispatchEvent(new Event('jk-step-change'));
    } }, 0);
    frames.forEach((frame, index) => {
      if (index) tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .3 }, index - .15);
      tl.fromTo(pictures[index], { scale: 1.04 }, { scale: 1, duration: 1.2 }, index);
      tl.to(segments[index], { scaleX: 1, duration: 1 }, index);
    });
    frames.forEach((frame, i) => { frame.inert = i !== 0; frame.dataset.current = String(i === 0); });
  }, root);
  return () => {
    ctx.revert();
    frames.forEach(frame => { frame.inert = false; delete frame.dataset.current; });
    pictures.forEach(picture => picture.style.removeProperty('will-change'));
    delete root.dataset.enhanced;
  };
}
