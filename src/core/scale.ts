import { ChartPadding, DataValue, Point } from './types';

export const DEFAULT_PADDING: ChartPadding = {
  top: 24,
  right: 24,
  bottom: 34,
  left: 48
};

/**
 * Normalizes input data into points mapped to SVG viewBox coordinates.
 */
export function scaleDataToPoints(
  data: DataValue[],
  width: number,
  height: number,
  customPadding?: Partial<ChartPadding>
): { points: Point[]; minVal: number; maxVal: number; padding: ChartPadding } {
  const padding: ChartPadding = {
    ...DEFAULT_PADDING,
    ...customPadding
  };

  if (!data || data.length === 0) {
    return { points: [], minVal: 0, maxVal: 0, padding };
  }

  const cleanValues = data.map((item) => {
    if (typeof item === 'number') {
      return { value: Number.isFinite(item) ? item : 0, label: undefined };
    }
    return {
      value: Number.isFinite(item.value) ? item.value : 0,
      label: item.label
    };
  });

  const numericValues = cleanValues.map((v) => v.value);
  let minVal = Math.min(...numericValues);
  let maxVal = Math.max(...numericValues);

  // If min and max are the same, give some breathing room
  if (minVal === maxVal) {
    minVal = minVal > 0 ? 0 : minVal - 1;
    maxVal = maxVal === 0 ? 1 : maxVal + 1;
  }

  const chartWidth = Math.max(1, width - padding.left - padding.right);
  const chartHeight = Math.max(1, height - padding.top - padding.bottom);
  const valueRange = maxVal - minVal;

  const count = cleanValues.length;
  const stepX = count > 1 ? chartWidth / (count - 1) : chartWidth / 2;

  const points: Point[] = cleanValues.map((d, index) => {
    const x = count === 1 ? padding.left + chartWidth / 2 : padding.left + index * stepX;
    // Invert Y coordinate because SVG origin (0,0) is top-left
    const normalizedY = (d.value - minVal) / valueRange;
    const y = padding.top + chartHeight - normalizedY * chartHeight;

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      value: d.value,
      label: d.label
    };
  });

  return { points, minVal, maxVal, padding };
}

/**
 * Selects a clean, non-overlapping subset of indices for X-axis labels.
 * Always guarantees that:
 * 1. The first item (0) is included if available.
 * 2. The last item (totalCount - 1) is included.
 * 3. Intermediate items are evenly distributed across the range.
 * 4. No two adjacent or colliding indices are selected.
 */
export function getSampledLabelIndices(
  totalCount: number,
  maxLabels: number = 7
): Set<number> {
  const indices = new Set<number>();
  if (totalCount <= 0) return indices;
  if (totalCount <= maxLabels) {
    for (let i = 0; i < totalCount; i++) {
      indices.add(i);
    }
    return indices;
  }

  const count = Math.max(2, maxLabels);
  for (let k = 0; k < count; k++) {
    const idx = Math.round((k / (count - 1)) * (totalCount - 1));
    indices.add(idx);
  }
  return indices;
}
