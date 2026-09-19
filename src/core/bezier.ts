import { Point } from './types';

// Fast 1-decimal rounding (FPU register math, avoiding slow .toFixed() string formatting)
function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Generates an SVG path string from an array of Points.
 * Supports smooth cubic Bézier curves (Catmull-Rom style) or straight lines.
 * Optimized with pre-allocated buffer arrays and single-pass join.
 */
export function generateLinePath(points: Point[], smooth = true, curvature = 0.25): string {
  const len = points.length;
  if (len === 0) return '';
  if (len === 1) return `M ${r1(points[0].x)},${r1(points[0].y)}`;

  if (!smooth || curvature === 0 || len === 2) {
    const parts = new Array(len);
    for (let i = 0; i < len; i++) {
      const pt = points[i];
      parts[i] = `${i === 0 ? 'M' : 'L'} ${r1(pt.x)},${r1(pt.y)}`;
    }
    return parts.join(' ');
  }

  // Smooth Catmull-Rom to Cubic Bézier conversion
  // Pre-allocate array: 1 initial 'M' segment + (len - 1) 'C' segments
  const parts = new Array(len);
  parts[0] = `M ${r1(points[0].x)},${r1(points[0].y)}`;

  for (let i = 0; i < len - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < len - 2 ? points[i + 2] : p2;

    const cp1x = r1(p1.x + (p2.x - p0.x) * curvature);
    const cp1y = r1(p1.y + (p2.y - p0.y) * curvature);

    const cp2x = r1(p2.x - (p3.x - p1.x) * curvature);
    const cp2y = r1(p2.y - (p3.y - p1.y) * curvature);

    parts[i + 1] = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${r1(p2.x)},${r1(p2.y)}`;
  }

  return parts.join(' ');
}

/**
 * Closes the line path to the bottom baseline to create an area fill.
 * Accepts an optional precomputed existingLinePath to avoid duplicate Bézier calculations.
 */
export function generateAreaPath(
  points: Point[],
  baselineY: number,
  smooth = true,
  curvature = 0.25,
  existingLinePath?: string
): string {
  const len = points.length;
  if (len === 0) return '';

  const linePath = existingLinePath ?? generateLinePath(points, smooth, curvature);
  const firstPt = points[0];
  const lastPt = points[len - 1];
  const base = r1(baselineY);

  // Draw line to bottom-right, then bottom-left, then close path
  return `${linePath} L ${r1(lastPt.x)},${base} L ${r1(firstPt.x)},${base} Z`;
}

/**
 * Closes the polygon between two curves to create a stacked area segment.
 * Optimized with reverse-index traversal without array clones.
 * Accepts an optional precomputed existingTopLinePath to avoid duplicate Bézier calculations.
 */
export function generateStackedAreaPath(
  topPoints: Point[],
  bottomPoints: Point[],
  smooth = true,
  curvature = 0.25,
  existingTopLinePath?: string
): string {
  const topLen = topPoints.length;
  const btmLen = bottomPoints.length;
  if (topLen === 0) return '';

  const topLine = existingTopLinePath ?? generateLinePath(topPoints, smooth, curvature);
  if (btmLen === 0) return `${topLine} Z`;

  // Read bottomPoints in reverse order without allocating/cloning intermediate arrays
  const bottomSegs = new Array(btmLen);
  for (let i = btmLen - 1, idx = 0; i >= 0; i--, idx++) {
    const pt = bottomPoints[i];
    bottomSegs[idx] = `L ${r1(pt.x)},${r1(pt.y)}`;
  }

  return `${topLine} ${bottomSegs.join(' ')} Z`;
}

/**
 * Generates an SVG path string for a rectangular bar with independent corner rounding.
 * Allows top corners (top-left, top-right) and bottom corners (bottom-left, bottom-right)
 * to be rounded independently, preventing unwanted notches or curved edges at internal stack boundaries.
 */
export function generateBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  roundTop = true,
  roundBottom = false
): string {
  const maxR = roundTop && roundBottom ? height / 2 : height;
  const r = Math.max(0, Math.min(radius, width / 2, maxR));
  const rTop = roundTop ? r : 0;
  const rBottom = roundBottom ? r : 0;

  const rx = r1(x);
  const ry = r1(y);
  const rw = r1(width);
  const rh = r1(height);

  if (rTop <= 0 && rBottom <= 0) {
    return `M ${rx},${ry} h ${rw} v ${rh} h ${-rw} Z`;
  }

  const rT = r1(rTop);
  const rB = r1(rBottom);
  const parts: string[] = [`M ${r1(x + rTop)},${ry}`];
  parts.push(`h ${r1(width - 2 * rTop)}`);
  if (rTop > 0) {
    parts.push(`a ${rT},${rT} 0 0 1 ${rT},${rT}`);
  }
  parts.push(`v ${r1(height - rTop - rBottom)}`);
  if (rBottom > 0) {
    parts.push(`a ${rB},${rB} 0 0 1 ${-rB},${rB}`);
  }
  parts.push(`h ${r1(-(width - 2 * rBottom))}`);
  if (rBottom > 0) {
    parts.push(`a ${rB},${rB} 0 0 1 ${-rB},${-rB}`);
  }
  parts.push(`v ${r1(-(height - rTop - rBottom))}`);
  if (rTop > 0) {
    parts.push(`a ${rT},${rT} 0 0 1 ${rT},${-rT}`);
  }
  parts.push('Z');
  return parts.join(' ');
}
