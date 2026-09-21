import { describe, it, expect } from 'vitest';
import { scaleDataToPoints, getSampledLabelIndices } from '../src/core/scale';

describe('scaleDataToPoints', () => {
  it('returns empty points if dataset is empty', () => {
    const result = scaleDataToPoints([], 500, 200);
    expect(result.points).toEqual([]);
    expect(result.minVal).toBe(0);
    expect(result.maxVal).toBe(0);
  });

  it('correctly maps values to viewBox points', () => {
    const data = [10, 50, 90];
    const width = 500;
    const height = 220;
    const padding = { top: 20, right: 20, bottom: 20, left: 20 };

    const result = scaleDataToPoints(data, width, height, padding);

    expect(result.points.length).toBe(3);
    expect(result.minVal).toBe(10);
    expect(result.maxVal).toBe(90);

    // Chart inner dimensions:
    // chartWidth = 500 - 40 = 460
    // chartHeight = 220 - 40 = 180
    // min value (10) should have y = padTop + chartHeight = 200
    // max value (90) should have y = padTop = 20
    const [p0, p1, p2] = result.points;
    expect(p0.x).toBe(20);
    expect(p0.y).toBe(200);

    expect(p2.x).toBe(480);
    expect(p2.y).toBe(20);

    // Middle value (50) is midpoint: y = 20 + 90 = 110
    expect(p1.x).toBe(250);
    expect(p1.y).toBe(110);
  });

  it('handles custom overrideMin and overrideMax', () => {
    const data = [10, 20];
    const result = scaleDataToPoints(data, 100, 100, undefined, 0, 100);
    expect(result.minVal).toBe(0);
    expect(result.maxVal).toBe(100);
  });
});

describe('getSampledLabelIndices', () => {
  it('returns empty set when totalCount is <= 0', () => {
    expect(getSampledLabelIndices(0).size).toBe(0);
  });

  it('returns all indices when totalCount is <= maxLabels', () => {
    const indices = getSampledLabelIndices(5, 7);
    expect(indices.size).toBe(5);
    expect(Array.from(indices)).toEqual([0, 1, 2, 3, 4]);
  });

  it('samples evenly across the range when totalCount > maxLabels', () => {
    const indices = getSampledLabelIndices(100, 5);
    expect(indices.size).toBe(5);
    expect(indices.has(0)).toBe(true);
    expect(indices.has(99)).toBe(true);
  });
});
