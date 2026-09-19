import React, { useState, useEffect, useRef, Component as ReactClassComponent } from 'react';
import * as Babel from '@babel/standalone';
import { SvgLineChart } from '../src/components/SvgLineChart';
import { SvgBarChart } from '../src/components/SvgBarChart';
import { SvgDonutChart } from '../src/components/SvgDonutChart';
import { SvgSparkline } from '../src/components/SvgSparkline';
import { SvgCrosshair } from '../src/components/SvgCrosshair';
import { downsampleLTTB } from '../src/core/lttb';
import { CHART_VARIANTS } from '../src/core/variants';

interface LiveRunnerProps {
  code: string;
  onStatsChange?: (stats: { nodes: number; bytes: number } | null) => void;
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

export const LiveRunner: React.FC<LiveRunnerProps> = ({ code, onStatsChange }) => {
  const [RenderedNode, setRenderedNode] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'svg' | 'stats'>('preview');
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [svgStats, setSvgStats] = useState<{ nodes: number; bytes: number } | null>(null);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fast compilation with debounced syntax evaluation
  useEffect(() => {
    const timer = setTimeout(() => {
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
          SvgDonutChart,
          SvgSparkline,
          SvgCrosshair,
          downsampleLTTB,
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
    }, 40);

    return () => clearTimeout(timer);
  }, [code]);

  // Inspect generated SVG DOM in real-time
  const updateSvgMetrics = React.useCallback(() => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (svgEl) {
      const raw = svgEl.outerHTML;
      // All child elements inside SVG + the SVG element itself
      const nodes = svgEl.querySelectorAll('*').length + 1;
      const bytes = new Blob([raw]).size;

      const newStats = { nodes, bytes };
      setSvgStats(newStats);
      onStatsChange?.(newStats);

      // Simple beautify for display
      const formatted = raw
        .replace(/></g, '>\n  <')
        .replace(/<\/g>/g, '\n</g>')
        .replace(/<\/defs>/g, '\n</defs>');
      setSvgMarkup(formatted);
    } else {
      setSvgStats(null);
      onStatsChange?.(null);
      setSvgMarkup('');
    }
  }, [onStatsChange]);

  // MutationObserver for instant automatic calculation on any code change or interactive state mutation
  useEffect(() => {
    updateSvgMetrics();

    if (!containerRef.current) return;

    const observer = new MutationObserver(() => {
      updateSvgMetrics();
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    // Also run a short rAF check in case child SVG renders asynchronously
    const rafId = requestAnimationFrame(updateSvgMetrics);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [RenderedNode, updateSvgMetrics]);

  const handleCopySvg = () => {
    if (!svgMarkup) return;
    navigator.clipboard.writeText(svgMarkup);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

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
            Visual Chart
          </button>
          <button
            className={`btn ${activeTab === 'svg' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setActiveTab('svg')}
          >
            Pure SVG Code
          </button>
        </div>

        {svgStats && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                color: '#94a3b8',
                marginRight: '2px'
              }}
              title="Real-time SVG metrics calculated automatically from active rendered DOM"
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block'
                }}
              />
              <span style={{ fontWeight: 600 }}>Auto Live:</span>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#38bdf8',
                background: '#0f172a',
                padding: '4px 9px',
                borderRadius: '6px',
                border: '1px solid #1e293b',
                fontFamily: 'monospace',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Total SVG DOM elements in document tree"
            >
              {svgStats.nodes} SVG Nodes
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#10b981',
                background: '#0f172a',
                padding: '4px 9px',
                borderRadius: '6px',
                border: '1px solid #1e293b',
                fontFamily: 'monospace',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Exact SVG markup byte size in UTF-8"
            >
              {svgStats.bytes.toLocaleString()} Bytes SVG
            </span>

            {activeTab === 'svg' && (
              <button
                className="btn"
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={handleCopySvg}
              >
                {copiedSvg ? '✓ Copied SVG!' : 'Copy SVG'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Non-blocking Syntax Error Banner */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#f87171',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}
        >
          <strong>⚠️ Code syntax / compile error:</strong>
          <div style={{ marginTop: '4px', opacity: 0.9 }}>{error}</div>
        </div>
      )}

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
