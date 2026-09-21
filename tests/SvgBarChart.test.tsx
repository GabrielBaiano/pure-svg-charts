import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SvgBarChart } from '../src/components/SvgBarChart';

describe('<SvgBarChart />', () => {
  const sampleData = [
    { value: 100, label: 'A' },
    { value: 200, label: 'B' },
    { value: 150, label: 'C' }
  ];

  it('renders bar chart SVG without errors', () => {
    const { container } = render(<SvgBarChart data={sampleData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 500 220');
  });

  it('renders custom HTML tooltip when bar is hovered', () => {
    const onBarHover = vi.fn();
    const { container, queryByTestId } = render(
      <SvgBarChart
        data={sampleData}
        onBarHover={onBarHover}
        renderTooltip={({ item, formattedValue }) => (
          <div>
            Bar {item.label}: {formattedValue}
          </div>
        )}
      />
    );

    expect(queryByTestId('custom-tooltip')).toBeNull();

    // Find the first bar path
    const barPaths = container.querySelectorAll('path[cursor="pointer"], path[style*="cursor: pointer"]');
    expect(barPaths.length).toBeGreaterThan(0);

    fireEvent.mouseEnter(barPaths[0]);

    const tooltip = container.querySelector('[data-testid="custom-tooltip"]');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Bar A: 100');
    expect(onBarHover).toHaveBeenCalled();
  });

  it('pins bar tooltip on touch and unpins on tap outside', () => {
    const onBarHover = vi.fn();
    const { container } = render(
      <SvgBarChart
        data={sampleData}
        onBarHover={onBarHover}
        renderTooltip={({ item }) => <div>Bar {item.label}</div>}
      />
    );

    const barPaths = container.querySelectorAll('path[style*="cursor: pointer"]');
    expect(barPaths.length).toBeGreaterThan(0);

    // Touch bar
    fireEvent.touchStart(barPaths[1]);

    expect(container.querySelector('[data-testid="custom-tooltip"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="custom-tooltip"]')?.textContent).toContain('Bar B');

    // Mouse leave does not unpin
    fireEvent.mouseLeave(barPaths[1]);
    expect(container.querySelector('[data-testid="custom-tooltip"]')).toBeTruthy();

    // Tap outside dismisses
    fireEvent.pointerDown(document.body);
    expect(container.querySelector('[data-testid="custom-tooltip"]')).toBeNull();
  });
});
