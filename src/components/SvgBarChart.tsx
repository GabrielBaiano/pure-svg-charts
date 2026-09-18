import React, { useId, useMemo, useState } from 'react';
import { getSampledLabelIndices } from '../core/scale';
import { ChartPadding, SvgBarChartProps } from '../core/types';
import { CHART_VARIANTS } from '../core/variants';

const DEFAULT_BAR_PADDING: ChartPadding = {
  top: 24,
  right: 24,
  bottom: 34,
  left: 48
};

export const SvgBarChart: React.FC<SvgBarChartProps> = (props) => {
  const {
    variant = 'default',
    data = [],
    width = 500,
    height = 220,
    radius = 6,
    barGap = 0.3,
    showValues = false,
    valueFormatter = (val) => String(Math.round(val)),
    title,
    subtitle,
    metric,
    padding,
    animated = true,
    className = '',
    style,
    onBarHover
  } = props;

  const preset = CHART_VARIANTS[variant] || CHART_VARIANTS.default;

  const color = props.color ?? preset.color;
  const showGrid = props.showGrid ?? preset.showGrid;
  const gridLines = props.gridLines ?? preset.gridLines;
  const showXAxis = props.showXAxis ?? preset.showXAxis;
  const showYAxis = props.showYAxis ?? preset.showYAxis;
  const glow = props.glow ?? preset.glow;

  const gradientId = useId().replace(/:/g, '-');
  const glowId = `glow-${gradientId}`;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pad: ChartPadding = {
    ...DEFAULT_BAR_PADDING,
    ...padding
  };

  const chartWidth = Math.max(1, width - pad.left - pad.right);
  const chartHeight = Math.max(1, height - pad.top - pad.bottom);
  const baselineY = height - pad.bottom;

  const cleanData = useMemo(() => {
    return data.map((d) => {
      if (typeof d === 'number') {
        return { value: Number.isFinite(d) ? d : 0, label: undefined };
      }
      return {
        value: Number.isFinite(d.value) ? d.value : 0,
        label: d.label
      };
    });
  }, [data]);

  const maxVal = useMemo(() => {
    const vals = cleanData.map((d) => d.value);
    const max = Math.max(...vals, 0);
    return max === 0 ? 1 : max;
  }, [cleanData]);

  const totalBars = cleanData.length;
  const slotWidth = totalBars > 0 ? chartWidth / totalBars : chartWidth;
  const barWidth = Math.max(2, slotWidth * (1 - barGap));
  const barOffset = (slotWidth - barWidth) / 2;

  // Grid steps with rounded integers
  const gridSteps = useMemo(() => {
    if (!showGrid || gridLines <= 1) return [];
    const steps = [];
    const valStep = maxVal / (gridLines - 1);
    const yStep = chartHeight / (gridLines - 1);

    for (let i = 0; i < gridLines; i++) {
      const y = pad.top + i * yStep;
      const val = Math.round(maxVal - i * valStep);
      steps.push({ y, val });
    }
    return steps;
  }, [showGrid, gridLines, maxVal, chartHeight, pad.top]);

  // Clean evenly-spaced X-axis label sampling to prevent any overlap
  const visibleLabelIndices = useMemo(() => {
    const labeled = cleanData
      .map((item, idx) => ({ label: item.label, idx }))
      .filter((item) => item.label !== undefined && item.label !== '');
    if (!labeled.length) return new Set<number>();

    const maxLabels = Math.min(8, Math.max(2, Math.floor(chartWidth / 55)));
    const sampledRelative = getSampledLabelIndices(labeled.length, maxLabels);
    const selectedAbsolute = new Set<number>();
    sampledRelative.forEach((relIdx) => {
      if (labeled[relIdx]) {
        selectedAbsolute.add(labeled[relIdx].idx);
      }
    });
    return selectedAbsolute;
  }, [cleanData, chartWidth]);

  const transitionStyle = animated
    ? {
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    : undefined;

  const containerStyling: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    ...preset.containerStyle,
    ...style
  };

  if (!cleanData.length) {
    return (
      <div
        className={`pure-svg-empty ${className}`}
        style={{
          ...containerStyling,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '14px'
        }}
      >
        No data to display
      </div>
    );
  }

  return (
    <div className={`pure-svg-chart-container ${className}`} style={containerStyling}>
      {/* Optional Header */}
      {(title || metric || subtitle) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '14px',
            gap: '8px'
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'inherit'
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '12px',
                  opacity: 0.75
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {metric && (
            <div
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: color,
                textAlign: 'right'
              }}
            >
              {metric}
            </div>
          )}
        </div>
      )}

      {/* SVG Bar Chart Engine */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          overflow: 'visible'
        }}
      >
        <defs>
          {glow && (
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.75" />
            </filter>
          )}
        </defs>

        {/* Grid lines & Y-Axis values */}
        {showGrid &&
          gridSteps.map((step, idx) => (
            <g key={`bar-grid-${idx}`}>
              <line
                x1={pad.left}
                y1={step.y}
                x2={width - pad.right}
                y2={step.y}
                stroke="currentColor"
                strokeOpacity={0.15}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              {showYAxis && (
                <text
                  x={pad.left - 8}
                  y={step.y + 3.5}
                  textAnchor="end"
                  fill="currentColor"
                  opacity={0.65}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {valueFormatter(step.val)}
                </text>
              )}
            </g>
          ))}

        {cleanData.map((item, idx) => {
          const barHeight = Math.max(1, (item.value / maxVal) * chartHeight);
          const x = pad.left + idx * slotWidth + barOffset;
          const y = baselineY - barHeight;
          const centerX = x + barWidth / 2;
          const isHovered = hoveredIndex === idx;

          return (
            <g key={`bar-${idx}`}>
              {/* Optional Permanent Value above bar */}
              {showValues && (cleanData.length <= 15 || visibleLabelIndices.has(idx)) && (
                <text
                  x={centerX}
                  y={y - 6}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  fontWeight="700"
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {valueFormatter(item.value)}
                </text>
              )}

              {/* Bar rectangle */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={Math.min(radius, barWidth / 2)}
                ry={Math.min(radius, barWidth / 2)}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                filter={glow ? `url(#${glowId})` : undefined}
                style={{
                  ...transitionStyle,
                  cursor: 'pointer'
                }}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  onBarHover?.({ value: item.value, index: idx, label: item.label });
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  onBarHover?.(null);
                }}
              />

              {/* X-Axis category label with smart sampling */}
              {showXAxis && item.label && visibleLabelIndices.has(idx) && (
                <text
                  x={centerX}
                  y={baselineY + 18}
                  textAnchor="middle"
                  fill="currentColor"
                  opacity={0.65}
                  fontSize="11"
                  fontWeight="500"
                >
                  {item.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && cleanData[hoveredIndex] && !showValues && (
        <div
          style={{
            position: 'absolute',
            left: `${((pad.left + hoveredIndex * slotWidth + slotWidth / 2) / width) * 100}%`,
            top: `${((baselineY - (cleanData[hoveredIndex].value / maxVal) * chartHeight) / height) * 100}%`,
            transform: 'translate(-50%, -130%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            border: '1px solid #334155',
            zIndex: 10
          }}
        >
          {cleanData[hoveredIndex].label ? `${cleanData[hoveredIndex].label}: ` : ''}
          {valueFormatter(cleanData[hoveredIndex].value)}
        </div>
      )}
    </div>
  );
};
