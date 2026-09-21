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
        dots="always"
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
        dots="always"
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

  it('supports stacked area charts with custom colors and multi-series tooltip', () => {
    const rawData = [
      { date: '2024-04-01', desktop: 222, mobile: 150 },
      { date: '2024-04-02', desktop: 97, mobile: 180 }
    ];

    const { container } = render(
      <SvgLineChart
        data={rawData}
        x="date"
        y={['mobile', 'desktop']}
        dots="always"
        colors={['#2563eb', '#60a5fa']}
        stacked
        fillGradient
        renderTooltip={({ point, allSeriesPoints }) => (
          <div data-testid="stacked-tooltip">
            <span data-testid="label">{point.label}</span>
            {allSeriesPoints?.map((s) => (
              <span key={s.seriesName} data-testid={`s-${s.seriesName}`}>
                {s.seriesName}: {s.value}
              </span>
            ))}
          </div>
        )}
      />
    );

    // Both series should have area fill paths (fill with url(#gr-...))
    const fillPaths = container.querySelectorAll('path[fill^="url(#gr-"]');
    expect(fillPaths.length).toBe(2);

    // Trigger hover on first dot
    const hitboxes = container.querySelectorAll('circle[fill="transparent"]');
    fireEvent.mouseEnter(hitboxes[0]);

    const tooltip = container.querySelector('[data-testid="stacked-tooltip"]');
    expect(tooltip).toBeTruthy();
    expect(container.querySelector('[data-testid="label"]')?.textContent).toBe('2024-04-01');
    expect(container.querySelector('[data-testid="s-mobile"]')?.textContent).toBe('mobile: 150');
    expect(container.querySelector('[data-testid="s-desktop"]')?.textContent).toBe('desktop: 222');
  });

  it('defaults to dots="hover" with zero static circle nodes and dynamic active dot on scrub', () => {
    const { container } = render(
      <SvgLineChart
        data={sampleData}
        renderTooltip={({ point }) => <div>Point {point.label}</div>}
      />
    );

    // With dots="hover", static circles should NOT be rendered (O(1) DOM nodes)
    const staticCircles = container.querySelectorAll('circle');
    expect(staticCircles.length).toBe(0);

    // Keyboard navigate to point 0
    const svg = container.querySelector('svg');
    fireEvent.keyDown(svg!, { key: 'ArrowRight' });

    // Dynamic active dot appears under cursor (enlarged dotRadius + 2)
    const activeDot = container.querySelector('[data-testid="active-hover-dot"]');
    expect(activeDot).toBeTruthy();
    expect(activeDot?.getAttribute('r')).toBe('6');
  });

  it('supports dots="none" with zero circles rendered even when active', () => {
    const { container } = render(
      <SvgLineChart
        data={sampleData}
        dots="none"
        renderTooltip={({ point }) => <div>Point {point.label}</div>}
      />
    );

    const svg = container.querySelector('svg');
    fireEvent.keyDown(svg!, { key: 'ArrowRight' });

    const activeDot = container.querySelector('[data-testid="active-hover-dot"]');
    expect(activeDot).toBeNull();
    expect(container.querySelectorAll('circle').length).toBe(0);
  });

  it('supports shaded background zones with labels', () => {
    const { container } = render(
      <SvgLineChart
        data={sampleData}
        zones={[
          {
            startX: 'Feb',
            endX: 'Mar',
            color: 'rgba(239, 68, 68, 0.15)',
            label: 'Warning Zone',
            labelPosition: 'top'
          }
        ]}
      />
    );

    const zone = container.querySelector('[data-testid="chart-zone"]');
    expect(zone).toBeTruthy();
    expect(zone?.getAttribute('fill')).toBe('rgba(239, 68, 68, 0.15)');

    const label = container.querySelector('[data-testid="chart-zone-label"]');
    expect(label).toBeTruthy();
    expect(label?.textContent).toBe('Warning Zone');
  });

  it('supports TypeScript generic typing for data keys', () => {
    interface AnalyticsRecord {
      timestamp: string;
      pageviews: number;
      sessions: number;
    }

    const typedData: AnalyticsRecord[] = [
      { timestamp: '2024-01-01', pageviews: 1200, sessions: 800 },
      { timestamp: '2024-01-02', pageviews: 1500, sessions: 950 }
    ];

    const { container } = render(
      <SvgLineChart<AnalyticsRecord>
        data={typedData}
        x="timestamp"
        y={['pageviews', 'sessions']}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(container.querySelectorAll('path[stroke]').length).toBeGreaterThanOrEqual(2);
  });
});

