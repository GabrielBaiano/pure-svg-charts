# 📋 Roadmap & TO-DO — pure-svg-charts

This document outlines the strategic improvement roadmap, upcoming features, and production milestones required to eliminate adoption barriers for **`pure-svg-charts`**, positioning it as the default lightweight charting library for the modern React ecosystem.

---

## 🎯 Roadmap Overview

```
[ P1: Mobile & Touch ] ──> [ P2: Custom Tooltips ] ──> [ P3: New Chart Types ] ──> [ P4: Time-Series & a11y ]
```

---

## 🚨 Priority 1 (P1): Mobile Interactivity & Touch Gestures *(Top Deal-Breaker)*

- [x] **Native Touch Event Listeners:**
  - [x] Implement `onTouchStart`, `onTouchMove`, and `onTouchEnd` in `<SvgLineChart>` and `<SvgBarChart>`.
  - [x] Calculate precise relative touch coordinates (`e.touches[0].clientX / clientY`).
  - [x] Set `touch-action: pan-y` on the SVG container to preserve natural vertical page scrolling while the user scrubs horizontally across the chart.
- [x] **Tap-to-Pin Tooltip Behavior:**
  - [x] Lock the tooltip to the closest data point on single tap.
  - [x] Dismiss smoothly when tapping outside the chart canvas.
- [x] **High-Density Touch Hitbox:**
  - [x] Enlarge touch hitboxes for crosshair guidelines and active anchor points to facilitate effortless fingertip tracking on mobile and tablet screens.

---

## 🎨 Priority 2 (P2): Rich & Fully Customizable Tooltips with React Components

- [x] **`renderTooltip` Prop (HTML / React Children):**
  - [x] Allow developers to pass an arbitrary React component for custom tooltip rendering:
    ```tsx
    <SvgLineChart
      data={data}
      renderTooltip={({ point, seriesName, formattedValue }) => (
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 shadow-xl">
          <span className="font-bold text-emerald-400">{point.label}</span>
          <p className="text-white text-lg font-semibold">{formattedValue} USD</p>
        </div>
      )}
    />
    ```
- [x] **HTML Overlay / React Portal Rendering:**
  - [x] Anchor the tooltip outside the SVG clipping boundary (using an HTML overlay or `createPortal`) to prevent it from being cropped by `overflow: hidden`.
- [x] **Zero-Overhead Fallback:**
  - [x] Preserve the native SVG tooltip (`<rect>` + `<text>`) as the default lightweight fallback when no custom component is supplied.

---

## 📊 Priority 3 (P3): Essential Enterprise Chart Types

- [ ] **Combo / Dual-Axis Chart:**
  - [ ] Support simultaneous **Bars** (e.g. Volume/Revenue) and **Line** (e.g. Profit Margin % / Conversion) within the same chart canvas.
  - [ ] Primary left Y-axis (absolute numbers) and secondary right Y-axis (percentages or distinct units).
- [ ] **Horizontal Bar Chart (`SvgHorizontalBarChart`):**
  - [ ] Ideal for dashboard rankings (Top 10 Products, Countries, Customers).
  - [ ] Clean layout for long category text labels on the vertical Y-axis without truncation.
  - [ ] Support for negative values extending leftward from the zero baseline.
- [ ] **Continuous Scatter Plot (`SvgScatterPlot`):**
  - [ ] Plotting of continuous $(X, Y)$ numerical pairs independent of categorical slots.
  - [ ] Support for variable bubble radius and cluster color mapping.
- [ ] **Confidence Interval / Min-Max Band Area Chart:**
  - [ ] Render uncertainty bands (shaded area between minimum and maximum bounds) commonly required in financial modeling and telemetry forecasting.

---

## ⏰ Priority 4 (P4): Time-Series & Continuous Date Scales

- [ ] **Native Date & Timestamp Support on X-Axis:**
  - [ ] Accept `Date` objects, Unix epoch numbers (ms), and ISO date strings.
  - [ ] Calculate the horizontal coordinate proportionally to elapsed time rather than categorical index strides.
- [ ] **Irregular Interval Handling:**
  - [ ] Gracefully handle market gaps (weekends, holidays) and intermittent sensor data without distorting the visual timescale.
- [ ] **Intelligent Date Formatters:**
  - [ ] Automated resolution presets matching scale density: `'auto'` | `'day'` | `'month'` | `'year'` | `'hour'`.

---

## ♿ Priority 5 (P5): Enterprise Accessibility (a11y / WCAG 2.1 & ADA Compliance)

- [ ] **Accessible SVG Semantics:**
  - [ ] Include `role="img"` on root `<svg>`.
  - [ ] Dynamically inject `<title>` and `<desc>` elements for screen readers.
- [ ] **Full Keyboard Navigation:**
  - [ ] Support `tabIndex={0}` to allow keyboard focus on chart elements.
  - [ ] Enable navigating data points using $\leftarrow$ and $\rightarrow$ arrow keys.
  - [ ] Trigger tooltips and announce active point metrics via `aria-live="polite"`.
- [ ] **High-Contrast Conformance:**
  - [ ] Guarantee WCAG AA color contrast ratios (minimum 4.5:1 between axes, background, and series lines).

---

## 🛠️ Priority 6 (P6): Infrastructure, Tree-Shaking & Production Reliability
 
- [x] **Surgical Tree-Shaking (`"sideEffects": false`):**
  - [x] Declare `"sideEffects": false` in root `package.json` so importing only `<SvgLineChart />` yields a standalone bundle of only ~4 kB.
- [x] **Automated Test Suite (Vitest):**
  - [x] Setup Vitest + React Testing Library.
  - [x] Unit tests for LTTB downsampling accuracy (`lttb.test.ts`).
  - [x] Unit tests for Bézier curve mathematics (`bezier.test.ts`).
  - [x] Unit tests for scaling and coordinates (`scale.test.ts`).
  - [x] Component tests for Line and Bar charts with touch and custom tooltips.
- [x] **Continuous Integration (GitHub Actions):**
  - [x] Add `.github/workflows/ci.yml` verifying TypeScript compilation, linting, and automated tests on every Pull Request.
- [ ] **Image Export Utility:**
  - [ ] Helper utility `exportChartAsImage(svgRef, 'png' | 'svg', filename)` enabling users to easily build "Download Chart" buttons.

---

## 📈 Execution Status

| Priority | Feature Area | Status |
| :--- | :--- | :--- |
| **P1** | Mobile & Touch Events | ✅ Completed |
| **P2** | Custom Tooltip (React Portal / HTML) | ✅ Completed |
| **P3** | Combo Chart, Horizontal Bars & Scatter | ⏳ Planned |
| **P4** | Continuous Time-Series Scales | ⏳ Planned |
| **P5** | Accessibility (a11y / WCAG) | ⏳ Planned |
| **P6** | Tree-Shaking, Vitest & CI | 🚀 In Progress (Tree-shaking, Vitest & CI done) |
