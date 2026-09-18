import React, { useState, useRef } from 'react';
import { LiveRunner } from './LiveRunner';

const PRESETS = {
  cyberpunk: `// ⚡ Scenario 1: Cyberpunk Neon Glow (With Titles, Numbers & Values)
function ChartDemo() {
  const [data, setData] = useState([
    { label: '00:00', value: 42 },
    { label: '04:00', value: 68 },
    { label: '08:00', value: 35 },
    { label: '12:00', value: 92 },
    { label: '16:00', value: 58 },
    { label: '20:00', value: 84 },
    { label: '23:59', value: 76 }
  ]);
  const [color, setColor] = useState('#00f0ff');
  const [glow, setGlow] = useState(true);
  const [showValues, setShowValues] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Parameter Control Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button 
          className="btn" 
          onClick={() => setData(data.map(d => ({ ...d, value: Math.floor(Math.random() * 80) + 20 })))}
        >
          🎲 Shuffle Telemetry
        </button>
        <button 
          className="btn" 
          onClick={() => setColor(color === '#00f0ff' ? '#ff007f' : color === '#ff007f' ? '#39ff14' : '#00f0ff')}
        >
          🎨 Neon Palette
        </button>
        <button 
          className={\`btn \${glow ? 'active' : ''}\`} 
          onClick={() => setGlow(!glow)}
        >
          {glow ? '✨ Glow Enabled' : '🚫 Glow Disabled'}
        </button>
        <button 
          className={\`btn \${showValues ? 'active' : ''}\`} 
          onClick={() => setShowValues(!showValues)}
        >
          {showValues ? '🔢 Numbers on Points: ON' : '🔢 Numbers on Points: OFF'}
        </button>
      </div>

      {/* Cyberpunk Themed Container */}
      <div className="theme-card theme-cyberpunk">
        <SvgLineChart
          title="CYBERNETIC TELEMETRY"
          subtitle="Real-time Node Latency & Packet Flow"
          metric="99.8% UPTIME"
          data={data}
          color={color}
          glow={glow}
          smooth={true}
          strokeWidth={3}
          fillGradient={true}
          gradientStartOpacity={0.4}
          showGrid={true}
          gridLines={4}
          showXAxis={true}
          showYAxis={true}
          showValues={showValues}
          valueFormatter={(val) => \`\${val}ms\`}
          animated={true}
          height={240}
        />
      </div>
    </div>
  );
}

render(<ChartDemo />);`,

  glass: `// 💎 Scenario 2: Financial Glassmorphism (Titles, Currencies & Gradients)
function ChartDemo() {
  const datasets = {
    '1D': [
      { label: '09h', value: 3380 },
      { label: '12h', value: 3415 },
      { label: '15h', value: 3390 },
      { label: '18h', value: 3445 },
      { label: '21h', value: 3420 }
    ],
    '1W': [
      { label: 'Mon', value: 3100 },
      { label: 'Tue', value: 3250 },
      { label: 'Wed', value: 3180 },
      { label: 'Thu', value: 3390 },
      { label: 'Fri', value: 3420 }
    ],
    '1M': [
      { label: 'W1', value: 2800 },
      { label: 'W2', value: 3120 },
      { label: 'W3', value: 3290 },
      { label: 'W4', value: 3420 }
    ]
  };

  const [timeframe, setTimeframe] = useState('1W');
  const [fillGradient, setFillGradient] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Timeframe selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['1D', '1W', '1M'].map((tf) => (
          <button
            key={tf}
            className={\`btn \${timeframe === tf ? 'active' : ''}\`}
            onClick={() => setTimeframe(tf)}
          >
            📅 {tf} Period
          </button>
        ))}
        <button
          className="btn"
          onClick={() => setFillGradient(!fillGradient)}
        >
          {fillGradient ? '💧 Fill Area: ON' : '🚫 Line Only'}
        </button>
      </div>

      {/* Glassmorphic Container */}
      <div className="theme-card theme-glass">
        <SvgLineChart
          title="ETH / USD Market Price"
          subtitle="Decentralized Liquidity Pool (Mainnet)"
          metric="$3,420.50 (+14.2%)"
          data={datasets[timeframe]}
          color="#10b981"
          smooth={true}
          strokeWidth={3.5}
          fillGradient={fillGradient}
          gradientStartOpacity={0.35}
          showGrid={true}
          showXAxis={true}
          showYAxis={true}
          valueFormatter={(v) => \`$\${v.toLocaleString()}\`}
          animated={true}
          height={240}
        />
      </div>
    </div>
  );
}

render(<ChartDemo />);`,

  paper: `// 📄 Scenario 3: Clean Minimalist / Light Paper (Permanent Values & Clean Typography)
function ChartDemo() {
  const [data, setData] = useState([
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 24 },
    { label: 'Mar', value: 18 },
    { label: 'Apr', value: 36 },
    { label: 'May', value: 28 },
    { label: 'Jun', value: 45 }
  ]);
  const [showValues, setShowValues] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="btn" 
          onClick={() => setData(data.map(d => ({ ...d, value: Math.floor(Math.random() * 40) + 10 })))}
        >
          🎲 Randomize Subscribers
        </button>
        <button 
          className={\`btn \${showValues ? 'active' : ''}\`} 
          onClick={() => setShowValues(!showValues)}
        >
          {showValues ? '🏷️ Numbers on Points: Visible' : '🏷️ Numbers: Hidden'}
        </button>
      </div>

      {/* Light Paper Theme Card */}
      <div className="theme-card theme-paper">
        <SvgLineChart
          title="Active Paid Subscribers"
          subtitle="Monthly recurring subscriptions (2026)"
          metric="45,000 Users"
          data={data}
          color="#4f46e5"
          smooth={true}
          strokeWidth={3}
          fillGradient={true}
          gradientStartOpacity={0.15}
          showGrid={true}
          gridLines={4}
          showXAxis={true}
          showYAxis={true}
          showValues={showValues}
          valueFormatter={(v) => \`\${v}k\`}
          animated={true}
          height={230}
        />
      </div>
    </div>
  );
}

render(<ChartDemo />);`,

  terminal: `// 📟 Scenario 4: Retro Terminal / Brutalist Mono (Dashed, High-Contrast Values)
function ChartDemo() {
  const [data, setData] = useState([
    { label: 'CORE_0', value: 45 },
    { label: 'CORE_1', value: 82 },
    { label: 'CORE_2', value: 30 },
    { label: 'CORE_3', value: 95 },
    { label: 'CORE_4', value: 60 },
    { label: 'CORE_5', value: 75 }
  ]);
  const [dashed, setDashed] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="btn" 
          onClick={() => setData(data.map(d => ({ ...d, value: Math.floor(Math.random() * 70) + 25 })))}
        >
          ⚡ Refresh Hardware Load
        </button>
        <button 
          className={\`btn \${dashed ? 'active' : ''}\`} 
          onClick={() => setDashed(!dashed)}
        >
          {dashed ? 'Dashed Line: ON' : 'Solid Line'}
        </button>
      </div>

      <div className="theme-card theme-terminal">
        <SvgLineChart
          title="SYS_DIAGNOSTICS_V2"
          subtitle="Kernel cluster telemetry output"
          metric="AVG_LOAD: 64.5%"
          data={data}
          color="#22c55e"
          smooth={false}
          strokeWidth={2.5}
          strokeDasharray={dashed ? "5 5" : undefined}
          glow={true}
          fillGradient={false}
          showGrid={true}
          showXAxis={true}
          showYAxis={true}
          showValues={true}
          valueFormatter={(v) => \`\${v}%\`}
          animated={true}
          height={240}
        />
      </div>
    </div>
  );
}

render(<ChartDemo />);`,

  bars: `// 📊 Scenario 5: Rounded Bar Chart (Categories, Grid & Value Badges)
function ChartDemo() {
  const [bars, setBars] = useState([
    { label: 'Q1 (Jan)', value: 120 },
    { label: 'Q2 (Apr)', value: 240 },
    { label: 'Q3 (Jul)', value: 190 },
    { label: 'Q4 (Oct)', value: 310 }
  ]);
  const [radius, setRadius] = useState(10);
  const [showValues, setShowValues] = useState(true);

  const shuffle = () => {
    setBars(bars.map(b => ({
      ...b,
      value: Math.floor(Math.random() * 250) + 80
    })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button className="btn active" onClick={shuffle}>
          🎲 Randomize Revenue
        </button>
        <button 
          className="btn" 
          onClick={() => setRadius(radius === 10 ? 0 : 10)}
        >
          {radius === 10 ? 'Pill Tops (10px)' : 'Square Bars (0px)'}
        </button>
        <button 
          className={\`btn \${showValues ? 'active' : ''}\`} 
          onClick={() => setShowValues(!showValues)}
        >
          {showValues ? '🏷️ Value Badges: ON' : '🏷️ Value Badges: OFF'}
        </button>
      </div>

      <div className="theme-card theme-glass">
        <SvgBarChart
          title="Quarterly Global Revenue"
          subtitle="Fiscal Year 2026 Audit Report"
          metric="$860,000 Total"
          data={bars}
          color="#f43f5e"
          radius={radius}
          barGap={0.35}
          showGrid={true}
          showXAxis={true}
          showYAxis={true}
          showValues={showValues}
          valueFormatter={(val) => \`$\${val}k\`}
          animated={true}
          height={240}
        />
      </div>
    </div>
  );
}

render(<ChartDemo />);`
};

export function App() {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESETS>('cyberpunk');
  const [code, setCode] = useState(PRESETS.cyberpunk);
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 30) }, (_, i) => i + 1);

  const handleSelectPreset = (key: keyof typeof PRESETS) => {
    setSelectedPreset(key);
    setCode(PRESETS[key]);
  };

  const handleReset = () => {
    setCode(PRESETS[selectedPreset]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);

      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">
          <span className="brand-title">Pure SVG Charts</span>
          <div className="nav-badges">
            <span className="nav-badge">&lt; 3kB Bundle</span>
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

      {/* Scenario Toolbar */}
      <div className="toolbar">
        <div className="preset-group">
          <span className="toolbar-label">CSS Scenarios:</span>
          <button
            className={`preset-btn ${selectedPreset === 'cyberpunk' ? 'active' : ''}`}
            onClick={() => handleSelectPreset('cyberpunk')}
          >
            ⚡ Cyberpunk Neon
          </button>
          <button
            className={`preset-btn ${selectedPreset === 'glass' ? 'active' : ''}`}
            onClick={() => handleSelectPreset('glass')}
          >
            💎 Financial Glass
          </button>
          <button
            className={`preset-btn ${selectedPreset === 'paper' ? 'active' : ''}`}
            onClick={() => handleSelectPreset('paper')}
          >
            📄 Minimalist Light
          </button>
          <button
            className={`preset-btn ${selectedPreset === 'terminal' ? 'active' : ''}`}
            onClick={() => handleSelectPreset('terminal')}
          >
            📟 Retro Terminal
          </button>
          <button
            className={`preset-btn ${selectedPreset === 'bars' ? 'active' : ''}`}
            onClick={() => handleSelectPreset('bars')}
          >
            📊 Rounded Bars
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="action-btn" onClick={handleReset} title="Reset to original code">
            ↺ Reset
          </button>
          <button className="action-btn" onClick={handleCopy}>
            {copySuccess ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Split View Editor & Preview */}
      <main className="split-view">
        {/* Left Side: Code Editor */}
        <section className="editor-pane">
          <div className="pane-header">
            <div className="tab-tag">
              <span>⚛</span>
              <span>LiveEditor.tsx</span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Edit parameters and inspect live SVG
            </span>
          </div>

          <div className="editor-wrapper">
            <div className="line-numbers">
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
            />
          </div>
        </section>

        {/* Right Side: Live Rendered Output */}
        <section className="preview-pane">
          <div className="pane-header">
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1' }}>
              Rendered Result & Controls
            </span>
            <div className="status-tag">
              <span className="status-dot" />
              <span>Live Reactive SVG</span>
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
