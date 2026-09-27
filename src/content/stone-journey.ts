// Estudos ilustrativos. Nao descrevem materiais ou etapas executadas pela JK.
export const stoneJourney = [
  { id: "sequencia-01-chapa", title: "Chapa", detail: "O desenho natural, visto por inteiro.", alt: "Imagem ilustrativa de uma chapa clara com veios cinza, apoiada em um suporte numa sala escura." },
  { id: "sequencia-02-borda", title: "Borda", detail: "O encontro entre superfície e espessura.", alt: "Imagem ilustrativa de uma borda de pedra clara e um pequeno recorte sobre uma bancada." },
  { id: "sequencia-03-acabamento", title: "Acabamento", detail: "A luz revela outra escala da matéria.", alt: "Imagem ilustrativa em close da textura mineral de uma superfície clara sob luz lateral." },
  { id: "sequencia-04-aplicada", title: "Peça aplicada", detail: "A matéria passa a fazer parte do espaço.", alt: "Imagem ilustrativa de uma ilha de pedra clara em um ambiente arquitetônico fictício." },
] as const;

export type JourneyClip = {
  desktop: { src: string; bytes: number };
  mobile: { src: string; bytes: number; height: 720 };
  durationSeconds: number;
};
export type JourneyVideo = { clips: readonly JourneyClip[] };
// Preencher somente com video aprovado, sem audio, GOP curto e faststart.
export const stoneJourneyVideo: JourneyVideo | null = {
  "clips": [
    {
      "desktop": {
        "src": "/video/jornada-1-desktop.mp4",
        "bytes": 240259
      },
      "mobile": {
        "src": "/video/jornada-1-mobile.mp4",
        "bytes": 166010,
        "height": 720
      },
      "durationSeconds": 1.458333
    },
    {
      "desktop": {
        "src": "/video/jornada-2-desktop.mp4",
        "bytes": 176059
      },
      "mobile": {
        "src": "/video/jornada-2-mobile.mp4",
        "bytes": 60529,
        "height": 720
      },
      "durationSeconds": 1.458333
    },
    {
      "desktop": {
        "src": "/video/jornada-3-desktop.mp4",
        "bytes": 244192
      },
      "mobile": {
        "src": "/video/jornada-3-mobile.mp4",
        "bytes": 167156,
        "height": 720
      },
      "durationSeconds": 1.458333
    },
    {
      "desktop": {
        "src": "/video/jornada-4-desktop.mp4",
        "bytes": 249175
      },
      "mobile": {
        "src": "/video/jornada-4-mobile.mp4",
        "bytes": 169017,
        "height": 720
      },
      "durationSeconds": 1.458333
    }
  ]
};
