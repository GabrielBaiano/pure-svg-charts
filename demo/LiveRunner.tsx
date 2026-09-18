import React, { useState, useEffect, Component as ReactClassComponent } from 'react';
import * as Babel from '@babel/standalone';
import { SvgLineChart } from '../src/components/SvgLineChart';
import { SvgBarChart } from '../src/components/SvgBarChart';

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

      // Safe evaluation scope with React and pure-svg-charts components
      const scope = {
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useMemo: React.useMemo,
        useCallback: React.useCallback,
        SvgLineChart,
        SvgBarChart
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
    <PreviewErrorBoundary key={code}>
      {RenderedNode}
    </PreviewErrorBoundary>
  );
};
