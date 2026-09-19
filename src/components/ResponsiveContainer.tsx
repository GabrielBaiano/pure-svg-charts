import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import { ResponsiveContainerProps } from '../core/types';

/**
 * Custom hook to observe and measure the parent DOM element's width and height.
 * Uses the browser's native ResizeObserver with zero external runtime dependencies.
 */
export function useParentSize<T extends HTMLElement = HTMLDivElement>(options?: {
  initialWidth?: number;
  initialHeight?: number;
  debounceMs?: number;
}) {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({
    width: options?.initialWidth ?? 0,
    height: options?.initialHeight ?? 0
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial measurement
    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w > 0 && h > 0) {
        setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      }
    };

    updateSize();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }

    let timeoutId: any = null;
    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const entry = entries[0];
      const { width, height } = entry.contentRect;

      const apply = () => {
        const w = Math.floor(width);
        const h = Math.floor(height);
        if (w > 0 && h > 0) {
          setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
        }
      };

      if (options?.debounceMs && options.debounceMs > 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(apply, options.debounceMs);
      } else {
        apply();
      }
    });

    observer.observe(element);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [options?.debounceMs]);

  return { ref, width: size.width, height: size.height };
}

/**
 * ResponsiveContainer automatically measures its parent container and clones its child
 * chart component with dynamic, responsive width and height.
 * 
 * Usage:
 * ```tsx
 * <ResponsiveContainer height={300}>
 *   <SvgBarChart data={[...]} />
 * </ResponsiveContainer>
 * ```
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  width = '100%',
  height = '100%',
  aspect,
  minWidth = 0,
  minHeight = 0,
  maxHeight,
  debounce = 0,
  className = '',
  style,
  children
}) => {
  const { ref, width: measuredWidth, height: measuredHeight } = useParentSize<HTMLDivElement>({
    debounceMs: debounce
  });

  // Determine effective dimensions
  let effWidth = measuredWidth > 0 ? measuredWidth : 500;
  if (minWidth && effWidth < minWidth) effWidth = minWidth;

  let effHeight = measuredHeight > 0 ? measuredHeight : 300;
  if (aspect && aspect > 0 && effWidth > 0) {
    effHeight = Math.round(effWidth / aspect);
  }
  if (minHeight && effHeight < minHeight) effHeight = minHeight;
  if (maxHeight && effHeight > maxHeight) effHeight = maxHeight;

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    minWidth: minWidth ? `${minWidth}px` : undefined,
    minHeight: minHeight ? `${minHeight}px` : undefined,
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    position: 'relative',
    ...style
  };

  const isReady = measuredWidth > 0 && (aspect ? true : measuredHeight > 0);

  return (
    <div ref={ref} className={`pure-svg-responsive-container ${className}`} style={containerStyle}>
      {isReady &&
        (typeof children === 'function'
          ? children({ width: effWidth, height: effHeight })
          : React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              width: effWidth,
              height: effHeight
            })
          : null)}
    </div>
  );
};
