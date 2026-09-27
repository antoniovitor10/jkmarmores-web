'use client';
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import type { ConfiguradorProps } from './Configurador';
import styles from './Shell.module.css';

export function ConfiguradorLoader({ children, ...props }: ConfiguradorProps & { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const [Experience, setExperience] = useState<ComponentType<ConfiguradorProps> | null>(null);
  const [error, setError] = useState(false);
  async function activate() {
    if (pending.current) return;
    pending.current = true;
    try { const loaded = await import('./Experiencia'); setExperience(() => loaded.default); }
    catch { pending.current = false; setError(true); }
  }
  useEffect(() => {
    if (!root.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { void activate(); observer.disconnect(); }
    }, { rootMargin: '250px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={`${styles.root} ${props.compact ? styles.compact : styles.full}`} data-configurador onClick={event => { if ((event.target as HTMLElement).closest('[data-activate]')) void activate(); }}>
    {Experience ? <Experience {...props} /> : children}
    {error && !Experience && <p role="status">Não foi possível abrir a experiência. Use Explorar combinações para tentar novamente.</p>}
  </div>;
}
