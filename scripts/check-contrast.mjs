import fs from 'node:fs/promises';
const luminance = hex => {
  const rgb = hex.replace('#','').match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  return rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722;
};
const pairs = [
  ['Texto / papel','#211c18','#f3ece2'], ['Texto / superfície quente','#211c18','#e8ddcf'],
  ['Secundário / papel','#695b4e','#f3ece2'], ['Secundário / superfície','#695b4e','#e8ddcf'],
  ['Papel / grafite','#f3ece2','#191715'], ['Texto secundário / grafite','#d8cec3','#191715'],
  ['Caramelo / grafite','#cea57e','#191715'], ['Caramelo / preto','#cea57e','#000000'],
  ['Botão claro / caramelo','#191715','#cea57e'], ['Botão escuro / bronze','#fff8f0','#835638'],
  ['Botão hover','#fff8f0','#644029'], ['Pendência','#62462f','#ead7bc'],
  ['Borda de campo / papel','#8c7a66','#f3ece2',3], ['Foco / papel','#98704d','#f3ece2',3], ['Foco / grafite','#98704d','#191715',3],
];
const results = pairs.map(([role,foreground,background,minimum = 4.5]) => {
  const a=luminance(foreground),b=luminance(background);
  const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  return {role,foreground,background,ratio:+ratio.toFixed(2),minimum,pass:ratio >= minimum};
});
await fs.writeFile('docs/auditorias/2026-09-27-institucional-contraste.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
if(results.some(item => !item.pass)) process.exitCode=1;
