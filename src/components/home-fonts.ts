import localFont from "next/font/local";
import { readFileSync } from "node:fs";
import path from "node:path";

export const homeDisplay = localFont({ src: "../../public/fonts/instrument-serif-latin-400.woff2", weight: "400", display: "swap", variable: "--fonte-display-a1", preload: true, adjustFontFallback: "Times New Roman" });
// Incorporado no HTML estatico: elimina uma ida adicional a rede sem preload do corpo.
const bodyWoff2 = readFileSync(path.join(process.cwd(), "public/fonts/instrument-sans-latin-variable.woff2")).toString("base64");
export const homeBody = { variable: "home-body-font" };
export const homeBodyStyles = `
@font-face{font-family:InstrumentBody;src:url(data:font/woff2;base64,${bodyWoff2}) format('woff2');font-display:swap;font-weight:400 600}
@font-face{font-family:InstrumentBodyFallback;src:local(Arial);ascent-override:93.97%;descent-override:24.22%;line-gap-override:0%;size-adjust:103.22%}
.home-body-font{--fonte-corpo-a1:InstrumentBody,InstrumentBodyFallback}
`;
