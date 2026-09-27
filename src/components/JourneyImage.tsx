"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = { alt: string; width: number; height: number; avif: string; webp: string; src: string; sizes: string; mobileAvif?: string; mobileWebp?: string; children: ReactNode };

export function JourneyImage({ alt, width, height, avif, webp, src, sizes, mobileAvif, mobileWebp, children }: Props) {
  const ref = useRef<HTMLPictureElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <>
    <picture ref={ref}>
      {mobileAvif && <source media="(max-width: 700px)" type="image/avif" srcSet={ready ? mobileAvif : undefined} sizes="100vw" />}
      {mobileWebp && <source media="(max-width: 700px)" type="image/webp" srcSet={ready ? mobileWebp : undefined} sizes="100vw" />}
      <source type="image/avif" srcSet={ready ? avif : undefined} sizes={sizes} />
      <source type="image/webp" srcSet={ready ? webp : undefined} sizes={sizes} />
      <img src={ready ? src : undefined} alt={alt} width={width} height={height} decoding="async" fetchPriority="low" />
    </picture>
    <noscript>{children}</noscript>
  </>;
}
