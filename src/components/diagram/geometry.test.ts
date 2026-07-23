import { describe, expect, it } from "vitest";
import {
  bottomMid,
  center,
  cpuFor,
  elbow,
  leftMid,
  progressAlong,
  rectFromCenter,
  rightMid,
  stackVertically,
  topMid,
  withoutRepeats,
} from "./geometry";

describe("withoutRepeats", () => {
  it("drops consecutive duplicate points", () => {
    const result = withoutRepeats([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ]);
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ]);
  });

  it("keeps equal points that are not adjacent", () => {
    const result = withoutRepeats([
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 0, y: 0 },
    ]);
    expect(result).toHaveLength(3);
  });
});

describe("progressAlong", () => {
  it("spaces times by segment length, not by index", () => {
    const times = progressAlong([
      { x: 0, y: 0 },
      { x: 0, y: 10 },
      { x: 30, y: 10 },
    ]);
    expect(times).toEqual([0, 0.25, 1]);
  });

  it("returns a single zero for a one-point path", () => {
    expect(progressAlong([{ x: 4, y: 4 }])).toEqual([0]);
  });

  it("falls back to even spacing when every point is identical", () => {
    const times = progressAlong([
      { x: 2, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 2 },
    ]);
    expect(times).toEqual([0, 0.5, 1]);
  });
});

describe("rectFromCenter and anchors", () => {
  const rect = rectFromCenter(10, 20, 4, 6);

  it("builds a rect centered on the given point", () => {
    expect(rect).toEqual({ x: 8, y: 17, width: 4, height: 6 });
  });

  it("resolves each edge anchor", () => {
    expect(center(rect)).toEqual({ x: 10, y: 20 });
    expect(leftMid(rect)).toEqual({ x: 8, y: 20 });
    expect(rightMid(rect)).toEqual({ x: 12, y: 20 });
    expect(topMid(rect)).toEqual({ x: 10, y: 17 });
    expect(bottomMid(rect)).toEqual({ x: 10, y: 23 });
  });
});

describe("elbow", () => {
  it("turns at the midpoint by default", () => {
    expect(elbow({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual([
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 20 },
      { x: 10, y: 20 },
    ]);
  });

  it("turns at an explicit vertical line", () => {
    const points = elbow({ x: 0, y: 0 }, { x: 10, y: 20 }, 3);
    expect(points[1]).toEqual({ x: 3, y: 0 });
    expect(points[2]).toEqual({ x: 3, y: 20 });
  });
});

describe("stackVertically", () => {
  it("centers the column of rects on the given point", () => {
    const rects = stackVertically(3, { width: 10, height: 10 }, 0, 0, 5);
    expect(rects.map((r) => r.y)).toEqual([-20, -5, 10]);
    expect(rects.every((r) => r.x === -5 && r.width === 10)).toBe(true);
  });
});

describe("cpuFor", () => {
  it("reports the idle floor with no active requests", () => {
    expect(cpuFor(0)).toBe(6);
  });

  it("climbs with the number of active requests", () => {
    expect(cpuFor(3)).toBe(63);
  });

  it("saturates at 100", () => {
    expect(cpuFor(6)).toBe(100);
    expect(cpuFor(20)).toBe(100);
  });
});
