import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountJourney } from './journey-motion';
import { mountCinemaHero } from './cinema-motion';
import { mountMaterialGallery } from './gallery-motion';
export { gsap, ScrollTrigger };
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
export function mountPageMotion() {
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 701px)', mobile: '(max-width: 700px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
    if (!context.conditions?.motion) return;
    const hero = document.querySelector<HTMLElement>('.cinema-hero');
    const journey = document.querySelector<HTMLElement>('.journey-track');
    const gallery = document.querySelector<HTMLElement>('.material-gallery');
    const mobile = context.conditions?.mobile;
    let width = innerWidth, height = innerHeight;
    let cleanHero = () => {};
    let cleanJourney = () => {};
    let cleanGallery = () => {};
    // Give the browser a paint between each section's layout work.
    let frame = 0, resizeFrame = 0;
    const clear = () => {
      cancelAnimationFrame(frame);
      cleanGallery(); cleanJourney(); cleanHero();
      document.documentElement.style.removeProperty('--motion-viewport');
    };
    const mount = () => {
      // Read 100svh once. Address-bar resizes must not move earlier sections or
      // change the gallery's travel while the finger is down. Width/orientation
      // changes below clear this value and measure the new layout normally.
      if (mobile && hero) document.documentElement.style.setProperty('--motion-viewport', `${hero.querySelector<HTMLElement>('.cinema-stage')!.getBoundingClientRect().height}px`);
      cleanHero = hero ? mountCinemaHero(hero) : () => {};
      frame = requestAnimationFrame(() => {
        cleanJourney = journey ? mountJourney(journey) : () => {};
        frame = requestAnimationFrame(() => {
          cleanGallery = gallery ? mountMaterialGallery(gallery) : () => {};
          ScrollTrigger.refresh();
        });
      });
    };
    mount();
    const resize = () => {
      if (innerWidth === width && (mobile || innerHeight === height)) return;
      width = innerWidth; height = innerHeight;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => { clear(); mount(); });
    };
    window.addEventListener('resize', resize, { passive: true });
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(resizeFrame); clear(); };
  });
  return () => mm.revert();
}
