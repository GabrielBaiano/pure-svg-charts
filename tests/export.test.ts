import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportChartAsImage } from '../src/core/export';

describe('exportChartAsImage', () => {
  let mockContainer: HTMLDivElement;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    mockContainer.innerHTML = `
      <svg viewBox="0 0 500 220" width="500" height="220">
        <circle cx="50" cy="50" r="10" fill="red" />
      </svg>
    `;
    document.body.appendChild(mockContainer);

    // Mock URL.createObjectURL and URL.revokeObjectURL
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
    vi.restoreAllMocks();
  });

  it('throws error when target does not contain an SVG element', async () => {
    const emptyDiv = document.createElement('div');
    await expect(exportChartAsImage(emptyDiv, 'svg')).rejects.toThrow(
      'exportChartAsImage: no <svg> element found'
    );
  });

  it('triggers download for SVG format', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await exportChartAsImage(mockContainer, 'svg', 'my-chart');

    expect(clickSpy).toHaveBeenCalled();
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
  });

  it('supports React ref objects', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const ref = { current: mockContainer };

    await exportChartAsImage(ref, 'svg', 'ref-chart');

    expect(clickSpy).toHaveBeenCalled();
  });
});
