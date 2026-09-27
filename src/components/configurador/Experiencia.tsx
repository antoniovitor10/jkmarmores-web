'use client';

/* Native img elements swap local prerendered frames after activation. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ambientesConfigurador as ambientes, materiaisConfigurador as materiais, acabamentosConfigurador as acabamentos, quadroUrl, totalQuadros, orcamentoConfigurador, type AmbienteConfigurador, type MaterialConfigurador, type AcabamentoConfigurador } from '@/content/configurador';
import type { ConfiguradorProps } from './Configurador';
import styles from './Configurador.module.css';

const levels = [1, 1.5, 2, 2.5];
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
type Point = { x: number; y: number };
export default function Experiencia({ compact, materialContext }: ConfiguradorProps) {
  const [environment, setEnvironment] = useState<AmbienteConfigurador>('cozinha');
  const [material, setMaterial] = useState<MaterialConfigurador>('rosado');
  const [finish, setFinish] = useState<AcabamentoConfigurador>('polido');
  const [tab, setTab] = useState('Ambiente');
  const [frame, setFrame] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [detail, setDetail] = useState(false);
  const [source, setSource] = useState('');
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staticMode, setStaticMode] = useState(true);
  const [width, setWidth] = useState<720 | 1280>(720);
  const stage = useRef<HTMLDivElement>(null);
  const sceneViewport = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const drag = useRef({ x: 0, y: 0, frame: 0, pan: { x: 0, y: 0 }, distance: 0, zoom: 0, moved: false });
  const lastTap = useRef(0);
  const combo = `${environment}-${material}`;
  const envName = ambientes.find(item => item.id === environment)!.nome;
  const matName = materiais.find(item => item.id === material)!.nome;
  const finishItem = acabamentos.find(item => item.id === finish)!;
  const currentFrame = staticMode ? 0 : frame;
  const requested = quadroUrl(combo, currentFrame, zoom > 0 ? 2048 : width);
  const [displayed, setDisplayed] = useState({ combo: '', frame: 0 });

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    const update = () => { setStaticMode(media.matches || !!connection?.saveData); setWidth(innerWidth < 768 ? 720 : 1280); };
    update(); media.addEventListener('change', update); connection?.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); connection?.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = requested;
    img.decode().then(() => {
      if (cancelled) return;
      setSource(requested); setDisplayed({ combo, frame: currentFrame }); setFailed(false); setLoading(false);
      if (!staticMode) {
        // Only immediate angle neighbours; no full sequence or other combination download.
        for (const next of [currentFrame - 1, currentFrame + 1]) {
          if (next >= 0 && next < totalQuadros) new Image().src = quadroUrl(combo, next, width);
        }
      }
    }).catch(() => { if (!cancelled) { setFailed(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [requested, combo, currentFrame, staticMode, width]);

  function reset() { setZoom(0); setPan({ x: 0, y: 0 }); }
  function changeCombo() { setFrame(0); reset(); setLoading(true); setFailed(false); }
  function changeZoom(next: number) { setZoom(clamp(next, 0, levels.length - 1)); setPan({ x: 0, y: 0 }); }
  function rotate(delta: number) { if (!staticMode) { setFrame(value => clamp(value + delta, 0, totalQuadros - 1)); } }
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && document.activeElement !== node) return;
      event.preventDefault();
      setZoom(value => clamp(value + (event.deltaY < 0 ? 1 : -1), 0, levels.length - 1));
      setPan({ x: 0, y: 0 });
    };
    node.addEventListener('wheel', wheel, { passive: false });
    return () => node.removeEventListener('wheel', wheel);
  }, []);
  function down(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button,a,aside')) return;
    if (event.pointerType === 'mouse') event.currentTarget.focus({ preventScroll: true });
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    const pair = [...pointers.current.values()];
    drag.current = { x: event.clientX, y: event.clientY, frame, pan, distance: pair.length === 2 ? Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y) : 0, zoom, moved: false };
  }
  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const pair = [...pointers.current.values()];
    if (pair.length === 2 && drag.current.distance) {
      const distance = Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y);
      changeZoom(drag.current.zoom + Math.round(Math.log2(distance / drag.current.distance) * 2));
      drag.current.moved = true; return;
    }
    const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 8) drag.current.moved = true;
    if (zoom) {
      const box = (sceneViewport.current ?? event.currentTarget).getBoundingClientRect();
      const maxX = box.width * (levels[zoom] - 1) / 2, maxY = box.height * (levels[zoom] - 1) / 2;
      setPan({ x: clamp(drag.current.pan.x + dx, -maxX, maxX), y: clamp(drag.current.pan.y + dy, -maxY, maxY) });
    } else if (!staticMode && Math.abs(dx) > Math.abs(dy)) {
      setFrame(clamp(drag.current.frame - Math.round(dx / 12), 0, totalQuadros - 1));
    }
  }
  function up(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);
    if (event.type === 'pointercancel') { lastTap.current = 0; return; }
    if (!drag.current.moved) {
      const now = Date.now();
      if (now - lastTap.current < 400) { changeZoom(zoom ? 0 : 2); lastTap.current = 0; }
      else lastTap.current = now;
    }
    if (pointers.current.size) { const p = [...pointers.current.values()][0]; drag.current = { ...drag.current, x:p.x, y:p.y, pan, frame, distance:0, moved:true }; }
  }
  const sameCombo = displayed.combo === combo;
  return <div className={`${styles.root} ${compact ? styles.compact : ''}`}>
    <div className={styles.controls}>
      <div className={styles.tabs} aria-label="Etapas da combinação">
        {['Ambiente', 'Material', 'Acabamento'].map((label, index) => <button key={label} type="button" aria-pressed={tab === label} onClick={() => setTab(label)}><span>0{index + 1}</span>{label}</button>)}
      </div>
      <div className={styles.options} role="group" aria-label={tab}>
        {tab === 'Ambiente' && ambientes.map(item => <button type="button" key={item.id} aria-pressed={item.id === environment} onClick={() => { setEnvironment(item.id); changeCombo(); }}><img src={`/configurador/${item.id}-rosado/thumb.avif`} alt="" width="72" height="48" />{item.nome}</button>)}
        {tab === 'Material' && materiais.map(item => <button type="button" key={item.id} aria-pressed={item.id === material} onClick={() => { setMaterial(item.id); changeCombo(); }}><img src={`/configurador/closes/${item.id}-polido.avif`} alt="" width="72" height="48" />{item.nome}</button>)}
        {tab === 'Acabamento' && acabamentos.map(item => <button type="button" key={item.id} aria-pressed={item.id === finish} onClick={() => { setFinish(item.id); setDetail(true); }}><img src={`/configurador/closes/${material}-${item.id}.avif`} alt="" width="72" height="48" />{item.nome}</button>)}
      </div>
    </div>
    <div ref={stage} className={styles.stage} tabIndex={0} role="group" aria-label="Palco da combinação. Use setas para mudar o ângulo, mais e menos para zoom; Escape para reenquadrar." style={{ touchAction: zoom ? 'none' : 'pan-y' }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Escape','Home','End'].includes(event.key)) event.preventDefault();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        if (zoom) { const limit = (sceneViewport.current ?? event.currentTarget).clientWidth * (levels[zoom] - 1) / 2; setPan(p => ({ ...p, x:clamp(p.x - direction * 40, -limit, limit) })); }
        else rotate(direction);
      }
      if (zoom && ['ArrowUp','ArrowDown'].includes(event.key)) { const limit = (sceneViewport.current ?? event.currentTarget).clientHeight * (levels[zoom] - 1) / 2; setPan(p => ({ ...p, y:clamp(p.y + (event.key === 'ArrowUp' ? 40 : -40), -limit, limit) })); }
      if (event.key === '+' || event.key === '=') changeZoom(zoom + 1);
      if (event.key === '-') changeZoom(zoom - 1);
      if (event.key === 'Escape') { reset(); setDetail(false); }
      if (!staticMode && event.key === 'Home') setFrame(0);
      if (!staticMode && event.key === 'End') setFrame(totalQuadros - 1);
    }}>
      <div ref={sceneViewport} className={styles.sceneViewport}>{source && sameCombo && <img className={styles.scene} src={source} alt={`${envName} com referência ilustrativa de ${matName.toLowerCase()}.`} draggable={false} width="1280" height="720" style={{ transform:`translate(${pan.x}px, ${pan.y}px) scale(${levels[zoom]})` }} />}</div>
      {(!sameCombo || loading || failed) && <div className={styles.loadMessage} role="status">{failed ? 'Não foi possível carregar esta vista. Escolha outra combinação ou tente novamente.' : 'Preparando o ambiente…'}</div>}
      <div className={styles.topline}><span>{envName}<br /><strong>{matName}</strong></span><span>{staticMode ? 'Vista estática' : `Ângulo ${String((sameCombo ? displayed.frame : 0) + 1).padStart(2,'0')} / ${totalQuadros}`}<br />Zoom {levels[zoom].toFixed(1).replace('.',',')}×</span></div>
      <button className={`${styles.arrow} ${styles.previous}`} type="button" aria-label="Ângulo anterior" disabled={staticMode || frame === 0} onClick={() => rotate(-1)}><span className={styles.chevron} aria-hidden="true" /></button>
      <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label="Próximo ângulo" disabled={staticMode || frame === totalQuadros - 1} onClick={() => rotate(1)}><span className={styles.chevron} aria-hidden="true" /></button>
      <div className={styles.zoomControls} aria-label="Controles de aproximação"><button type="button" aria-label="Diminuir zoom" disabled={!zoom} onClick={() => changeZoom(zoom - 1)}>−</button><button type="button" aria-label="Aumentar zoom" disabled={zoom === levels.length - 1} onClick={() => changeZoom(zoom + 1)}>+</button><button type="button" onClick={reset}>Reenquadrar</button></div>
      {detail && <aside className={styles.detail} aria-label="Detalhe do acabamento"><img src={`/configurador/closes/${material}-${finish}.avif`} width="720" height="405" alt={`Referência ilustrativa de superfície ${finishItem.nome.toLowerCase()} em ${matName.toLowerCase()}.`} /><div><strong>{finishItem.nome}</strong><button type="button" onClick={() => setDetail(false)}>Fechar detalhe</button><p>{finishItem.descricao} O palco mantém a vista polida; compare o acabamento neste detalhe.</p></div></aside>}
      <div className={styles.bottomline}><button className={styles.finishLink} type="button" aria-expanded={detail} onClick={() => setDetail(!detail)}>Ver detalhe: {finishItem.nome}</button><a className={styles.quote} href={orcamentoConfigurador(envName, matName, finishItem.nome, materialContext)}>Pedir orçamento desta combinação</a></div>
    </div>
    <div className={styles.caption}><p>Visualização ilustrativa, gerada por IA.</p><p>{staticMode ? 'Movimento reduzido ou economia de dados: prévia estática.' : 'Arraste ou use as setas para explorar o arco disponível.'} {zoom ? 'Arraste para mover o detalhe.' : 'Duplo toque para aproximar.'}</p></div>
    <p className={styles.disclaimer}>Referências de cor e acabamento, não amostras do catálogo. Confirme com a JK materiais, aplicações e disponibilidade.{compact && ' Esta simulação não representa o material desta página.'}</p>
    <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{envName}, {matName}, {finishItem.nome}. {staticMode ? 'Vista estática.' : `Ângulo ${displayed.frame + 1} de ${totalQuadros}.`} Zoom {levels[zoom]} vezes.</p>
  </div>;
}
