import React, { useState, useEffect, useRef, Component as ReactClassComponent } from 'react';
import * as Babel from '@babel/standalone';
import { SvgLineChart } from '../src/components/SvgLineChart';
import { SvgBarChart } from '../src/components/SvgBarChart';
import { CHART_VARIANTS } from '../src/core/variants';

interface LiveRunnerProps {
  code: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PreviewErrorBoundary extends ReactClassComponent<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Preview runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            color: '#f87171',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}
        >
          <strong>⚠️ Runtime Error:</strong>
          <div style={{ marginTop: '8px' }}>{this.state.error?.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const LiveRunner: React.FC<LiveRunnerProps> = ({ code }) => {
  const [RenderedNode, setRenderedNode] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'svg' | 'stats'>('preview');
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [svgStats, setSvgStats] = useState<{ nodes: number; bytes: number } | null>(null);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setError(null);

      // Clean imports from user code
      const sanitizedCode = code
        .replace(/import\s+.*?;?\n/g, '')
        .replace(/export\s+default\s+/g, 'return ')
        .trim();

      // Wrap code so that return is allowed and render() / ChartDemo is captured
      const wrappedCode = `
        let renderedResult = null;
        const render = (element) => { renderedResult = element; };
        
        ${sanitizedCode}
        
        if (!renderedResult && typeof ChartDemo !== 'undefined') {
          renderedResult = React.createElement(ChartDemo);
        } else if (!renderedResult && typeof App !== 'undefined') {
          renderedResult = React.createElement(App);
        }
        
        return renderedResult;
      `;

      const transformed = Babel.transform(wrappedCode, {
        presets: ['react', 'typescript'],
        parserOpts: {
          allowReturnOutsideFunction: true
        },
        filename: 'preview.tsx'
      }).code;

      if (!transformed) {
        throw new Error('Failed to transpile code');
      }

      // Safe evaluation scope with React and pure-svg-charts components & variants
      const scope = {
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useMemo: React.useMemo,
        useCallback: React.useCallback,
        SvgLineChart,
        SvgBarChart,
        CHART_VARIANTS
      };

      const scopeKeys = Object.keys(scope);
      const scopeValues = Object.values(scope);

      const fn = new Function(...scopeKeys, transformed);
      const result = fn(...scopeValues);

      if (React.isValidElement(result)) {
        setRenderedNode(result);
      } else {
        setRenderedNode(
          <div style={{ color: '#94a3b8', padding: '16px', fontSize: '13px' }}>
            No React element returned. Use <code>render(&lt;YourComponent /&gt;)</code> or declare a function named <code>ChartDemo</code>.
          </div>
        );
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  }, [code]);

  // Inspect generated SVG DOM in real-time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const svgEl = containerRef.current.querySelector('svg');
        if (svgEl) {
          const raw = svgEl.outerHTML;
          // Simple beautify for display
          const formatted = raw
            .replace(/></g, '>\n  <')
            .replace(/<\/g>/g, '\n</g>')
            .replace(/<\/defs>/g, '\n</defs>');
          setSvgMarkup(formatted);
          setSvgStats({
            nodes: svgEl.querySelectorAll('*').length,
            bytes: new Blob([raw]).size
          });
        } else {
          setSvgMarkup('');
          setSvgStats(null);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [RenderedNode, code]);

  const handleCopySvg = () => {
    if (!svgMarkup) return;
    navigator.clipboard.writeText(svgMarkup);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  if (error) {
    return (
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          color: '#f87171',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap'
        }}
      >
        <strong>⚠️ Syntax / Compile Error:</strong>
        <div style={{ marginTop: '8px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-header Navigation Tabs for Live View */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn ${activeTab === 'preview' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setActiveTab('preview')}
          >
            🎨 Visual Chart
          </button>
          <button
            className={`btn ${activeTab === 'svg' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setActiveTab('svg')}
          >
            ⚡ Pure SVG Code
          </button>
        </div>

        {svgStats && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#38bdf8',
                background: '#0f172a',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #334155'
              }}
            >
              {svgStats.nodes} SVG Nodes
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#10b981',
                background: '#0f172a',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #334155'
              }}
            >
              {svgStats.bytes} Bytes SVG
            </span>
            {activeTab === 'svg' && (
              <button
                className="btn"
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={handleCopySvg}
              >
                {copiedSvg ? '✓ Copied SVG!' : '📋 Copy SVG'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab 1: Visual Interactive Output */}
      <div style={{ display: activeTab === 'preview' ? 'block' : 'none' }}>
        <div ref={containerRef}>
          <PreviewErrorBoundary key={code}>
            {RenderedNode}
          </PreviewErrorBoundary>
        </div>
      </div>

      {/* Tab 2: Raw Generated SVG Code Inspector */}
      {activeTab === 'svg' && (
        <div
          style={{
            background: '#030712',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px',
            maxHeight: '400px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#a5f3fc',
            whiteSpace: 'pre'
          }}
        >
          {svgMarkup || 'Rendering SVG...'}
        </div>
      )}
    </div>
  );
};
