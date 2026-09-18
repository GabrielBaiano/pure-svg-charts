import React from 'react';

export type DataValue = number | { value: number; label?: string };

export interface Point {
  x: number;
  y: number;
  value: number;
  label?: string;
}

export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BaseChartProps {
  /** Visual theme preset: 'default' | 'cyberpunk' | 'glass' | 'paper' | 'terminal' | 'tokyonight' (default: 'default') */
  variant?: 'default' | 'cyberpunk' | 'glass' | 'paper' | 'terminal' | 'tokyonight';
  /** Width in SVG coordinate units (default: 500) */
  width?: number;
  /** Height in SVG coordinate units (default: 220) */
  height?: number;
  /** Primary theme color (default: #6366f1) */
  color?: string;
  /** Padding around the chart inside the viewBox */
  padding?: Partial<ChartPadding>;
  /** Enable smooth CSS transitions on SVG elements (default: true) */
  animated?: boolean;
  /** Display horizontal background grid lines (default: true) */
  showGrid?: boolean;
  /** Number of grid lines (default: 4) */
  gridLines?: number;
  /** Display X-axis labels below chart (default: true) */
  showXAxis?: boolean;
  /** Display Y-axis value numbers on grid lines (default: true) */
  showYAxis?: boolean;
  /** Display permanent value numbers above points/bars (default: false) */
  showValues?: boolean;
  /** Formatter function for values and axis ticks */
  valueFormatter?: (val: number) => string;
  /** Optional title displayed above chart */
  title?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Highlighted metric string (e.g. "$48,250" or "+18.2%") */
  metric?: string;
  /** Add a neon glow filter around the chart (default: false) */
  glow?: boolean;
  /** Custom CSS class names */
  className?: string;
  /** Inline styles for the outer container */
  style?: React.CSSProperties;
}

export interface SvgLineChartProps extends BaseChartProps {
  /** Array of numbers or { value, label } */
  data: DataValue[];
  /** Stroke width in pixels (default: 3) */
  strokeWidth?: number;
  /** Whether to render a smooth Bézier curve or straight lines (default: true) */
  smooth?: boolean;
  /** Curvature intensity when smooth is true [0..1] (default: 0.25) */
  curvature?: number;
  /** SVG stroke-dasharray (e.g. "6 6" for dashed line) */
  strokeDasharray?: string;
  /** Show interactive data dots on the line (default: true) */
  showDots?: boolean;
  /** Dot radius in pixels (default: 4) */
  dotRadius?: number;
  /** Whether to fill the area under the curve with a gradient (default: true) */
  fillGradient?: boolean;
  /** Gradient start opacity (default: 0.35) */
  gradientStartOpacity?: number;
  /** Callback when a point is hovered */
  onPointHover?: (point: Point | null) => void;
}

export interface SvgBarChartProps extends BaseChartProps {
  /** Array of numbers or { value, label } */
  data: DataValue[];
  /** Corner radius for rounded bars (default: 6) */
  radius?: number;
  /** Spacing ratio between bars [0..1] (default: 0.3) */
  barGap?: number;
  /** Callback when a bar is hovered */
  onBarHover?: (item: { value: number; index: number; label?: string } | null) => void;
}
