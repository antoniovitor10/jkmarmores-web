export function mountJourneyImages(root: HTMLElement) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.querySelectorAll<HTMLSourceElement>('source[data-srcset]').forEach(source => { source.srcset = source.dataset.srcset!; });
      const image = entry.target.querySelector<HTMLImageElement>('img[data-src]');
      if (image) image.src = image.dataset.src!;
      const texture = entry.target.querySelector<SVGImageElement>('image[data-href]');
      if (texture) texture.setAttribute('href', texture.dataset.href!);
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '300px 0px' });
  root.querySelectorAll('[data-journey-image],.journey-monogram').forEach(picture => observer.observe(picture));
  return () => observer.disconnect();
}
