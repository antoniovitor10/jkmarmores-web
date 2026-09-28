"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./HomeHero.module.css";

export function HeroScrub({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    void import("./hero-motion").then(({ mountHero }) => {
      if (!cancelled && root.current) dispose = mountHero(root.current);
    });
    return () => { cancelled = true; dispose(); };
  }, []);

  return <div ref={root} className={styles.track} data-motion="true">
    <noscript><style>{`.${styles.track}[data-motion] { height:auto; } .${styles.stage} { position:relative; }`}</style></noscript>
    <div className={styles.stage} data-hero-stage>
      {children}
      <div className={styles.progress} aria-hidden="true" />
    </div>
  </div>;
}
