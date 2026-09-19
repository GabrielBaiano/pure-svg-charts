import { ChartPadding, DataValue, Point } from './types';

export const DEFAULT_PADDING: ChartPadding = {
  top: 24,
  right: 24,
  bottom: 34,
  left: 48
};

/**
 * Normalizes input data into points mapped to SVG viewBox coordinates.
 * Optimized with single-pass bounds resolution and fast register math.
 */
export function scaleDataToPoints(
  data: DataValue[],
  width: number,
  height: number,
  customPadding?: Partial<ChartPadding>,
  overrideMin?: number,
  overrideMax?: number
): { points: Point[]; minVal: number; maxVal: number; padding: ChartPadding } {
  const padding: ChartPadding = { ...DEFAULT_PADDING, ...customPadding };
  const count = data ? data.length : 0;
  if (count === 0) {
    return { points: [], minVal: overrideMin ?? 0, maxVal: overrideMax ?? 0, padding };
  }

  let minVal = overrideMin !== undefined ? overrideMin : Infinity;
  let maxVal = overrideMax !== undefined ? overrideMax : -Infinity;

  // Single pass to find bounds without intermediate array allocations
  if (overrideMin === undefined || overrideMax === undefined) {
    for (let i = 0; i < count; i++) {
      const item = data[i];
      const val = typeof item === 'number' ? item : item.value;
      const num = Number.isFinite(val) ? val : 0;
      if (overrideMin === undefined && num < minVal) minVal = num;
      if (overrideMax === undefined && num > maxVal) maxVal = num;
    }
  }

  if (minVal === maxVal || !Number.isFinite(minVal)) {
    minVal = minVal > 0 ? 0 : minVal - 1;
    maxVal = maxVal === 0 ? 1 : maxVal + 1;
  }

  const chartWidth = Math.max(1, width - padding.left - padding.right);
  const chartHeight = Math.max(1, height - padding.top - padding.bottom);
  const valueRange = maxVal - minVal || 1;
  const stepX = count > 1 ? chartWidth / (count - 1) : chartWidth / 2;

  // Pre-allocate points array and round via FPU registers
  const points: Point[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const item = data[i];
    const isNum = typeof item === 'number';
    const val = isNum ? (Number.isFinite(item) ? item : 0) : (Number.isFinite(item.value) ? item.value : 0);
    const label = isNum ? undefined : item.label;

    const rawX = count === 1 ? padding.left + chartWidth / 2 : padding.left + i * stepX;
    const rawY = padding.top + chartHeight - ((val - minVal) / valueRange) * chartHeight;

    points[i] = {
      x: Math.round(rawX * 10) / 10,
      y: Math.round(rawY * 10) / 10,
      value: val,
      label
    };
  }

  return { points, minVal, maxVal, padding };
}

/**
 * Selects a clean, non-overlapping subset of indices for X-axis labels.
 */
export function getSampledLabelIndices(totalCount: number, maxLabels: number = 7): Set<number> {
  const indices = new Set<number>();
  if (totalCount <= 0) return indices;
  const count = totalCount <= maxLabels ? totalCount : Math.max(2, maxLabels);
  for (let k = 0; k < count; k++) {
    indices.add(totalCount <= maxLabels ? k : Math.round((k / (count - 1)) * (totalCount - 1)));
  }
  return indices;
}
