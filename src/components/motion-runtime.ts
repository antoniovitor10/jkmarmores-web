import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountJourney } from './journey-motion';
import { motionNetworkPolicy, type MotionConnection } from '@/lib/motion-network';

export { gsap, ScrollTrigger };
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function mountPageMotion() {
  const mm = gsap.matchMedia();
  const connection = (navigator as Navigator & { connection?: MotionConnection }).connection;
  const configure = () => {
    mm.revert();
    if (motionNetworkPolicy(connection) !== 'allowed') return;
    mm.add({ full: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 700px)' }, context => {
      if (!context.conditions?.full) return;
      const journey = document.querySelector<HTMLElement>('.journey-track');
      const stopJourney = journey ? mountJourney(journey) : () => {};
      const hero = document.querySelector<HTMLElement>('.home-hero');
      const heroImage = hero?.querySelector<HTMLElement>('[data-gallery-image] picture');
      if (hero && heroImage) gsap.to(heroImage, { yPercent: -3, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .4 } });
      document.querySelectorAll<HTMLElement>('.editorial-image picture').forEach(picture => {
        if (picture.getBoundingClientRect().top < innerHeight) return;
        gsap.fromTo(picture, { clipPath: 'inset(0% 0% 14% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'power2.out', scrollTrigger: { trigger: picture, start: 'top 92%', once: true } });
      });
      const request = document.querySelector<HTMLElement>('.home-request');
      if (request) gsap.fromTo(request, { backgroundColor: '#f4efe9' }, { backgroundColor: '#e9e2d9', ease: 'none', scrollTrigger: { trigger: request, start: 'top 95%', end: 'top 35%', scrub: true } });
      const contact = document.querySelector<HTMLElement>('.home-contact');
      if (contact) gsap.fromTo(contact, { backgroundColor: '#e9e2d9' }, { backgroundColor: '#f4efe9', ease: 'none', scrollTrigger: { trigger: contact, start: 'top 95%', end: 'top 35%', scrub: true } });
      return stopJourney;
    });
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
  };
  configure();
  connection?.addEventListener('change', configure);
  return () => { connection?.removeEventListener('change', configure); mm.revert(); };
}
