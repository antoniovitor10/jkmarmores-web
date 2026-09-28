"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { Escolha } from "@/content/configurador";
import type { ConfiguradorProps } from "./Configurador";
import styles from "./Configurador.module.css";
export function ConfiguradorLoader({
  children,
  initialChoice: defaultChoice,
  ...props
}: ConfiguradorProps & { children: ReactNode; initialChoice: Escolha }) {
  const root = useRef<HTMLDivElement>(null),
    pending = useRef(false);
  const [initialChoice, setInitialChoice] = useState(defaultChoice);
  const [Selector, setSelector] = useState<ComponentType<
    ConfiguradorProps & { initialChoice: Escolha }
  > | null>(null);
  const [error, setError] = useState(false);
  const activate = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    try {
      const loaded = await import("./Seletor");
      setSelector(() => loaded.default);
    } catch {
      pending.current = false;
      setError(true);
    }
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void activate();
          observer.disconnect();
        }
      },
      { rootMargin: `${Math.round(innerHeight)}px 0px` },
    );
    const start = () => observer.observe(node);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("load", start);
    };
  }, [activate]);
  return (
    <div
      ref={root}
      className={styles.root}
      data-configurador
      onClick={(event) => {
        if (Selector) return;
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
          "button",
        );
        if (!button) return;
        setInitialChoice((previous) => ({
          ambiente:
            (button.dataset.ambiente as Escolha["ambiente"]) ||
            previous.ambiente,
          material:
            (button.dataset.material as Escolha["material"]) ||
            previous.material,
        }));
        void activate();
      }}
    >
      {Selector ? (
        <Selector {...props} initialChoice={initialChoice} />
      ) : (
        children
      )}
      {error && !Selector && (
        <p role="status">
          Não foi possível ativar as escolhas. Toque em um botão para tentar
          novamente.
        </p>
      )}
    </div>
  );
}
