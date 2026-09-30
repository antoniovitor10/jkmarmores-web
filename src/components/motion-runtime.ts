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
      const cut = panel.querySelector('.stone-panel-cut');
      const media = panel.querySelector('.stone-panel-image');
      const caption = panel.querySelector('figcaption');
      const title = caption?.querySelector('h3 > span');
      const description = caption?.querySelector('p');
      const index = caption?.querySelector('.stone-index');
      const timeline = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true,
        onToggle: self => { if (media instanceof HTMLElement) media.style.willChange = self.isActive ? 'transform' : 'auto'; }
      }});
      timeline.fromTo(media, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', duration: 1 }, 0)
        .fromTo(cut, { clipPath: 'inset(0 0 0 36%)' }, { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: .24 }, 0)
        .fromTo(caption, { y: mobile ? 24 : 40 }, { y: mobile ? -12 : -24, ease: 'none', duration: 1 }, 0)
        .fromTo(title!, { yPercent: 105 }, { yPercent: 0, ease: 'power2.out', duration: .22 }, mobile ? .28 : .31)
        .fromTo(index!, { opacity: .25, y: 10 }, { opacity: 1, y: 0, ease: 'none', duration: .2 }, mobile ? .30 : .33)
        .fromTo(description!, { y: 20, opacity: .15 }, { y: 0, opacity: 1, ease: 'none', duration: .2 }, mobile ? .34 : .37);
    });
    document.querySelectorAll<HTMLElement>('.light-transition').forEach(section => {
      const light = section.querySelector('.section-light');
      if (!light) return;
      gsap.timeline({ scrollTrigger: { trigger:section, start:'top bottom', end:'top 15%', scrub:true } })
        .fromTo(light, { opacity:0, xPercent:-20, scaleX:.7 }, { opacity:.9, xPercent:0, scaleX:1, ease:'none', duration:.55 })
        .to(light, { opacity:0, xPercent:20, ease:'none', duration:.45 });
    });
    document.querySelectorAll<HTMLElement>('.editorial-image,.selector-image').forEach(el => {
      if (el.getBoundingClientRect().top >= innerHeight) gsap.fromTo(el, { clipPath:'inset(0 0 0 24%)' }, { clipPath:'inset(0 0 0 0%)', duration:1.2, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%', once:true } });
      if (el.matches('.editorial-image')) gsap.fromTo(el.querySelector('img'), { yPercent:-3, scale:1.08 }, { yPercent:3, scale:1.08, ease:'none', scrollTrigger:{ trigger:el, start:'top bottom', end:'bottom top', scrub:true } });
    });
    document.querySelectorAll<HTMLElement>('.material-collection').forEach(collection => {
      if (collection.getBoundingClientRect().top < innerHeight) return;
      gsap.fromTo(collection.querySelectorAll('.material-card'), { y:24 }, { y:0, duration:.85, stagger:mobile ? .08 : .12, ease:'power2.out', scrollTrigger:{ trigger:collection, start:'top 90%', once:true } });
    });
    return () => { prologo?.removeAttribute('data-enhanced'); };
  });
  return () => mm.revert();
}
