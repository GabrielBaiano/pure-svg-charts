import React from 'react';

export type DataValue = number | { value: number; label?: string };

export interface Point {
  x: number;
  y: number;
  value: number;
  label?: string;
  originalValue?: number;
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
  /** Show crosshair guidelines and axis value badges during hover (default: false) */
  crosshair?: boolean;
  /** Accent color used for negative values (default: #f7768e) */
  negativeColor?: string;
  /** Show horizontal zero-axis line when data crosses zero (default: true) */
  showZeroLine?: boolean;
  /** Render chart in a themed card container with background, border, and padding (default: true). Set to false to render flush inside custom containers without double borders. */
  card?: boolean;
  /** Custom CSS class names */
  className?: string;
  /** Inline styles for the outer container */
  style?: React.CSSProperties;
}

export interface LineSeries {
  id?: string;
  name: string;
  data: DataValue[];
  color?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fillGradient?: boolean;
}

export interface SvgLineChartProps extends BaseChartProps {
  /** Array of numbers or { value, label } (used for single series) */
  data?: DataValue[];
  /** Multiple series configuration for multi-line charts */
  series?: LineSeries[];
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
  /** Show series legend when multiple series are provided (default: true) */
  showLegend?: boolean;
  /** Whether multi-series area fills are stacked cumulatively (default: false) */
  stacked?: boolean;
  /** Maximum number of points to render via LTTB downsampling (default: 300, set 0 or Infinity to disable) */
  maxDisplayPoints?: number;
  /** Callback when a point is hovered */
  onPointHover?: (point: Point | null) => void;
}

export interface BarSeries {
  id?: string;
  name: string;
  color?: string;
  data: DataValue[];
}

export interface SvgBarChartProps extends BaseChartProps {
  /** Array of numbers or { value, label } (single series) */
  data?: DataValue[];
  /** Multiple series configuration for stacked or grouped bar charts */
  series?: BarSeries[];
  /** Whether multi-series bars are stacked vertically (default: true when series is present) */
  stacked?: boolean;
  /** Vertical gap in pixels between stacked bar segments (default: 0 for flush/seamless) */
  stackGap?: number;
  /** Show series legend when multiple series are provided (default: true) */
  showLegend?: boolean;
  /** Corner radius for rounded bars (default: 6) */
  radius?: number;
  /** Spacing ratio between bars [0..1] (default: 0.3) */
  barGap?: number;
  /** Callback when a bar is hovered */
  onBarHover?: (item: { value: number; index: number; label?: string; seriesName?: string } | null) => void;
}

export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

export interface SvgDonutChartProps {
  /** Visual theme preset */
  variant?: 'default' | 'cyberpunk' | 'glass' | 'paper' | 'terminal' | 'tokyonight';
  /** Slices dataset */
  data: DonutSlice[];
  /** Size in pixels (both width and height, default: 240) */
  size?: number;
  /** Ratio of the inner hole [0..0.9] (0 for pie, default: 0.68) */
  innerRadiusRatio?: number;
  /** Optional title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Highlighted metric string */
  metric?: string;
  /** Text shown in center of donut hole */
  centerLabel?: string;
  /** Large value shown in center of donut hole */
  centerValue?: string | number;
  /** Show slice legend (default: true) */
  showLegend?: boolean;
  /** Enable smooth CSS animations (default: true) */
  animated?: boolean;
  /** Formatter for slice values */
  valueFormatter?: (val: number) => string;
  /** Custom CSS class name */
  className?: string;
  /** Inline container styles */
  style?: React.CSSProperties;
  /** Callback on slice hover */
  onSliceHover?: (slice: DonutSlice | null) => void;
}

export interface SvgSparklineProps {
  /** Numerical values */
  data: (number | { value: number })[];
  /** Width in SVG units (default: 120) */
  width?: number;
  /** Height in SVG units (default: 34) */
  height?: number;
  /** Stroke color (default: #6366f1) */
  color?: string;
  /** Line thickness (default: 2) */
  strokeWidth?: number;
  /** Smooth curve (default: true) */
  smooth?: boolean;
  /** Fill area under the curve (default: true) */
  fillArea?: boolean;
  /** Area fill opacity (default: 0.15) */
  fillOpacity?: number;
  /** Glowing indicator dot at final point (default: true) */
  showEndDot?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Container inline styles */
  style?: React.CSSProperties;
}

export interface ResponsiveContainerProps {
  /** Width of the container (e.g. '100%' or pixel number, default: '100%') */
  width?: number | string;
  /** Height of the container (e.g. '100%', 300, default: '100%') */
  height?: number | string;
  /** Optional aspect ratio (width / height) */
  aspect?: number;
  /** Minimum container width in pixels */
  minWidth?: number;
  /** Minimum container height in pixels */
  minHeight?: number;
  /** Maximum container height in pixels */
  maxHeight?: number;
  /** ResizeObserver debounce time in milliseconds (default: 0) */
  debounce?: number;
  /** Custom CSS class names */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Child chart component or function returning child with measured dimensions */
  children: React.ReactElement | ((dims: { width: number; height: number }) => React.ReactElement);
}
