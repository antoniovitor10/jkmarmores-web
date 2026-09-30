import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function mountMaterialGallery(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('.gallery-stage')!;
  const rail = root.querySelector<HTMLElement>('.gallery-rail')!;
  const items = [...root.querySelectorAll<HTMLElement>('.gallery-material')];
  // Short viewports keep the complete native flow so copy never gets clipped.
  if (innerHeight < 650) return () => {};
  root.dataset.motion = 'true';
  const note = root.querySelector<HTMLElement>('.gallery-note')!;
  const safeBottom = stage.getBoundingClientRect().bottom - note.offsetHeight - 44;
  if (items.some(item => item.querySelector('a')!.getBoundingClientRect().bottom > safeBottom)) {
    delete root.dataset.motion;
    return () => {};
  }
  const distance = () => rail.scrollWidth - root.clientWidth;
  let trigger: ScrollTrigger | undefined;
  const ctx = gsap.context(() => {
    const tween = gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: {
      trigger: root, pin: stage, pinType: 'transform', start: 'top top',
      end: () => '+=' + Math.round(innerWidth <= 700 ? innerHeight * 1.65 : Math.min(distance(), innerHeight * 2.6)),
      scrub: .15, invalidateOnRefresh: true, anticipatePin: 0,
      onToggle: self => { rail.style.willChange = self.isActive ? 'transform' : 'auto'; },
    } });
    trigger = tween.scrollTrigger;
  }, root);
  // Keyboard focus follows the same scroll itinerary; every category remains reachable.
  const focus = (event: FocusEvent) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>('.gallery-material');
    if (!item || !trigger) return;
    const index = items.indexOf(item);
    const progress = index / (items.length - 1);
    trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
    trigger.animation?.progress(progress);
  };
  rail.addEventListener('focusin', focus);
  return () => { rail.removeEventListener('focusin', focus); ctx.revert(); rail.style.removeProperty('will-change'); delete root.dataset.motion; };
}
