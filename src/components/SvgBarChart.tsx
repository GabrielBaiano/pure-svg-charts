import React, { useMemo, useState } from 'react';
import { getSampledLabelIndices } from '../core/scale';
import { generateBarPath } from '../core/bezier';
import { SvgBarChartProps } from '../core/types';
import {
  ChartEmpty,
  ChartGlowFilter,
  ChartGrid,
  ChartHeader,
  DEFAULT_PALETTE,
  fullSvgStyle,
  toCleanData,
  useChartBase
} from './ChartCommon';
import { SvgCrosshair } from './SvgCrosshair';

interface RenderedBarSegment {
  key: string;
  seriesIdx: number;
  catIdx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  path: string;
  value: number;
  label?: string;
  seriesName: string;
  seriesColor: string;
  stackTotal?: number;
  percent?: string;
}

export const SvgBarChart: React.FC<SvgBarChartProps> = (props) => {
  const {
    data = [],
    series,
    stacked = true,
    stackGap = 0,
    showLegend = true,
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
    animated,
    negativeColor,
    showZeroLine
  } = base;

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const isMultiSeries = Boolean(series && series.length > 0);

  const normalizedSeries = useMemo(() => {
    if (isMultiSeries && series) {
      return series.map((s, idx) => ({
        id: s.id || `bs-${idx}`,
        name: s.name || `Series ${idx + 1}`,
        color: s.color || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length],
        data: toCleanData(s.data)
      }));
    }
    return [
      {
        id: 'def',
        name: 'Default',
        color,
        data: toCleanData(data)
      }
    ];
  }, [isMultiSeries, series, data, color]);

  const categoryCount = useMemo(() => {
    return Math.max(0, ...normalizedSeries.map((s) => s.data.length));
  }, [normalizedSeries]);

  const refSeries = useMemo(
    () => normalizedSeries.find((s) => s.data.some((d) => d.label)) || normalizedSeries[0],
    [normalizedSeries]
  );
  const getCategoryLabel = (idx: number) => refSeries?.data[idx]?.label || `#${idx + 1}`;

  const { minVal, maxVal, categoryPosTotals, categoryNegTotals } = useMemo(() => {
    if (categoryCount === 0) return { minVal: 0, maxVal: 1, categoryPosTotals: [], categoryNegTotals: [] };

    if (isMultiSeries && stacked) {
      const posTotals = new Array(categoryCount);
      const negTotals = new Array(categoryCount);
      let min = 0;
      let max = 0;
      for (let catIdx = 0; catIdx < categoryCount; catIdx++) {
        let pos = 0;
        let neg = 0;
        for (let sIdx = 0; sIdx < normalizedSeries.length; sIdx++) {
          const v = normalizedSeries[sIdx].data[catIdx]?.value || 0;
          if (v > 0) pos += v;
          else if (v < 0) neg += v;
        }
        posTotals[catIdx] = pos;
        negTotals[catIdx] = neg;
        if (neg < min) min = neg;
        if (pos > max) max = pos;
      }
      if (min === max) {
        min = min > 0 ? 0 : min - 1;
        max = max === 0 ? 1 : max + 1;
      }
      return { minVal: min, maxVal: max, categoryPosTotals: posTotals, categoryNegTotals: negTotals };
    }

    let min = 0;
    let max = 0;
    for (const s of normalizedSeries) {
      for (const d of s.data) {
        if (d.value < min) min = d.value;
        if (d.value > max) max = d.value;
      }
    }
    if (min === max) {
      min = min > 0 ? 0 : min - 1;
      max = max === 0 ? 1 : max + 1;
    }
    return { minVal: min, maxVal: max, categoryPosTotals: [], categoryNegTotals: [] };
  }, [normalizedSeries, categoryCount, isMultiSeries, stacked]);

  const valueRange = Math.max(0.0001, maxVal - minVal);
  const zeroY =
    minVal < 0 && maxVal > 0
      ? pad.top + ((maxVal - 0) / valueRange) * chartHeight
      : minVal >= 0
      ? baselineY
      : pad.top;

  const slotWidth = categoryCount > 0 ? chartWidth / categoryCount : chartWidth;
  const barWidth = Math.max(2, slotWidth * (1 - barGap));
  const barOffset = (slotWidth - barWidth) / 2;

  const renderedSegments = useMemo<RenderedBarSegment[]>(() => {
    if (categoryCount === 0) return [];
    const segments: RenderedBarSegment[] = [];

    if (isMultiSeries && stacked) {
      const gap = Math.max(0, stackGap);

      for (let catIdx = 0; catIdx < categoryCount; catIdx++) {
        const x = pad.left + catIdx * slotWidth + barOffset;
        let accumPosY = 0;
        let accumNegY = 0;

        let highestPosIdx = -1;
        let lowestNegIdx = -1;
        const posTotal = categoryPosTotals[catIdx] || 0;
        const negTotal = categoryNegTotals[catIdx] || 0;

        for (let sIdx = 0; sIdx < normalizedSeries.length; sIdx++) {
          const v = normalizedSeries[sIdx].data[catIdx]?.value || 0;
          if (v > 0) highestPosIdx = sIdx;
          else if (v < 0 && lowestNegIdx === -1) lowestNegIdx = sIdx;
        }

        for (let sIdx = 0; sIdx < normalizedSeries.length; sIdx++) {
          const s = normalizedSeries[sIdx];
          const val = s.data[catIdx]?.value || 0;
          if (val === 0 && normalizedSeries.length > 1) continue;

          const isNeg = val < 0;
          const segHeight = Math.max(val !== 0 ? 2 : 0, (Math.abs(val) / valueRange) * chartHeight);

          let segY = zeroY;
          let segPath = '';
          let segRx = 0;

          if (isNeg) {
            segY = zeroY + accumNegY;
            const isBottom = sIdx === lowestNegIdx;

            if (gap > 0) {
              segRx = Math.min(radius, barWidth / 2, segHeight / 2);
              segPath = generateBarPath(x, segY, barWidth, segHeight, segRx, true, true);
              accumNegY += segHeight + gap;
            } else {
              segRx = Math.min(radius, barWidth / 2, segHeight);
              const roundTop = false;
              const roundBottom = isBottom;
              const overlap = isBottom ? 0 : 0.5;
              segPath = generateBarPath(x, segY, barWidth, segHeight + overlap, segRx, roundTop, roundBottom);
              accumNegY += segHeight;
            }
          } else {
            const isTop = sIdx === highestPosIdx;
            segY = zeroY - accumPosY - segHeight;

            if (gap > 0) {
              segRx = Math.min(radius, barWidth / 2, segHeight / 2);
              segPath = generateBarPath(x, segY, barWidth, segHeight, segRx, true, true);
              accumPosY += segHeight + gap;
            } else {
              segRx = Math.min(radius, barWidth / 2, segHeight);
              const roundTop = isTop;
              const roundBottom = false;
              const overlap = isTop ? 0 : 0.5;
              segPath = generateBarPath(x, segY, barWidth, segHeight + overlap, segRx, roundTop, roundBottom);
              accumPosY += segHeight;
            }
          }

          const stackTotal = isNeg ? Math.abs(negTotal) : posTotal;
          const percent =
            stackTotal > 0 ? ((Math.abs(val) / stackTotal) * 100).toFixed(1) : '0';

          const segColor = isNeg && negativeColor ? negativeColor : s.color;

          segments.push({
            key: `${s.id}-${catIdx}`,
            seriesIdx: sIdx,
            catIdx,
            x,
            y: segY,
            width: barWidth,
            height: segHeight,
            rx: segRx,
            path: segPath,
            value: val,
            label: getCategoryLabel(catIdx),
            seriesName: s.name,
            seriesColor: segColor,
            stackTotal,
            percent
          });
        }
      }
    } else if (isMultiSeries && !stacked) {
      const seriesCount = normalizedSeries.length;
      const subBarWidth = Math.max(2, barWidth / seriesCount);

      for (let catIdx = 0; catIdx < categoryCount; catIdx++) {
        for (let sIdx = 0; sIdx < seriesCount; sIdx++) {
          const s = normalizedSeries[sIdx];
          const val = s.data[catIdx]?.value || 0;
          const isNeg = val < 0;
          const subX = pad.left + catIdx * slotWidth + barOffset + sIdx * subBarWidth;
          const subHeight = Math.max(val !== 0 ? 2 : 0, (Math.abs(val) / valueRange) * chartHeight);
          const rx = Math.min(radius, subBarWidth / 2, subHeight);

          let subY = zeroY;
          let segPath = '';

          if (isNeg) {
            subY = zeroY;
            segPath = generateBarPath(subX, subY, subBarWidth, subHeight, rx, false, true);
          } else {
            subY = zeroY - subHeight;
            segPath = generateBarPath(subX, subY, subBarWidth, subHeight, rx, true, false);
          }

          const segColor = isNeg && negativeColor ? negativeColor : s.color;

          segments.push({
            key: `${s.id}-${catIdx}`,
            seriesIdx: sIdx,
            catIdx,
            x: subX,
            y: subY,
            width: subBarWidth,
            height: subHeight,
            rx,
            path: segPath,
            value: val,
            label: getCategoryLabel(catIdx),
            seriesName: s.name,
            seriesColor: segColor
          });
        }
      }
    } else {
      // Single series
      const s = normalizedSeries[0];
      for (let catIdx = 0; catIdx < categoryCount; catIdx++) {
        const item = s.data[catIdx];
        const val = item?.value || 0;
        const isNeg = val < 0;
        const x = pad.left + catIdx * slotWidth + barOffset;
        const bHeight = Math.max(val !== 0 ? 2 : 0, (Math.abs(val) / valueRange) * chartHeight);
        const rx = Math.min(radius, barWidth / 2, bHeight);

        let y = zeroY;
        let segPath = '';

        if (isNeg) {
          y = zeroY;
          segPath = generateBarPath(x, y, barWidth, bHeight, rx, false, true);
        } else {
          y = zeroY - bHeight;
          segPath = generateBarPath(x, y, barWidth, bHeight, rx, true, false);
        }

        const segColor = isNeg && negativeColor ? negativeColor : s.color;

        segments.push({
          key: `${s.id}-${catIdx}`,
          seriesIdx: 0,
          catIdx,
          x,
          y,
          width: barWidth,
          height: bHeight,
          rx,
          path: segPath,
          value: val,
          label: item?.label || getCategoryLabel(catIdx),
          seriesName: s.name,
          seriesColor: segColor
        });
      }
    }

    return segments;
  }, [categoryCount, isMultiSeries, stacked, stackGap, normalizedSeries, categoryPosTotals, categoryNegTotals, pad.left, pad.top, slotWidth, barOffset, barWidth, baselineY, zeroY, valueRange, chartHeight, radius, refSeries, negativeColor]);

  const visibleLabelIndices = useMemo(() => {
    if (!categoryCount) return new Set<number>();
    const maxLabels = Math.min(8, Math.max(2, Math.floor(chartWidth / 55)));
    return getSampledLabelIndices(categoryCount, maxLabels);
  }, [categoryCount, chartWidth]);

  const transitionStyle = animated
    ? { transition: 'y 0.45s cubic-bezier(0.4, 0, 0.2, 1), height 0.45s cubic-bezier(0.4, 0, 0.2, 1)' }
    : undefined;

  const activeSegment = useMemo(
    () => (hoveredKey ? renderedSegments.find((seg) => seg.key === hoveredKey) || null : null),
    [hoveredKey, renderedSegments]
  );

  const handleBarEnter = (seg: RenderedBarSegment) => {
    if (hoveredKey === seg.key) return;
    setHoveredKey(seg.key);
    onBarHover?.({
      value: seg.value,
      index: seg.catIdx,
      label: seg.label,
      seriesName: seg.seriesName
    });
  };

  const handleBarLeave = () => {
    if (hoveredKey === null) return;
    setHoveredKey(null);
    onBarHover?.(null);
  };

  if (categoryCount === 0) {
    return <ChartEmpty height={height} className={className} style={containerStyle} />;
  }

  return (
    <div className={`pure-svg-chart-container ${className}`} style={containerStyle}>
      <ChartHeader title={title} subtitle={subtitle} metric={metric} color={color} />

      {isMultiSeries && showLegend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 12, fontSize: 12 }}>
          {normalizedSeries.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
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
        <defs>{glow && <ChartGlowFilter id={glowId} color={color} />}</defs>

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

        {crosshair && activeSegment && (
          <SvgCrosshair
            x={activeSegment.x + activeSegment.width / 2}
            y={activeSegment.y}
            baselineY={zeroY}
            padLeft={pad.left}
            padRight={pad.right}
            width={width}
            color={activeSegment.seriesColor || color}
            valueStr={valueFormatter(activeSegment.value)}
            label={activeSegment.label}
          />
        )}

        {renderedSegments.map((seg) => {
          const isHovered = hoveredKey === seg.key;

          return (
            <g key={seg.key}>
              {showValues && !isMultiSeries && (categoryCount <= 15 || visibleLabelIndices.has(seg.catIdx)) && (
                <text
                  x={seg.x + seg.width / 2}
                  y={seg.value < 0 ? seg.y + seg.height + 14 : seg.y - 6}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  fontWeight="700"
                >
                  {valueFormatter(seg.value)}
                </text>
              )}

              <path
                d={seg.path}
                fill={seg.seriesColor}
                opacity={isHovered ? 1 : 0.88}
                filter={glow ? `url(#${glowId})` : undefined}
                style={{ ...transitionStyle, cursor: 'pointer' }}
                onMouseEnter={() => handleBarEnter(seg)}
                onMouseLeave={handleBarLeave}
              />
            </g>
          );
        })}

        {showXAxis &&
          Array.from(visibleLabelIndices).map((catIdx) => {
            const lbl = getCategoryLabel(catIdx);
            const x = pad.left + catIdx * slotWidth + slotWidth / 2;
            return (
              <text
                key={catIdx}
                x={x}
                y={baselineY + 18}
                textAnchor="middle"
                fill="currentColor"
                opacity={0.65}
                fontSize="11"
                fontWeight="500"
              >
                {lbl}
              </text>
            );
          })}

        {/* SVG-native hover tooltip */}
        {activeSegment && !showValues && (() => {
          const bx = activeSegment.x + activeSegment.width / 2;
          const by = activeSegment.y;
          const labelPrefix = activeSegment.label ? `${activeSegment.label}: ` : '';
          const percentSuffix = activeSegment.percent ? ` (${activeSegment.percent}%)` : '';
          const seriesPrefix = isMultiSeries ? `${activeSegment.seriesName} — ` : '';
          const text = `${seriesPrefix}${labelPrefix}${valueFormatter(activeSegment.value)}${percentSuffix}`;
          const tw = Math.max(40, text.length * 7 + 16);
          const tx = Math.max(pad.left + tw / 2, Math.min(width - pad.right - tw / 2, bx));
          const ty = by - 10;
          return (
            <g pointerEvents="none">
              <rect
                x={tx - tw / 2}
                y={ty - 16}
                width={tw}
                height={20}
                rx={5}
                fill="#0f172a"
                stroke={activeSegment.seriesColor || color}
                strokeWidth={1}
              />
              <text
                x={tx}
                y={ty - 2}
                textAnchor="middle"
                fill="#fff"
                fontSize="11"
                fontWeight="700"
                fontFamily="monospace"
              >
                {text}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
