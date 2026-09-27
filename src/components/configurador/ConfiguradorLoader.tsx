"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { ConfiguradorProps } from "./Configurador";
import styles from "./Shell.module.css";

export function ConfiguradorLoader({
  children,
  ...props
}: ConfiguradorProps & { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const experienceModule = useRef<Promise<
    typeof import("./Experiencia")
  > | null>(null);
  const [Experience, setExperience] =
    useState<ComponentType<ConfiguradorProps> | null>(null);
  const [error, setError] = useState(false);
  const loadExperience = useCallback(() => {
    return (experienceModule.current ??= import("./Experiencia").catch(
      (error) => {
        experienceModule.current = null;
        throw error;
      },
    ));
  }, []);
  const activate = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    try {
      const loaded = await loadExperience();
      setExperience(() => loaded.default);
    } catch {
      pending.current = false;
      setError(true);
    }
  }, [loadExperience]);
  useEffect(() => {
    const node = root.current;
    if (!node || !("IntersectionObserver" in window)) return;
    let disposed = false;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void activate();
          observer.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    const ahead = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        ahead.disconnect();
        void loadExperience()
          .then((loaded) => {
            if (!disposed)
              loaded.preloadInitialFrames(
                node.clientWidth,
                innerHeight * (props.compact ? 0.8 : 1),
              );
          })
          .catch(() => {}); // Activation can retry a failed speculative import.
      },
      { rootMargin: `${Math.round(innerHeight * 1.5)}px 0px` },
    );
    const start = () => {
      observer.observe(node);
      // Wait for the page load and idle time before preparing anything offscreen.
      if ("requestIdleCallback" in window)
        idle = window.requestIdleCallback(() => ahead.observe(node));
      else timer = setTimeout(() => ahead.observe(node), 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      disposed = true;
      window.removeEventListener("load", start);
      observer.disconnect();
      ahead.disconnect();
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [activate, loadExperience, props.compact]);
  return (
    <div
      ref={root}
      className={`${styles.root} ${props.compact ? styles.compact : styles.full}`}
      data-configurador
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("[data-activate]"))
          void activate();
      }}
    >
      {Experience ? <Experience {...props} /> : children}
      {error && !Experience && (
        <p role="status">
          Não foi possível abrir a experiência. Use Explorar combinações para
          tentar novamente.
        </p>
      )}
    </div>
  );
}
