import { asset } from "@/lib/base-path";
import { jkMonogramPath } from '@/content/monogram';

export function StoneMonogram() {
  return <div className="journey-mask">
    <svg className="journey-monogram" viewBox="0 0 800 500" role="img" aria-label="JK, monograma em pedra quente">
      <defs><clipPath id="jk-stone-mask"><path d={jkMonogramPath} /></clipPath></defs>
      <path d={jkMonogramPath} fill="#c9ab91" />
      <image href={asset("/img/sequencia-01-chapa-1600.avif")} x="-600" y="-500" width="2000" height="1500" preserveAspectRatio="xMidYMid slice" clipPath="url(#jk-stone-mask)" />
    </svg>
    <noscript><style>{`.journey-mask > svg { display:none; }`}</style>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="journey-monogram" src={asset("/brand/jk-monograma-provisorio.svg")} width={800} height={500} alt="JK, monograma em pedra quente" loading="lazy" />
    </noscript>
    <p>Mármores e Granitos</p>
  </div>;
}
