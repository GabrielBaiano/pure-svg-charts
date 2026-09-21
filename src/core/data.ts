import { DataValue } from './types';

export interface NormalizedInputResult<TSeries> {
  data: DataValue[];
  series?: TSeries[];
  isMultiSeries: boolean;
}

/**
 * Normalizes raw input data into consistent single-series or multi-series datasets.
 * Supports:
 * - Direct object arrays with `x` and `y` keys (e.g. data=[{ month: 'Jan', revenue: 100 }], x='month', y='revenue')
 * - Automatic multi-series generation when `y` is an array of strings (e.g. y=['revenue', 'expenses'])
 * - Traditional array of numbers or { value, label }
 * - Pre-configured series arrays
 */
export function normalizeChartInput<TSeries extends { name: string; data: DataValue[]; color?: string; id?: string }>(options: {
  data?: any[];
  series?: TSeries[];
  x?: string;
  y?: string | string[];
  defaultPalette?: string[];
}): NormalizedInputResult<TSeries> {
  const { data = [], series, x, y, defaultPalette = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'] } = options;

  // 1. Explicit multi-series already provided
  if (series && series.length > 0) {
    return {
      data: [],
      series,
      isMultiSeries: true
    };
  }

  // 2. No data provided
  if (!data || data.length === 0) {
    return {
      data: [],
      series: undefined,
      isMultiSeries: false
    };
  }

  // 3. Multi-series extraction from raw object records: y is string[]
  if (Array.isArray(y) && y.length > 0) {
    const generatedSeries: TSeries[] = y.map((key, idx) => ({
      id: `s-${key}-${idx}`,
      name: key,
      color: defaultPalette[idx % defaultPalette.length],
      data: data.map((item) => {
        const val = typeof item === 'object' && item !== null ? Number(item[key]) || 0 : 0;
        const lbl = x && typeof item === 'object' && item !== null && item[x] !== undefined
          ? String(item[x])
          : undefined;
        return lbl !== undefined ? { value: val, label: lbl } : { value: val };
      })
    } as TSeries));

    return {
      data: [],
      series: generatedSeries,
      isMultiSeries: true
    };
  }

  // 4. Single-series extraction from raw object records: y is string
  if (typeof y === 'string') {
    const singleData: DataValue[] = data.map((item) => {
      const val = typeof item === 'object' && item !== null ? Number(item[y]) || 0 : 0;
      const lbl = x && typeof item === 'object' && item !== null && item[x] !== undefined
        ? String(item[x])
        : typeof item === 'object' && item !== null && item.label !== undefined
        ? String(item.label)
        : undefined;
      return lbl !== undefined ? { value: val, label: lbl } : { value: val };
    });

    return {
      data: singleData,
      series: undefined,
      isMultiSeries: false
    };
  }

  // 5. Raw records with custom X key but no Y key (assumes records have .value)
  if (x && data.length > 0 && typeof data[0] === 'object' && data[0] !== null && 'value' in data[0]) {
    const singleData: DataValue[] = data.map((item) => {
      const val = Number(item.value) || 0;
      const lbl = item[x] !== undefined ? String(item[x]) : item.label;
      return lbl !== undefined ? { value: val, label: lbl } : { value: val };
    });

    return {
      data: singleData,
      series: undefined,
      isMultiSeries: false
    };
  }

  // 6. Standard backward-compatible DataValue[]
  return {
    data: data as DataValue[],
    series: undefined,
    isMultiSeries: false
  };
}
