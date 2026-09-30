import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountJourney } from './journey-motion';
import { mountCinemaHero } from './cinema-motion';
import { motionNetworkPolicy, type MotionConnection } from '@/lib/motion-network';
export { gsap, ScrollTrigger };
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
export function mountPageMotion() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const connection = (navigator as Navigator & { connection?: MotionConnection }).connection;
    let dispose = () => {};
    const configure = () => {
      dispose();
      if (motionNetworkPolicy(connection) !== 'allowed') return;
      const hero = document.querySelector<HTMLElement>('.cinema-hero');
      const journey = document.querySelector<HTMLElement>('.journey-track');
      const cleanHero = hero ? mountCinemaHero(hero) : () => {};
      const cleanJourney = journey ? mountJourney(journey) : () => {};
      const ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>('.editorial-image').forEach(el => {
          gsap.fromTo(el, { clipPath: 'polygon(0 0,100% 0,100% 0,0 12%)' }, { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', duration: .64, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });
      });
      dispose = () => { ctx.revert(); cleanJourney(); cleanHero(); };
      ScrollTrigger.refresh();
    };
    configure();
    connection?.addEventListener('change', configure);
    return () => { dispose(); connection?.removeEventListener('change', configure); };
  });
  return () => mm.revert();
}
