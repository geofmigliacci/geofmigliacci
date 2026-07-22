import { describe, expect, it } from "vitest";
import { cpuFor, progressAlong, withoutRepeats } from "./geometry";

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
