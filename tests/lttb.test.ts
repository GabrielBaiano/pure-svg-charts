import { describe, it, expect } from 'vitest';
import { downsampleLTTB } from '../src/core/lttb';

describe('downsampleLTTB', () => {
  it('returns original data if threshold is greater than or equal to data length', () => {
    const data = [10, 20, 30];
    expect(downsampleLTTB(data, 5)).toBe(data);
    expect(downsampleLTTB(data, 3)).toBe(data);
  });

  it('returns original data if threshold or length is <= 2', () => {
    const data = [10, 20];
    expect(downsampleLTTB(data, 1)).toBe(data);
    expect(downsampleLTTB(data, 2)).toBe(data);
  });

  it('downsamples large numeric arrays down to exactly the target threshold', () => {
    const data = Array.from({ length: 100 }, (_, i) => Math.sin(i / 5) * 50);
    const threshold = 15;
    const sampled = downsampleLTTB(data, threshold);

    expect(sampled.length).toBe(threshold);
    // Preserves the first and last points
    expect(sampled[0]).toBe(data[0]);
    expect(sampled[sampled.length - 1]).toBe(data[data.length - 1]);
  });

  it('downsamples object data ({ value, label }) correctly', () => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      value: i % 2 === 0 ? i * 2 : i * -1,
      label: `Point ${i}`
    }));
    const threshold = 10;
    const sampled = downsampleLTTB(data, threshold);

    expect(sampled.length).toBe(threshold);
    expect(sampled[0]).toEqual(data[0]);
    expect(sampled[sampled.length - 1]).toEqual(data[data.length - 1]);
  });

  it('handles non-finite values without throwing NaN errors', () => {
    const data = [10, NaN, 30, Infinity, -Infinity, 60, 70, 80];
    const threshold = 4;
    const sampled = downsampleLTTB(data, threshold);

    expect(sampled.length).toBe(threshold);
    expect(sampled[0]).toBe(10);
    expect(sampled[sampled.length - 1]).toBe(80);
  });
});
