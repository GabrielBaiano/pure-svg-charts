import { describe, it, expect } from 'vitest';
import { normalizeChartInput } from '../src/core/data';

describe('normalizeChartInput', () => {
  it('handles empty input gracefully', () => {
    const result = normalizeChartInput({});
    expect(result.data).toEqual([]);
    expect(result.isMultiSeries).toBe(false);
  });

  it('preserves existing series array when supplied', () => {
    const series = [{ name: 'S1', data: [1, 2, 3] }];
    const result = normalizeChartInput({ series });
    expect(result.isMultiSeries).toBe(true);
    expect(result.series).toBe(series);
  });

  it('extracts single series from raw object records using x and y strings', () => {
    const rawData = [
      { month: 'Jan', revenue: 100, cost: 40 },
      { month: 'Feb', revenue: 200, cost: 80 }
    ];

    const result = normalizeChartInput({
      data: rawData,
      x: 'month',
      y: 'revenue'
    });

    expect(result.isMultiSeries).toBe(false);
    expect(result.data).toEqual([
      { value: 100, label: 'Jan' },
      { value: 200, label: 'Feb' }
    ]);
  });

  it('automatically extracts multi-series when y is string[]', () => {
    const rawData = [
      { month: 'Jan', revenue: 1000, expenses: 400 },
      { month: 'Feb', revenue: 1500, expenses: 600 }
    ];

    const result = normalizeChartInput({
      data: rawData,
      x: 'month',
      y: ['revenue', 'expenses']
    });

    expect(result.isMultiSeries).toBe(true);
    expect(result.series?.length).toBe(2);
    expect(result.series?.[0].name).toBe('revenue');
    expect(result.series?.[0].data).toEqual([
      { value: 1000, label: 'Jan' },
      { value: 1500, label: 'Feb' }
    ]);
    expect(result.series?.[1].name).toBe('expenses');
    expect(result.series?.[1].data).toEqual([
      { value: 400, label: 'Jan' },
      { value: 600, label: 'Feb' }
    ]);
  });

  it('preserves standard numeric and { value, label } arrays without x or y', () => {
    const numericData = [10, 20, 30];
    const resultNum = normalizeChartInput({ data: numericData });
    expect(resultNum.data).toEqual(numericData);
    expect(resultNum.isMultiSeries).toBe(false);

    const objectData = [{ value: 10, label: 'A' }, { value: 20, label: 'B' }];
    const resultObj = normalizeChartInput({ data: objectData });
    expect(resultObj.data).toEqual(objectData);
  });
});
