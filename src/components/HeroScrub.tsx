import type { ReactNode } from "react";
import styles from "./HomeHero.module.css";

export function HeroScrub({ children }: { children: ReactNode }) {
  return <div className={styles.track}>
    <noscript><style>{`.${styles.track}[data-motion] { height:auto; } .${styles.stage} { position:relative; }`}</style></noscript>
    <div className={styles.stage} data-hero-stage>
      {children}
      <div className={styles.progress} aria-hidden="true" />
    </div>
  </div>;
}
