import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountHero } from './hero-motion';

export { gsap, ScrollTrigger };
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function mountPageMotion() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const hero = document.querySelector<HTMLElement>('.home-hero > div');
    const disposeHero = hero ? mountHero(hero) : () => {};
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
            tl.fromTo(el, { clipPath: 'inset(0 0 12% 0)' }, { clipPath: 'inset(0)', duration: .64, ease: 'expo.out' })
              .fromTo(el.querySelector('img'), { scale: 1.06 }, { scale: 1, duration: .64, ease: 'expo.out' }, 0);
          } else {
            const dark = el.matches('.home-contact');
            const from = dark ? '#f3ece2' : '#0b0a09', to = dark ? '#0b0a09' : '#f3ece2';
            ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'top 70%',
              onUpdate: self => {
                const color = gsap.utils.interpolate(from, to, self.progress);
                const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(c => { const n = c / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
                const luminance = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
                document.body.style.setProperty('--page-bg', color);
                document.body.style.setProperty('--page-ink', luminance > .179 ? '#000' : '#fff');
              },
            });
          }
        });
      }
    }, { rootMargin: '50% 0px' });
    document.querySelectorAll('.home-page > #configurador,.home-contact,.editorial-image').forEach(el => {
      if (!el.matches('.editorial-image') || !el.closest('#configurador')) observer.observe(el);
    });
    return () => { disposeHero(); observer.disconnect(); ctx.revert(); document.body.style.removeProperty('--page-bg'); document.body.style.removeProperty('--page-ink'); };
  });
  return () => mm.revert();
}
