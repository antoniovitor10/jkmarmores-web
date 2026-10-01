import { escolhaInicial } from "@/content/configurador";
import { ConfiguradorLoader } from "./ConfiguradorLoader";
import { Vista } from "./Vista";
export type ConfiguradorProps = { compact?: boolean; materialContext?: string };
export function Configurador(props: ConfiguradorProps) {
  return (
    <ConfiguradorLoader {...props} initialChoice={escolhaInicial}>
      <div data-selector-layout>
      <Vista
        escolha={escolhaInicial}
        exibida={escolhaInicial}
        materialContext={props.materialContext}
      />
      <noscript>
        <p>
          A imagem mostra a referência inicial. Ative JavaScript para trocar as
          escolhas.
        </p>
      </noscript>
      </div>
    </ConfiguradorLoader>
  );
}
