export interface DataPoint {
  label: string;
  value: number;
}

/**
 * Deterministic harmonic wave generator with realistic floating-point decimals (números quebrados).
 * Simulates high-frequency financial telemetry or IoT sensor streams.
 * Supports sliding window offset for live streaming update tests.
 */
export function generateBenchmarkData(count: number, offset: number = 0): DataPoint[] {
  const data: DataPoint[] = [];
  for (let i = 0; i < count; i++) {
    const idx = i + offset;
    const wave1 = Math.sin(idx / (count / 20)) * 60;
    const wave2 = Math.cos(idx / (count / 60)) * 30;
    const wave3 = Math.sin(idx / (count / 150)) * 15;
    const noise = ((idx * 13) % 17) - 8 + (Math.sin(idx * 0.7) * 4.37);
    // Precise floating-point decimals (ex: 154.83, 89.26)
    const rawValue = 150 + wave1 + wave2 + wave3 + noise;
    const value = Math.round(rawValue * 100) / 100;
    data.push({
      label: `#${idx + 1}`,
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
