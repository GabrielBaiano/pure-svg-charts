import { describe, it, expect } from 'vitest';
import {
  generateLinePath,
  generateAreaPath,
  generateStackedAreaPath,
  generateBarPath
} from '../src/core/bezier';
import { Point } from '../src/core/types';

describe('generateLinePath', () => {
  it('returns empty string for empty points array', () => {
    expect(generateLinePath([])).toBe('');
  });

  it('returns single M command for 1 point', () => {
    const points: Point[] = [{ x: 10, y: 20, value: 5 }];
    expect(generateLinePath(points)).toBe('M 10,20');
  });

  it('generates linear path when smooth is false or points length is 2', () => {
    const points: Point[] = [
      { x: 0, y: 10, value: 1 },
      { x: 50, y: 30, value: 2 },
      { x: 100, y: 20, value: 3 }
    ];
    const linear = generateLinePath(points, false);
    expect(linear).toBe('M 0,10 L 50,30 L 100,20');

    const twoPoints = points.slice(0, 2);
    expect(generateLinePath(twoPoints, true)).toBe('M 0,10 L 50,30');
  });

  it('generates cubic Bezier curve (C commands) when smooth is true', () => {
    const points: Point[] = [
      { x: 0, y: 50, value: 1 },
      { x: 50, y: 20, value: 2 },
      { x: 100, y: 40, value: 3 },
      { x: 150, y: 10, value: 4 }
    ];
    const path = generateLinePath(points, true, 0.25);
    expect(path.startsWith('M 0,50')).toBe(true);
    expect(path).toContain('C ');
  });
});

describe('generateAreaPath', () => {
  it('returns empty string for empty points', () => {
    expect(generateAreaPath([], 100)).toBe('');
  });

  it('closes linear path to the baseline', () => {
    const points: Point[] = [
      { x: 10, y: 20, value: 1 },
      { x: 50, y: 40, value: 2 }
    ];
    const baselineY = 100;
    const path = generateAreaPath(points, baselineY, false);
    expect(path).toBe('M 10,20 L 50,40 L 50,100 L 10,100 Z');
  });
});

describe('generateStackedAreaPath', () => {
  it('returns empty string for empty top points', () => {
    expect(generateStackedAreaPath([], [])).toBe('');
  });

  it('closes polygon between topPoints and bottomPoints in reverse order', () => {
    const top: Point[] = [
      { x: 0, y: 30, value: 10 },
      { x: 50, y: 20, value: 15 }
    ];
    const bottom: Point[] = [
      { x: 0, y: 80, value: 0 },
      { x: 50, y: 70, value: 0 }
    ];
    const path = generateStackedAreaPath(top, bottom, false);
    expect(path).toBe('M 0,30 L 50,20 L 50,70 L 0,80 Z');
  });
});

describe('generateBarPath', () => {
  it('generates flat rectangle path without rounding', () => {
    const path = generateBarPath(10, 20, 30, 40, 0, false, false);
    expect(path).toBe('M 10,20 h 30 v 40 h -30 Z');
  });

  it('generates rounded top corners when roundTop is true', () => {
    const path = generateBarPath(10, 20, 30, 40, 5, true, false);
    expect(path).toContain('a 5,5 0 0 1');
    expect(path.endsWith('Z')).toBe(true);
  });

  it('caps radius to max allowed dimensions', () => {
    const path = generateBarPath(0, 0, 10, 20, 50, true, true);
    // radius cannot exceed width / 2 = 5
    expect(path).toContain('a 5,5');
  });
});
