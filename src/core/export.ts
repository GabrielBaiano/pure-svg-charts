export interface ExportImageOptions {
  /** Resolution multiplier for PNG rendering (default: 2 for Retina crispness) */
  scale?: number;
  /** Optional background color (e.g. '#0f172a' or '#ffffff', default: transparent) */
  background?: string;
}

/**
 * Exports an SVG chart element to a downloadable PNG or SVG image file.
 * Zero external dependencies — relies entirely on standard browser DOM and Canvas APIs.
 *
 * @param target - The SVG element, container element, or a React ref object pointing to either.
 * @param format - Output image format: 'png' | 'svg' (default: 'png')
 * @param filename - Base name for downloaded file (without extension, default: 'chart')
 * @param options - Custom export options (scale factor, background fill)
 */
export async function exportChartAsImage(
  target: SVGSVGElement | HTMLElement | { current: HTMLElement | SVGSVGElement | null } | null,
  format: 'png' | 'svg' = 'png',
  filename: string = 'chart',
  options?: ExportImageOptions
): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('exportChartAsImage can only be executed in a browser environment with DOM access.');
  }

  // 1. Resolve DOM node
  const resolved = (target && 'current' in target) ? target.current : target;
  if (!resolved) {
    throw new Error('exportChartAsImage: provided target element or ref is null or undefined.');
  }

  const svgElement: SVGSVGElement | null =
    resolved instanceof SVGSVGElement
      ? resolved
      : resolved.querySelector('svg');

  if (!svgElement) {
    throw new Error('exportChartAsImage: no <svg> element found inside the provided target.');
  }

  // 2. Clone SVG to avoid mutating active UI and ensure proper namespaces
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  // Determine dimensions from viewBox or bounding box
  const viewBox = svgElement.viewBox?.baseVal;
  const rect = svgElement.getBoundingClientRect();
  const width = viewBox?.width && viewBox.width > 0 ? viewBox.width : (rect.width || 500);
  const height = viewBox?.height && viewBox.height > 0 ? viewBox.height : (rect.height || 220);

  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  const svgString = new XMLSerializer().serializeToString(clone);

  // 3. SVG Export
  if (format === 'svg') {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    triggerDownload(blob, `${filename}.svg`);
    return;
  }

  // 4. PNG Export
  const scale = options?.scale && options.scale > 0 ? options.scale : 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('exportChartAsImage: failed to create 2D canvas context.');
  }

  // Optional background color
  if (options?.background) {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Render SVG onto Canvas via Image element
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error(`exportChartAsImage: failed to load SVG into image: ${err}`));
    };
    img.src = url;
  });

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('exportChartAsImage: canvas toBlob conversion returned null.'));
        return;
      }
      triggerDownload(blob, `${filename}.png`);
      resolve();
    }, 'image/png');
  });
}

function triggerDownload(blob: Blob, fullFilename: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fullFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}
