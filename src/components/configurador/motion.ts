export function motionDuration(node: Element, token: string, fallback: number) {
  const value = getComputedStyle(node).getPropertyValue(token).trim();
  return value
    ? parseFloat(value) * (value.endsWith("ms") ? 1 : 1000)
    : fallback;
}

// CSS cubic-bezier evaluated once per animation, with no layout reads per frame.
export function motionEase(
  node: Element,
  token = "--ease-move",
  fallback = [0.65, 0, 0.35, 1],
) {
  const match = getComputedStyle(node)
    .getPropertyValue(token)
    .match(/cubic-bezier\(([^)]+)\)/);
  const [x1, y1, x2, y2] = match ? match[1].split(",").map(Number) : fallback;
  const curve = (t: number, a: number, b: number) =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  return (progress: number) => {
    if (progress <= 0 || progress >= 1)
      return Math.max(0, Math.min(1, progress));
    let low = 0,
      high = 1,
      t = progress;
    for (let i = 0; i < 12; i++) {
      if (curve(t, x1, x2) < progress) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return curve(t, y1, y2);
  };
}
