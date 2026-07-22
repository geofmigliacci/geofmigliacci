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
