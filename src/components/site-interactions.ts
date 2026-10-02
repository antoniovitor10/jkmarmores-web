import { afterPoster } from '@/lib/after-poster';
import { mountJourneyImages } from './journey-images';

export function mountSiteInteractions() {
  let disposed = false;
  let motion = () => {};
  let nearby: IntersectionObserver | undefined;
  const journey = document.querySelector<HTMLElement>('.journey-track');
  let stopImages = () => {};
  const cancelMotion = afterPoster(() => {
    stopImages = journey ? mountJourneyImages(journey) : () => {};
    // A rede so decide se baixa video (journey-motion); as transicoes rodam sempre,
    // exceto quando o sistema pede menos movimento.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.dataset.motionStatic = 'true';
      return;
    }
    document.querySelector<HTMLElement>('.home-hero')?.setAttribute('data-motion-ready', 'true');
    nearby = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      nearby?.disconnect();
      void import('./motion-runtime').then(({ mountPageMotion }) => {
        if (!disposed) motion = mountPageMotion();
      });
    }, { rootMargin: '300px 0px' });
    document.querySelectorAll('.prologo,.stone-signature,.journey-heading,.editorial-image').forEach(el => nearby!.observe(el));
  });
  const dock = document.querySelector<HTMLElement>(".mobile-quote-dock");
  const shine = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' || document.body.dataset.motionStatic || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.button,.selector-controls button,.material-card') : null;
    target?.setAttribute('data-gleam', 'true');
  };
  const finishShine = (event: AnimationEvent) => {
    if (event.animationName === 'grazing-light' && event.target instanceof Element) event.target.removeAttribute('data-gleam');
  };
  document.addEventListener('pointerdown', shine, { passive:true });
  document.addEventListener('animationend', finishShine);
  const hero = document.querySelector(".prologo, .home-hero");
  const menu = document.querySelector<HTMLDetailsElement>(".mobile-nav");
  const summary = menu?.querySelector("summary");
  let pastHero = !hero;
  const occupied = new Set<Element>();
  const covered = new Set<Element>();
  let dockReady = !dock;
  const update = () => { if (dock) { const visible = dockReady && pastHero && !occupied.size && !covered.size && !menu?.open; dock.dataset.visible = String(visible); dock.inert = !visible; } };
  // Reserva o canto ocupado pelo botão, sem medir o layout a cada scroll.
  // O mesmo cuidado vale para textos e controles no celular e no desktop.
  let clearance: IntersectionObserver | undefined;
  let resizeFrame = 0;
  const observeClearance = () => {
    if (!dock) return;
    clearance?.disconnect();
    covered.clear();
    dockReady = false;
    update();
    clearance = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) covered.add(entry.target);
        else covered.delete(entry.target);
      }
      dockReady = true;
      update();
    }, { rootMargin: `-${Math.max(0, innerHeight - 112)}px 0px 0px -${Math.max(0, innerWidth - 224)}px` });
    document.querySelectorAll('main h1,main h2,main h3,main p,main a,main button,main label,main legend,main address,main dt,main dd,.site-footer a,.site-footer p,.site-footer span,.site-footer address').forEach(el => clearance!.observe(el));
  };
  const resizeClearance = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(observeClearance);
  };
  observeClearance();
  window.addEventListener('resize', resizeClearance, { passive:true });
  const heroContact = (event: Event) => { pastHero = (event as CustomEvent<{ show:boolean }>).detail.show; update(); };
  document.addEventListener('jk:hero-contact', heroContact);
  const cover = new IntersectionObserver(([entry]) => { pastHero = entry.boundingClientRect.bottom <= 0; document.querySelector<HTMLElement>(".site-header")?.setAttribute("data-past-hero", String(pastHero)); update(); });
  if (hero) cover.observe(hero);
  const zones = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target.matches('.home-contact .button,.selector-controls .button') ? entry.intersectionRatio >= .5 : entry.intersectionRect.height >= innerHeight * .5) occupied.add(entry.target);
      else occupied.delete(entry.target);
    }
    update();
  }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });
  document.querySelectorAll(".selector-controls .button, .home-contact .button, .contact-panel, .contact-details, .form-layout").forEach(el => zones.observe(el));
  const targets = [...document.querySelectorAll<HTMLElement>("main, .site-footer, .site-header .brand, .desktop-nav, .header-cta")];
  const previous = targets.map(el => el.inert);
  const toggle = () => { targets.forEach((el, i) => { el.inert = !!menu?.open || previous[i]; }); update(); };
  const key = (event: KeyboardEvent) => {
    if (!menu?.open) return;
    if (event.key === "Escape") { menu.open = false; summary?.focus(); }
    if (event.key === "Tab") {
      const items = [...menu.querySelectorAll<HTMLElement>("summary,a[href]")];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };
  menu?.addEventListener("toggle", toggle);
  document.addEventListener("keydown", key);
  toggle();
  return () => { disposed = true; stopImages(); nearby?.disconnect(); cancelMotion(); motion(); cover.disconnect(); zones.disconnect(); clearance?.disconnect(); cancelAnimationFrame(resizeFrame); window.removeEventListener('resize', resizeClearance); menu?.removeEventListener("toggle", toggle); document.removeEventListener("keydown", key); document.removeEventListener('jk:hero-contact', heroContact); document.removeEventListener('pointerdown', shine); document.removeEventListener('animationend', finishShine); delete document.body.dataset.motionStatic; document.querySelectorAll('[data-gleam]').forEach(el => el.removeAttribute('data-gleam')); targets.forEach((el, i) => { el.inert = previous[i]; }); };
}
