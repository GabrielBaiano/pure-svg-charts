import React, { useMemo, useState } from 'react';
import { generateAreaPath, generateLinePath } from '../core/bezier';
import { getSampledLabelIndices, scaleDataToPoints } from '../core/scale';
import { Point, SvgLineChartProps } from '../core/types';
import {
  ChartEmpty,
  ChartGlowFilter,
  ChartGrid,
  ChartHeader,
  DEFAULT_PALETTE,
  fullSvgStyle,
  useChartBase
} from './ChartCommon';
import { SvgCrosshair } from './SvgCrosshair';

interface HoveredSeriesPoint extends Point {
  seriesColor?: string;
  seriesName?: string;
}

export const SvgLineChart: React.FC<SvgLineChartProps> = (props) => {
  const {
    data,
    series,
    curvature = 0.25,
    showDots = true,
    dotRadius: userDotRadius,
    showValues = false,
    title,
    subtitle,
    metric,
    showLegend = true,
    className = '',
    onPointHover
  } = props;

  const base = useChartBase(props);
  const {
    preset,
    color,
    pad,
    width,
    height,
    chartWidth,
    baselineY,
    valueFormatter,
    uid,
    glowId,
    containerStyle,
    showGrid,
    gridLines,
    showXAxis,
    showYAxis,
    glow,
    crosshair,
    animated
  } = base;

  const smooth = props.smooth ?? preset.smooth;
  const strokeWidth = props.strokeWidth ?? preset.strokeWidth;
  const strokeDasharray = props.strokeDasharray ?? preset.strokeDasharray;
  const fillGradient = props.fillGradient ?? preset.fillGradient;
  const gradientStartOpacity = props.gradientStartOpacity ?? preset.gradientStartOpacity;

  const [activePoint, setActivePoint] = useState<HoveredSeriesPoint | null>(null);

  const normalizedSeries = useMemo(() => {
    if (series && series.length > 0) {
      return series.map((s, idx) => ({
        id: s.id || `s-${idx}`,
        name: s.name || `Series ${idx + 1}`,
        data: s.data || [],
        color: s.color || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length],
        strokeWidth: s.strokeWidth ?? strokeWidth,
        strokeDasharray: s.strokeDasharray ?? strokeDasharray,
        fillGradient: s.fillGradient ?? (idx === 0 && fillGradient)
      }));
    }
    return [
      {
        id: 'def',
        name: 'Default',
        data: data || [],
        color,
        strokeWidth,
        strokeDasharray,
        fillGradient
      }
    ];
  }, [series, data, color, strokeWidth, strokeDasharray, fillGradient]);

  const { minVal, maxVal } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const s of normalizedSeries) {
      for (const d of s.data) {
        const v = typeof d === 'number' ? d : d.value;
        if (Number.isFinite(v)) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
    if (min === Infinity) return { minVal: 0, maxVal: 1 };
    if (min === max) {
      min = min > 0 ? 0 : min - 1;
      max = max === 0 ? 1 : max + 1;
    }
    return { minVal: min, maxVal: max };
  }, [normalizedSeries]);

  const renderedSeries = useMemo(() => {
    return normalizedSeries.map((s, idx) => {
      const { points } = scaleDataToPoints(s.data, width, height, pad, minVal, maxVal);
      return {
        ...s,
        points,
        linePath: generateLinePath(points, smooth, curvature),
        areaPath: s.fillGradient ? generateAreaPath(points, baselineY, smooth, curvature) : '',
        gradId: `gr-${uid}-${idx}`
      };
    });
  }, [normalizedSeries, width, height, pad, baselineY, minVal, maxVal, smooth, curvature, uid]);

  const maxSeriesPoints = Math.max(0, ...renderedSeries.map((s) => s.points.length));
  const dotRadius = userDotRadius ?? (maxSeriesPoints > 50 ? 2.5 : maxSeriesPoints > 25 ? 3 : 4);

  const visibleLabels = useMemo(() => {
    const ref = renderedSeries.find((s) => s.points.some((p) => p.label)) || renderedSeries[0];
    if (!ref || !ref.points.length) return [];
    const labeled = ref.points.map((p) => ({ label: p.label, x: p.x })).filter((p) => p.label);
    if (!labeled.length) return [];
    const maxL = Math.min(8, Math.max(2, Math.floor(chartWidth / 55)));
    const sampled = getSampledLabelIndices(labeled.length, maxL);
    return Array.from(sampled).map((i) => labeled[i]);
  }, [renderedSeries, chartWidth]);

  const transitionStyle = animated
    ? { transition: 'd 0.45s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s, fill 0.3s' }
    : undefined;

  const handleMouseEnter = (pt: Point, sName?: string, sColor?: string) => {
    const enriched = { ...pt, seriesName: sName, seriesColor: sColor };
    setActivePoint(enriched);
    onPointHover?.(enriched);
  };

  const handleMouseLeave = () => {
    setActivePoint(null);
    onPointHover?.(null);
  };

  if (!maxSeriesPoints) {
    return <ChartEmpty height={height} className={className} style={containerStyle} />;
  }

  const isMultiSeries = Boolean(series && series.length > 1);

  return (
    <div className={`pure-svg-chart-container ${className}`} style={containerStyle}>
      <ChartHeader
        title={title}
        subtitle={subtitle}
        metric={metric}
        color={color}
        marginBottom={isMultiSeries && showLegend ? 8 : 14}
      />

      {isMultiSeries && showLegend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 12, fontSize: 12 }}>
          {renderedSeries.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: s.color,
                  display: 'inline-block'
                }}
              />
              <span style={{ opacity: 0.9, fontWeight: 600 }}>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} style={fullSvgStyle}>
        <defs>
          {renderedSeries.map((s) =>
            s.fillGradient ? (
              <linearGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={gradientStartOpacity} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ) : null
          )}
          {glow && <ChartGlowFilter id={glowId} color={color} />}
        </defs>

        <ChartGrid
          showGrid={showGrid}
          showYAxis={showYAxis}
          gridLines={gridLines}
          minVal={minVal}
          maxVal={maxVal}
          pad={pad}
          width={width}
          height={height}
          valueFormatter={valueFormatter}
        />

        {renderedSeries.map((s) =>
          s.fillGradient && s.areaPath ? (
            <path key={`a-${s.id}`} d={s.areaPath} fill={`url(#${s.gradId})`} style={transitionStyle} pointerEvents="none" />
          ) : null
        )}

        {renderedSeries.map((s) => (
          <path
            key={`l-${s.id}`}
            d={s.linePath}
            fill="none"
            stroke={s.color}
            strokeWidth={s.strokeWidth}
            strokeDasharray={s.strokeDasharray}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={glow ? `url(#${glowId})` : undefined}
            style={transitionStyle}
          />
        ))}

        {crosshair && activePoint && (
          <SvgCrosshair
            x={activePoint.x}
            y={activePoint.y}
            baselineY={baselineY}
            padLeft={pad.left}
            padRight={pad.right}
            width={width}
            color={activePoint.seriesColor || color}
            valueStr={valueFormatter(activePoint.value)}
            label={activePoint.label}
          />
        )}

        {renderedSeries.map((s) =>
          s.points.map((pt, ptIdx) => {
            const isHovered = activePoint?.x === pt.x && activePoint?.y === pt.y;

            return (
              <g key={`${s.id}-${ptIdx}`}>
                {showValues && !isMultiSeries && (
                  <text
                    x={pt.x}
                    y={pt.y - (dotRadius + 6)}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {valueFormatter(pt.value)}
                  </text>
                )}

                {showDots && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? dotRadius * 1.5 : dotRadius}
                    fill={isHovered ? '#fff' : s.color}
                    stroke={s.color}
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ cursor: 'pointer', transition: animated ? 'all 0.2s' : undefined }}
                    onMouseEnter={() => handleMouseEnter(pt, s.name, s.color)}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </g>
            );
          })
        )}

        {showXAxis &&
          visibleLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={lbl.x}
              y={baselineY + 18}
              textAnchor={idx === 0 ? 'start' : idx === visibleLabels.length - 1 ? 'end' : 'middle'}
              fill="currentColor"
              opacity={0.65}
              fontSize="11"
              fontWeight="500"
            >
              {lbl.label}
            </text>
          ))}

        {/* SVG-native hover tooltip — always anchored exactly above active point */}
        {activePoint && !showValues && (() => {
          const text =
            (activePoint.seriesName && isMultiSeries ? `${activePoint.seriesName}: ` : '') +
            (activePoint.label ? `${activePoint.label} — ` : '') +
            valueFormatter(activePoint.value);
          const tw = Math.max(40, text.length * 7 + 16);
          const tx = Math.max(pad.left + tw / 2, Math.min(width - pad.right - tw / 2, activePoint.x));
          const ty = activePoint.y - dotRadius - 8;
          return (
            <g pointerEvents="none">
              <rect x={tx - tw / 2} y={ty - 16} width={tw} height={20} rx={5} fill="#0f172a" stroke={activePoint.seriesColor || '#334155'} strokeWidth={1} />
              <text x={tx} y={ty - 2} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="monospace">{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
