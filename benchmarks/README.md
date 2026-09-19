# ⚡ pure-svg-charts — Benchmark & Comparison Suite

This directory contains an **optional, fully-isolated benchmarking suite** designed to empirically compare **pure-svg-charts** against the most popular React charting libraries:
- **Recharts** (SVG-based with D3 dependency)
- **Chart.js / react-chartjs-2** (HTML5 Canvas-based)
- **Victory** (SVG-based with D3/Victory-core dependency)

---

## 🔒 Isolation & Zero-Bloat Guarantee

To preserve the zero-overhead philosophy of `pure-svg-charts`:
1. **Excluded from root `npm install`:** When users clone or fork the repository and run `npm install` at the root, none of the benchmark dependencies (Recharts, Chart.js, Victory) are downloaded.
2. **Excluded from npm package:** The published npm package only ships `dist/`. This directory is completely excluded from npm distribution.
3. **Excluded from GitHub .zip archives:** Configured in `.gitattributes` via `export-ignore`.

---

## 🚀 Running the Benchmarks

From the repository root:

```bash
# 1. Install benchmark dependencies (one-time)
npm run benchmarks:install

# 2. Launch the interactive benchmark dashboard
npm run benchmarks:dev
```

The benchmark dashboard will open at **`http://localhost:5174`**.

---

## 📊 Measured Metrics

- **Bundle Footprint (gzipped kB):** Production payload size.
- **Mount Latency (ms):** Accurate component initialization and rendering time via `performance.now()`.
- **DOM Node Count:** Total DOM nodes created (demonstrates how LTTB in `pure-svg-charts` caps SVG nodes to ~70 even with 5,000 points).
- **Re-render / Streaming Latency (ms):** Time required to recompute geometry upon dataset mutations.
- **Exportable Markdown Report:** Single-click copyable table ready for GitHub README, Twitter/X, Reddit, or blog posts.
