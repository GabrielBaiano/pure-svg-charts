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

export interface ChartZone {
  id?: string;
  startX: string | number;
  endX: string | number;
  color?: string;
  label?: string;
  labelPosition?: 'top' | 'bottom';
}

export interface BaseChartProps<T = any> {
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
  /** Formatter function for X-axis labels */
  labelFormatter?: (label: string) => string;
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
  /** Automatically measure parent container and resize width/height dynamically via ResizeObserver (default: false) */
  responsive?: boolean;
  /** Accessible label for the chart region/SVG (default: title or 'Interactive chart') */
  ariaLabel?: string;
  /** Key in data records representing the X-axis label/index (e.g. 'date', 'month') */
  x?: (keyof T & string) | string;
  /** Key (or array of keys) representing series values (e.g. 'revenue' or ['revenue', 'expenses']) */
  y?: (keyof T & string) | (keyof T & string)[] | string | string[];
  /** Array of colors for multi-series charts or custom palette */
  colors?: string[];
  /** Shaded background zones/intervals along the X axis */
  zones?: ChartZone[];
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

export interface SvgLineChartProps<T = any> extends BaseChartProps<T> {
  /** Array of numbers, { value, label }, or arbitrary object records when x and y are provided */
  data?: (DataValue | T)[];
  /** Multiple series configuration for multi-line charts */
  series?: LineSeries[];
  /** Stroke width in pixels (default: 3) */
  strokeWidth?: number;
  /** Stroke dash array for dashed lines (e.g. "5,5") */
  strokeDasharray?: string;
  /** Use smooth Bézier curves instead of straight lines (default: false) */
  smooth?: boolean;
  /** Curvature tension for Bézier curves [0.0..1.0] (default: 0.25) */
  curvature?: number;
  /**
   * Dot display mode:
   * - 'hover' (default): 0 static dots in DOM. Renders 1 dynamic active dot when hovering/touching. O(1) DOM nodes.
   * - 'always': renders dots on all data points.
   * - 'none': no dots rendered at all.
   */
  dots?: 'hover' | 'always' | 'none';
  /** Deprecated: use `dots` prop instead. If true, equivalent to `dots="always"`. If false, `dots="none"`. */
  showDots?: boolean;
  /** Dot radius in pixels (default: 4, auto-reduced on dense datasets) */
  dotRadius?: number;
  /** Fill gradient area below the line (default: false) */
  fillGradient?: boolean;
  /** Starting opacity of area fill gradient [0..1] (default: 0.35) */
  gradientStartOpacity?: number;
  /** Show series legend when multiple series are provided (default: true) */
  showLegend?: boolean;
  /** Whether multi-series area fills are stacked cumulatively (default: false) */
  stacked?: boolean;
  /** Maximum number of points to render via LTTB downsampling (default: 300, set 0 or Infinity to disable) */
  maxDisplayPoints?: number;
  /** Callback when a point is hovered */
  onPointHover?: (point: Point | null) => void;
  /** Custom render function for tooltip (HTML/React overlay). Overrides default SVG tooltip. */
  renderTooltip?: (props: LineTooltipProps) => React.ReactNode;
}

export interface LineTooltipSeriesItem {
  seriesName: string;
  seriesColor: string;
  value: number;
  formattedValue: string;
}

export interface LineTooltipProps {
  point: Point;
  seriesName?: string;
  seriesColor?: string;
  value: number;
  formattedValue: string;
  /** All series values at this X coordinate (useful for multi-series / stacked charts) */
  allSeriesPoints?: LineTooltipSeriesItem[];
}

export interface BarSeries {
  id?: string;
  name: string;
  color?: string;
  data: DataValue[];
}

export interface BarTooltipProps {
  item: {
    value: number;
    index: number;
    label?: string;
    seriesName?: string;
    seriesColor?: string;
    percent?: string;
  };
  formattedValue: string;
}

export interface SvgBarChartProps<T = any> extends BaseChartProps<T> {
  /** Array of numbers, { value, label }, or arbitrary object records when x and y are provided */
  data?: (DataValue | T)[];
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
  /** Custom render function for tooltip (HTML/React overlay). Overrides default SVG tooltip. */
  renderTooltip?: (props: BarTooltipProps) => React.ReactNode;
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

export interface ExportImageOptions {
  /** Resolution multiplier for PNG rendering (default: 2 for Retina crispness) */
  scale?: number;
  /** Optional background color (e.g. '#0f172a' or '#ffffff', default: transparent) */
  background?: string;
}

