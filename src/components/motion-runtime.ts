import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export { gsap, ScrollTrigger };
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function mountPageMotion() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(() => {});
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        ctx.add(() => {
          const el = entry.target as HTMLElement;
          if (el.matches('.editorial-image')) {
            if (entry.boundingClientRect.top < innerHeight) return;
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
            tl.fromTo(el, { opacity: .8, y: 12 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power1.out' })
              .fromTo(el.querySelector('img'), { scale: 1.015 }, { scale: 1, duration: 1.2, ease: 'power1.out' }, 0);
          }
        });
      }
    }, { rootMargin: '50% 0px' });
    document.querySelectorAll('.editorial-image').forEach(el => {
      if (!el.matches('.editorial-image') || !el.closest('#configurador')) observer.observe(el);
    });
    return () => { observer.disconnect(); ctx.revert(); document.body.style.removeProperty('--page-bg'); document.body.style.removeProperty('--page-ink'); };
  });
  return () => mm.revert();
}
