import React, { useId } from 'react';
import { generateAreaPath, generateLinePath } from '../core/bezier';
import { scaleDataToPoints } from '../core/scale';
import { SvgSparklineProps } from '../core/types';

const SPARK_PAD = { top: 3, right: 3, bottom: 3, left: 3 };

export const SvgSparkline: React.FC<SvgSparklineProps> = ({
  data = [],
  width = 120,
  height = 34,
  color = '#6366f1',
  strokeWidth = 2,
  smooth = true,
  fillArea = true,
  fillOpacity = 0.15,
  showEndDot = true,
  className = '',
  style
}) => {
  const gradId = `sp-${useId().replace(/:/g, '-')}`;
  const { points } = scaleDataToPoints(data, width, height, SPARK_PAD);
  if (!points.length) return null;

  const linePath = generateLinePath(points, smooth, 0.25);
  const areaPath = fillArea ? generateAreaPath(points, height - 3, smooth, 0.25) : '';
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`pure-svg-sparkline ${className}`}
      style={{
        width,
        height,
        display: 'inline-block',
        verticalAlign: 'middle',
        overflow: 'visible',
        ...style
      }}
    >
      {fillArea && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      {fillArea && areaPath && <path d={areaPath} fill={`url(#${gradId})`} pointerEvents="none" />}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showEndDot && (
        <g fill={color}>
          <circle cx={last.x} cy={last.y} r={strokeWidth * 2.2} opacity={0.3} />
          <circle cx={last.x} cy={last.y} r={strokeWidth} />
        </g>
      )}
    </svg>
  );
};
