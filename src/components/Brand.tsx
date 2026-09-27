import { conteudo } from '@/content';
import { texto } from '@/lib/site';

export function Brand({ footer = false }: { footer?: boolean }) {
  // JPEG da cliente recortado e convertido em WebP 480 px; suficiente para 2x.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/jk-logo-480.webp" srcSet="/brand/jk-logo-288.webp 288w, /brand/jk-logo-480.webp 480w" sizes={footer ? '(max-width: 700px) 180px, 210px' : '(max-width: 800px) 120px, 144px'} width={480} height={296} alt={texto(conteudo.empresa.nome)} className="brand-image" loading={footer ? 'lazy' : 'eager'} />;
}
