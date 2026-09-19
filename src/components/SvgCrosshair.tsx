import React from 'react';

export interface SvgCrosshairProps {
  x: number;
  y: number;
  baselineY: number;
  padLeft: number;
  padRight: number;
  width: number;
  color: string;
  valueStr: string;
  label?: string;
  dotRadius?: number;
  /** Show directional arrows pointing toward axes (default: true) */
  showArrows?: boolean;
}

export const SvgCrosshair: React.FC<SvgCrosshairProps> = ({
  x,
  y,
  baselineY,
  padLeft,
  padRight,
  width,
  color,
  valueStr,
  label,
  dotRadius = 4,
  showArrows = true
}) => {
  const vW = Math.max(34, valueStr.length * 7 + 10);
  const lW = label ? Math.max(32, label.length * 7 + 12) : 0;
  const cX = Math.max(padLeft + lW / 2, Math.min(width - padRight - lW / 2, x));

  // Arrows pointing toward the axis intersection points (optional)
  const arrows = showArrows
    ? `M${x - 5} ${baselineY - 1}h10l-5 7z` +
      `M${padLeft + 1} ${y - 5}v10l-7 -5z` +
      (y + dotRadius * 2 + 10 < baselineY ? `M${x - 3.5} ${y + dotRadius * 2 + 3}h7l-3.5 6z` : '') +
      (x - dotRadius * 2 - 10 > padLeft ? `M${x - dotRadius * 2 - 3} ${y - 3.5}v7l-6 -3.5z` : '')
    : '';

  return (
    <g className="pure-svg-crosshair" pointerEvents="none">
      {/* Dashed guideline lines: vertical down to baseline, horizontal left to Y-axis */}
      <path
        d={`M${x} ${y}V${baselineY}M${padLeft} ${y}H${x}`}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray="3 3"
        strokeOpacity={0.65}
      />

      {/* Directional arrow heads (shown only when showArrows is true) */}
      {showArrows && arrows && <path d={arrows} fill={color} />}

      {/* Badge backgrounds */}
      <g fill={color}>
        <rect x={padLeft - 7 - vW} y={y - 9} width={vW} height={18} rx={4} />
        {label && <rect x={cX - lW / 2} y={baselineY + 7} width={lW} height={18} rx={4} />}
      </g>

      {/* Badge labels */}
      <g fill="#fff" fontSize="10" fontWeight="700" fontFamily="monospace" textAnchor="middle">
        <text x={padLeft - 7 - vW / 2} y={y + 3.5}>{valueStr}</text>
        {label && <text x={cX} y={baselineY + 19.5}>{label}</text>}
      </g>
    </g>
  );
};
