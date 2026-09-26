"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Material } from "@/lib/types";
import type { StoneSceneProps, StoneSelection } from "@/lib/stone";
import styles from "./StoneScene.module.css";

type Option = { slug: string; nome: string; tipo: Material["tipo"]; acabamentos: { slug: string; nome: string }[]; demonstracao: boolean };
type Runtime = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  stone: THREE.MeshStandardMaterial;
  cozinha: THREE.Group;
  lavatorio: THREE.Group;
  luz: THREE.DirectionalLight;
  texture?: THREE.Texture;
  draw: () => void;
};

const demoFinishes = [
  { slug: "polido", nome: "Polido (simulação)" },
  { slug: "levigado", nome: "Levigado (simulação)" },
  { slug: "escovado", nome: "Escovado (simulação)" },
];

const demoOptions: Option[] = [
  { slug: "amostra-marmore", nome: "Amostra de mármore", tipo: "marmore", acabamentos: demoFinishes, demonstracao: true },
  { slug: "amostra-granito", nome: "Amostra de granito", tipo: "granito", acabamentos: demoFinishes, demonstracao: true },
  { slug: "amostra-quartzito", nome: "Amostra de quartzito", tipo: "quartzito", acabamentos: demoFinishes, demonstracao: true },
];

const textureByType: Partial<Record<Material["tipo"], string>> = {
  marmore: "/3d/textures/amostra-marmore.webp",
  granito: "/3d/textures/amostra-granito.webp",
  quartzito: "/3d/textures/amostra-quartzito.webp",
};

function finishRoughness(slug: string) {
  if (/polid/i.test(slug)) return 0.15;
  if (/levig|acetinad/i.test(slug)) return 0.48;
  if (/escov|flamead/i.test(slug)) return 0.83;
  return 0.5;
}

function addBox(group: THREE.Group, width: number, height: number, depth: number, x: number, y: number, z: number, material: THREE.Material | THREE.Material[]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
}

function makeStage(canvas: HTMLCanvasElement, mode: StoneSceneProps["mode"]): Runtime {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.7;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e8e5df");
  const aspect = Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1);
  const extent = mode === "chapa" ? 2.7 : 3.3;
  const camera = new THREE.OrthographicCamera(-extent * aspect, extent * aspect, extent, -extent, 0.1, 40);
  camera.position.set(mode === "chapa" ? 3 : 5, mode === "chapa" ? 4.2 : 4.5, mode === "chapa" ? 5 : 6);
  camera.lookAt(0, mode === "chapa" ? 0.1 : 0.8, 0);

  const ambient = new THREE.HemisphereLight("#ffffff", "#aaa29a", 2.4);
  scene.add(ambient);
  const luz = new THREE.DirectionalLight("#ffffff", 3.2);
  luz.position.set(-2.5, 5, 3.5);
  scene.add(luz);

  const stone = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.45, metalness: 0 });
  const edge = new THREE.MeshStandardMaterial({ color: "#918b84", roughness: 0.65 });
  const cabinet = new THREE.MeshStandardMaterial({ color: "#b5afa5", roughness: 0.9 });
  const wall = new THREE.MeshStandardMaterial({ color: "#d4d0c8", roughness: 1 });
  const sink = new THREE.MeshStandardMaterial({ color: "#f2f0eb", roughness: 0.6 });
  const floor = new THREE.MeshStandardMaterial({ color: "#cec9c0", roughness: 1 });
  const slabFaces = [edge, edge, stone, edge, edge, edge];

  const cozinha = new THREE.Group();
  const lavatorio = new THREE.Group();
  scene.add(cozinha, lavatorio);

  if (mode === "ambiente") {
    addBox(cozinha, 5.2, 3.4, 0.12, 0, 1.5, -0.85, wall);
    addBox(cozinha, 5.2, 0.12, 3.4, 0, -0.24, 0.55, floor);
    for (const x of [-1.35, 0, 1.35]) addBox(cozinha, 1.27, 1.35, 1.15, x, 0.52, 0.05, cabinet);
    addBox(cozinha, 4.35, 0.2, 1.45, 0, 1.3, 0.05, slabFaces);
    addBox(cozinha, 4.35, 0.44, 0.1, 0, 1.62, -0.63, slabFaces);

    addBox(lavatorio, 4.3, 3.4, 0.12, 0, 1.5, -0.75, wall);
    addBox(lavatorio, 4.3, 0.12, 2.9, 0, -0.24, 0.4, floor);
    addBox(lavatorio, 2.6, 1.08, 1.15, 0, 0.56, 0.12, cabinet);
    addBox(lavatorio, 3.1, 0.18, 1.45, 0, 1.22, 0.12, slabFaces);
    addBox(lavatorio, 0.9, 0.15, 0.62, 0, 1.39, -0.02, sink);
  } else {
    addBox(cozinha, 4.6, 0.13, 3.2, 0, -0.36, 0, floor);
    addBox(cozinha, 3.8, 0.22, 2.6, 0, 0, 0, slabFaces);
    addBox(cozinha, 4.6, 2.7, 0.08, 0, 0.9, -1.75, wall);
  }

  const draw = () => renderer.render(scene, camera);
  return { renderer, scene, camera, stone, cozinha, lavatorio, luz, draw };
}

function disposeStage(stage: Runtime) {
  stage.texture?.dispose();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  stage.scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  stage.renderer.dispose();
}

export default function StoneScene({ mode, materialSlug, materials, onSelectionChange, onQuoteRequest }: StoneSceneProps) {
  const options = useMemo<Option[]>(() => {
    const confirmed = materials.filter((item) => item.confirmado && typeof item.nome === "string");
    if (!confirmed.length) return demoOptions;
    return confirmed.map((item) => ({
      slug: item.slug,
      nome: item.nome as string,
      tipo: item.tipo,
      acabamentos: item.acabamentos.filter((finish) => typeof finish.nome === "string").map((finish) => ({ slug: finish.slug, nome: finish.nome as string })),
      demonstracao: false,
    }));
  }, [materials]);

  const [selectedSlug, setSelectedSlug] = useState("");
  const [finish, setFinish] = useState("");
  const [ambiente, setAmbiente] = useState(mode === "chapa" ? "chapa" : "cozinha");
  const [angle, setAngle] = useState(0);
  const [light, setLight] = useState(0);
  const [gate, setGate] = useState<"checking" | "ready" | "manual">("checking");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reason, setReason] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const generationRef = useRef(0);
  const rafRef = useRef(0);
  const readyRef = useRef(false);
  const testedRef = useRef(false);
  const slug = selectedSlug || materialSlug || options[0]?.slug || "";
  const option = options.find((item) => item.slug === slug) || options[0];
  const finishes = option?.acabamentos.length ? option.acabamentos : demoFinishes;
  const finishSlug = finishes.some((item) => item.slug === finish) ? finish : finishes[0]?.slug || "";
  const currentFinish = finishes.find((item) => item.slug === finishSlug);
  const canQuote = !!option && !option.demonstracao && !!option.acabamentos.length && !!currentFinish;
  const posterSuffix = !option?.demonstracao ? "-neutro" : option.tipo === "marmore" ? "" : option.tipo === "granito" || option.tipo === "quartzito" ? `-${option.tipo}` : "-neutro";
  const posterMode = mode === "ambiente" && ambiente === "lavatorio" ? "lavatorio" : mode;
  const finishSuffix = /levig|acetinad/i.test(finishSlug) ? "-levigado" : /escov|flamead/i.test(finishSlug) ? "-escovado" : "";
  const poster = `/3d/poster-${posterMode}${posterSuffix}${finishSuffix}.webp`;

  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const weak = (typeof memory === "number" && memory <= 2) || (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setGate(weak || reduced ? "manual" : "ready");
      if (weak || reduced) setReason(weak ? "Este aparelho usa a prévia estática por padrão." : "Movimento reduzido: a prévia estática está ativa.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!option || !finishSlug || option.demonstracao || !option.acabamentos.length) return;
    onSelectionChange({ materialSlug: option.slug, acabamento: finishSlug, ambiente });
  }, [option, finishSlug, ambiente, onSelectionChange]);

  useEffect(() => {
    if (gate !== "ready" || failed || !canvasRef.current) return;
    const canvas = canvasRef.current;
    let stage: Runtime;
    try {
      performance.mark(`stone-scene-${mode}-start`);
      stage = makeStage(canvas, mode);
    } catch {
      const timer = window.setTimeout(() => {
        setFailed(true);
        setReason("A visualização 3D não está disponível neste navegador.");
      }, 0);
      return () => window.clearTimeout(timer);
    }
    runtimeRef.current = stage;
    const resize = new ResizeObserver(() => {
      if (!canvas.clientWidth || !canvas.clientHeight) return;
      const aspect = canvas.clientWidth / canvas.clientHeight;
      const extent = mode === "chapa" ? 2.7 : 3.3;
      stage.camera.left = -extent * aspect;
      stage.camera.right = extent * aspect;
      stage.camera.updateProjectionMatrix();
      stage.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      stage.draw();
    });
    resize.observe(canvas);
    const lost = (event: Event) => {
      event.preventDefault();
      setReady(false);
      setFailed(true);
      setReason("A visualização 3D foi interrompida; a prévia estática continua disponível.");
    };
    canvas.addEventListener("webglcontextlost", lost, false);
    return () => {
      resize.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      // A geração corrente precisa ser invalidada para descartar carregamentos atrasados.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      generationRef.current++;
      cancelAnimationFrame(rafRef.current);
      if (runtimeRef.current === stage) runtimeRef.current = null;
      disposeStage(stage);
    };
  }, [gate, failed, mode]);

  useEffect(() => {
    const stage = runtimeRef.current;
    if (!stage || !option) return;
    const id = ++generationRef.current;
    stage.cozinha.visible = mode === "chapa" || ambiente === "cozinha";
    stage.lavatorio.visible = mode === "ambiente" && ambiente === "lavatorio";
    stage.stone.roughness = finishRoughness(finishSlug);
    stage.stone.needsUpdate = true;
    stage.luz.position.set(-2.5 + light * 1.2, mode === "chapa" ? 1.5 : 5, 3.5);
    const a = angle * Math.PI / 180;
    const radius = mode === "chapa" ? 6.2 : 7.7;
    stage.camera.position.set(Math.sin(a + 0.7) * radius, mode === "chapa" ? 4.2 : 4.5, Math.cos(a + 0.7) * radius);
    stage.camera.lookAt(0, mode === "chapa" ? 0.1 : 0.8, 0);

    const firstDraw = () => {
      if (generationRef.current !== id) return;
      stage.draw();
      if (!readyRef.current) {
        readyRef.current = true;
        performance.mark(`stone-scene-${mode}-first-frame`);
        performance.measure(`stone-scene-${mode}-time-to-frame`, `stone-scene-${mode}-start`, `stone-scene-${mode}-first-frame`);
        setReady(true);
        if (!testedRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          testedRef.current = true;
          const intervals: number[] = [];
          let previous = 0;
          const start = performance.now();
          const sample = (now: number) => {
            if (generationRef.current !== id) return;
            if (previous) intervals.push(now - previous);
            previous = now;
            stage.draw();
            if (now - start < 2000) rafRef.current = requestAnimationFrame(sample);
            else if (intervals.length > 20) {
              intervals.sort((a, b) => a - b);
              const fps = 1000 / intervals[Math.floor(intervals.length / 2)];
              performance.mark(`stone-scene-${mode}-fps-${Math.round(fps)}`);
              if (fps < 24) {
                setReady(false);
                setFailed(true);
                setReason("A prévia estática foi ativada para manter a página fluida.");
              }
            }
          };
          rafRef.current = requestAnimationFrame(sample);
        }
      }
    };

    // Uma amostra CC0 do mesmo tipo de pedra não representa um material confirmado.
    const textureUrl = option.demonstracao ? textureByType[option.tipo] : undefined;
    if (!textureUrl) {
      stage.texture?.dispose();
      stage.texture = undefined;
      stage.stone.map = null;
      stage.stone.color.set("#bdb9b2");
      firstDraw();
      return;
    }
    stage.stone.map = null;
    stage.stone.color.set("#bdb9b2");
    stage.stone.needsUpdate = true;
    stage.draw();
    new THREE.TextureLoader().load(textureUrl, (texture) => {
      if (generationRef.current !== id || runtimeRef.current !== stage) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(stage.renderer.capabilities.getMaxAnisotropy(), 4);
      stage.texture?.dispose();
      stage.texture = texture;
      stage.stone.map = texture;
      stage.stone.color.set("#ffffff");
      stage.stone.needsUpdate = true;
      firstDraw();
    }, undefined, () => {
      if (generationRef.current !== id) return;
      setReady(false);
      setFailed(true);
      setReason("A textura não carregou; a prévia estática continua disponível.");
    });
  }, [option, finishSlug, ambiente, angle, light, mode, gate, failed]);

  function retry() {
    testedRef.current = false;
    readyRef.current = false;
    setFailed(false);
    setReady(false);
    setGate("ready");
  }

  function quote() {
    if (!option || !canQuote) return;
    const selection: StoneSelection = { materialSlug: option.slug, acabamento: finishSlug, ambiente };
    onQuoteRequest(selection);
  }

  return <div className={styles.root}>
    <div className={styles.viewport}>
      {/* O poster já está comprimido e é servido como arquivo estático sem otimizador de imagens. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {!ready && <img className={styles.poster} src={poster} alt={mode === "chapa" ? "Ilustração estática de uma chapa de pedra com borda visível." : ambiente === "lavatorio" ? "Ilustração estática de uma bancada em lavatório." : "Ilustração estática de uma bancada em cozinha."} width="900" height="600" />}
      {gate === "ready" && !failed && <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />}
    </div>
    <p className={styles.notice}>Visualização ilustrativa com texturas CC0 provisórias. Não é obra nem amostra comercial da JK. Cor e acabamento reais devem ser confirmados.</p>
    <div className={styles.controls}>
      {mode === "ambiente" && <label>Ambiente ilustrado<select value={ambiente} onChange={(event) => setAmbiente(event.target.value)}><option value="cozinha">Cozinha</option><option value="lavatorio">Lavatório</option></select></label>}
      <label>Material ilustrado<select value={option?.slug || ""} onChange={(event) => setSelectedSlug(event.target.value)}>{options.map((item) => <option key={item.slug} value={item.slug}>{item.nome}{item.demonstracao ? " (demonstração)" : ""}</option>)}</select></label>
      <label>Acabamento visual<select value={finishSlug} onChange={(event) => setFinish(event.target.value)}>{finishes.map((item) => <option key={item.slug} value={item.slug}>{item.nome}</option>)}</select></label>
      <div className={styles.buttons} aria-label="Controles de visualização"><button type="button" disabled={!ready || failed} onClick={() => setAngle((value) => Math.max(-45, value - 15))}>Girar para a esquerda</button><button type="button" disabled={!ready || failed} onClick={() => setAngle((value) => Math.min(45, value + 15))}>Girar para a direita</button>{mode === "chapa" && <><button type="button" disabled={!ready || failed} onClick={() => setLight((value) => Math.max(-2, value - 1))}>Luz à esquerda</button><button type="button" disabled={!ready || failed} onClick={() => setLight((value) => Math.min(2, value + 1))}>Luz à direita</button></>}</div>
      <p className={styles.summary} aria-live="polite">{mode === "chapa" ? "Chapa ilustrativa" : ambiente === "cozinha" ? "Bancada em cozinha ilustrativa" : "Bancada em lavatório ilustrativo"}. {option?.nome || "Material a confirmar"}. {currentFinish?.nome || "Acabamento a confirmar"}. Borda reta ilustrativa.</p>
      {canQuote && <button type="button" onClick={quote}>Pedir orçamento desta combinação</button>}
      {!canQuote && <p>O pedido desta combinação ficará disponível após a confirmação dos materiais e acabamentos da JK.</p>}
      {(gate === "manual" || failed) && <div><p role="status">{reason}</p><button type="button" onClick={retry}>Tentar visualização 3D</button></div>}
    </div>
  </div>;
}
