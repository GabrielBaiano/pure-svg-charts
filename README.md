# 📊 Pure SVG Charts

<p align="center">
  <strong>Ultra-lightweight, reactive, and animated SVG charts for React.</strong>
</p>

<p align="center">
  <a href="#-license"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License" /></a>
  <a href="https://bundlephobia.com"><img src="https://img.shields.io/badge/bundle%20size-%3C%205kB-success.svg?style=flat-square" alt="Bundle Size" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React-%3E%3D18.0.0-61dafb.svg?style=flat-square" alt="React 18+" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
</p>

---

## 💡 Overview

**Pure SVG Charts** is a minimal, zero-dependency charting library for React. It transforms simple arrays into clean, optimized SVG paths and shapes with fluid transitions.

Instead of heavy canvas engines or massive D3 bundles, it leverages native SVG geometry and reactive state — making it effortless to link buttons, sliders, and controls to animated chart parameters.

---

## ✨ Features

- 🪶 **Ultra-Lightweight:** Sub-5kB target bundle size with zero heavy runtime dependencies.
- ⚡ **Pure SVG:** Crisp on any display, scalable, and 100% Server-Side Rendering (SSR) friendly.
- 🎛️ **Reactive Controls:** Seamlessly morph paths and parameters when buttons or filters change.
- 🧼 **Simple Data Format:** Pass plain numeric arrays or simple objects — no nested configuration hell.
- 🎨 **Style Friendly:** Works out of the box with Tailwind CSS, CSS variables, or inline styles.

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

## 🚀 Quick Start

```tsx
import React, { useState } from 'react';
import { SvgLineChart } from 'pure-svg-charts';

export function SalesWidget() {
  const [dataset, setDataset] = useState([12, 19, 8, 15, 22, 30]);
  const [smooth, setSmooth] = useState(true);

  return (
    <div>
      {/* Controls to toggle parameters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setDataset([12, 19, 8, 15, 22, 30])}>Week 1</button>
        <button onClick={() => setDataset([5, 14, 25, 18, 10, 35])}>Week 2</button>
        <button onClick={() => setSmooth(!smooth)}>
          {smooth ? 'Smooth Curve' : 'Straight Lines'}
        </button>
      </div>

      {/* Animated SVG Chart */}
      <SvgLineChart
        data={dataset}
        smooth={smooth}
        animated={true}
        stroke="#6366f1"
        strokeWidth={3}
        height={220}
      />
    </div>
  );
}
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © 2026 [Gabriel Baiano](https://github.com/GabrielBaiano).
