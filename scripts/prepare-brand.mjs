import sharp from 'sharp';
// Recorte do arquivo da cliente: preserva desenho, textura e assinatura completos.
await sharp('assets/brand/logo-jk-cliente-2026-09-26.jpg')
  .extract({ left: 260, top: 266, width: 1080, height: 666 })
  .resize({ width: 480 }).webp({ quality: 92 }).toFile('public/brand/jk-logo-480.webp');
await sharp('assets/brand/logo-jk-cliente-2026-09-26.jpg')
  .extract({ left: 260, top: 266, width: 1080, height: 666 })
  .resize({ width: 288 }).webp({ quality: 88 }).toFile('public/brand/jk-logo-288.webp');
// Recorte mobile do quadro 02: aproxima a quina e exclui a peça solta à direita.
await sharp('assets/images/sequencia-02-borda.png')
  .extract({ left: 950, top: 470, width: 850, height: 1063 })
  .png().toFile('assets/images/sequencia-02-borda-mobile.png');
await sharp('assets/images/a1-prova-01.png')
  .extract({ left: 710, top: 0, width: 1748, height: 1344 })
  .resize({ width: 780 }).png().toFile('assets/images/a1-mobile.png');
