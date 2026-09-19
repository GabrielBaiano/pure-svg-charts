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
  customPadding?: Partial<ChartPadding>,
  overrideMin?: number,
  overrideMax?: number
): { points: Point[]; minVal: number; maxVal: number; padding: ChartPadding } {
  const padding: ChartPadding = { ...DEFAULT_PADDING, ...customPadding };
  if (!data || !data.length) {
    return { points: [], minVal: overrideMin ?? 0, maxVal: overrideMax ?? 0, padding };
  }

  const cleanValues = data.map((item) =>
    typeof item === 'number'
      ? { value: Number.isFinite(item) ? item : 0, label: undefined }
      : { value: Number.isFinite(item.value) ? item.value : 0, label: item.label }
  );

  let minVal = overrideMin !== undefined ? overrideMin : Math.min(...cleanValues.map((v) => v.value));
  let maxVal = overrideMax !== undefined ? overrideMax : Math.max(...cleanValues.map((v) => v.value));
  if (minVal === maxVal) {
    minVal = minVal > 0 ? 0 : minVal - 1;
    maxVal = maxVal === 0 ? 1 : maxVal + 1;
  }

  const chartWidth = Math.max(1, width - padding.left - padding.right);
  const chartHeight = Math.max(1, height - padding.top - padding.bottom);
  const valueRange = maxVal - minVal;
  const count = cleanValues.length;
  const stepX = count > 1 ? chartWidth / (count - 1) : chartWidth / 2;

  const points: Point[] = cleanValues.map((d, index) => ({
    x: Number((count === 1 ? padding.left + chartWidth / 2 : padding.left + index * stepX).toFixed(2)),
    y: Number((padding.top + chartHeight - ((d.value - minVal) / valueRange) * chartHeight).toFixed(2)),
    value: d.value,
    label: d.label
  }));

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
