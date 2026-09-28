"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as PointerReactEvent,
  type RefObject,
} from "react";
import { motionDuration, motionEase } from "./motion";
export type Camera = { position: number; zoom: number; x: number; y: number };
export const limit = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
export function useCamera(
  stageRef: RefObject<HTMLElement | null>,
  staticMode: boolean,
  onInteract: () => void,
  frameCount: number,
) {
  const [view, setView] = useState<Camera>({
    position: 0,
    zoom: 1,
    x: 0,
    y: 0,
  });
  const current = useRef(view),
    animation = useRef(0),
    pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef({
    x: 0,
    y: 0,
    previousX: 0,
    time: 0,
    speed: 0,
    view,
    distance: 0,
    moved: false,
    midX: 0,
    midY: 0,
  });
  const lastTap = useRef(0);
  const bounds = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const measure = useCallback(() => {
    const box = stageRef.current
      ?.querySelector("canvas")
      ?.getBoundingClientRect();
    if (box) bounds.current = box;
    return bounds.current;
  }, [stageRef]);
  useEffect(() => {
    const node = stageRef.current?.querySelector("canvas");
    if (!node) return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure, stageRef]);
  const stop = useCallback(() => {
    cancelAnimationFrame(animation.current);
    animation.current = 0;
  }, []);
  const update = useCallback((next: Camera) => {
    const box = bounds.current;
    const zoom = limit(next.zoom, 1, 2.6);
    const bounded = {
      ...next,
      position: limit(next.position, 0, 1),
      zoom,
      x: limit(
        next.x,
        (-(box?.width ?? 0) * (zoom - 1)) / 2,
        ((box?.width ?? 0) * (zoom - 1)) / 2,
      ),
      y: limit(
        next.y,
        (-(box?.height ?? 0) * (zoom - 1)) / 2,
        ((box?.height ?? 0) * (zoom - 1)) / 2,
      ),
    };
    current.current = bounded;
    setView(bounded);
  }, []);
  const glide = useCallback(
    (target: Camera, duration?: number, coast = false) => {
      stop();
      target = { ...target, position: limit(target.position, 0, 1) };
      const node = stageRef.current;
      const ms =
        duration ?? (node ? motionDuration(node, "--dur-state", 200) : 200);
      const curve = coast
        ? (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
        : node
          ? motionEase(node)
          : (t: number) => t;
      const from = current.current,
        start = performance.now();
      const tick = (time: number) => {
        const t = limit((time - start) / ms, 0, 1),
          ease = curve(t);
        update({
          position: from.position + (target.position - from.position) * ease,
          zoom: from.zoom + (target.zoom - from.zoom) * ease,
          x: from.x + (target.x - from.x) * ease,
          y: from.y + (target.y - from.y) * ease,
        });
        if (t < 1) animation.current = requestAnimationFrame(tick);
      };
      if (staticMode) update(target);
      else animation.current = requestAnimationFrame(tick);
    },
    [staticMode, stop, update, stageRef],
  );
  const zoomAt = useCallback(
    (zoom: number, clientX?: number, clientY?: number, smooth = true) => {
      const box = measure();
      const old = current.current,
        z = limit(zoom, 1, 2.6),
        px = (clientX ?? box.left + box.width / 2) - box.left - box.width / 2,
        py = (clientY ?? box.top + box.height / 2) - box.top - box.height / 2;
      const next = {
        ...old,
        zoom: z,
        x: px - ((px - old.x) * z) / old.zoom,
        y: py - ((py - old.y) * z) / old.zoom,
      };
      if (smooth)
        glide(
          next,
          stageRef.current
            ? motionDuration(stageRef.current, "--dur-sheet", 320)
            : 320,
        );
      else update(next);
    },
    [glide, stageRef, update, measure],
  );
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-controls]")) return;
      if (!e.ctrlKey && document.activeElement !== el) return;
      e.preventDefault();
      onInteract();
      stop();
      zoomAt(
        current.current.zoom * Math.exp(-e.deltaY * 0.0015),
        e.clientX,
        e.clientY,
        false,
      );
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [onInteract, stageRef, stop, zoomAt]);
  useEffect(() => stop, [stop]);
  useEffect(() => {
    if (staticMode) stop();
  }, [staticMode, stop]);
  function down(e: PointerReactEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("button,a,aside,nav,[data-controls]"))
      return;
    measure();
    onInteract();
    stop();
    if (e.pointerType === "mouse")
      e.currentTarget.focus({ preventScroll: true });
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    const pair = [...pointers.current.values()];
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      previousX: e.clientX,
      time: performance.now(),
      speed: 0,
      view: current.current,
      distance:
        pair.length === 2
          ? Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y)
          : 0,
      moved: false,
      midX: pair.length === 2 ? (pair[0].x + pair[1].x) / 2 : 0,
      midY: pair.length === 2 ? (pair[0].y + pair[1].y) / 2 : 0,
    };
  }
  function move(e: PointerReactEvent<HTMLElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pair = [...pointers.current.values()];
    const d = drag.current,
      box = bounds.current;
    if (pair.length === 2 && d.distance) {
      const z = limit(
        (d.view.zoom *
          Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y)) /
          d.distance,
        1,
        2.6,
      );
      const px = d.midX - box.left - box.width / 2,
        py = d.midY - box.top - box.height / 2;
      update({
        ...d.view,
        zoom: z,
        x:
          px -
          ((px - d.view.x) * z) / d.view.zoom +
          (pair[0].x + pair[1].x) / 2 -
          d.midX,
        y:
          py -
          ((py - d.view.y) * z) / d.view.zoom +
          (pair[0].y + pair[1].y) / 2 -
          d.midY,
      });
      d.moved = true;
      return;
    }
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 7) d.moved = true;
    if (current.current.zoom > 1.01)
      update({ ...current.current, x: d.view.x + dx, y: d.view.y + dy });
    else if (!staticMode && Math.abs(dx) > Math.abs(dy)) {
      const now = performance.now();
      d.speed =
        (-(e.clientX - d.previousX) / Math.max(8, now - d.time) / box.width) *
        0.85;
      d.previousX = e.clientX;
      d.time = now;
      update({
        ...current.current,
        position: d.view.position - (dx / box.width) * 0.85,
      });
    }
  }
  function up(e: PointerReactEvent<HTMLElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    const d = drag.current;
    if (e.type === "pointercancel") {
      lastTap.current = 0;
      return;
    }
    if (pointers.current.size) {
      const p = [...pointers.current.values()][0];
      drag.current = {
        ...d,
        x: p.x,
        y: p.y,
        view: current.current,
        distance: 0,
        moved: true,
        speed: 0,
      };
      return;
    }
    if (!d.moved) {
      const now = Date.now();
      if (now - lastTap.current < 360) {
        zoomAt(current.current.zoom > 1.05 ? 1 : 1.6, e.clientX, e.clientY);
        lastTap.current = 0;
      } else lastTap.current = now;
    } else if (
      !staticMode &&
      current.current.zoom < 1.01 &&
      performance.now() - d.time < 100
    ) {
      const projected = limit(
        current.current.position + limit(d.speed, -0.003, 0.003) * 90,
        0,
        1,
      );
      const position =
        Math.round(projected * (frameCount - 1)) / (frameCount - 1);
      glide({ ...current.current, position }, 220, true);
    }
  }
  return { view, current, stop, glide, zoomAt, update, down, move, up };
}
