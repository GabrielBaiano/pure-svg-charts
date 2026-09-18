import React, { useId, useMemo, useState } from 'react';
import { generateAreaPath, generateLinePath } from '../core/bezier';
import { scaleDataToPoints } from '../core/scale';
import { Point, SvgLineChartProps } from '../core/types';

export const SvgLineChart: React.FC<SvgLineChartProps> = ({
  data = [],
  width = 500,
  height = 220,
  color = '#6366f1',
  strokeWidth = 3,
  smooth = true,
  curvature = 0.25,
  strokeDasharray,
  showDots = true,
  dotRadius = 4,
  fillGradient = true,
  gradientStartOpacity = 0.35,
  showGrid = true,
  gridLines = 4,
  showXAxis = true,
  showYAxis = true,
  showValues = false,
  valueFormatter = (val) => String(Math.round(val)),
  title,
  subtitle,
  metric,
  glow = false,
  padding,
  animated = true,
  className = '',
  style,
  onPointHover
}) => {
  const gradientId = useId().replace(/:/g, '-');
  const glowId = `glow-${gradientId}`;
  const [activePoint, setActivePoint] = useState<Point | null>(null);

  const { points, minVal, maxVal, padding: pad } = useMemo(() => {
    return scaleDataToPoints(data, width, height, padding);
  }, [data, width, height, padding]);

  const baselineY = height - pad.bottom;
  const chartHeight = Math.max(1, height - pad.top - pad.bottom);

  const linePath = useMemo(() => {
    return generateLinePath(points, smooth, curvature);
  }, [points, smooth, curvature]);

  const areaPath = useMemo(() => {
    if (!fillGradient) return '';
    return generateAreaPath(points, baselineY, smooth, curvature);
  }, [points, baselineY, smooth, curvature, fillGradient]);

  // Compute grid line steps
  const gridSteps = useMemo(() => {
    if (!showGrid || gridLines <= 1) return [];
    const steps = [];
    const valStep = (maxVal - minVal) / (gridLines - 1);
    const yStep = chartHeight / (gridLines - 1);

    for (let i = 0; i < gridLines; i++) {
      const y = pad.top + i * yStep;
      const val = maxVal - i * valStep;
      steps.push({ y, val });
    }
    return steps;
  }, [showGrid, gridLines, minVal, maxVal, chartHeight, pad.top]);

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

  if (!points.length) {
    return (
      <div
        className={`pure-svg-empty ${className}`}
        style={{
          width: '100%',
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '14px',
          ...style
        }}
      >
        No data to display
      </div>
    );
  }

  return (
    <div
      className={`pure-svg-chart-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        fontFamily: 'inherit',
        ...style
      }}
    >
      {/* Optional Header (Title, Subtitle, Metric) */}
      {(title || metric || subtitle) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px',
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
                  color: '#94a3b8'
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
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
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
                stroke="#334155"
                strokeOpacity={0.4}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              {showYAxis && (
                <text
                  x={pad.left - 8}
                  y={step.y + 3.5}
                  textAnchor="end"
                  fill="#64748b"
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

        {/* Data Point Circles and permanent values */}
        {points.map((pt, idx) => {
          const isHovered = activePoint?.x === pt.x && activePoint?.y === pt.y;

          return (
            <g key={`point-${idx}`}>
              {/* Permanent Value label above point */}
              {showValues && (
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

              {/* Visible Circle Dot */}
              {showDots && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? dotRadius * 1.6 : dotRadius}
                  fill={isHovered ? '#ffffff' : color}
                  stroke={color}
                  strokeWidth={2}
                  filter={glow ? `url(#${glowId})` : undefined}
                  style={{
                    transition:
                      'cx 0.45s cubic-bezier(0.4, 0, 0.2, 1), cy 0.45s cubic-bezier(0.4, 0, 0.2, 1), r 0.2s ease',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </g>
          );
        })}

        {/* X-Axis Category Labels */}
        {showXAxis &&
          points.map((pt, idx) => {
            if (!pt.label) return null;
            return (
              <text
                key={`label-${idx}`}
                x={pt.x}
                y={baselineY + 18}
                textAnchor="middle"
                fill="#94a3b8"
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
