import { describe, expect, it } from "vitest";
import { getFlightGeometry } from "./CardCommitFlight";

describe("card commit flight geometry", () => {
  it("settles at the topmost product layer and follows one continuous inward arc", () => {
    const geometry = getFlightGeometry({
      left: 18,
      top: 548,
      width: 112,
      height: 236,
      screenLeft: 0,
      screenTop: 0,
      screenWidth: 390,
      screenHeight: 844,
    });

    expect(geometry.targetTop).toBe(8);
    expect(geometry.targetLeft + geometry.targetWidth / 2).toBeCloseTo(195, 5);
    expect(geometry.fromY).toBeGreaterThan(geometry.point25.y);
    expect(geometry.point25.y).toBeGreaterThan(geometry.point50.y);
    expect(geometry.point50.y).toBeGreaterThan(geometry.point75.y);
    expect(geometry.point75.y).toBeGreaterThan(0);
    expect(Math.abs(geometry.fromX)).toBeGreaterThan(Math.abs(geometry.point25.x));
    expect(Math.abs(geometry.point25.x)).toBeGreaterThan(Math.abs(geometry.point50.x));
    expect(Math.abs(geometry.point50.x)).toBeGreaterThan(Math.abs(geometry.point75.x));
  });
});
