/* eslint-disable @next/next/no-img-element */
import { ConfiguradorLoader } from "./ConfiguradorLoader";
import { orcamentoConfigurador } from "@/content/configurador";
import styles from "./Shell.module.css";

export type ConfiguradorProps = { compact?: boolean; materialContext?: string };
export function Configurador({
  compact = false,
  materialContext,
}: ConfiguradorProps) {
  return (
    <ConfiguradorLoader compact={compact} materialContext={materialContext}>
      <div className={styles.placeholder}>
        <p className={styles.kicker}>O SEU AMBIENTE, EM PERSPECTIVA</p>
        <h3>Escolha. Aproxime. Imagine.</h3>
        <p>
          Cozinha com ilha ou lavatório. Referências em pedra rosada, bege e
          escura, com detalhes de acabamento polido, levigado ou escovado.
        </p>
        <button type="button" data-activate>
          Explorar combinações
        </button>
        <p className={styles.disclaimer}>
          Materiais e acabamentos a confirmar com a JK.
        </p>
        <a
          className={styles.quote}
          href={orcamentoConfigurador(
            "Cozinha com ilha",
            "Rosado",
            "Polido",
            materialContext,
          )}
        >
          Pedir orçamento desta pedra
        </a>
        <noscript>
          <img
            src="/configurador/orbita-rosado/720/00.avif"
            width="720"
            height="405"
            loading="lazy"
            alt="Cozinha com ilha em pedra rosada, visualização ilustrativa gerada por IA."
            style={{ width: "100%", height: "auto" }}
          />
          <p>
            Prévia: cozinha com ilha, referência rosada e acabamento
            polido. Ative JavaScript para trocar a combinação e explorar os
            ângulos.
          </p>
        </noscript>
      </div>
    </ConfiguradorLoader>
  );
}
