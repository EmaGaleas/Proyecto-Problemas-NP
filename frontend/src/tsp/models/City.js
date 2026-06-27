/**
 * City model
 * @typedef {Object} City
 * @property {number} id     - Unique identifier
 * @property {string} name   - Display name
 * @property {number} x      - X coordinate in the SVG viewBox (0–800)
 * @property {number} y      - Y coordinate in the SVG viewBox (0–600)
 */

export function createCity(id, name, x, y) {
  return { id, name, x, y };
}

export function distanceBetween(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function angleBetween(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
}
