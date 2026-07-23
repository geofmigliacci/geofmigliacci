export interface Point {
  x: number;
  y: number;
}

export function withoutRepeats(points: readonly Point[]): Point[] {
  const result: Point[] = [];
  for (const point of points) {
    const last = result.at(-1);
    if (!last || last.x !== point.x || last.y !== point.y) result.push(point);
  }
  return result;
}

export function progressAlong(points: readonly Point[]): number[] {
  if (points.length <= 1) return points.map(() => 0);

  const distances = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
    distances.push(total);
  }

  if (total === 0) return points.map((_, index) => index / (points.length - 1));
  return distances.map((distance) => distance / total);
}

const IDLE_CPU = 6;

export function cpuFor(activeRequests: number): number {
  if (activeRequests === 0) return IDLE_CPU;
  return Math.min(100, 24 + activeRequests * 13);
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectFromCenter(
  cx: number,
  cy: number,
  width: number,
  height: number,
): Rect {
  return { x: cx - width / 2, y: cy - height / 2, width, height };
}

export const center = (rect: Rect): Point => ({
  x: rect.x + rect.width / 2,
  y: rect.y + rect.height / 2,
});
export const leftMid = (rect: Rect): Point => ({
  x: rect.x,
  y: rect.y + rect.height / 2,
});
export const rightMid = (rect: Rect): Point => ({
  x: rect.x + rect.width,
  y: rect.y + rect.height / 2,
});
export const topMid = (rect: Rect): Point => ({
  x: rect.x + rect.width / 2,
  y: rect.y,
});
export const bottomMid = (rect: Rect): Point => ({
  x: rect.x + rect.width / 2,
  y: rect.y + rect.height,
});

export function elbow(from: Point, to: Point, turnX?: number): Point[] {
  const x = turnX ?? (from.x + to.x) / 2;
  return [from, { x, y: from.y }, { x, y: to.y }, to];
}

export function stackVertically(
  count: number,
  size: { width: number; height: number },
  cx: number,
  cy: number,
  gap: number,
): Rect[] {
  const span = count * size.height + (count - 1) * gap;
  const startY = cy - span / 2;
  return Array.from({ length: count }, (_, index) => ({
    x: cx - size.width / 2,
    y: startY + index * (size.height + gap),
    width: size.width,
    height: size.height,
  }));
}
