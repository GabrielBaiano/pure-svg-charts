import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { javascript } from '@codemirror/lang-javascript';
import { LiveRunner } from './LiveRunner';

const PRESETS = {
  stress: `/**
 * ⚡ ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Compiles simple datasets directly into pure SVG paths (< 5kB bundle, zero dependencies).
 * 
 * 🛠️ WHAT THIS DEMO PROVES:
 * High-density stream (60 points) rendered effortlessly at 60-120 FPS with GPU acceleration.
 */
function ChartDemo() {
  // 60 high-density points
  const data = Array.from({ length: 60 }, (_, i) => ({
    label: \`#\${i + 1}\`,
    value: Math.round(180 + Math.sin(i / 4) * 80 + Math.cos(i / 2) * 35)
  }));

  return (
    <div style={{ width: '100%' }}>
      <SvgLineChart
        variant="tokyonight"
        data={data}
        title="High-Density Telemetry Stream (60 Points)"
        subtitle="Zero-overhead SVG geometry • Hardware-accelerated transitions"
        metric="245 units"
        smooth
        fillGradient
        strokeWidth={2}
        height={360}
      />
    </div>
  );
}

render(<ChartDemo />);`,

  crypto: `/**
 * 🪙 ABOUT CRYPTO TICKER:
 * High-volatility financial streaming with neon glow & zero memory leaks.
 */
function ChartDemo() {
  const data = [
    { label: '00:00', value: 64200 },
    { label: '04:00', value: 65100 },
    { label: '08:00', value: 63900 },
    { label: '12:00', value: 67450 },
    { label: '16:00', value: 66800 },
    { label: '20:00', value: 68900 },
    { label: '23:59', value: 68150 }
  ];

  return (
    <div style={{ width: '100%' }}>
      <SvgLineChart
        variant="tokyonight"
        data={data}
        title="BTC / USD Spot Index"
        subtitle="24h Liquidity Variance"
        metric="$68,150"
        smooth
        glow
        showValues
        valueFormatter={(v) => \`$\${v.toLocaleString()}\`}
        height={360}
      />
    </div>
  );
}

render(<ChartDemo />);`,

  saas: `/**
 * 🛍️ ABOUT SAAS REVENUE:
 * Clean fiscal cohorts with automated value badge positioning.
 */
function ChartDemo() {
  const data = [
    { label: 'Jan', value: 24000 },
    { label: 'Feb', value: 31000 },
    { label: 'Mar', value: 28500 },
    { label: 'Apr', value: 42000 },
    { label: 'May', value: 39000 },
    { label: 'Jun', value: 58000 }
  ];

  return (
    <div style={{ width: '100%' }}>
      <SvgLineChart
        variant="tokyonight"
        data={data}
        title="Monthly Recurring Revenue (MRR)"
        subtitle="H1 2026 Financial Cohort"
        metric="$58,000 / mo"
        smooth
        fillGradient
        showValues
        valueFormatter={(v) => \`$\${Math.round(v / 1000)}k\`}
        height={360}
      />
    </div>
  );
}

render(<ChartDemo />);`,

  telemetry: `/**
 * 🖥️ ABOUT CLUSTER TELEMETRY:
 * Low-overhead diagnostics with stepped linear SVG path & dashed stroke.
 */
function ChartDemo() {
  const data = [
    { label: 'NODE_0', value: 42 },
    { label: 'NODE_1', value: 78 },
    { label: 'NODE_2', value: 35 },
    { label: 'NODE_3', value: 94 },
    { label: 'NODE_4', value: 58 },
    { label: 'NODE_5', value: 82 },
    { label: 'NODE_6', value: 64 },
    { label: 'NODE_7', value: 71 }
  ];

  return (
    <div style={{ width: '100%' }}>
      <SvgLineChart
        variant="terminal"
        data={data}
        title="CLUSTER_TELEMETRY_STREAM"
        subtitle="Active Core CPU & I/O Utilization"
        metric="LOAD: 71%"
        smooth={false}
        glow
        strokeDasharray="4 4"
        showValues
        valueFormatter={(v) => \`\${Math.round(v)}%\`}
        height={360}
      />
    </div>
  );
}

render(<ChartDemo />);`,

  quarterly: `/**
 * 📊 ABOUT QUARTERLY AUDIT:
 * Zero-dependency rounded SVG bar chart with responsive auto-spacing.
 */
function ChartDemo() {
  const data = [
    { label: 'Q1 (Jan-Mar)', value: 140 },
    { label: 'Q2 (Apr-Jun)', value: 260 },
    { label: 'Q3 (Jul-Sep)', value: 210 },
    { label: 'Q4 (Oct-Dec)', value: 350 }
  ];

  return (
    <div style={{ width: '100%' }}>
      <SvgBarChart
        variant="tokyonight"
        data={data}
        title="Fiscal Year 2026 Audit"
        subtitle="Quarter-Over-Quarter Volume Analysis"
        metric="$960,000 Total"
        radius={8}
        barGap={0.35}
        showValues
        valueFormatter={(v) => \`$\${Math.round(v)}k\`}
        height={360}
      />
    </div>
  );
}

render(<ChartDemo />);`
};

export function App() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof PRESETS>('stress');
  const [code, setCode] = useState(PRESETS.stress);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSelectScenario = (key: keyof typeof PRESETS) => {
    setSelectedScenario(key);
    setCode(PRESETS[key]);
  };

  const handleReset = () => {
    setCode(PRESETS[selectedScenario]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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
          <span className="toolbar-label">Scenarios:</span>
          <button
            className={`preset-btn ${selectedScenario === 'stress' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('stress')}
          >
            ⚡ High-Density Stress
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'crypto' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('crypto')}
          >
            📈 Crypto Ticker
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'saas' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('saas')}
          >
            🛍️ SaaS Revenue
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'telemetry' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('telemetry')}
          >
            🖥️ Cluster Telemetry
          </button>
          <button
            className={`preset-btn ${selectedScenario === 'quarterly' ? 'active' : ''}`}
            onClick={() => handleSelectScenario('quarterly')}
          >
            📊 Quarterly Audit
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="action-btn" onClick={handleReset} title="Reset to original code">
            ↺ Reset
          </button>
          <button className="action-btn" onClick={handleCopy}>
            {copySuccess ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>
      </div>

      {/* Split View Editor & Preview */}
      <main className="split-view">
        {/* Left Side: CodeMirror Editor with Tokyo Night */}
        <section className="editor-pane">
          <div className="pane-header">
            <div className="tab-tag">
              <span>🌙</span>
              <span>LiveEditor.tsx (Tokyo Night)</span>
            </div>
            <span style={{ fontSize: '11px', color: '#7982a9' }}>
              @uiw/react-codemirror
            </span>
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
              <span>100% Pure SVG</span>
            </div>
          </div>

          <div className="preview-content">
            <LiveRunner code={code} />
          </div>
        </section>
      </main>
    </div>
  );
}
