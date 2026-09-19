import React, { useId, useMemo, useState } from 'react';
import type { SvgDonutChartProps } from '../core/types';
import { CHART_VARIANTS } from '../core/variants';
import { ChartEmpty, ChartGlowFilter, ChartHeader, DEFAULT_PALETTE } from './ChartCommon';

export const SvgDonutChart: React.FC<SvgDonutChartProps> = ({
  variant = 'default',
  data = [],
  size = 240,
  innerRadiusRatio = 0.68,
  title,
  subtitle,
  metric,
  centerLabel,
  centerValue,
  showLegend = true,
  animated = true,
  valueFormatter = (val) => String(Math.round(val)),
  className = '',
  style,
  onSliceHover
}) => {
  const preset = CHART_VARIANTS[variant] || CHART_VARIANTS.default;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const glowId = `d-gl-${useId().replace(/:/g, '-')}`;

  const cleanData = useMemo(
    () =>
      data
        .map((d, i) => ({
          label: d.label || `Slice ${i + 1}`,
          value: Number.isFinite(d.value) && d.value > 0 ? d.value : 0,
          color: d.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]
        }))
        .filter((d) => d.value > 0),
    [data]
  );

  const total = useMemo(() => cleanData.reduce((acc, curr) => acc + curr.value, 0), [cleanData]);

  const strokeWidth = (size / 2) * Math.max(0.1, 1 - Math.min(0.9, innerRadiusRatio));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const slices = useMemo(() => {
    if (!total) return [];
    let accumulated = 0;
    const gap = cleanData.length > 1 ? 2 : 0;

    return cleanData.map((slice, index) => {
      const sliceLength = (slice.value / total) * circumference;
      const strokeDasharray = `${Math.max(0, sliceLength - gap)} ${circumference - Math.max(0, sliceLength - gap)}`;
      const strokeDashoffset = -accumulated;
      accumulated += sliceLength;
      return {
        ...slice,
        index,
        strokeDasharray,
        strokeDashoffset,
        percentage: ((slice.value / total) * 100).toFixed(1)
      };
    });
  }, [cleanData, total, circumference]);

  const setHover = (idx: number | null) => {
    setHoveredIdx(idx);
    onSliceHover?.(idx !== null ? cleanData[idx] : null);
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    ...preset.containerStyle,
    ...style
  };

  if (!cleanData.length || !total) {
    return <ChartEmpty height={size} className={className} style={containerStyle} />;
  }

  const active = hoveredIdx !== null ? slices[hoveredIdx] : null;
  const displayVal = active ? valueFormatter(active.value) : centerValue !== undefined ? centerValue : valueFormatter(total);
  const displayLbl = active ? `${active.label} (${active.percentage}%)` : centerLabel || 'Total';

  return (
    <div className={`pure-svg-chart-container ${className}`} style={containerStyle}>
      <ChartHeader title={title} subtitle={subtitle} metric={metric} color={preset.color} />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <ChartGlowFilter id={glowId} color={preset.color} />
            </defs>

            <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={strokeWidth}
              />
              {slices.map((s) => {
                const isHovered = hoveredIdx === s.index;
                return (
                  <circle
                    key={s.index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={s.strokeDasharray}
                    strokeDashoffset={s.strokeDashoffset}
                    strokeLinecap="round"
                    filter={isHovered ? `url(#${glowId})` : undefined}
                    style={{
                      cursor: 'pointer',
                      opacity: hoveredIdx === null || isHovered ? 1 : 0.45,
                      transition: animated ? 'stroke-width 0.25s, opacity 0.25s' : undefined
                    }}
                    onMouseEnter={() => setHover(s.index)}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}
            </g>

            <text
              x={size / 2}
              y={size / 2 - 2}
              textAnchor="middle"
              fill={active ? active.color : 'currentColor'}
              fontSize={size > 200 ? 20 : 16}
              fontWeight="800"
            >
              {displayVal}
            </text>
            <text
              x={size / 2}
              y={size / 2 + 14}
              textAnchor="middle"
              fill="currentColor"
              opacity={0.7}
              fontSize={10}
              fontWeight="600"
              letterSpacing="0.04em"
            >
              {displayLbl}
            </text>
          </svg>
        </div>

        {showLegend && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, minWidth: 130 }}>
            {slices.map((s) => (
              <div
                key={s.index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                  opacity: hoveredIdx === null || hoveredIdx === s.index ? 1 : 0.45,
                  fontWeight: hoveredIdx === s.index ? 700 : 500
                }}
                onMouseEnter={() => setHover(s.index)}
                onMouseLeave={() => setHover(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color, display: 'inline-block' }} />
                  <span>{s.label}</span>
                </div>
                <span style={{ fontFamily: 'monospace', opacity: 0.85 }}>{s.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
