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
    const prologo = document.querySelector<HTMLElement>('.prologo');
    const hero = prologo?.querySelector<HTMLElement>('.home-hero');
    const mask = hero?.querySelector<SVGSVGElement>('.hero-mask');
    const windowPath = mask?.querySelector<SVGGElement>('.hero-monogram-path');
    if (prologo && hero && mask && windowPath) {
      prologo.dataset.enhanced = 'true';
      let startMatrix = '', endMatrix = '';
      const measure = () => {
        const width = hero.clientWidth, height = hero.clientHeight;
        mask.setAttribute('viewBox', `0 0 ${width} ${height}`);
        const initialScale = Math.max(width / 90, height / 280) * 1.15;
        const finalScale = Math.min(width * .82, 560) / 800;
        startMatrix = `matrix(${initialScale} 0 0 ${initialScale} ${width / 2 - initialScale * 244} ${height / 2 - initialScale * 160})`;
        endMatrix = `matrix(${finalScale} 0 0 ${finalScale} ${width / 2 - finalScale * 400} ${height / 2 - finalScale * 250})`;
      };
      measure();
      gsap.set(windowPath, { attr:{ transform:startMatrix } });
      gsap.set('.hero-signature', { autoAlpha:0, y:16 });
      let contactVisible = false;
      const timeline = gsap.timeline({ scrollTrigger: { trigger:prologo, start:'top top', end:'bottom bottom', scrub:true, invalidateOnRefresh:true, onRefresh:measure,
        onUpdate:self => { const show = self.progress >= .45; if (show !== contactVisible) { contactVisible = show; document.dispatchEvent(new CustomEvent('jk:hero-contact', { detail:{show} })); } }
      } });
      timeline.to('[data-hero-intro]', { yPercent:-10, autoAlpha:0, ease:'none', duration:.25 }, .20)
        .to('[data-hero-veil]', { opacity:0, ease:'none', duration:.25 }, .28)
        .fromTo(windowPath, { attr:{ transform:() => startMatrix } }, { attr:{ transform:() => endMatrix }, ease:'power2.inOut', duration:.48, immediateRender:false }, .30)
        .to('.hero-signature', { autoAlpha:1, y:0, ease:'none', duration:.15 }, .78)
        .to({}, { duration:.07 }, .93);
    }
    const signature = document.querySelector('.stone-signature');
    if (signature) {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: signature, start: 'top bottom', end: 'center center', scrub: true } });
      timeline.fromTo('.signature-stage > h2', { y: 28 }, { y: 0, ease: 'none', duration: 1 }, 0);
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
    document.querySelectorAll<HTMLElement>('.editorial-image,.selector-image,.stone-panel-image').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      gsap.fromTo(el, { clipPath: 'inset(0 0 12% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    return () => { prologo?.removeAttribute('data-enhanced'); };
  });
  return () => mm.revert();
}
