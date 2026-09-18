import React from 'react';

export type ChartVariant = 'default' | 'cyberpunk' | 'glass' | 'paper' | 'terminal' | 'tokyonight';

export interface VariantConfig {
  color: string;
  smooth: boolean;
  strokeWidth: number;
  fillGradient: boolean;
  gradientStartOpacity: number;
  showGrid: boolean;
  gridLines: number;
  showXAxis: boolean;
  showYAxis: boolean;
  glow: boolean;
  strokeDasharray?: string;
  containerStyle?: React.CSSProperties;
}

export const CHART_VARIANTS: Record<ChartVariant, VariantConfig> = {
  default: {
    color: '#6366f1',
    smooth: true,
    strokeWidth: 3,
    fillGradient: true,
    gradientStartOpacity: 0.25,
    showGrid: true,
    gridLines: 4,
    showXAxis: true,
    showYAxis: true,
    glow: false,
    containerStyle: {
      background: '#070b14',
      border: '1px solid #1e293b',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      color: '#f1f5f9'
    }
  },

  tokyonight: {
    color: '#7aa2f7',
    smooth: true,
    strokeWidth: 3,
    fillGradient: true,
    gradientStartOpacity: 0.28,
    showGrid: true,
    gridLines: 4,
    showXAxis: true,
    showYAxis: true,
    glow: true,
    containerStyle: {
      background: '#1a1b26',
      border: '1px solid #2f3549',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.55)',
      color: '#c0caf5'
    }
  },

  cyberpunk: {
    color: '#00f0ff',
    smooth: true,
    strokeWidth: 3,
    fillGradient: true,
    gradientStartOpacity: 0.35,
    showGrid: true,
    gridLines: 4,
    showXAxis: true,
    showYAxis: true,
    glow: true,
    containerStyle: {
      background: '#050508',
      border: '1px solid rgba(0, 240, 255, 0.25)',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 0 35px rgba(0, 240, 255, 0.12)',
      color: '#00f0ff'
    }
  },

  glass: {
    color: '#10b981',
    smooth: true,
    strokeWidth: 3.5,
    fillGradient: true,
    gradientStartOpacity: 0.35,
    showGrid: true,
    gridLines: 4,
    showXAxis: true,
    showYAxis: true,
    glow: false,
    containerStyle: {
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      color: '#ffffff'
    }
  },

  paper: {
    color: '#4f46e5',
    smooth: true,
    strokeWidth: 3,
    fillGradient: true,
    gradientStartOpacity: 0.12,
    showGrid: true,
    gridLines: 4,
    showXAxis: true,
    showYAxis: true,
    glow: false,
    containerStyle: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
      color: '#0f172a'
    }
  },

  terminal: {
    color: '#22c55e',
    smooth: false,
    strokeWidth: 2.5,
    strokeDasharray: '5 5',
    fillGradient: false,
    gradientStartOpacity: 0.0,
    showGrid: true,
    gridLines: 4,
    showXAxis: true,
    showYAxis: true,
    glow: true,
    containerStyle: {
      background: '#020c04',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 0 25px rgba(34, 197, 94, 0.15)',
      color: '#4ade80',
      fontFamily: 'monospace'
    }
  }
};
