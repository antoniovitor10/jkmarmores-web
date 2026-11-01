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
  const menu = document.querySelector<HTMLDetailsElement>(".mobile-nav");
  const summary = menu?.querySelector("summary");
  // T-0013: o botão flutuante do WhatsApp fica sempre visível; some só com o menu do celular aberto
  // (o teclado do formulário continua escondendo pelo CSS).
  const update = () => { if (dock) { const visible = !menu?.open; dock.dataset.visible = String(visible); dock.inert = !visible; } };
  // Cabeçalho fixo: na home ele começa transparente sobre a foto e fica grafite assim que a página rola.
  const header = document.querySelector<HTMLElement>(".site-header");
  let scrollFrame = 0;
  const marcarRolagem = () => { cancelAnimationFrame(scrollFrame); scrollFrame = requestAnimationFrame(() => header?.setAttribute("data-rolado", String(scrollY > 24))); };
  marcarRolagem();
  window.addEventListener("scroll", marcarRolagem, { passive:true });
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
  return () => { disposed = true; stopImages(); nearby?.disconnect(); cancelMotion(); motion(); cancelAnimationFrame(scrollFrame); window.removeEventListener('scroll', marcarRolagem); menu?.removeEventListener("toggle", toggle); document.removeEventListener("keydown", key); document.removeEventListener('pointerdown', shine); document.removeEventListener('animationend', finishShine); delete document.body.dataset.motionStatic; document.querySelectorAll('[data-gleam]').forEach(el => el.removeAttribute('data-gleam')); targets.forEach((el, i) => { el.inert = previous[i]; }); };
}
