import localFont from 'next/font/local';

// T-0011: títulos em Source Serif 4 500 com tamanho óptico (OFL, public/fonts/OFL-SourceSerif4.txt); a Bodoni Moda saiu por legibilidade (ADR-0003).
export const homeDisplay = localFont({ src: '../../public/fonts/source-serif-4-latin.woff2', weight: '500', display: 'swap', variable: '--fonte-display-a1', preload: true, adjustFontFallback: 'Times New Roman' });
export const homeBody = localFont({ src: '../../public/fonts/source-latin-400.woff2', weight: '400', display: 'swap', variable: '--fonte-corpo-a1', preload: true, adjustFontFallback: 'Arial' });
