export interface DataPoint {
  label: string;
  value: number;
}

/**
 * Deterministic harmonic wave generator for benchmark comparison.
 * Simulates high-frequency financial telemetry or IoT sensor streams.
 */
export function generateBenchmarkData(count: number): DataPoint[] {
  const data: DataPoint[] = [];
  for (let i = 0; i < count; i++) {
    const wave1 = Math.sin(i / (count / 20)) * 60;
    const wave2 = Math.cos(i / (count / 60)) * 30;
    const wave3 = Math.sin(i / (count / 150)) * 15;
    const noise = ((i * 13) % 17) - 8;
    const value = Math.round(150 + wave1 + wave2 + wave3 + noise);
    data.push({
      label: `#${i + 1}`,
      value
    });
  }
  return data;
}

export const DENSITIES = [
  { count: 50, label: '50 pts (Widget)' },
  { count: 500, label: '500 pts (Daily)' },
  { count: 2000, label: '2,000 pts (Telemetry)' },
  { count: 5000, label: '5,000 pts (Massive Stress)' }
];
