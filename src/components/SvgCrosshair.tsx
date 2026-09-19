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
  dotRadius = 4
}) => {
  const valBadgeW = Math.max(34, valueStr.length * 7 + 10);
  const labelBadgeW = label ? Math.max(32, label.length * 7 + 12) : 0;
  const clampedX = Math.max(padLeft + labelBadgeW / 2, Math.min(width - padRight - labelBadgeW / 2, x));

  // Combined arrow path: baseline down arrow, Y-axis side arrow, and localized chevrons
  const downArrow = `M${x - 5} ${baselineY - 1}h10l-5 7z`;
  const sideArrow = `M${padLeft + 1} ${y - 5}v10l-7 -5z`;
  const localDown = y + dotRadius * 2 + 10 < baselineY ? `M${x - 3.5} ${y + dotRadius * 2 + 3}h7l-3.5 6z` : '';
  const localSide = x - dotRadius * 2 - 10 > padLeft ? `M${x - dotRadius * 2 - 3} ${y - 3.5}v7l-6 -3.5z` : '';
  const arrowsPath = `${downArrow} ${sideArrow} ${localDown} ${localSide}`;

  return (
    <g className="pure-svg-crosshair" pointerEvents="none">
      {/* Guidelines to axes */}
      <path
        d={`M${x} ${y}V${baselineY}M${padLeft} ${y}H${x}`}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray="3 3"
        strokeOpacity={0.65}
      />

      {/* Directional indicator arrows */}
      <path d={arrowsPath} fill={color} />

      {/* Axis value and label badges */}
      <g fill={color}>
        <rect x={padLeft - 7 - valBadgeW} y={y - 9} width={valBadgeW} height={18} rx={4} />
        {label && <rect x={clampedX - labelBadgeW / 2} y={baselineY + 7} width={labelBadgeW} height={18} rx={4} />}
      </g>

      <g fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="monospace" textAnchor="middle">
        <text x={padLeft - 7 - valBadgeW / 2} y={y + 3.5}>{valueStr}</text>
        {label && <text x={clampedX} y={baselineY + 19.5}>{label}</text>}
      </g>
    </g>
  );
};
