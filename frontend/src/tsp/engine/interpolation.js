export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function lerpPoint(x1, y1, x2, y2, t) {
  const eased = easeInOut(t);
  return { x: lerp(x1, x2, eased), y: lerp(y1, y2, eased) };
}
