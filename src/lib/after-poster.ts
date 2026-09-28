// A camada de movimento só disputa recursos depois da apresentação da capa.
export function afterPoster(run: () => void) {
  let cancelled = false;
  const ready = async () => {
    const poster = document.querySelector<HTMLImageElement>('.home-hero figure img');
    await Promise.all([poster?.decode().catch(() => {}), document.fonts.ready]);
    requestAnimationFrame(() => requestAnimationFrame(() => { if (!cancelled) run(); }));
  };
  if (document.readyState === 'complete') void ready();
  else addEventListener('load', ready, { once: true });
  return () => { cancelled = true; removeEventListener('load', ready); };
}
