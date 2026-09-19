import { Point } from './types';

/**
 * Generates an SVG path string from an array of Points.
 * Supports smooth cubic Bézier curves (Catmull-Rom style) or straight lines.
 */
export function generateLinePath(points: Point[], smooth = true, curvature = 0.25): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  if (!smooth || curvature === 0 || points.length === 2) {
    return points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
  }

  // Smooth Catmull-Rom to Cubic Bézier conversion
  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) * curvature;
    const cp1y = p1.y + (p2.y - p0.y) * curvature;

    const cp2x = p2.x - (p3.x - p1.x) * curvature;
    const cp2y = p2.y - (p3.y - p1.y) * curvature;

    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return path;
}

/**
 * Closes the line path to the bottom baseline to create an area fill.
 */
export function generateAreaPath(
  points: Point[],
  baselineY: number,
  smooth = true,
  curvature = 0.25
): string {
  if (points.length === 0) return '';

  const linePath = generateLinePath(points, smooth, curvature);
  const firstPt = points[0];
  const lastPt = points[points.length - 1];

  // Draw line to bottom-right, then bottom-left, then close path
  return `${linePath} L ${lastPt.x},${baselineY} L ${firstPt.x},${baselineY} Z`;
}

/**
 * Closes the polygon between two curves to create a stacked area segment.
 */
export function generateStackedAreaPath(
  topPoints: Point[],
  bottomPoints: Point[],
  smooth = true,
  curvature = 0.25
): string {
  if (topPoints.length === 0) return '';
  const topLine = generateLinePath(topPoints, smooth, curvature);
  const reversedBottom = [...bottomPoints].reverse();
  const bottomSegs = reversedBottom.map((pt) => `L ${pt.x.toFixed(2)},${pt.y.toFixed(2)}`).join(' ');
  return `${topLine} ${bottomSegs} Z`;
}

