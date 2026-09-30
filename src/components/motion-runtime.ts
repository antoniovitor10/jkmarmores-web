import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export { gsap, ScrollTrigger };
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function mountPageMotion() {
  const mm = gsap.matchMedia();
  mm.add({ full: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 700px)' }, context => {
    if (!context.conditions?.full) return;
    const mobile = context.conditions.mobile;
    const signature = document.querySelector('.stone-signature');
    if (signature) {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: signature, start: 'top bottom', end: 'center center', scrub: true } });
      timeline.fromTo('.signature-brand', { y: 50, scale: .9 }, { y: 0, scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('.signature-copy h2', { y: 28 }, { y: 0, ease: 'none', duration: 1 }, 0);
    }
    document.querySelectorAll<HTMLElement>('.stone-panel').forEach(panel => {
      const media = panel.querySelector('.stone-panel-image');
      const caption = panel.querySelector('figcaption');
      const timeline = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true,
        onToggle: self => { if (media instanceof HTMLElement) media.style.willChange = self.isActive ? 'transform' : 'auto'; }
      }});
      timeline.fromTo(media, { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.08, ease: 'none', duration: 1 }, 0)
        .fromTo(caption, { y: mobile ? 24 : 40 }, { y: mobile ? -12 : -24, ease: 'none', duration: 1 }, 0);
    });
    document.querySelectorAll<HTMLElement>('.editorial-image,.selector-image').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      gsap.fromTo(el, { clipPath: 'inset(0 0 12% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  });
  return () => mm.revert();
}
