# Versão 2: galeria clara

O papel quente (#f4efe9), a tinta marrom (#2b2622) e a superfície de pedra (#e9e2d9) unem todas as páginas. A imagem conduz a abertura; texto e contato formam um único conjunto no terço inferior esquerdo.

Work Sans Light 300 nos títulos, com escala contida e espaçamento de .008em a .012em; Source Sans 3 400 no corpo, 18px no desktop e 17px no celular. Ambas são livres, locais e em subset; não são fontes oficiais da marca. Bodoni foi reprovada.

O eixo é um contêiner de 1280px, com margens mínimas de 40px no desktop e 24px no celular. Seções têm 72–104px de respiro, sem reservas artificiais vazias. Imagens grandes com legendas alinhadas; seletor em duas colunas no desktop e empilhado no celular. A logo do header e do rodapé deriva do JPEG da cliente com alfa; o vetor oficial continua pendente.

Capa em 100svh, título curto, apoio e um único CTA. Gradiente só na região do texto. A foto de ambiente preserva a bancada inteira no desktop; recorte móvel próprio. Derivados nunca ampliam a fonte nativa.

A galeria tem quatro quadros e scrub sobre a rolagem nativa. O monograma abre a jornada; cortes substituem imagens e legendas juntas, com fundo opaco. Clip-path e transform são as principais ferramentas. Carregamento GSAP após a capa, com gsap.matchMedia; somente reduced-motion desativa o movimento. Save-Data, 3G, cache e rede não medida mantêm transições com imagens, sem vídeo.

Fatos vêm de src/content/cliente.ts. Fotografias ilustrativas têm aviso global e registro de origem; nomes de pedras e serviços não confirmados continuam pendentes. Nenhuma nova geração paga.
