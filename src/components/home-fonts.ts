import localFont from 'next/font/local';

export const homeDisplay = localFont({ src: '../../public/fonts/bodoni-latin-400.woff2', weight: '400', display: 'swap', variable: '--fonte-display-a1', preload: true, adjustFontFallback: 'Times New Roman' });
export const homeBody = localFont({ src: '../../public/fonts/source-latin-400.woff2', weight: '400', display: 'swap', variable: '--fonte-corpo-a1', preload: true, adjustFontFallback: 'Arial' });
