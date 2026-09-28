/* eslint-disable @next/next/no-img-element */
import {
  ambientesConfigurador,
  materiaisConfigurador,
  imagemEscolha,
  fontesImagem,
  tamanhosImagem,
  nomeEscolha,
  orcamentoConfigurador,
  type Escolha,
} from "@/content/configurador";
import styles from "./Configurador.module.css";
type Props = {
  escolha: Escolha;
  exibida: Escolha;
  anterior?: Escolha;
  carregando?: boolean;
  erro?: boolean;
  materialContext?: string;
  onFadeEnd?: () => void;
};
export function Vista({
  escolha,
  exibida,
  anterior,
  carregando,
  erro,
  materialContext,
  onFadeEnd,
}: Props) {
  return (
    <>
      <div className={styles.choices}>
        <div className={styles.strip}>
          <fieldset className={styles.group}>
            <legend>Ambiente</legend>
            <div>
              {ambientesConfigurador.map((item) => (
                <button
                  type="button"
                  className={`button ${styles.choice}`}
                  key={item.id}
                  data-ambiente={item.id}
                  aria-pressed={escolha.ambiente === item.id}
                >
                  {item.nome}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.group}>
            <legend>Pedra</legend>
            <div>
              {materiaisConfigurador.map((item) => (
                <button
                  type="button"
                  className={`button ${styles.choice}`}
                  key={item.id}
                  data-material={item.id}
                  aria-pressed={escolha.material === item.id}
                  aria-busy={carregando && escolha.material === item.id}
                >
                  {item.nome}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
      <figure className={styles.figure}>
        <div className={styles.images}>
          {anterior && (
            <img
              className={styles.image}
              src={imagemEscolha(anterior, 1280)}
              srcSet={fontesImagem(anterior)}
              sizes={tamanhosImagem}
              width="1280"
              height="720"
              alt=""
              aria-hidden="true"
            />
          )}
          <img
            key={`${exibida.ambiente}-${exibida.material}`}
            className={`${styles.image} ${anterior ? styles.entering : ""}`}
            data-escolha={`${exibida.ambiente}-${exibida.material}`}
            src={imagemEscolha(exibida, 1280)}
            srcSet={fontesImagem(exibida)}
            sizes={tamanhosImagem}
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            alt={`${nomeEscolha(exibida)}. Imagem ilustrativa gerada por IA.`}
            onAnimationEnd={onFadeEnd}
          />
        </div>
        <figcaption className={styles.caption}>
          <span role="status" aria-live="polite">
            {carregando
              ? `Carregando ${nomeEscolha(escolha)}...`
              : erro
                ? "Esta imagem não carregou. Toque na escolha para tentar novamente."
                : nomeEscolha(exibida)}
          </span>
        </figcaption>
      </figure>
      <div className={styles.footer}>
        <a
          className="button"
          href={orcamentoConfigurador(exibida, materialContext)}
        >
          Pedir orçamento desta pedra
        </a>
        <p>Materiais e acabamentos a confirmar com a JK.</p>
      </div>
    </>
  );
}
