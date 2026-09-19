import React, { useMemo, useState } from 'react';
import { getSampledLabelIndices } from '../core/scale';
import { SvgBarChartProps } from '../core/types';
import {
  ChartEmpty,
  ChartGlowFilter,
  ChartGrid,
  ChartHeader,
  fullSvgStyle,
  toCleanData,
  useChartBase
} from './ChartCommon';
import { SvgCrosshair } from './SvgCrosshair';

export const SvgBarChart: React.FC<SvgBarChartProps> = (props) => {
  const {
    data = [],
    radius = 6,
    barGap = 0.3,
    showValues = false,
    title,
    subtitle,
    metric,
    className = '',
    onBarHover
  } = props;

  const base = useChartBase(props);
  const {
    color,
    pad,
    width,
    height,
    chartWidth,
    chartHeight,
    baselineY,
    valueFormatter,
    glowId,
    containerStyle,
    showGrid,
    gridLines,
    showXAxis,
    showYAxis,
    glow,
    crosshair,
    showArrows,
    animated
  } = base;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cleanData = useMemo(() => toCleanData(data), [data]);

  const maxVal = useMemo(() => {
    const max = Math.max(...cleanData.map((d) => d.value), 0);
    return max === 0 ? 1 : max;
  }, [cleanData]);

  const totalBars = cleanData.length;
  const slotWidth = totalBars > 0 ? chartWidth / totalBars : chartWidth;
  const barWidth = Math.max(2, slotWidth * (1 - barGap));
  const barOffset = (slotWidth - barWidth) / 2;

  const visibleLabelIndices = useMemo(() => {
    const labeled = cleanData
      .map((item, idx) => ({ label: item.label, idx }))
      .filter((item) => item.label !== undefined && item.label !== '');
    if (!labeled.length) return new Set<number>();

    const maxLabels = Math.min(8, Math.max(2, Math.floor(chartWidth / 55)));
    const sampled = getSampledLabelIndices(labeled.length, maxLabels);
    const selected = new Set<number>();
    sampled.forEach((relIdx) => {
      if (labeled[relIdx]) selected.add(labeled[relIdx].idx);
    });
    return selected;
  }, [cleanData, chartWidth]);

  const transitionStyle = animated
    ? { transition: 'y 0.45s cubic-bezier(0.4, 0, 0.2, 1), height 0.45s cubic-bezier(0.4, 0, 0.2, 1)' }
    : undefined;

  if (!cleanData.length) {
    return <ChartEmpty height={height} className={className} style={containerStyle} />;
  }

  const activeBar = hoveredIndex !== null ? cleanData[hoveredIndex] : null;

  return (
    <div className={`pure-svg-chart-container ${className}`} style={containerStyle}>
      <ChartHeader title={title} subtitle={subtitle} metric={metric} color={color} />

      <svg viewBox={`0 0 ${width} ${height}`} style={fullSvgStyle}>
        <defs>{glow && <ChartGlowFilter id={glowId} color={color} />}</defs>

        <ChartGrid
          showGrid={showGrid}
          showYAxis={showYAxis}
          gridLines={gridLines}
          minVal={0}
          maxVal={maxVal}
          pad={pad}
          width={width}
          height={height}
          valueFormatter={valueFormatter}
        />

        {crosshair && activeBar && (
          <SvgCrosshair
            x={pad.left + hoveredIndex! * slotWidth + barOffset + barWidth / 2}
            y={baselineY - Math.max(1, (activeBar.value / maxVal) * chartHeight)}
            baselineY={baselineY}
            padLeft={pad.left}
            padRight={pad.right}
            width={width}
            color={color}
            valueStr={valueFormatter(activeBar.value)}
            label={activeBar.label}
            dotRadius={Math.min(radius, barWidth / 2)}
            showArrows={showArrows}
          />
        )}

        {cleanData.map((item, idx) => {
          const barHeight = Math.max(1, (item.value / maxVal) * chartHeight);
          const x = pad.left + idx * slotWidth + barOffset;
          const y = baselineY - barHeight;
          const centerX = x + barWidth / 2;
          const isHovered = hoveredIndex === idx;

          return (
            <g key={idx}>
              {showValues && (cleanData.length <= 15 || visibleLabelIndices.has(idx)) && (
                <text
                  x={centerX}
                  y={y - 6}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  fontWeight="700"
                >
                  {valueFormatter(item.value)}
                </text>
              )}

              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={Math.min(radius, barWidth / 2)}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                filter={glow ? `url(#${glowId})` : undefined}
                style={{ ...transitionStyle, cursor: 'pointer' }}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  onBarHover?.({ value: item.value, index: idx, label: item.label });
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  onBarHover?.(null);
                }}
              />

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

        {/* SVG-native hover tooltip — anchored directly above the bar top in viewBox coords */}
        {activeBar && !showValues && (() => {
          const bx = pad.left + hoveredIndex! * slotWidth + barOffset + barWidth / 2;
          const by = baselineY - Math.max(1, (activeBar.value / maxVal) * chartHeight);
          const text = (activeBar.label ? `${activeBar.label}: ` : '') + valueFormatter(activeBar.value);
          const tw = Math.max(40, text.length * 7 + 16);
          const tx = Math.max(pad.left + tw / 2, Math.min(width - pad.right - tw / 2, bx));
          const ty = by - 10;
          return (
            <g pointerEvents="none">
              <rect x={tx - tw / 2} y={ty - 16} width={tw} height={20} rx={5} fill="#0f172a" stroke={color} strokeWidth={1} />
              <text x={tx} y={ty - 2} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="monospace">{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
