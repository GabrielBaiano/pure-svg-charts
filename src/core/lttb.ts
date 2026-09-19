import { DataValue } from './types';

/**
 * Largest-Triangle-Three-Buckets (LTTB) downsampling algorithm.
 * Reduces high-density data arrays (e.g. 5,000 to 100,000 points) to a target threshold
 * while strictly preserving visual trends, peaks, and troughs with zero external dependencies.
 */
export function downsampleLTTB<T extends DataValue>(data: T[], threshold: number): T[] {
  const len = data.length;
  if (threshold >= len || threshold <= 2 || len <= 2) {
    return data;
  }

  const sampled: T[] = new Array(threshold);
  let sampledIndex = 0;

  // Bucket size. Leave room for start and end points
  const every = (len - 2) / (threshold - 2);

  let a = 0;
  sampled[sampledIndex++] = data[a];

  for (let i = 0; i < threshold - 2; i++) {
    // Calculate point average for next bucket (c)
    let avgX = 0;
    let avgY = 0;
    const avgRangeStart = Math.floor((i + 1) * every) + 1;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * every) + 1, len);
    const avgRangeLength = avgRangeEnd - avgRangeStart;

    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      const item = data[j];
      const val = typeof item === 'number' ? item : item.value;
      avgX += j;
      avgY += Number.isFinite(val) ? val : 0;
    }

    if (avgRangeLength > 0) {
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;
    }

    // Point a
    const itemA = data[a];
    const pointAX = a;
    const pointAY = typeof itemA === 'number' ? itemA : itemA.value;

    // Get the range for this bucket (b)
    const rangeOffs = Math.floor(i * every) + 1;
    const rangeTo = Math.min(Math.floor((i + 1) * every) + 1, len);

    let maxArea = -1;
    let maxAreaPointIndex = rangeOffs;

    for (let j = rangeOffs; j < rangeTo; j++) {
      const itemB = data[j];
      const valB = typeof itemB === 'number' ? itemB : itemB.value;
      const pointBY = Number.isFinite(valB) ? valB : 0;

      // Area of triangle between points a, b, and c:
      // Area = 0.5 * |(Ax - Cx)(By - Ay) - (Ax - Bx)(Cy - Ay)|
      const area = Math.abs(
        (pointAX - avgX) * (pointBY - pointAY) - (pointAX - j) * (avgY - pointAY)
      );

      if (area > maxArea) {
        maxArea = area;
        maxAreaPointIndex = j;
      }
    }

    sampled[sampledIndex++] = data[maxAreaPointIndex];
    a = maxAreaPointIndex;
  }

  // Always retain final point
  sampled[sampledIndex] = data[len - 1];

  return sampled;
}
