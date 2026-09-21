import React, { useMemo, useState, useRef, useEffect } from 'react';
import { generateAreaPath, generateLinePath, generateStackedAreaPath } from '../core/bezier';
import { downsampleLTTB } from '../core/lttb';
import { getSampledLabelIndices, scaleDataToPoints } from '../core/scale';
import { DataValue, Point, SvgLineChartProps } from '../core/types';
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
  originalValue?: number;
}

interface RenderedLineSeries {
  id: string;
  name: string;
  color: string;
  strokeWidth: number;
  strokeDasharray?: string;
  fillGradient?: boolean;
  points: (Point & { originalValue?: number })[];
  linePath: string;
  areaPath: string;
  gradId: string;
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
    stacked = false,
    maxDisplayPoints = 300,
    className = '',
    onPointHover,
    renderTooltip
  } = props;

  const base = useChartBase(props);
  const {
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
    showGrid,
    gridLines,
    showXAxis,
    showYAxis,
    glow,
    crosshair,
    animated,
    showZeroLine
  } = base;

  const smooth = props.smooth ?? preset.smooth;
  const strokeWidth = props.strokeWidth ?? preset.strokeWidth;
  const strokeDasharray = props.strokeDasharray ?? preset.strokeDasharray;
  const fillGradient = props.fillGradient ?? preset.fillGradient;
  const gradientStartOpacity = props.gradientStartOpacity ?? preset.gradientStartOpacity;

  const [activePoint, setActivePoint] = useState<HoveredSeriesPoint | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPinned) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsPinned(false);
        setActivePoint(null);
        onPointHover?.(null);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
    };
  }, [isPinned, onPointHover]);

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

  const isMultiSeries = Boolean(series && series.length > 1);

  // Prepare series data with cumulative stacking only when stacked is true
  const stackedSeriesData = useMemo(() => {
    if (!isMultiSeries || !stacked) {
      return normalizedSeries.map((s) => ({
        ...s,
        dataWithOrig: s.data
      }));
    }

    const pointCount = Math.max(0, ...normalizedSeries.map((s) => s.data.length));
    const runningTotals = new Array(pointCount).fill(0);

    return normalizedSeries.map((s) => {
      const dataWithOrig = s.data.map((d, i) => {
        const val = Math.max(0, typeof d === 'number' ? d : d.value);
        runningTotals[i] = (runningTotals[i] || 0) + val;
        return {
          value: runningTotals[i],
          origValue: val,
          label: typeof d === 'object' ? d.label : undefined
        };
      });
      return { ...s, dataWithOrig };
    });
  }, [normalizedSeries, isMultiSeries, stacked]);

  const { minVal, maxVal } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const s of stackedSeriesData) {
      for (const d of s.dataWithOrig) {
        const v = typeof d === 'number' ? d : d.value;
        if (Number.isFinite(v)) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
    if (stacked && isMultiSeries) {
      min = Math.min(0, min);
    }
    if (min === Infinity) return { minVal: 0, maxVal: 1 };
    if (min === max) {
      min = min > 0 ? 0 : min - 1;
      max = max === 0 ? 1 : max + 1;
    }
    return { minVal: min, maxVal: max };
  }, [stackedSeriesData, stacked, isMultiSeries]);

  const valueRange = Math.max(0.0001, maxVal - minVal);
  const zeroY =
    minVal < 0 && maxVal > 0
      ? pad.top + ((maxVal - 0) / valueRange) * chartHeight
      : minVal >= 0
      ? baselineY
      : pad.top;

  const effectiveBaselineY =
    minVal < 0 && maxVal > 0 ? zeroY : maxVal <= 0 ? zeroY : baselineY;

  const renderedSeries = useMemo<RenderedLineSeries[]>(() => {
    const result: RenderedLineSeries[] = [];

    for (let idx = 0; idx < stackedSeriesData.length; idx++) {
      const s = stackedSeriesData[idx];
      const effectiveData =
        maxDisplayPoints && maxDisplayPoints > 2 && s.dataWithOrig.length > maxDisplayPoints
          ? downsampleLTTB(s.dataWithOrig as any, maxDisplayPoints)
          : s.dataWithOrig;

      const { points } = scaleDataToPoints(effectiveData as DataValue[], width, height, pad, minVal, maxVal);

      // Only inject originalValue for stacked series to prevent V8 Hidden Class (Shape) thrashing
      if (stacked && isMultiSeries) {
        for (let pIdx = 0; pIdx < points.length; pIdx++) {
          (points[pIdx] as any).originalValue = (effectiveData[pIdx] as any)?.origValue ?? points[pIdx].value;
        }
      }

      // Generate line path once and reuse it directly for area gradient paths
      const linePath = generateLinePath(points, smooth, curvature);
      let areaPath = '';
      if (s.fillGradient) {
        if (stacked && isMultiSeries && idx > 0) {
          areaPath = generateStackedAreaPath(points, result[idx - 1].points, smooth, curvature, linePath);
        } else {
          areaPath = generateAreaPath(points, effectiveBaselineY, smooth, curvature, linePath);
        }
      }

      result.push({
        ...s,
        points,
        linePath,
        areaPath,
        gradId: `gr-${uid}-${idx}`
      });
    }

    return result;
  }, [stackedSeriesData, width, height, pad, effectiveBaselineY, minVal, maxVal, smooth, curvature, uid, maxDisplayPoints, stacked, isMultiSeries]);

  const maxSeriesPoints = Math.max(0, ...renderedSeries.map((s) => s.points.length));
  const isHighDensity = maxSeriesPoints > 60;
  const dotRadius = userDotRadius ?? (maxSeriesPoints > 50 ? 2.5 : maxSeriesPoints > 25 ? 3 : 4);

  const visibleLabels = useMemo(() => {
    const ref = renderedSeries.find((s) => s.points.some((p) => p.label)) || renderedSeries[0];
    if (!ref || !ref.points.length) return [];
    const labeled: { label?: string; x: number }[] = [];
    for (let i = 0; i < ref.points.length; i++) {
      const p = ref.points[i];
      if (p.label) labeled.push(p);
    }
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
    if (!isPinned) {
      setActivePoint(null);
      onPointHover?.(null);
    }
  };

  const resolveClosestPoint = (svgX: number, svgY: number) => {
    let closestPt: Point | null = null;
    let closestDist = Infinity;
    let closestSeriesName: string | undefined;
    let closestSeriesColor: string | undefined;

    for (const s of renderedSeries) {
      if (!s.points.length) continue;
      let low = 0;
      let high = s.points.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (s.points[mid].x < svgX) low = mid + 1;
        else high = mid - 1;
      }
      const i1 = Math.max(0, Math.min(s.points.length - 1, low));
      const i0 = Math.max(0, i1 - 1);
      const cand =
        Math.abs(s.points[i0].x - svgX) < Math.abs(s.points[i1].x - svgX)
          ? s.points[i0]
          : s.points[i1];

      const dx = cand.x - svgX;
      const dy = cand.y - svgY;
      const dist = dx * dx + dy * dy;

      if (dist < closestDist) {
        closestDist = dist;
        closestPt = cand;
        closestSeriesName = s.name;
        closestSeriesColor = s.color;
      }
    }

    if (closestPt) {
      if (
        activePoint &&
        activePoint.x === closestPt.x &&
        activePoint.y === closestPt.y &&
        activePoint.seriesName === closestSeriesName
      ) {
        return;
      }
      handleMouseEnter(closestPt, closestSeriesName, closestSeriesColor);
    }
  };

  const handleOverlayMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const svgX = pad.left + (clientX / rect.width) * chartWidth;
    const svgY = pad.top + (clientY / rect.height) * (baselineY - pad.top);
    resolveClosestPoint(svgX, svgY);
  };

  const handleTouch = (e: React.TouchEvent<SVGRectElement | SVGSVGElement>) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clientX = touch.clientX - rect.left;
    const clientY = touch.clientY - rect.top;
    const svgX = pad.left + (clientX / rect.width) * chartWidth;
    const svgY = pad.top + (clientY / rect.height) * (baselineY - pad.top);
    setIsPinned(true);
    resolveClosestPoint(svgX, svgY);
  };

  if (!maxSeriesPoints) {
    return <ChartEmpty height={height} className={className} style={containerStyle} />;
  }

  return (
    <div ref={containerRef} className={`pure-svg-chart-container ${className}`} style={containerStyle}>
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

      <div style={{ position: 'relative', width: '100%', touchAction: 'pan-y' }}>
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
          showZeroLine={showZeroLine}
          zeroY={zeroY}
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
            baselineY={zeroY}
            padLeft={pad.left}
            padRight={pad.right}
            width={width}
            color={activePoint.seriesColor || color}
            valueStr={valueFormatter(activePoint.originalValue !== undefined ? activePoint.originalValue : activePoint.value)}
            label={activePoint.label}
          />
        )}

        {/* Static dots and values (rendered only when showDots or showValues is enabled) */}
        {(!isHighDensity && showDots || (showValues && !isMultiSeries)) &&
          renderedSeries.map((s) =>
            s.points.map((pt, ptIdx) => {
              const shouldShowValue =
                showValues &&
                !isMultiSeries &&
                (maxSeriesPoints <= 25 || ptIdx % Math.ceil(maxSeriesPoints / 12) === 0);
              const shouldShowDot = showDots && !isHighDensity;

              if (!shouldShowValue && !shouldShowDot) return null;

              const isHovered = activePoint?.x === pt.x && activePoint?.y === pt.y;

              if (shouldShowValue && shouldShowDot) {
                return (
                  <g key={`${s.id}-${ptIdx}`}>
                    <text
                      x={pt.x}
                      y={pt.value < 0 ? pt.y + dotRadius + 14 : pt.y - (dotRadius + 6)}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="11"
                      fontWeight="700"
                      pointerEvents="none"
                    >
                      {valueFormatter(pt.value)}
                    </text>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? dotRadius * 1.5 : dotRadius}
                      fill={isHovered ? '#fff' : s.color}
                      stroke={s.color}
                      strokeWidth={isHovered ? 3 : 2}
                      style={{ cursor: 'pointer', transition: animated ? 'all 0.2s' : undefined }}
                      pointerEvents="none"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={Math.max(16, dotRadius * 2.5)}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => handleMouseEnter(pt, s.name, s.color)}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setIsPinned(true);
                        handleMouseEnter(pt, s.name, s.color);
                      }}
                    />
                  </g>
                );
              }

              if (shouldShowDot) {
                return (
                  <g key={`${s.id}-${ptIdx}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? dotRadius * 1.5 : dotRadius}
                      fill={isHovered ? '#fff' : s.color}
                      stroke={s.color}
                      strokeWidth={isHovered ? 3 : 2}
                      style={{ cursor: 'pointer', transition: animated ? 'all 0.2s' : undefined }}
                      pointerEvents="none"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={Math.max(16, dotRadius * 2.5)}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => handleMouseEnter(pt, s.name, s.color)}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setIsPinned(true);
                        handleMouseEnter(pt, s.name, s.color);
                      }}
                    />
                  </g>
                );
              }

              return (
                <text
                  key={`${s.id}-${ptIdx}`}
                  x={pt.x}
                  y={pt.value < 0 ? pt.y + dotRadius + 14 : pt.y - (dotRadius + 6)}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  fontWeight="700"
                  pointerEvents="none"
                >
                  {valueFormatter(pt.value)}
                </text>
              );
            })
          )}

        {/* Dynamic active point highlight dot (used when static dots are hidden) */}
        {(isHighDensity || !showDots) && activePoint && (
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r={dotRadius * 1.5}
            fill="#fff"
            stroke={activePoint.seriesColor || color}
            strokeWidth={3}
            pointerEvents="none"
          />
        )}

        {/* Transparent overlay capturing mouse and touch scrubbing movements */}
        <rect
          x={pad.left}
          y={pad.top}
          width={chartWidth}
          height={Math.max(0, baselineY - pad.top)}
          fill="transparent"
          style={{ cursor: 'crosshair' }}
          onMouseMove={handleOverlayMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
        />

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

        {/* SVG-native hover tooltip — used when custom renderTooltip is not provided */}
        {activePoint && !showValues && !renderTooltip && (() => {
          const displayVal =
            activePoint.originalValue !== undefined ? activePoint.originalValue : activePoint.value;
          const text =
            (activePoint.seriesName && isMultiSeries ? `${activePoint.seriesName}: ` : '') +
            (activePoint.label ? `${activePoint.label} — ` : '') +
            valueFormatter(displayVal);
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

      {/* HTML overlay tooltip for custom React component rendering */}
      {activePoint && !showValues && renderTooltip && (
        <div
          data-testid="custom-tooltip"
          style={{
            position: 'absolute',
            left: `${(activePoint.x / width) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap'
          }}
        >
          {renderTooltip({
            point: activePoint,
            seriesName: activePoint.seriesName,
            seriesColor: activePoint.seriesColor,
            value: activePoint.originalValue !== undefined ? activePoint.originalValue : activePoint.value,
            formattedValue: valueFormatter(
              activePoint.originalValue !== undefined ? activePoint.originalValue : activePoint.value
            )
          })}
        </div>
      )}
      </div>
    </div>
  );
};
