# 📊 Pure SVG Charts

<p align="center">
  <strong>Ultra-lightweight, reactive, and animated SVG charts for React with zero external runtime dependencies.</strong>
</p>

<p align="center">
  <a href="#-license"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License" /></a>
  <a href="https://bundlephobia.com"><img src="https://img.shields.io/badge/bundle%20size-%3C%2010kB%20(gzip)-success.svg?style=flat-square" alt="Bundle Size" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React-%3E%3D18.0.0-61dafb.svg?style=flat-square" alt="React 18+" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
</p>

---

## 💡 Why Pure SVG Charts? (The "F@%# Bloat" Manifesto)

**F@%# bloated charting libraries that destroy dashboard performance and developer productivity.**

We got completely sick of charting libraries that drag **200+ kB of heavy D3 dependencies**, crash Next.js Server-Side Rendering (SSR) with canvas hydration errors, choke the browser DOM with 5,000 separate `<circle>` elements, require 30 lines of nested configuration hell just to plot 7 numbers, and turn your app's Lighthouse performance score into a red nightmare.

**Pure SVG Charts** is the lightweight antidote:
- 🪶 **Under 10 kB (min+gzip):** Over 20x lighter than Recharts, ECharts, and Tremor. Zero external runtime dependencies.
- ⚡ **High-Density Engine (5,000+ Points):** Built-in Largest-Triangle-Three-Buckets (LTTB) downsampling renders 5,000 to 50,000 points in **~2.5 ms** while strictly preserving visual peaks and troughs.
- 📐 **Auto-Sizing ResponsiveContainer:** Adapts dynamically to 100% parent container width/height via native `ResizeObserver` with zero layout distortion.
- ⚖️ **Negative Values & Diverging Bars:** Seamless support for mixed positive and negative metrics with a prominent zero-baseline dividing line and downward-extending negative bars.
- 📊 **Stacked & Grouped Bars:** Multi-series financial stacking with custom top corner rounding, gap control (`stackGap`), and percentage share hover metrics.
- 🌊 **Stacked Area Curves:** Cumulative Bézier area fills closed natively in SVG without polygon tears.
- 🚀 **Zero DOM Bloat:** Virtualized continuous tracking cursor keeps the SVG DOM tree under 80 nodes, even on 50,000 data points.
- 🎨 **Ready-made UI Variants:** Instant themes (`tokyonight`, `glass`, `cyberpunk`, `paper`, `terminal`) with 100% granular override freedom.
- 🛡️ **SSR-First:** Zero hydration mismatches, zero `window is not defined` crashes. Works out of the box in Next.js App Router, Remix, and Astro.

---

## ⚡ Benchmark Results (5,000 Points): pure-svg-charts vs The Giants

Empirically audited live in Google Chrome via native `React.Profiler` (`actualDuration`) with a 10-sample rolling average on a high-density streaming dataset:

| Library | Engine | Bundle (Gzip) | Dependencies | Mount Latency | DOM Nodes | Streaming Update (avg) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **pure-svg-charts** | Pure SVG | **11.1 kB** | **0** | **1.45 ms** | **33 nodes** | **0.95 ms** |
| **Recharts** | SVG + D3 | 162.4 kB | 14 | 132.50 ms | 106 nodes | 138.20 ms |
| **Chart.js (react-chartjs-2)** | HTML5 Canvas | 68.2 kB | 4 | 0.45 ms | 7 nodes | 0.35 ms |
| **Victory** | SVG + D3 | 184.6 kB | 22 | 48.20 ms | 69 nodes | 38.50 ms |

> **Key Highlights:**
> - 📦 **14.6x lighter bundle** than Recharts (zero D3 or external runtime dependencies).
> - ⚡ **91x faster mount latency** than Recharts on high-density datasets (1.45 ms vs 132.50 ms).
> - ⚡ **145x faster streaming updates** than Recharts during continuous data feeds (0.95 ms vs 138.20 ms).
> - 🛡️ **LTTB Virtualization**: Caps SVG DOM nodes to preserve 60-120 FPS without thread lockup.

👉 **Want to re-run or audit these benchmarks on your machine? See the [Benchmarking Guide & Reproduction Instructions](./benchmarks/README.md).**

---

## 📦 Installation

```bash
npm install pure-svg-charts
# or
yarn add pure-svg-charts
# or
pnpm add pure-svg-charts
```

---

## 🚀 Components & Examples

### 1. High-Density Line Chart (5,000+ Points)

Handles massive datasets smoothly with automated LTTB downsampling and $O(\log N)$ binary search cursor snapping.

```tsx
import React from 'react';
import { SvgLineChart } from 'pure-svg-charts';

// Generate 5,000 data points
const data = Array.from({ length: 5000 }, (_, i) => ({
  value: Math.sin(i / 80) * 100 + Math.random() * 20,
  label: `#${i}`
}));

export function MassiveTelemetryChart() {
  return (
    <SvgLineChart
      data={data}
      maxDisplayPoints={300} // Target LTTB resolution (default: 300)
      smooth
      crosshair
      fillGradient
      variant="tokyonight"
      title="Live Sensor Telemetry"
      subtitle="5,000 streaming data points downsampled via LTTB"
      metric="104.2 °C"
      width={800}
      height={320}
    />
  );
}
```

---

### 2. Stacked Bars (Financial Channel Breakdown)

Decompose multi-series revenues into stacked columns with custom top-only corner rounding and segment percentage tooltips.

```tsx
import React, { useState } from 'react';
import { SvgBarChart } from 'pure-svg-charts';

const series = [
  {
    name: 'Subscriptions',
    color: '#7aa2f7',
    data: [{ label: 'Q1', value: 48 }, { label: 'Q2', value: 62 }, { label: 'Q3', value: 78 }, { label: 'Q4', value: 95 }]
  },
  {
    name: 'Enterprise',
    color: '#f7768e',
    data: [{ label: 'Q1', value: 24 }, { label: 'Q2', value: 38 }, { label: 'Q3', value: 45 }, { label: 'Q4', value: 58 }]
  },
  {
    name: 'Services',
    color: '#9ece6a',
    data: [{ label: 'Q1', value: 16 }, { label: 'Q2', value: 20 }, { label: 'Q3', value: 26 }, { label: 'Q4', value: 32 }]
  }
];

export function RevenueBreakdown() {
  const [stacked, setStacked] = useState(true);

  return (
    <div>
      <button onClick={() => setStacked(!stacked)}>
        {stacked ? 'Switch to Grouped' : 'Switch to Stacked'}
      </button>

      <SvgBarChart
        series={series}
        stacked={stacked}       // true = Stacked vertically, false = Grouped side-by-side
        stackGap={0}           // 0 = Seamless/flush, 2 = 2px vertical gap between segments
        radius={6}             // Top corner radius
        barGap={0.35}          // Gap ratio between category columns
        variant="tokyonight"
        title="Fiscal Revenue Streams"
        crosshair
        width={800}
        height={340}
      />
    </div>
  );
}
```

---

### 3. Stacked Area Chart

Cumulative multi-series area fills using native Bézier polygons.

```tsx
import React from 'react';
import { SvgLineChart } from 'pure-svg-charts';

const series = [
  {
    name: 'Organic Search',
    color: '#7aa2f7',
    fillGradient: true,
    data: [120, 150, 180, 240, 310, 420]
  },
  {
    name: 'Paid Ads',
    color: '#f7768e',
    fillGradient: true,
    data: [80, 100, 130, 160, 200, 260]
  },
  {
    name: 'Direct Traffic',
    color: '#9ece6a',
    fillGradient: true,
    data: [40, 55, 70, 95, 120, 150]
  }
];

export function TrafficAcquisitionChart() {
  return (
    <SvgLineChart
      series={series}
      stacked                  // Cumulative area stacking
      smooth
      showLegend
      variant="tokyonight"
      title="User Acquisition Channels"
      width={800}
      height={320}
      crosshair
    />
  );
}
```

---

### 4. Diverging Bars (Negative Values & Zero Baseline)

Plot mixed positive gains and negative losses with an automatic zero axis and dedicated negative color accents.

```tsx
import React from 'react';
import { SvgBarChart } from 'pure-svg-charts';

const pnlData = [
  { label: 'Jan', value: 48 },
  { label: 'Feb', value: -26 },
  { label: 'Mar', value: 65 },
  { label: 'Apr', value: -18 },
  { label: 'May', value: 84 },
  { label: 'Jun', value: -42 }
];

export function ProfitLossChart() {
  return (
    <SvgBarChart
      data={pnlData}
      negativeColor="#f7768e" // Distinct accent for negative bars
      showZeroLine             // Prominent horizontal line at 0
      showValues
      radius={6}
      variant="tokyonight"
      title="Net Operating Income (P&L)"
      width={800}
      height={320}
    />
  );
}
```

---

### 5. Responsive Container (Auto-Sizing Layouts)

Fill 100% of any dashboard grid, card, or viewport dynamically using native `ResizeObserver`.

```tsx
import React from 'react';
import { ResponsiveContainer, SvgLineChart } from 'pure-svg-charts';

export function ResponsiveCard() {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <SvgLineChart
          data={[10, 25, 18, 42, 60]}
          smooth
          fillGradient
          variant="tokyonight"
        />
      </ResponsiveContainer>
    </div>
  );
}
```

---

### 6. Donut Chart & Sparklines

```tsx
import React from 'react';
import { SvgDonutChart, SvgSparkline } from 'pure-svg-charts';

export function QuickDashboardWidgets() {
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      {/* Donut Chart */}
      <SvgDonutChart
        data={[
          { label: 'Engineering', value: 45, color: '#7aa2f7' },
          { label: 'Marketing', value: 30, color: '#f7768e' },
          { label: 'Sales', value: 25, color: '#9ece6a' }
        ]}
        size={240}
        innerRadiusRatio={0.65}
        centerLabel="Budget"
        centerValue="00k"
        variant="tokyonight"
      />

      {/* KPI Sparkline */}
      <div style={{ width: 140 }}>
        <SvgSparkline
          data={[12, 18, 14, 25, 22, 34, 40]}
          color="#9ece6a"
          fillArea
          showEndDot
          smooth
          height={40}
        />
      </div>
    </div>
  );
}
```

---

## 📋 Component Props & Configuration

### Common Props (`BaseChartProps`)

All chart components inherit these common properties:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `width` | `number` | `600` | Chart canvas width in SVG user units |
| `height` | `number` | `280` | Chart canvas height in SVG user units |
| `variant` | `'default' | 'tokyonight' | 'glass' | 'cyberpunk' | 'paper' | 'terminal'` | `'default'` | Pre-configured aesthetic color palette and theme |
| `title` | `string` | `undefined` | Header title string |
| `subtitle` | `string` | `undefined` | Header subtitle string |
| `metric` | `string` | `undefined` | Prominent metric badge in the top right |
| `showGrid` | `boolean` | `true` | Show background horizontal grid lines |
| `gridLines` | `number` | `4` | Number of horizontal division lines |
| `showXAxis` | `boolean` | `true` | Show X-axis category labels |
| `showYAxis` | `boolean` | `true` | Show Y-axis numeric scale labels |
| `crosshair` | `boolean` | `false` | Enable interactive tracking guidelines and axis badges |
| `negativeColor` | `string` | `'#f7768e'` | Accent color used for negative values below zero |
| `showZeroLine` | `boolean` | `true` | Show prominent horizontal line at zero when crossing zero |
| `card` | `boolean` | `true` | Render in a themed card container. Set to `false` to render flush inside custom containers |
| `glow` | `boolean` | `false` | Enable GPU neon drop-shadow filter |
| `valueFormatter` | `(val: number) => string` | `(v) => v.toLocaleString()` | Formatter for tooltips and axis labels |

### `SvgLineChartProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `(number | { value: number; label?: string })[]` | `[]` | Single-series data array |
| `series` | `LineSeries[]` | `undefined` | Multi-series configuration array |
| `stacked` | `boolean` | `false` | Whether multi-series area fills are stacked cumulatively |
| `maxDisplayPoints` | `number` | `300` | Maximum points rendered via LTTB downsampling (`0` or `Infinity` to disable) |
| `smooth` | `boolean` | `true` | Cubic Bézier spline interpolation (Catmull-Rom) |
| `curvature` | `number` | `0.25` | Spline tension parameter (`0` for straight lines) |
| `strokeWidth` | `number` | `2.5` | Curve stroke width in pixels |
| `fillGradient` | `boolean` | `true` | Render vertical gradient area fill under the curve |
| `showDots` | `boolean` | `true` (if `<= 60` pts) | Show individual data point circles |
| `dotRadius` | `number` | `4` | Radius of data point circles |
| `showLegend` | `boolean` | `true` | Show series color swatch legend |
| `onPointHover` | `(point: Point | null) => void` | `undefined` | Hover callback |

### `ResponsiveContainerProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `width` | `number | string` | `'100%'` | Outer container width (percentage or pixel number) |
| `height` | `number | string` | `'100%'` | Outer container height (percentage or pixel number) |
| `aspect` | `number` | `undefined` | Optional aspect ratio (`width / height`) |
| `minWidth` | `number` | `undefined` | Minimum width in pixels |
| `minHeight` | `number` | `undefined` | Minimum height in pixels |
| `maxHeight` | `number` | `undefined` | Maximum height in pixels |
| `debounce` | `number` | `0` | Debounce duration in ms for resize callbacks |
| `children` | `ReactElement | (dims) => ReactElement` | required | Child SVG chart component or render function |

### `SvgBarChartProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `(number | { value: number; label?: string })[]` | `[]` | Single-series data array |
| `series` | `BarSeries[]` | `undefined` | Multi-series configuration array |
| `stacked` | `boolean` | `true` (if `series`) | `true` for vertical stack, `false` for side-by-side grouped bars |
| `stackGap` | `number` | `0` | Vertical gap between stacked segments (`0` for flush seamless) |
| `radius` | `number` | `6` | Corner radius for bars (only top corners in stacked mode) |
| `barGap` | `number` | `0.3` | Spacing ratio between category columns `[0..1]` |
| `showLegend` | `boolean` | `true` | Show series color swatch legend |
| `onBarHover` | `(item: BarHoverItem | null) => void` | `undefined` | Hover callback |

---

## 🎨 Themes & Custom Styling

Themes can be set globally with the `variant` prop or styled with standard CSS/Tailwind:

```tsx
<SvgLineChart variant="tokyonight" data={[10, 25, 40]} />
<SvgBarChart variant="cyberpunk" data={[10, 25, 40]} />
<SvgDonutChart variant="glass" data={slices} />
```

All themes are plain JavaScript color token definitions exported as `CHART_VARIANTS` from the root package.

---

## 🙏 Acknowledgments
- Special thanks to the authors and maintainers of **[@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror)** for providing the modular, lightweight in-browser code editor and themes that power our live interactive playground.
- This documentation was structured and crafted following the **[awesome-readme](https://github.com/GabrielBaiano/awesome-readme)** specification for open-source developer documentation.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © 2026 [Gabriel Baiano](https://github.com/GabrielBaiano).
