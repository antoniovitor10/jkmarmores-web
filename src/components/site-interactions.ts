export function mountSiteInteractions() {
  const dock = document.querySelector<HTMLElement>(".mobile-quote-dock");
  const hero = document.querySelector(".prologo, .home-hero");
  const menu = document.querySelector<HTMLDetailsElement>(".mobile-nav");
  const summary = menu?.querySelector("summary");
  let pastHero = !hero;
  const occupied = new Set<Element>();
  const update = () => { if (dock) { const visible = pastHero && !occupied.size && !menu?.open; dock.dataset.visible = String(visible); dock.inert = !visible; } };
  const cover = new IntersectionObserver(([entry]) => { pastHero = entry.boundingClientRect.bottom <= 0; update(); });
  if (hero) cover.observe(hero);
  const zones = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRect.height >= innerHeight * .5) occupied.add(entry.target);
      else occupied.delete(entry.target);
    }
    update();
  }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });
  document.querySelectorAll("#configurador, .home-contact, .contact-panel, .contact-details, .form-layout").forEach(el => zones.observe(el));
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
  return () => { cover.disconnect(); zones.disconnect(); menu?.removeEventListener("toggle", toggle); document.removeEventListener("keydown", key); targets.forEach((el, i) => { el.inert = previous[i]; }); };
}
