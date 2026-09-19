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

const def = '0 10px 30px rgba(0,0,0,.4)';
const vData: Record<ChartVariant, [string, string, string, string, string, any?]> = {
  default: ['#6366f1', '#070b14', '#1e293b', def, '#f1f5f9'],
  tokyonight: ['#7aa2f7', '#1a1b26', '#2f3549', '0 15px 35px rgba(0,0,0,.55)', '#c0caf5', { glow: true, gradientStartOpacity: 0.28 }],
  cyberpunk: ['#00f0ff', '#050508', 'rgba(0,240,255,.25)', '0 0 35px rgba(0,240,255,.12)', '#00f0ff', { glow: true, gradientStartOpacity: 0.35 }],
  glass: ['#10b981', 'rgba(15,23,42,.75)', 'rgba(255,255,255,.12)', '0 20px 40px rgba(0,0,0,.4)', '#fff', { strokeWidth: 3.5, gradientStartOpacity: 0.35, backdropFilter: 'blur(16px)' }],
  paper: ['#4f46e5', '#f8fafc', '#e2e8f0', '0 10px 25px rgba(0,0,0,.05)', '#0f172a', { gradientStartOpacity: 0.12 }],
  terminal: ['#22c55e', '#020c04', 'rgba(34,197,94,.3)', '0 0 25px rgba(34,197,94,.15)', '#4ade80', { smooth: false, strokeWidth: 2.5, strokeDasharray: '5 5', fillGradient: false, glow: true, fontFamily: 'monospace' }]
};

export const CHART_VARIANTS: Record<ChartVariant, VariantConfig> = Object.fromEntries(
  Object.entries(vData).map(([k, [c, bg, b, sh, txt, ex = {}]]) => {
    const { glow = false, smooth = true, strokeWidth = 3, strokeDasharray, fillGradient = true, gradientStartOpacity = 0.25, ...css } = ex;
    return [
      k,
      {
        color: c,
        smooth,
        strokeWidth,
        fillGradient,
        gradientStartOpacity,
        showGrid: true,
        gridLines: 4,
        showXAxis: true,
        showYAxis: true,
        glow,
        strokeDasharray,
        containerStyle: {
          borderRadius: '16px',
          padding: '22px',
          background: bg,
          border: `1px solid ${b}`,
          boxShadow: sh,
          color: txt,
          ...css
        }
      }
    ];
  })
) as Record<ChartVariant, VariantConfig>;
