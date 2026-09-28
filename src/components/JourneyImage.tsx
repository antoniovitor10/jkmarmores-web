import type { ReactNode } from "react";

type Props = { alt: string; width: number; height: number; avif: string; webp: string; src: string; sizes: string; mobileAvif?: string; mobileWebp?: string; children: ReactNode };

export function JourneyImage({ alt, width, height, avif, webp, src, sizes, mobileAvif, mobileWebp, children }: Props) {
  return <>
    <picture data-journey-image>
      {mobileAvif && <source media="(max-width: 700px)" type="image/avif" data-srcset={mobileAvif} sizes="100vw" />}
      {mobileWebp && <source media="(max-width: 700px)" type="image/webp" data-srcset={mobileWebp} sizes="100vw" />}
      <source type="image/avif" data-srcset={avif} sizes={sizes} />
      <source type="image/webp" data-srcset={webp} sizes={sizes} />
      <img data-src={src} alt={alt} width={width} height={height} decoding="async" fetchPriority="low" />
    </picture>
    <noscript>{children}</noscript>
  </>;
}
