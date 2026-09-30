"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from 'react';
import { asset } from '@/lib/base-path';
import { ambientesConfigurador, materiaisConfigurador, orcamentoConfigurador, type Escolha, nomeEscolha } from '@/content/configurador';
import { motionNetworkPolicy, type MotionConnection } from '@/lib/motion-network';

export function OrbitRoom() {
  const [choice, setChoice] = useState<Escolha>({ ambiente: 'cozinha', material: 'bege' });
  const [shown, setShown] = useState<Escolha>(choice);
  const [angle, setAngle] = useState(0);
  const [status, setStatus] = useState('');
  const [canOrbit, setCanOrbit] = useState(false);
  const node = useRef<HTMLImageElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const generation = useRef(0);
  const sequence = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);
  const drag = useRef<{ x: number; angle: number } | null>(null);
  const src = (value: Escolha, frame: number, width = 720) => asset(`/configurador/${value.ambiente}-${value.material}/${width}/${String(frame).padStart(2, '0')}.avif`);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: MotionConnection }).connection;
    let cancelled = false;
    generation.current++;
    const update = () => {
      const allowed = !reduced.matches && motionNetworkPolicy(connection) === 'allowed';
      setCanOrbit(allowed);
    };
    const prepare = () => {
    update();
    reduced.addEventListener('change', update);
    connection?.addEventListener('change', update);
    const width = innerWidth <= 700 ? 720 : 1280;
    const image = new Image();
    image.src = src(choice, 0, width);
    image.decode().then(() => {
      if (cancelled) return;
      setShown(choice); setAngle(0); current.current = 0;
      if (node.current) node.current.src = image.src;
      setStatus('');
      const allowed = !reduced.matches && motionNetworkPolicy(connection) === 'allowed';
      sequence.current = [image];
      if (!allowed) return;
      // Decode only the first view now; neighbour frames load on demand.
    }).catch(() => { if (!cancelled) setStatus('A imagem não carregou. Escolha outro tom para tentar novamente.'); });
    };
    const observer = new IntersectionObserver(entries => { if(entries.some(entry => entry.isIntersecting)) { observer.disconnect(); prepare(); } }, { rootMargin: '200px 0px' });
    if(root.current) observer.observe(root.current);
    return () => { observer.disconnect(); cancelled = true; reduced.removeEventListener('change', update); connection?.removeEventListener('change', update); sequence.current = []; };
  }, [choice]);
  const rotate = (frame: number) => {
    if (!canOrbit) return;
    const index = ((frame % 24) + 24) % 24;
    const version = generation.current;
    current.current = index;
    const width = innerWidth <= 700 ? 720 : 1280;
    let image = sequence.current[index];
    if (!image) {
      image = new Image(); image.src = src(shown, index, width); sequence.current[index] = image;
    }
    const display = () => { if (version === generation.current && current.current === index && node.current) { node.current.src = image.src; setAngle(index); } };
    if (image.complete && image.naturalWidth) display();
    else void image.decode().then(display).catch(() => setStatus('Esta vista não carregou. Tente girar novamente.'));
    for (const offset of [-1, 1]) {
      const neighbour = (index + offset + 24) % 24;
      if (!sequence.current[neighbour]) { const preload = new Image(); preload.src = src(shown, neighbour, width); sequence.current[neighbour] = preload; }
    }
  };
  const select = (value: Escolha) => { setStatus('Carregando referência…'); setChoice(value); };
  return <div ref={root} className="orbit-room">
    <div className="orbit-view" onPointerDown={event => {
      if (!canOrbit || (event.pointerType === 'mouse' && event.button !== 0)) return;
      drag.current = { x: event.clientX, angle: current.current }; event.currentTarget.setPointerCapture(event.pointerId);
    }} onPointerMove={event => {
      if (drag.current) rotate(drag.current.angle + Math.round((event.clientX - drag.current.x) / 15));
    }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <img ref={node} src={src(shown, 0)} width="1280" height="720" loading="lazy" decoding="async" alt={`${nomeEscolha(shown)}. Ambiente ilustrativo gerado por IA.`} />
      <div className="orbit-description"><span>{nomeEscolha(shown)}</span><span>{canOrbit ? 'Arraste para mudar o olhar' : 'Referência do ambiente'}</span></div>
      {canOrbit && <div className="orbit-directions"><button type="button" onClick={() => rotate(current.current - 1)} aria-label="Girar ambiente para a esquerda">Anterior</button><button type="button" onClick={() => rotate(current.current + 1)} aria-label="Girar ambiente para a direita">Próximo</button></div>}
    </div>
    <div className="orbit-toolbar">
      <fieldset><legend>Ambiente</legend><div>{ambientesConfigurador.map(item => <button type="button" key={item.id} aria-pressed={choice.ambiente === item.id} onClick={() => select({ ...choice, ambiente: item.id })}>{item.nome}</button>)}</div></fieldset>
      <fieldset><legend>Tom da pedra</legend><div>{materiaisConfigurador.map(item => <button type="button" key={item.id} aria-pressed={choice.material === item.id} onClick={() => select({ ...choice, material: item.id })}>{item.nome}</button>)}</div></fieldset>
      <a className="button" href={orcamentoConfigurador(shown)}>Chamar no WhatsApp</a>
    </div>
    <p className="orbit-note">Materiais e acabamentos a confirmar com a JK.</p>
    <p className="orbit-status" role="status" aria-live="polite">{status}<span className="sr-only">Ângulo {angle + 1} de 24.</span></p>
  </div>;
}
