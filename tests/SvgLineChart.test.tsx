import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SvgLineChart } from '../src/components/SvgLineChart';

describe('<SvgLineChart />', () => {
  const sampleData = [
    { value: 10, label: 'Jan' },
    { value: 25, label: 'Feb' },
    { value: 15, label: 'Mar' },
    { value: 40, label: 'Apr' }
  ];

  it('renders SVG chart without crashing', () => {
    const { container } = render(<SvgLineChart data={sampleData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 500 220');
  });

  it('renders custom HTML tooltip when renderTooltip is provided', () => {
    const onPointHover = vi.fn();
    const { container, queryByTestId } = render(
      <SvgLineChart
        data={sampleData}
        onPointHover={onPointHover}
        renderTooltip={({ point, formattedValue }) => (
          <div data-testid="my-tooltip">
            <span>{point.label}: {formattedValue}</span>
          </div>
        )}
      />
    );

    // Before hover, no tooltip
    expect(queryByTestId('custom-tooltip')).toBeNull();

    // Trigger mouse enter on the first dot's hitbox
    const hitboxes = container.querySelectorAll('circle[fill="transparent"]');
    expect(hitboxes.length).toBeGreaterThan(0);

    fireEvent.mouseEnter(hitboxes[0]);

    // Now custom tooltip should be present in the DOM
    const tooltip = container.querySelector('[data-testid="custom-tooltip"]');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Jan: 10');
    expect(onPointHover).toHaveBeenCalled();
  });

  it('supports touch interaction and tap-to-pin', () => {
    const onPointHover = vi.fn();
    const { container } = render(
      <SvgLineChart
        data={sampleData}
        onPointHover={onPointHover}
        renderTooltip={({ point }) => <div>Custom {point.label}</div>}
      />
    );

    const hitboxes = container.querySelectorAll('circle[fill="transparent"]');
    expect(hitboxes.length).toBeGreaterThan(0);

    // Touch on point pins the tooltip
    fireEvent.touchStart(hitboxes[1]);

    const tooltip = container.querySelector('[data-testid="custom-tooltip"]');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Custom Feb');

    // Mouse leave does NOT dismiss pinned tooltip
    fireEvent.mouseLeave(hitboxes[1]);
    expect(container.querySelector('[data-testid="custom-tooltip"]')).toBeTruthy();

    // Tapping outside dismisses pinned tooltip
    fireEvent.pointerDown(document.body);
    expect(container.querySelector('[data-testid="custom-tooltip"]')).toBeNull();
  });

  it('supports keyboard navigation via ArrowRight, ArrowLeft, and Escape', () => {
    const onPointHover = vi.fn();
    const { container } = render(
      <SvgLineChart
        data={sampleData}
        onPointHover={onPointHover}
        renderTooltip={({ point }) => <div>Point {point.label}</div>}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    // Press ArrowRight to select first point
    fireEvent.keyDown(svg!, { key: 'ArrowRight' });
    expect(container.querySelector('[data-testid="custom-tooltip"]')?.textContent).toContain('Point Jan');

    // Press ArrowRight again to move to next point
    fireEvent.keyDown(svg!, { key: 'ArrowRight' });
    expect(container.querySelector('[data-testid="custom-tooltip"]')?.textContent).toContain('Point Feb');

    // Press ArrowLeft to move back
    fireEvent.keyDown(svg!, { key: 'ArrowLeft' });
    expect(container.querySelector('[data-testid="custom-tooltip"]')?.textContent).toContain('Point Jan');

    // Press Escape to dismiss
    fireEvent.keyDown(svg!, { key: 'Escape' });
    expect(container.querySelector('[data-testid="custom-tooltip"]')).toBeNull();
  });

  it('supports direct data ingestion with x and y props', () => {
    const rawApiData = [
      { date: 'Q1', sales: 120, expenses: 80 },
      { date: 'Q2', sales: 240, expenses: 140 }
    ];

    const { container } = render(
      <SvgLineChart
        data={rawApiData}
        x="date"
        y={['sales', 'expenses']}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    // Should render two series paths
    const paths = container.querySelectorAll('path[stroke]');
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });
});

