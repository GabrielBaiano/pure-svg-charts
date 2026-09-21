import React, { useId, useRef, useState, useEffect } from 'react';
import { ChartPadding, DataValue } from '../core/types';
import { CHART_VARIANTS, ChartVariant } from '../core/variants';

export const DEFAULT_PADDING: ChartPadding = { top: 24, right: 24, bottom: 34, left: 48 };
export const DEFAULT_PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

export const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

export const toCleanData = (data: DataValue[] = []): { value: number; label?: string }[] => {
  if (!data || data.length === 0) return [];
  const len = data.length;
  const result = new Array(len);
  for (let i = 0; i < len; i++) {
    const d = data[i];
    if (typeof d === 'number') {
      result[i] = { value: Number.isFinite(d) ? d : 0 };
    } else {
      const val = Number.isFinite(d.value) ? d.value : 0;
      result[i] = d.label !== undefined ? { value: val, label: d.label } : { value: val };
    }
  }
  return result;
};

export const fullSvgStyle: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  display: 'block',
  overflow: 'visible',
  touchAction: 'pan-y'
};

export function useChartBase(props: any) {
  const v = (props.variant as ChartVariant) || 'default';
  const preset = CHART_VARIANTS[v] || CHART_VARIANTS.default;
  const color = props.color ?? preset.color;
  const pad: ChartPadding = { ...DEFAULT_PADDING, ...props.padding };

  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredSize, setMeasuredSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!props.responsive) return;
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.floor(rect.width);
      if (w > 0) {
        setMeasuredSize((prev) => {
          if (prev?.width === w) return prev;
          return { width: w, height: props.height ?? 220 };
        });
      }
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width: w } = entries[0].contentRect;
      const floorW = Math.floor(w);
      if (floorW > 0) {
        setMeasuredSize((prev) => {
          if (prev?.width === floorW) return prev;
          return { width: floorW, height: props.height ?? 220 };
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [props.responsive, props.height]);

  const width = measuredSize?.width ?? props.width ?? 500;
  const height = measuredSize?.height ?? props.height ?? 220;
  const chartWidth = Math.max(1, width - pad.left - pad.right);
  const chartHeight = Math.max(1, height - pad.top - pad.bottom);
  const baselineY = height - pad.bottom;
  const valueFormatter = props.valueFormatter || ((v: number) => String(Math.round(v)));
  const uid = useId().replace(/:/g, '-');
  const glowId = `gl-${uid}`;

  const isCard = props.card !== false;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    ...(isCard
      ? preset.containerStyle
      : {
          borderRadius: 0,
          padding: 0,
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          color: preset.containerStyle?.color || 'currentColor'
        }),
    ...props.style
  };

  const ariaLabel = props.ariaLabel || props.title || 'Interactive chart';

  return {
    preset,
    color,
    pad,
    width,
    height,
    chartWidth,
    chartHeight,
    baselineY,
    valueFormatter,
    uid,
    glowId,
    containerStyle,
    containerRef,
    ariaLabel,
    card: isCard,
    showGrid: props.showGrid ?? preset.showGrid ?? true,
    gridLines: props.gridLines ?? preset.gridLines ?? 4,
    showXAxis: props.showXAxis ?? preset.showXAxis ?? true,
    showYAxis: props.showYAxis ?? preset.showYAxis ?? true,
    glow: props.glow ?? preset.glow ?? false,
    crosshair: props.crosshair ?? false,
    animated: props.animated ?? true,
    negativeColor: props.negativeColor ?? '#f7768e',
    showZeroLine: props.showZeroLine ?? true
  };
}

export const ChartHeader: React.FC<{
  title?: string;
  subtitle?: string;
  metric?: string;
  color?: string;
  marginBottom?: number | string;
}> = React.memo(({ title, subtitle, metric, color, marginBottom = 14 }) => {
  if (!title && !metric && !subtitle) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom, gap: 8 }}>
      <div>
        {title && <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h3>}
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: 12, opacity: 0.75 }}>{subtitle}</p>}
      </div>
      {metric && <div style={{ fontSize: 18, fontWeight: 800, color, textAlign: 'right' }}>{metric}</div>}
    </div>
  );
});

export const ChartEmpty: React.FC<{ height: number; className?: string; style?: React.CSSProperties }> = React.memo(({
  height,
  className = '',
  style
}) => (
  <div
    className={`pure-svg-empty ${className}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: 14,
      ...style,
      height
    }}
  >
    No data to display
  </div>
));

export const ChartTooltip: React.FC<{
  xPercent: number;
  yPercent: number;
  borderColor?: string;
  children: React.ReactNode;
}> = React.memo(({ xPercent, yPercent, borderColor = '#334155', children }) => (
  <div
    style={{
      position: 'absolute',
      left: `${xPercent}%`,
      top: `${yPercent}%`,
      transform: 'translate(-50%, -130%)',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      padding: '4px 8px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      border: `1px solid ${borderColor}`,
      zIndex: 10
    }}
  >
    {children}
  </div>
));

export const ChartGrid: React.FC<{
  showGrid?: boolean;
  showYAxis?: boolean;
  gridLines?: number;
  minVal: number;
  maxVal: number;
  pad: ChartPadding;
  width: number;
  height: number;
  valueFormatter: (val: number) => string;
  showZeroLine?: boolean;
  zeroY?: number;
}> = React.memo(({
  showGrid = true,
  showYAxis = true,
  gridLines = 4,
  minVal,
  maxVal,
  pad,
  width,
  height,
  valueFormatter,
  showZeroLine = true,
  zeroY
}) => {
  if (!showGrid || gridLines <= 1) return null;
  const chartHeight = Math.max(1, height - pad.top - pad.bottom);
  const valStep = (maxVal - minVal) / (gridLines - 1);
  const yStep = chartHeight / (gridLines - 1);

  let pathD = '';
  const yLabels = [];

  for (let i = 0; i < gridLines; i++) {
    const y = pad.top + i * yStep;
    const val = Math.round(maxVal - i * valStep);
    pathD += `M${pad.left} ${y}H${width - pad.right}`;
    if (showYAxis) {
      yLabels.push(
        <text key={i} x={pad.left - 8} y={y + 3.5}>
          {valueFormatter(val)}
        </text>
      );
    }
  }

  const effectiveZeroY =
    zeroY !== undefined
      ? zeroY
      : minVal < 0 && maxVal > 0
      ? pad.top + ((maxVal - 0) / (maxVal - minVal)) * chartHeight
      : undefined;

  return (
    <g className="pure-svg-grid">
      <path d={pathD} stroke="currentColor" strokeOpacity={0.15} strokeDasharray="3 3" strokeWidth={1} />
      {showZeroLine && effectiveZeroY !== undefined && (
        <line
          x1={pad.left}
          y1={effectiveZeroY}
          x2={width - pad.right}
          y2={effectiveZeroY}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth={1.5}
        />
      )}
      {showYAxis && (
        <g fill="currentColor" opacity={0.65} fontSize={10} fontWeight="600" fontFamily="monospace" textAnchor="end">
          {yLabels}
        </g>
      )}
    </g>
  );
});

export const ChartGlowFilter: React.FC<{ id: string; color: string }> = React.memo(({ id, color }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.75" />
  </filter>
));
