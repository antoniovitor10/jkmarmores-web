import { gsap } from 'gsap';
export function mountCinemaHero(root: HTMLElement) {
  root.dataset.motion = 'true';
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .12 } });
    tl.fromTo('.cinema-cover img', { scale: 1.02, yPercent: 0 }, { scale: 1.12, yPercent: -3, duration: .7 }, 0)
      .to('.cinema-intro', { y: -32, autoAlpha: 0, duration: .24 }, .08)
      .to('.cinema-foot', { autoAlpha: 0, duration: .15 }, .12)
      .to('.cinema-cover', { clipPath: 'inset(0% 0% 100% 0%)', duration: .52 }, .3)
      .fromTo('.journey-monogram', { scale: .94 }, { scale: 1.03, duration: .7 }, .3);
  }, root);
  return () => { ctx.revert(); delete root.dataset.motion; };
}
