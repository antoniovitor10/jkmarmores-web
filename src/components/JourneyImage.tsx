"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = { alt: string; width: number; height: number; avif: string; webp: string; src: string; sizes: string; children: ReactNode };

export function JourneyImage({ alt, width, height, avif, webp, src, sizes, children }: Props) {
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
      <source type="image/avif" srcSet={ready ? avif : undefined} sizes={sizes} />
      <source type="image/webp" srcSet={ready ? webp : undefined} sizes={sizes} />
      <img src={ready ? src : undefined} alt={alt} width={width} height={height} decoding="async" fetchPriority="low" />
    </picture>
    <noscript>{children}</noscript>
  </>;
}
