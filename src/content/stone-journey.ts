// Quadros da jornada em Calacatta (HU-0001, T-0005): a mesma pedra da capa, da chapa à peça aplicada.
export const stoneJourney = [
  { id: "sequencia-01-chapa", title: "Chapa", detail: "O desenho natural, visto por inteiro.", alt: "Chapa inteira de mármore Calacatta em pé num suporte, numa sala escura." },
  { id: "sequencia-02-borda", title: "Borda", detail: "O encontro entre superfície e espessura.", alt: "Borda polida de uma bancada de mármore Calacatta, com uma pequena amostra da mesma pedra ao lado." },
  { id: "sequencia-03-acabamento", title: "Acabamento", detail: "A luz revela outra escala da matéria.", alt: "Close do mármore Calacatta polido sob luz lateral, com um veio cinza e dourado." },
  { id: "sequencia-04-aplicada", title: "Peça aplicada", detail: "A matéria passa a fazer parte do espaço.", alt: "Ilha de cozinha em mármore Calacatta num ambiente de pé-direito alto." },
] as const;

export type JourneyClip = {
  desktop: { src: string; bytes: number };
  mobile: { src: string; bytes: number; height: 720 };
  durationSeconds: number;
};
export type JourneyVideo = { clips: readonly JourneyClip[] };
// Sem vídeo desde a HU-0001 (D4): a jornada usa só os quadros, com as transições de rolagem. Preencher somente com vídeo aprovado, sem áudio, GOP curto e faststart.
export const stoneJourneyVideo: JourneyVideo | null = null;
