import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { javascript } from '@codemirror/lang-javascript';
import { LiveRunner } from './LiveRunner';

const PRESETS = {
  simple: `/**
 * SIMPLE & STATIC (NO TRANSITIONS):
 * Pure, zero-overhead SVG line chart with static data.
 * No state complexity, no period buttons -- directly straight to the point.
 * 
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Compiles simple datasets directly into pure SVG paths (< 5kB bundle, zero dependencies).
 * Pure vector cubic Bezier spline interpolation with hardware-accelerated rendering.
 */
function ChartDemo() {
  // Baseline monthly metrics dataset (6 static data points)
  const data = [
    { label: 'Jan', value: 35 },
    { label: 'Feb', value: 58 },
    { label: 'Mar', value: 42 },
    { label: 'Apr', value: 89 },
    { label: 'May', value: 64 },
    { label: 'Jun', value: 105 }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      {/* Zero-dependency pure SVG line chart */}
      <SvgLineChart
        variant="tokyonight"
        data={data}
        title="Monthly Active Users (MAU)"
        subtitle="H1 2026 Direct Performance • Static Vector Rendering"
        metric="105,400 users"
        smooth
        fillGradient
        crosshair
        height={340}
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  periods: `/**
 * MULTI-PERIOD TRANSITIONS:
 * Demonstrates hardware-accelerated SVG path morphing across multiple timeframes.
 * Click any period button to navigate between datasets and observe fluid 60-120 FPS transitions.
 * 
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Native CSS GPU transitions animate SVG paths ('d' attribute and point coordinates)
 * smoothly without any external animation library or requestAnimationFrame loop.
 */
function ChartDemo() {
  // Multi-timeframe telemetry datasets with dynamic density (6 to 60 points)
  const PERIODS = {
    '1H': [
      { label: '10m', value: 120 },
      { label: '20m', value: 180 },
      { label: '30m', value: 165 },
      { label: '40m', value: 240 },
      { label: '50m', value: 210 },
      { label: '60m', value: 290 }
    ],
    '24H': [
      { label: '04h', value: 420 },
      { label: '08h', value: 780 },
      { label: '12h', value: 650 },
      { label: '16h', value: 920 },
      { label: '20h', value: 840 },
      { label: '24h', value: 1150 }
    ],
    '7D': [
      { label: 'Mon', value: 1800 },
      { label: 'Tue', value: 2400 },
      { label: 'Wed', value: 2100 },
      { label: 'Thu', value: 3200 },
      { label: 'Fri', value: 2900 },
      { label: 'Sat', value: 3900 },
      { label: 'Sun', value: 4600 }
    ],
    '30D': [
      { label: 'W1', value: 8500 },
      { label: 'W2', value: 12400 },
      { label: 'W3', value: 16800 },
      { label: 'W4', value: 22100 }
    ]
  };

  // Active period state controlling reactive dataset switching
  const [activePeriod, setActivePeriod] = useState('7D');
  const [data, setData] = useState(PERIODS['7D']);

  const switchPeriod = (period) => {
    setActivePeriod(period);
    setData(PERIODS[period]);
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Timeframe Navigation Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7aa2f7', textTransform: 'uppercase' }}>
          Period:
        </span>
        {Object.keys(PERIODS).map((period) => (
          <button
            key={period}
            className={"btn " + (activePeriod === period ? "active" : "")}
            onClick={() => switchPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Reactive Morphing SVG Chart */}
      <SvgLineChart
        variant="tokyonight"
        data={data}
        title={"Telemetry Stream (" + activePeriod + ")"}
        subtitle="Smooth SVG Bezier morphing across time periods"
        metric={(data[data.length - 1]?.value?.toLocaleString() || "") + " ops"}
        smooth
        fillGradient
        crosshair
        height={340}
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  stress: `/**
 * HIGH-DENSITY STRESS TEST (5,000 POINTS):
 * Massive telemetry dataset (5,000 points) rendered at 60-120 FPS using LTTB downsampling.
 * The Largest-Triangle-Three-Buckets (LTTB) algorithm visually downsamples to 300 points
 * preserving all peaks, valleys, and trends with zero DOM lag (< 80 SVG nodes).
 * 
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Proves that pure SVG geometry handles 5,000+ data points smoothly with single-target hover tracking.
 */
function ChartDemo() {
  const [pointCount, setPointCount] = useState(5000);

  // Synthesize oscillating telemetry stream with high-frequency wave harmonics
  const data = useMemo(() => {
    return Array.from({ length: pointCount }, (_, i) => ({
      label: "#" + (i + 1),
      value: Math.round(
        200 +
          Math.sin(i / (pointCount / 50)) * 90 +
          Math.cos(i / (pointCount / 120)) * 45 +
          Math.sin(i / (pointCount / 400)) * 25
      )
    }));
  }, [pointCount]);

  return (
    <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Density Navigation Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7aa2f7', textTransform: 'uppercase' }}>
          Dataset:
        </span>
        {[1000, 5000, 10000].map((count) => (
          <button
            key={count}
            className={"btn " + (pointCount === count ? "active" : "")}
            onClick={() => setPointCount(count)}
          >
            {count.toLocaleString()} pts
          </button>
        ))}
      </div>

      <SvgLineChart
        variant="tokyonight"
        data={data}
        title={"High-Density Stream (" + pointCount.toLocaleString() + " Points)"}
        subtitle="LTTB downsampling • Single-target hover tracking • 60-120 FPS"
        metric="284 ops/s"
        smooth
        fillGradient
        strokeWidth={2}
        width={800}
        height={340}
        crosshair
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  crypto: `/**
 * CRYPTO TICKER & SPOT INDEX:
 * High-volatility financial streaming with neon glow and currency pair navigation.
 * Demonstrates value formatting, neon drop-shadow filters, and instant asset switching.
 * 
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Delivers crisp financial visualization with SVG vector precision and zero latency.
 */
function ChartDemo() {
  // Spot market currency pairs with timestamp intervals
  const PAIRS = {
    'BTC': [
      { label: '00:00', value: 64200 },
      { label: '04:00', value: 65100 },
      { label: '08:00', value: 63900 },
      { label: '12:00', value: 67450 },
      { label: '16:00', value: 66800 },
      { label: '20:00', value: 68900 },
      { label: '23:59', value: 68150 }
    ],
    'ETH': [
      { label: '00:00', value: 3380 },
      { label: '04:00', value: 3450 },
      { label: '08:00', value: 3390 },
      { label: '12:00', value: 3580 },
      { label: '16:00', value: 3510 },
      { label: '20:00', value: 3690 },
      { label: '23:59', value: 3640 }
    ],
    'SOL': [
      { label: '00:00', value: 142 },
      { label: '04:00', value: 148 },
      { label: '08:00', value: 139 },
      { label: '12:00', value: 165 },
      { label: '16:00', value: 158 },
      { label: '20:00', value: 174 },
      { label: '23:59', value: 171 }
    ]
  };

  // Active cryptocurrency pair state
  const [activePair, setActivePair] = useState('BTC');
  const data = PAIRS[activePair];

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Pair Switcher Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7aa2f7', textTransform: 'uppercase' }}>
          Asset:
        </span>
        {Object.keys(PAIRS).map((pair) => (
          <button
            key={pair}
            className={"btn " + (activePair === pair ? "active" : "")}
            onClick={() => setActivePair(pair)}
          >
            {pair + "/USD"}
          </button>
        ))}
      </div>

      {/* Financial Chart with Currency Formatter & Glow Filter */}
      <SvgLineChart
        variant="tokyonight"
        data={data}
        title={activePair + " / USD Spot Index"}
        subtitle="24h Liquidity Variance"
        metric={"$" + (data[data.length - 1]?.value?.toLocaleString() || "")}
        smooth
        glow
        showValues
        crosshair
        valueFormatter={(v) => "$" + v.toLocaleString()}
        height={340}
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  quarterly: `/**
 * QUARTERLY AUDIT & BAR ANALYSIS:
 * Zero-dependency rounded SVG bar chart with responsive auto-spacing and hover tooltips.
 * Clean categorical comparisons with customizable bar radius and gap ratios.
 * 
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Pure SVG rect geometry with CSS transitions for height, position, and color morphing.
 */
function ChartDemo() {
  // Fiscal quarters dataset
  const data = [
    { label: 'Q1 (Jan-Mar)', value: 140 },
    { label: 'Q2 (Apr-Jun)', value: 260 },
    { label: 'Q3 (Jul-Sep)', value: 210 },
    { label: 'Q4 (Oct-Dec)', value: 350 }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      {/* Rounded bar chart with value badges and crosshair tracking */}
      <SvgBarChart
        variant="tokyonight"
        data={data}
        title="Fiscal Year 2026 Audit"
        subtitle="Quarter-Over-Quarter Volume Analysis"
        metric="$960,000 Total"
        radius={8}
        barGap={0.35}
        showValues
        crosshair
        valueFormatter={(v) => "$" + Math.round(v) + "k"}
        height={340}
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  multiseries: `/**
 * MULTI-SERIES LINE CHART:
 * Multiple datasets rendered on the same canvas with a shared Y axis scale.
 * Each series has its own color, legend entry, and independent fill gradient.
 * Crosshair and tooltip identify the exact series being hovered.
 *
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Unified global min/max keeps all series proportionally aligned without external math libraries.
 */
function ChartDemo() {
  // Three performance metrics tracked over the same 6-month window
  const series = [
    {
      name: 'Revenue',
      color: '#7aa2f7',
      fillGradient: true,
      data: [
        { label: 'Jan', value: 42 },
        { label: 'Feb', value: 68 },
        { label: 'Mar', value: 55 },
        { label: 'Apr', value: 91 },
        { label: 'May', value: 78 },
        { label: 'Jun', value: 114 }
      ]
    },
    {
      name: 'Expenses',
      color: '#f7768e',
      strokeDasharray: '5 4',
      data: [
        { label: 'Jan', value: 38 },
        { label: 'Feb', value: 45 },
        { label: 'Mar', value: 60 },
        { label: 'Apr', value: 52 },
        { label: 'May', value: 70 },
        { label: 'Jun', value: 65 }
      ]
    },
    {
      name: 'Profit',
      color: '#9ece6a',
      data: [
        { label: 'Jan', value: 4 },
        { label: 'Feb', value: 23 },
        { label: 'Mar', value: -5 },
        { label: 'Apr', value: 39 },
        { label: 'May', value: 8 },
        { label: 'Jun', value: 49 }
      ]
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      {/* Multi-series chart with shared global scale and per-series legend */}
      <SvgLineChart
        variant="tokyonight"
        series={series}
        title="H1 2026 — Financial Overview"
        subtitle="Revenue vs Expenses vs Profit (shared scale)"
        metric="$114k Revenue"
        crosshair
        showLegend
        height={340}
        valueFormatter={(v) => (v >= 0 ? '+' : '') + v + 'k'}
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  donut: `/**
 * DONUT CHART — CATEGORY DISTRIBUTION:
 * Pure SVG donut chart rendered with stroke-dasharray math on a single <circle> element.
 * Hover any slice or legend row to isolate and inspect category breakdowns.
 * Center text updates dynamically to reflect the active selection.
 *
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * No canvas, no D3 arc generators — pure trigonometry converted to stroke offsets.
 */
function ChartDemo() {
  // Q2 2026 marketing budget distribution across channels
  const [data, setData] = useState([
    { label: 'Paid Search', value: 38, color: '#7aa2f7' },
    { label: 'Social Ads',  value: 24, color: '#9ece6a' },
    { label: 'Content SEO', value: 18, color: '#e0af68' },
    { label: 'Email',       value: 12, color: '#bb9af7' },
    { label: 'Referral',    value: 8,  color: '#f7768e' }
  ]);

  return (
    <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      {/* Interactive donut with center total and hover isolation */}
      <SvgDonutChart
        variant="tokyonight"
        data={data}
        title="Marketing Budget — Q2 2026"
        subtitle="Channel distribution by percentage share"
        metric="$240k Total"
        size={240}
        innerRadiusRatio={0.68}
        showLegend
        animated
        valueFormatter={(v) => v + '%'}
        centerLabel="Budget"
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  kpi: `/**
 * KPI DASHBOARD WITH SPARKLINES:
 * Compact KPI cards pairing a metric headline with an inline SvgSparkline trend indicator.
 * Each sparkline renders as a standalone inline SVG element with gradient fill and end-dot.
 * Zero state complexity -- data is declared statically and passed directly to the component.
 *
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Sparklines are the smallest possible chart unit -- pure path + optional gradient in <120px.
 */
function ChartDemo() {
  // KPI metrics with historical trend data for sparkline rendering
  const kpis = [
    {
      label: 'Daily Active Users',
      value: '24,850',
      change: '+12.4%',
      positive: true,
      color: '#7aa2f7',
      trend: [18200, 19400, 18800, 21000, 20400, 22900, 24850]
    },
    {
      label: 'Conversion Rate',
      value: '3.82%',
      change: '+0.6pp',
      positive: true,
      color: '#9ece6a',
      trend: [2.9, 3.1, 3.0, 3.4, 3.3, 3.6, 3.82]
    },
    {
      label: 'Avg Session (s)',
      value: '142s',
      change: '-8s',
      positive: false,
      color: '#f7768e',
      trend: [165, 158, 160, 152, 148, 150, 142]
    },
    {
      label: 'Bounce Rate',
      value: '34.1%',
      change: '-2.3pp',
      positive: true,
      color: '#e0af68',
      trend: [42, 40, 39, 37, 36, 35, 34.1]
    }
  ];

  const card = {
    background: '#1a1b26',
    border: '1px solid #2f3549',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    color: '#c0caf5'
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {kpis.map((kpi) => (
        <div key={kpi.label} style={card}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>{kpi.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>{kpi.value}</div>
            <div style={{ fontSize: '12px', marginTop: '2px', color: kpi.positive ? '#9ece6a' : '#f7768e', fontWeight: 700 }}>
              {kpi.change}
            </div>
          </div>
          {/* Compact inline sparkline — 140x40px standalone SVG */}
          <SvgSparkline
            data={kpi.trend}
            width={140}
            height={40}
            color={kpi.color}
            strokeWidth={2}
            fillArea
            showEndDot
          />
        </div>
      ))}
    </div>
  );
}

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`,

  stackedbars: `/**
 * STACKED REVENUE STREAMS (QUARTERLY BREAKDOWN):
 * Multi-series stacked bar chart decomposing revenue across three distinct channels.
 * Demonstrates cumulative stacking math, per-segment hover metrics with percentage share,
 * and seamless toggle to grouped side-by-side bar mode.
 * 
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * High-precision financial bar stacking rendered natively in pure SVG with zero external dependencies.
 */
function ChartDemo() {
  const [stacked, setStacked] = useState(true);

  const series = [
    {
      name: 'Subscriptions',
      color: '#7aa2f7',
      data: [
        { label: 'Q1', value: 48 },
        { label: 'Q2', value: 62 },
        { label: 'Q3', value: 78 },
        { label: 'Q4', value: 95 }
      ]
    },
    {
      name: 'Enterprise',
      color: '#f7768e',
      data: [
        { label: 'Q1', value: 24 },
        { label: 'Q2', value: 38 },
        { label: 'Q3', value: 45 },
        { label: 'Q4', value: 58 }
      ]
    },
    {
      name: 'Services',
      color: '#9ece6a',
      data: [
        { label: 'Q1', value: 16 },
        { label: 'Q2', value: 20 },
        { label: 'Q3', value: 26 },
        { label: 'Q4', value: 32 }
      ]
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7aa2f7', textTransform: 'uppercase' }}>
          Bar Mode:
        </span>
        <button
          className={"btn " + (stacked ? "active" : "")}
          onClick={() => setStacked(true)}
        >
          Stacked Bars
        </button>
        <button
          className={"btn " + (!stacked ? "active" : "")}
          onClick={() => setStacked(false)}
        >
          Grouped (Side-by-Side)
        </button>
      </div>

      <SvgBarChart
        variant="tokyonight"
        series={series}
        stacked={stacked}
        title="2026 Fiscal Revenue Streams"
        subtitle="Quarterly channel breakdown • Percentage share on hover"
        metric="$419k Total"
        barGap={0.35}
        radius={6}
        width={800}
        height={340}
        crosshair
      />
    </div>
  );
}

render(<ChartDemo />);

// Special thanks to @uiw/react-codemirror for powering this live in-browser editor playground.`
};

const THEME_OPTIONS = [
  { id: 'tokyonight', icon: '🌙', label: 'Tokyo Night', desc: 'Neon blue & deep purple night' },
  { id: 'cyberpunk', icon: '⚡', label: 'Cyberpunk', desc: 'Hot yellow, cyan & dark neon' },
  { id: 'glass', icon: '💎', label: 'Financial Glass', desc: 'Translucent emerald & dark slate' },
  { id: 'paper', icon: '📄', label: 'Light Paper', desc: 'Minimalist editorial slate & ink' },
  { id: 'terminal', icon: '📟', label: 'Retro Terminal', desc: 'Monochrome CRT phosphor green' },
  { id: 'default', icon: '🔷', label: 'Classic Indigo', desc: 'Clean default indigo blue' }
];

const ADDABLE_PROPS: {
  propName: string;
  snippet: string;
  icon: string;
  name: string;
  desc: string;
  components: string[];
}[] = [
  // --- SvgLineChart & SvgBarChart (BaseChartProps) ---
  { propName: 'glow',             snippet: 'glow',                   icon: '⚡',  name: 'glow',                   desc: 'GPU drop shadow neon effect',             components: ['SvgLineChart', 'SvgBarChart'] },
  { propName: 'crosshair',        snippet: 'crosshair',              icon: '🎯',  name: 'crosshair',               desc: 'Position guidelines & axis badges',       components: ['SvgLineChart', 'SvgBarChart'] },
  { propName: 'showValues',       snippet: 'showValues',             icon: '🏷️',  name: 'showValues',              desc: 'Permanent value badges above points',     components: ['SvgLineChart', 'SvgBarChart'] },
  // --- SvgLineChart only ---
  { propName: 'dotRadius',        snippet: 'dotRadius={2.5}',        icon: '🔍',  name: 'dotRadius={2.5}',         desc: 'Small 2.5px point circles',               components: ['SvgLineChart'] },
  { propName: 'strokeDasharray',  snippet: 'strokeDasharray="4 4"',  icon: '〰️', name: 'strokeDasharray="4 4"',   desc: 'Dashed curve style',                      components: ['SvgLineChart'] },
  { propName: 'showDots',         snippet: 'showDots={false}',       icon: '⚪',  name: 'showDots={false}',        desc: 'Hide individual data point circles',      components: ['SvgLineChart'] },
  { propName: 'fillGradient',     snippet: 'fillGradient',           icon: '💧',  name: 'fillGradient',            desc: 'Gradient area fill under the line',       components: ['SvgLineChart'] },
  { propName: 'smooth',           snippet: 'smooth',                 icon: '🌊',  name: 'smooth',                  desc: 'Cubic Bézier spline interpolation',       components: ['SvgLineChart'] },
  { propName: 'strokeWidth',      snippet: 'strokeWidth={4}',        icon: '📏',  name: 'strokeWidth={4}',         desc: 'Bolder 4px curve stroke',                 components: ['SvgLineChart'] },
  { propName: 'curvature',        snippet: 'curvature={0}',          icon: '📐',  name: 'curvature={0}',           desc: 'Straight lines (zero curvature)',         components: ['SvgLineChart'] },
  { propName: 'showLegend',       snippet: 'showLegend={false}',     icon: '📋',  name: 'showLegend={false}',      desc: 'Hide multi-series legend',                components: ['SvgLineChart', 'SvgBarChart'] },
  { propName: 'stacked',          snippet: 'stacked={false}',        icon: '📊',  name: 'stacked={false}',         desc: 'Toggle stacked vs grouped mode',          components: ['SvgBarChart', 'SvgLineChart'] },
  { propName: 'maxDisplayPoints', snippet: 'maxDisplayPoints={150}', icon: '⚡',  name: 'maxDisplayPoints={150}',  desc: 'LTTB target display resolution',          components: ['SvgLineChart'] },
  // --- SvgBarChart only ---
  { propName: 'radius',           snippet: 'radius={10}',            icon: '🔲',  name: 'radius={10}',             desc: 'Rounded bar corner radius',               components: ['SvgBarChart'] },
  { propName: 'barGap',           snippet: 'barGap={0.15}',          icon: '📊',  name: 'barGap={0.15}',           desc: 'Dense bar column spacing',                components: ['SvgBarChart'] },
  // --- SvgDonutChart only ---
  { propName: 'showLegend',       snippet: 'showLegend={false}',     icon: '📋',  name: 'showLegend={false}',      desc: 'Hide slice legend',                       components: ['SvgDonutChart'] },
  { propName: 'animated',         snippet: 'animated={false}',       icon: '⏸',   name: 'animated={false}',        desc: 'Disable slice transition animations',     components: ['SvgDonutChart'] },
  { propName: 'innerRadiusRatio', snippet: 'innerRadiusRatio={0.5}', icon: '🍩',  name: 'innerRadiusRatio={0.5}',  desc: 'Thicker ring (0 = pie chart)',            components: ['SvgDonutChart'] },
  // --- SvgSparkline only ---
  { propName: 'fillArea',         snippet: 'fillArea={false}',       icon: '💧',  name: 'fillArea={false}',        desc: 'Disable gradient area fill',              components: ['SvgSparkline'] },
  { propName: 'showEndDot',       snippet: 'showEndDot={false}',     icon: '⚪',  name: 'showEndDot={false}',      desc: 'Hide glowing end-point indicator',        components: ['SvgSparkline'] },
  { propName: 'smooth',           snippet: 'smooth={false}',         icon: '🌊',  name: 'smooth={false}',          desc: 'Use straight line segments',              components: ['SvgSparkline'] },
  { propName: 'strokeWidth',      snippet: 'strokeWidth={3}',        icon: '📏',  name: 'strokeWidth={3}',         desc: 'Bolder 3px sparkline stroke',             components: ['SvgSparkline'] },
];

export function App() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof PRESETS>('simple');
  const [code, setCode] = useState(PRESETS.simple);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [liveStats, setLiveStats] = useState<{ nodes: number; bytes: number } | null>(null);

  const handleSelectScenario = (key: keyof typeof PRESETS) => {
    setSelectedScenario(key);
    setCode(PRESETS[key]);
    setIsThemeMenuOpen(false);
    setIsAddMenuOpen(false);
  };

  const handleReset = () => {
    setCode(PRESETS[selectedScenario]);
    setIsThemeMenuOpen(false);
    setIsAddMenuOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Switch Theme in Code
  const handleThemeChange = (newTheme: string) => {
    setCode((prev) => {
      if (/variant=["'][^"']*["']/.test(prev)) {
        return prev.replace(/variant=["'][^"']*["']/, `variant="${newTheme}"`);
      }
      return prev.replace(/(<(?:SvgLineChart|SvgBarChart|SvgDonutChart) )/, `$1\n        variant="${newTheme}"`);
    });
  };

  // Add Prop to Code
  const handleAddProp = (snippet: string) => {
    setCode((prev) => {
      const propName = snippet.split(/[={]/)[0].trim();
      // Match inside the chart JSX component only
      return prev.replace(/(<(?:SvgLineChart|SvgBarChart|SvgDonutChart|SvgSparkline))([\s\S]*?)(\/>)/, (match, openTag, attrs, closeTag) => {
        if (new RegExp('\\b' + propName + '\\b').test(attrs)) {
          return match;
        }
        return openTag + attrs + '\n        ' + snippet + '\n      ' + closeTag;
      });
    });
  };

  // Remove Prop from Code — strictly inside JSX chart tags to avoid corrupting JS data objects
  const handleRemoveProp = (propName: string) => {
    setCode((prev) => {
      return prev.replace(/(<(?:SvgLineChart|SvgBarChart|SvgDonutChart|SvgSparkline))([\s\S]*?)(\/>)/g, (_, openTag, attrs, closeTag) => {
        const propRegex = new RegExp('\\n\\s*\\b' + propName + '\\b(?:=(?:\\{[^}]*\\}|"[^"]*"|\'[^\']*\'))?', 'g');
        return openTag + attrs.replace(propRegex, '') + closeTag;
      });
    });
  };

  // Parse active theme from code
  const currentThemeMatch = code.match(/variant=["']([^"']+)["']/);
  const currentTheme = currentThemeMatch ? currentThemeMatch[1] : 'tokyonight';
  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  // Detect which chart component(s) are present in the current code
  const ALL_COMPONENTS = ['SvgLineChart', 'SvgBarChart', 'SvgDonutChart', 'SvgSparkline'] as const;
  const detectedComponents = ALL_COMPONENTS.filter((c) => code.includes(c));

  // Only show props that apply to at least one of the detected components
  const seen = new Set<string>();
  const filteredProps = ADDABLE_PROPS.filter((p) => {
    if (!p.components.some((c) => detectedComponents.includes(c as any))) return false;
    if (seen.has(p.propName)) return false;
    seen.add(p.propName);
    return true;
  });

  // Extract all JSX attributes from the chart component tag to avoid false positives with JS object properties
  const chartTagMatch = code.match(/<(?:SvgLineChart|SvgBarChart|SvgDonutChart|SvgSparkline)([\s\S]*?)\/>/);
  const chartAttrs = chartTagMatch ? chartTagMatch[1] : '';

  const activeProps = filteredProps
    .map((p) => p.propName)
    .filter((propName) => new RegExp('\\b' + propName + '\\b').test(chartAttrs));

  // Show theme button only when variant= is applicable (not sparkline-only presets)
  const hasVariantProp = detectedComponents.some((c) => c !== 'SvgSparkline');

  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">
          <span className="brand-title">Pure SVG Charts</span>
          <div className="nav-badges">
            <span className="nav-badge">&lt; 5kB Bundle</span>
            <span className="nav-badge">Tokyo Night</span>
            <span className="nav-badge">Pure SVG</span>
            <span className="nav-badge">Zero Deps</span>
          </div>
        </div>

        <a
          href="https://github.com/GabrielBaiano/pure-svg-charts"
          target="_blank"
          rel="noreferrer"
          className="github-link"
        >
          GitHub ↗
        </a>
      </header>

      {/* Scenarios Toolbar */}
      <div className="toolbar">
        <div className="preset-group">
          <span className="toolbar-label">Examples:</span>
          <button
            className={`preset-btn ${selectedScenario === 'simple' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('simple')}
          >
            Simple Static
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'periods' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('periods')}
          >
            Multi-Period Transitions
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'stress' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('stress')}
          >
            High-Density Stress
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'crypto' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('crypto')}
          >
            Crypto Ticker
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'quarterly' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('quarterly')}
          >
            Bar Audit
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'stackedbars' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('stackedbars')}
          >
            Stacked Bars
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'multiseries' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('multiseries')}
          >
            Multi-Series
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'donut' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('donut')}
          >
            Donut Chart
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'kpi' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('kpi')}
          >
            KPI Sparklines
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="action-btn" onClick={handleReset} title="Reset to original code">
            Reset
          </button>
          <button className="action-btn" onClick={handleCopy}>
            {copySuccess ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Split View Editor & Preview */}
      <main className="split-view">
        {/* Left Side: CodeMirror Editor with Tokyo Night */}
        <section className="editor-pane">
          <div className="pane-header">
            <div className="tab-tag">
              <span>LiveEditor.tsx (Tokyo Night)</span>
            </div>
            <span style={{ fontSize: '11px', color: '#7982a9' }}>
              @uiw/react-codemirror
            </span>
          </div>

          {/* Interactive Configs Quickbar */}
          <div className="editor-quickbar">
            {/* Theme Selector Dropdown — only shown for components that support variant= */}
            {hasVariantProp && (
              <div className="quickbar-dropdown-container">
                <button
                  className="quickbar-btn theme-btn"
                  onClick={() => {
                    setIsThemeMenuOpen(!isThemeMenuOpen);
                    setIsAddMenuOpen(false);
                  }}
                  title="Click to change theme variant in code"
                >
                  <span>{activeThemeObj.icon} {activeThemeObj.label}</span>
                  <span className="dropdown-arrow">▾</span>
                </button>

                {isThemeMenuOpen && (
                  <div className="quickbar-menu theme-menu" onMouseLeave={() => setIsThemeMenuOpen(false)}>
                    <div className="menu-header">Change Theme Variant</div>
                    {THEME_OPTIONS.map((t) => (
                      <button
                        key={t.id}
                        className={`menu-item ${currentTheme === t.id ? 'active' : ''}`}
                        onClick={() => {
                          handleThemeChange(t.id);
                          setIsThemeMenuOpen(false);
                        }}
                      >
                        <span className="menu-item-icon">{t.icon}</span>
                        <div className="menu-item-info">
                          <span className="menu-item-name">{t.label}</span>
                          <span className="menu-item-desc">{t.desc}</span>
                        </div>
                        {currentTheme === t.id && <span className="menu-item-check">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Active Configs Pills (Click ✕ to remove from code) */}
            <div className="quickbar-pills">
              {activeProps.map((prop) => (
                <span key={prop} className="prop-chip" title={`Active config: ${prop}. Click ✕ to remove.`}>
                  <span className="chip-name">{prop}</span>
                  <button
                    className="chip-remove"
                    onClick={() => handleRemoveProp(prop)}
                    title={`Remove ${prop} from code`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {/* + Add Config Dropdown Button — shows only props compatible with the detected chart */}
            {filteredProps.length > 0 && (
              <div className="quickbar-dropdown-container">
                <button
                  className="quickbar-btn add-btn"
                  onClick={() => {
                    setIsAddMenuOpen(!isAddMenuOpen);
                    setIsThemeMenuOpen(false);
                  }}
                  title="Add a configuration prop to the chart component"
                >
                  <span>+ Add Config</span>
                  <span className="dropdown-arrow">▾</span>
                </button>

                {isAddMenuOpen && (
                  <div className="quickbar-menu add-menu" onMouseLeave={() => setIsAddMenuOpen(false)}>
                    {/* Show which component the props belong to */}
                    <div className="menu-header">
                      Props for {detectedComponents.join(' + ') || 'unknown'}
                    </div>
                    {filteredProps.map((item) => {
                      const isAlreadyAdded = activeProps.includes(item.propName);
                      return (
                        <button
                          key={item.snippet}
                          disabled={isAlreadyAdded}
                          className={`menu-item ${isAlreadyAdded ? 'disabled' : ''}`}
                          onClick={() => {
                            if (!isAlreadyAdded) {
                              handleAddProp(item.snippet);
                              setIsAddMenuOpen(false);
                            }
                          }}
                        >
                          <span className="menu-item-icon">{item.icon}</span>
                          <div className="menu-item-info">
                            <span className="menu-item-name">{item.name}</span>
                            <span className="menu-item-desc">{item.desc}</span>
                          </div>
                          {isAlreadyAdded ? (
                            <span className="menu-item-badge">Added</span>
                          ) : (
                            <span className="menu-item-add-icon">+</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="codemirror-wrapper">
            <CodeMirror
              value={code}
              height="100%"
              theme={tokyoNight}
              extensions={[javascript({ jsx: true, typescript: true })]}
              onChange={(val) => setCode(val)}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                foldGutter: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                highlightActiveLine: true
              }}
            />
          </div>
        </section>

        {/* Right Side: Live Output with Pure SVG Chart */}
        <section className="preview-pane">
          <div className="pane-header">
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#c0caf5' }}>
              Live Output & Diagnostics
            </span>
            <div className="status-tag">
              <span className="status-dot" />
              <span>
                100% Pure SVG
                {liveStats ? ` • ${liveStats.nodes} Nodes • ${liveStats.bytes.toLocaleString()} B` : ''}
              </span>
            </div>
          </div>

          <div className="preview-content">
            <LiveRunner code={code} onStatsChange={setLiveStats} />
          </div>
        </section>
      </main>
    </div>
  );
}
