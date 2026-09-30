'use client';

import { useRef, useState } from 'react';
import { ambientesConfigurador, materiaisConfigurador, escolhaInicial, imagemEscolha, fontesImagem, nomeEscolha, orcamentoConfigurador, type Escolha } from '@/content/configurador';

export function StoneSelector() {
  const [choice, setChoice] = useState<Escolha>(escolhaInicial);
  const [loading, setLoading] = useState(false);
  const request = useRef(0);
  async function select(next: Escolha) {
    const id = ++request.current;
    setLoading(true);
    const image = new Image();
    image.src = imagemEscolha(next, window.innerWidth < 720 ? 720 : 1280);
    try { await image.decode(); } catch { if (id === request.current) setLoading(false); return; }
    if (id !== request.current) return;
    setChoice(next);
    setLoading(false);
  }
  return <div className="stone-selector">
    <div className="selector-image" aria-busy={loading}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={`${choice.ambiente}-${choice.material}`} src={imagemEscolha(choice, 1280)} srcSet={fontesImagem(choice)} sizes="(max-width: 800px) 100vw, 70vw" width={1280} height={720} alt={`Imagem ilustrativa: ${nomeEscolha(choice)}. Não representa obra ou catálogo da JK.`} loading="lazy" />
      <span className="selector-caption" aria-live="polite">{loading ? 'Carregando referência…' : nomeEscolha(choice)}</span>
    </div>
    <div className="selector-controls">
      <fieldset><legend>Ambiente</legend>{ambientesConfigurador.map(item => <button key={item.id} type="button" aria-pressed={choice.ambiente === item.id} onClick={() => void select({...choice, ambiente:item.id})}>{item.nome}</button>)}</fieldset>
      <fieldset><legend>Tom da pedra</legend>{materiaisConfigurador.map(item => <button className="stone-swatch" key={item.id} type="button" aria-pressed={choice.material === item.id} onClick={() => void select({...choice, material:item.id})}><span data-tone={item.id} aria-hidden="true" />{item.nome}</button>)}</fieldset>
      <p>Materiais e acabamentos a confirmar com a JK.</p>
      <a className="button" href={orcamentoConfigurador(choice)}>Chamar no WhatsApp</a>
    </div>
  </div>;
}
