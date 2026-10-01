import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function mountMaterialGallery(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('.gallery-stage')!;
  const rail = root.querySelector<HTMLElement>('.gallery-rail')!;
  const items = [...root.querySelectorAll<HTMLElement>('.gallery-material')];
  // Short viewports keep the complete native flow so copy never gets clipped.
  const viewportHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-viewport')) || innerHeight;
  if (viewportHeight < 650) return () => {};
  root.dataset.motion = 'true';
  const note = root.querySelector<HTMLElement>('.gallery-note')!;
  const safeBottom = stage.getBoundingClientRect().bottom - note.offsetHeight - 44;
  if (items.some(item => item.querySelector('a')!.getBoundingClientRect().bottom > safeBottom)) {
    delete root.dataset.motion;
    return () => {};
  }
  const distance = () => rail.scrollWidth - root.clientWidth;
  // Native sticky stays on the browser's scroll thread. Only the rail moves in GSAP.
  const travel = Math.round(innerWidth <= 700 ? stage.offsetHeight * 1.65 : Math.min(distance(), stage.offsetHeight * 2.6));
  root.style.setProperty('--gallery-travel', `${travel}px`);
  // Decode the small responsive pictures shortly before entry, never block motion.
  let disposed = false;
  const images = [...rail.querySelectorAll<HTMLImageElement>('img')];
  const prepare = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    prepare.disconnect();
    images.forEach(image => {
      image.loading = 'eager';
      image.decoding = 'async';
      void image.decode().then(() => { if (!disposed) image.dataset.decoded = 'true'; }).catch(() => {});
    });
  }, { rootMargin: '120% 0px' });
  prepare.observe(root);
  let trigger: ScrollTrigger | undefined;
  const ctx = gsap.context(() => {
    const tween = gsap.to(rail, { x: () => -distance(), force3D: true, ease: 'none', scrollTrigger: {
      trigger: root, start: 'top top', end: '+=' + travel,
      scrub: .35, invalidateOnRefresh: true,
      onToggle: self => {
        if (self.isActive) rail.style.willChange = 'transform';
        else rail.style.removeProperty('will-change');
      },
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
  return () => {
    disposed = true;
    prepare.disconnect();
    images.forEach(image => { delete image.dataset.decoded; image.loading = 'lazy'; });
    rail.removeEventListener('focusin', focus);
    ctx.revert();
    rail.style.removeProperty('will-change');
    root.style.removeProperty('--gallery-travel');
    delete root.dataset.motion;
  };
}
