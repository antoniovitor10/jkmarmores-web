"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./Configurador.module.css";

export function Drawer({
  summary,
  children,
}: {
  summary: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false),
    [desktop, setDesktop] = useState(false),
    [height, setHeight] = useState(0);
  const body = useRef<HTMLDivElement>(null),
    start = useRef(0),
    dragged = useRef(false);
  const id = useId();
  useEffect(() => {
    const media = matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!body.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize[0].blockSize),
    );
    observer.observe(body.current);
    return () => observer.disconnect();
  }, []);
  return (
    <aside
      className={styles.sheet}
      data-open={open}
      data-controls
      aria-label="Escolher pedra e ambiente"
      style={{ "--drawer-reveal": `${height}px` } as CSSProperties}
    >
      <button
        className={styles.handle}
        type="button"
        aria-expanded={open || desktop}
        aria-controls={id}
        onPointerDown={(event) => {
          start.current = event.clientY;
          dragged.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const delta = event.clientY - start.current;
          if (Math.abs(delta) > 24) {
            dragged.current = true;
            setOpen(delta < 0);
          }
        }}
        onClick={(event) => {
          if (!dragged.current || event.detail === 0) setOpen(!open);
          dragged.current = false;
        }}
      >
        <span aria-hidden="true" />
        {open ? "Recolher ajustes" : "Ambiente e acabamento"}
      </button>
      <div className={styles.summary}>{summary}</div>
      <div
        ref={body}
        id={id}
        className={styles.sheetBody}
        inert={!open && !desktop}
        aria-hidden={!open && !desktop}
      >
        {children}
      </div>
    </aside>
  );
}
