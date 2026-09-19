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
 * HIGH-DENSITY STRESS TEST (60 POINTS):
 * High-density stream rendered effortlessly at 60-120 FPS with hardware acceleration.
 * Wide layout with adaptive point pitch ensures dots breathe and never collide.
 * 
 * ABOUT PURE-SVG-CHARTS:
 * F@%# 200kB D3 bloat and canvas overhead!
 * Compiles simple datasets directly into pure SVG paths (< 5kB bundle, zero dependencies).
 * Proves that pure SVG geometry handles 60+ data points with zero frame drops.
 */
function ChartDemo() {
  // WHY THIS COMMAND?
  // We use Array.from() with sine + cosine trigonometric harmonics and integer rounding to
  // synthesize an oscillating 60-point telemetry stream directly in-memory without needing
  // external mock APIs or heavy bundle bloat. This demonstrates pure SVG vector morphing running at 60-120 FPS.
  const data = Array.from({ length: 60 }, (_, i) => ({
    label: "#" + (i + 1),
    value: Math.round(180 + Math.sin(i / 4) * 80 + Math.cos(i / 2) * 35)
  }));

  return (
    <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }}>
      {/* Wide canvas prevents dots from overlapping with full axis crosshairs */}
      <SvgLineChart
        variant="tokyonight"
        data={data}
        title="High-Density Telemetry Stream (60 Points)"
        subtitle="Wide canvas • Down & side axis crosshairs • 60-120 FPS"
        metric="245 units"
        smooth
        fillGradient
        strokeWidth={2}
        width={800}
        height={340}
        dotRadius={2.5}
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

const ADDABLE_PROPS = [
  { propName: 'glow', snippet: 'glow', icon: '⚡', name: 'glow', desc: 'GPU drop shadow neon effect' },
  { propName: 'crosshair', snippet: 'crosshair', icon: '🎯', name: 'crosshair', desc: 'Hover crosshair guidelines' },
  { propName: 'showArrows', snippet: 'showArrows={false}', icon: '↗', name: 'showArrows={false}', desc: 'Hide crosshair directional arrows' },
  { propName: 'dotRadius', snippet: 'dotRadius={2.5}', icon: '🔍', name: 'dotRadius={2.5}', desc: 'Small 2.5px point circles' },
  { propName: 'showValues', snippet: 'showValues', icon: '🏷️', name: 'showValues', desc: 'Permanent value badges' },
  { propName: 'strokeDasharray', snippet: 'strokeDasharray="4 4"', icon: '〰️', name: 'strokeDasharray="4 4"', desc: 'Dashed curve style' },
  { propName: 'showDots', snippet: 'showDots={false}', icon: '⚪', name: 'showDots={false}', desc: 'Hide individual data points' },
  { propName: 'fillGradient', snippet: 'fillGradient', icon: '💧', name: 'fillGradient', desc: 'Smooth gradient area under line' },
  { propName: 'smooth', snippet: 'smooth', icon: '🌊', name: 'smooth', desc: 'Cubic Bézier spline interpolation' },
  { propName: 'strokeWidth', snippet: 'strokeWidth={4}', icon: '📏', name: 'strokeWidth={4}', desc: 'Bolder 4px curve stroke' },
  { propName: 'curvature', snippet: 'curvature={0.35}', icon: '📐', name: 'curvature={0.35}', desc: 'Higher spline tension' },
  { propName: 'radius', snippet: 'radius={10}', icon: '🔲', name: 'radius={10}', desc: 'Rounded bar corner radius' },
  { propName: 'barGap', snippet: 'barGap={0.15}', icon: '📊', name: 'barGap={0.15}', desc: 'Dense bar column spacing' }
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
      return prev.replace(/(<Svg(?:Line|Bar)Chart)/, `$1
        variant="${newTheme}"`);
    });
  };

  // Add Prop to Code
  const handleAddProp = (snippet: string) => {
    setCode((prev) => {
      const propName = snippet.split(/[={]/)[0].trim();
      if (new RegExp('\\b' + propName + '\\b').test(prev)) {
        return prev;
      }
      return prev.replace(/(\n\s*)(\/>)/, '$1        ' + snippet + '$1$2');
    });
  };

  // Remove Prop from Code
  const handleRemoveProp = (propName: string) => {
    setCode((prev) => {
      const regex = new RegExp('\\n\\s*' + propName + "(?:=(?:{[^}]*}|\"[^\"]*\"|'[^']*'|\\S+))?", 'g');
      return prev.replace(regex, '');
    });
  };

  // Parse active theme and active props from code
  const currentThemeMatch = code.match(/variant=["']([^"']+)["']/);
  const currentTheme = currentThemeMatch ? currentThemeMatch[1] : 'tokyonight';
  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  const activeProps = ADDABLE_PROPS
    .map((p) => p.propName)
    .filter((propName) => new RegExp('\\b' + propName + '(?:=[^\\s>]+)?\\b').test(code));

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
            {/* Theme Selector Dropdown */}
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

            {/* + Add Config Dropdown Button */}
            <div className="quickbar-dropdown-container">
              <button
                className="quickbar-btn add-btn"
                onClick={() => {
                  setIsAddMenuOpen(!isAddMenuOpen);
                  setIsThemeMenuOpen(false);
                }}
                title="Add a configuration prop to the chart component"
              >
                <span>➕ Add Config</span>
                <span className="dropdown-arrow">▾</span>
              </button>

              {isAddMenuOpen && (
                <div className="quickbar-menu add-menu" onMouseLeave={() => setIsAddMenuOpen(false)}>
                  <div className="menu-header">Select Prop to Insert</div>
                  {ADDABLE_PROPS.map((item) => {
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
