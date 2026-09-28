import { jkMonogramPath } from '@/content/monogram';

export function StoneMonogram() {
  return <div className="journey-mask">
    <svg className="journey-monogram" viewBox="0 0 800 500" role="img" aria-label="JK, monograma em pedra quente">
      <defs><clipPath id="jk-stone-mask"><path d={jkMonogramPath} /></clipPath></defs>
      <path d={jkMonogramPath} fill="#c9ab91" />
      <image data-href="/brand/jk-textura-transparente.webp" x="-5" y="-4" width="790" height="480" clipPath="url(#jk-stone-mask)" />
    </svg>
    <noscript><style>{`.journey-mask > svg { display:none; }`}</style>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="journey-monogram" src="/brand/jk-monograma-provisorio.svg" width={800} height={500} alt="JK, monograma em pedra quente" loading="lazy" />
    </noscript>
    <p>Mármores e Granitos</p>
  </div>;
}
