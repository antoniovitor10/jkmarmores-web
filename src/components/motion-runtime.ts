import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountJourney } from './journey-motion';
import { mountCinemaHero } from './cinema-motion';
import { mountMaterialGallery } from './gallery-motion';
import { motionNetworkPolicy, type MotionConnection } from '@/lib/motion-network';
export { gsap, ScrollTrigger };
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
export function mountPageMotion() {
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 701px)', mobile: '(max-width: 700px)', tall: '(min-height: 650px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
    if (!context.conditions?.motion) return;
    const connection = (navigator as Navigator & { connection?: MotionConnection }).connection;
    let dispose = () => {};
    const configure = () => {
      dispose();
      if (motionNetworkPolicy(connection) !== 'allowed') return;
      const hero = document.querySelector<HTMLElement>('.cinema-hero');
      const journey = document.querySelector<HTMLElement>('.journey-track');
      const gallery = document.querySelector<HTMLElement>('.material-gallery');
      const cleanHero = hero ? mountCinemaHero(hero) : () => {};
      let cleanJourney = () => {};
      let cleanGallery = () => {};
      // Give the browser a paint between each section's layout work.
      let frame = requestAnimationFrame(() => {
        cleanJourney = journey ? mountJourney(journey) : () => {};
        frame = requestAnimationFrame(() => {
          cleanGallery = gallery ? mountMaterialGallery(gallery) : () => {};
          ScrollTrigger.refresh();
        });
      });
      dispose = () => { cancelAnimationFrame(frame); cleanGallery(); cleanJourney(); cleanHero(); };
    };
    configure();
    connection?.addEventListener('change', configure);
    return () => { dispose(); connection?.removeEventListener('change', configure); };
  });
  return () => mm.revert();
}
