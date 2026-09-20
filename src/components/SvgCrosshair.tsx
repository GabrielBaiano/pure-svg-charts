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

export const SvgCrosshair: React.FC<SvgCrosshairProps> = React.memo(({
  x,
  y,
  baselineY,
  padLeft,
  padRight,
  width,
  color,
  valueStr,
  label
}) => {
  const vW = Math.max(34, valueStr.length * 7 + 10);
  const lW = label ? Math.max(32, label.length * 7 + 12) : 0;
  const cX = Math.max(padLeft + lW / 2, Math.min(width - padRight - lW / 2, x));

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

      {/* Axis badge backgrounds */}
      <g fill={color}>
        <rect x={padLeft - 7 - vW} y={y - 9} width={vW} height={18} rx={4} />
        {label && <rect x={cX - lW / 2} y={baselineY + 7} width={lW} height={18} rx={4} />}
      </g>

      {/* Axis badge labels */}
      <g fill="#fff" fontSize="10" fontWeight="700" fontFamily="monospace" textAnchor="middle">
        <text x={padLeft - 7 - vW / 2} y={y + 3.5}>{valueStr}</text>
        {label && <text x={cX} y={baselineY + 19.5}>{label}</text>}
      </g>
    </g>
  );
});
