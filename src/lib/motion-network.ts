export type MotionConnection = EventTarget & { saveData?: boolean; effectiveType?: string; downlink?: number };

// Usa apenas requisições críticas já concluídas. Nunca baixa um vídeo para testar a rede.
// Os timings também cobrem navegadores sem Network Information API e um "4g" otimista.
export function motionNetworkPolicy(connection?: MotionConnection) {
  const memory = typeof navigator === 'undefined' ? undefined : (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory <= 2) return "limited-device";
  if (connection?.saveData || /(^|-)2g|3g/.test(connection?.effectiveType ?? "") ||
      (connection?.downlink !== undefined && connection.downlink < 1.6)) return "slow-connection";
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const poster = performance.getEntriesByType("resource").find(entry => /\/img\/(capa-|material-detalhe-quente-)/.test(entry.name)) as PerformanceResourceTiming | undefined;
  let measured = false;
  for (const entry of [navigation, poster]) {
    if (!entry || entry.transferSize === 0) continue; // Cache não mede a conexão atual.
    measured = true;
    if (entry.responseStart - entry.startTime > 600) return "slow-response";
    const bodyMs = entry.responseEnd - entry.responseStart;
    if (entry.encodedBodySize >= 8192 && bodyMs > 400 && entry.encodedBodySize / bodyMs < 150 * 1024 / 1000) return "slow-response";
  }
  // Sem amostra nem informação de rede, o pôster é a alternativa conservadora.
  return connection || measured ? "allowed" : "unmeasured";
}
