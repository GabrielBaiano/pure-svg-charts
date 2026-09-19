import React, { useId, useMemo, useState } from 'react';
import { generateAreaPath, generateLinePath } from '../core/bezier';
import { getSampledLabelIndices, scaleDataToPoints } from '../core/scale';
import { Point, SvgLineChartProps } from '../core/types';
import { CHART_VARIANTS } from '../core/variants';
import { SvgCrosshair } from './SvgCrosshair';

export const SvgLineChart: React.FC<SvgLineChartProps> = (props) => {
  const {
    variant = 'default',
    data = [],
    width = 500,
    height = 220,
    curvature = 0.25,
    showDots = true,
    dotRadius: userDotRadius,
    showValues = false,
    valueFormatter = (val) => String(Math.round(val)),
    title,
    subtitle,
    metric,
    padding,
    animated = true,
    className = '',
    style,
    onPointHover
  } = props;

  // Retrieve base styling from chosen variant
  const preset = CHART_VARIANTS[variant] || CHART_VARIANTS.default;

  // Explicit user props take precedence over variant presets
  const color = props.color ?? preset.color;
  const smooth = props.smooth ?? preset.smooth;
  const strokeWidth = props.strokeWidth ?? preset.strokeWidth;
  const strokeDasharray = props.strokeDasharray ?? preset.strokeDasharray;
  const fillGradient = props.fillGradient ?? preset.fillGradient;
  const gradientStartOpacity = props.gradientStartOpacity ?? preset.gradientStartOpacity;
  const showGrid = props.showGrid ?? preset.showGrid;
  const gridLines = props.gridLines ?? preset.gridLines;
  const showXAxis = props.showXAxis ?? preset.showXAxis;
  const showYAxis = props.showYAxis ?? preset.showYAxis;
  const glow = props.glow ?? preset.glow;
  const crosshair = props.crosshair ?? true;

  const gradientId = useId().replace(/:/g, '-');
  const glowId = `glow-${gradientId}`;
  const [activePoint, setActivePoint] = useState<Point | null>(null);

  const { points, minVal, maxVal, padding: pad } = useMemo(() => {
    return scaleDataToPoints(data, width, height, padding);
  }, [data, width, height, padding]);

  // Adaptive dot radius: high-density datasets gracefully scale down to prevent dots from collapsing into each other
  const dotRadius = useMemo(() => {
    if (userDotRadius !== undefined) return userDotRadius;
    if (points.length > 50) return 2.5;
    if (points.length > 25) return 3;
    return 4;
  }, [userDotRadius, points.length]);

  const baselineY = height - pad.bottom;
  const chartHeight = Math.max(1, height - pad.top - pad.bottom);

  const linePath = useMemo(() => {
    return generateLinePath(points, smooth, curvature);
  }, [points, smooth, curvature]);

  const areaPath = useMemo(() => {
    if (!fillGradient) return '';
    return generateAreaPath(points, baselineY, smooth, curvature);
  }, [points, baselineY, smooth, curvature, fillGradient]);

  // Compute grid line steps with integers
  const gridSteps = useMemo(() => {
    if (!showGrid || gridLines <= 1) return [];
    const steps = [];
    const valStep = (maxVal - minVal) / (gridLines - 1);
    const yStep = chartHeight / (gridLines - 1);

    for (let i = 0; i < gridLines; i++) {
      const y = pad.top + i * yStep;
      const val = Math.round(maxVal - i * valStep);
      steps.push({ y, val });
    }
    return steps;
  }, [showGrid, gridLines, minVal, maxVal, chartHeight, pad.top]);

  // Clean evenly-spaced X-axis label sampling to prevent any overlap
  const visibleLabelIndices = useMemo(() => {
    const labeled = points
      .map((pt, idx) => ({ label: pt.label, idx }))
      .filter((item) => item.label !== undefined && item.label !== '');
    if (!labeled.length) return new Set<number>();

    const chartWidth = Math.max(1, width - pad.left - pad.right);
    const maxLabels = Math.min(8, Math.max(2, Math.floor(chartWidth / 55)));

    const sampledRelative = getSampledLabelIndices(labeled.length, maxLabels);
    const selectedAbsolute = new Set<number>();
    sampledRelative.forEach((relIdx) => {
      if (labeled[relIdx]) {
        selectedAbsolute.add(labeled[relIdx].idx);
      }
    });
    return selectedAbsolute;
  }, [points, width, pad.left, pad.right]);

  const transitionStyle = animated
    ? {
        transition: 'd 0.45s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease, fill 0.3s ease'
      }
    : undefined;

  const handleMouseEnter = (pt: Point) => {
    setActivePoint(pt);
    onPointHover?.(pt);
  };

  const handleMouseLeave = () => {
    setActivePoint(null);
    onPointHover?.(null);
  };

  const containerStyling: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    ...preset.containerStyle,
    ...style
  };

  if (!points.length) {
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
      {/* Optional Header (Title, Subtitle, Metric) */}
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

      {/* SVG Chart Engine */}
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
          {fillGradient && (
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={gradientStartOpacity} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          )}

          {glow && (
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.75" />
            </filter>
          )}
        </defs>

        {/* Background Grid Lines & Y-Axis Values */}
        {showGrid &&
          gridSteps.map((step, idx) => (
            <g key={`grid-${idx}`}>
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

        {/* Gradient Area Fill */}
        {fillGradient && areaPath && (
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            style={transitionStyle}
            pointerEvents="none"
          />
        )}

        {/* Main Line Stroke with optional Glow Filter */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={glow ? `url(#${glowId})` : undefined}
          style={transitionStyle}
        />

        {/* Interactive Crosshair Guidelines & Directional Indicator Arrows */}
        {crosshair && activePoint && (
          <SvgCrosshair
            x={activePoint.x}
            y={activePoint.y}
            baselineY={baselineY}
            padLeft={pad.left}
            padRight={pad.right}
            width={width}
            color={color}
            valueStr={valueFormatter(activePoint.value)}
            label={activePoint.label}
            dotRadius={dotRadius}
          />
        )}

        {/* Data Point Circles and permanent values */}
        {points.map((pt, idx) => {
          const isHovered = activePoint?.x === pt.x && activePoint?.y === pt.y;

          return (
            <g key={`point-${idx}`}>
              {/* Permanent Value label above point */}
              {showValues && (points.length <= 15 || visibleLabelIndices.has(idx)) && (
                <text
                  x={pt.x}
                  y={pt.y - (dotRadius + 6)}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  fontWeight="700"
                  style={{
                    transition: 'x 0.45s cubic-bezier(0.4, 0, 0.2, 1), y 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {valueFormatter(pt.value)}
                </text>
              )}

              {/* Interactive Hit Area */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={dotRadius * 3}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => handleMouseEnter(pt)}
                onMouseLeave={handleMouseLeave}
              />

              {/* Visible Circle Dot (Pure vector without clipping box) */}
              {showDots && (
                <>
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={dotRadius * 2.2}
                      fill={color}
                      opacity={0.25}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? dotRadius * 1.5 : dotRadius}
                    fill={isHovered ? '#ffffff' : color}
                    stroke={color}
                    strokeWidth={2}
                    style={{
                      transition:
                        'cx 0.45s cubic-bezier(0.4, 0, 0.2, 1), cy 0.45s cubic-bezier(0.4, 0, 0.2, 1), r 0.2s ease',
                      pointerEvents: 'none'
                    }}
                  />
                </>
              )}
            </g>
          );
        })}

        {/* X-Axis Category Labels with Smart Sampling for high-density datasets */}
        {showXAxis &&
          points.map((pt, idx) => {
            if (!pt.label || !visibleLabelIndices.has(idx)) return null;

            const isFirst = idx === 0;
            const isLast = idx === points.length - 1;

            return (
              <text
                key={`label-${idx}`}
                x={pt.x}
                y={baselineY + 18}
                textAnchor={isFirst ? 'start' : isLast ? 'end' : 'middle'}
                fill="currentColor"
                opacity={0.65}
                fontSize="11"
                fontWeight="500"
              >
                {pt.label}
              </text>
            );
          })}
      </svg>

      {/* Floating Hover Tooltip */}
      {activePoint && !showValues && (
        <div
          style={{
            position: 'absolute',
            left: `${(activePoint.x / width) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
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
          {activePoint.label ? `${activePoint.label}: ` : ''}
          {valueFormatter(activePoint.value)}
        </div>
      )}
    </div>
  );
};
