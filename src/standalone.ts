import React, { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { SvgBarChart } from './components/SvgBarChart';
import { SvgLineChart } from './components/SvgLineChart';
import { SvgDonutChart } from './components/SvgDonutChart';
import { SvgSparkline } from './components/SvgSparkline';
import { SvgCrosshair } from './components/SvgCrosshair';
import { CHART_VARIANTS } from './core/variants';
import { exportChartAsImage } from './core/export';
import type { SvgBarChartProps, SvgLineChartProps, SvgDonutChartProps, SvgSparklineProps } from './core/types';

const roots = new WeakMap<HTMLElement, Root>();

export function getOrCreateRoot(container: HTMLElement): Root {
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }
  return root;
}

export function mountChart(container: HTMLElement, element: React.ReactNode): void {
  const root = getOrCreateRoot(container);
  root.render(element);
}

export function unmountChart(container: HTMLElement): void {
  const root = roots.get(container);
  if (root) {
    root.unmount();
    roots.delete(container);
  }
}

export function renderBarChart(container: HTMLElement, props: SvgBarChartProps): void {
  mountChart(container, createElement(SvgBarChart, props));
}

export function renderLineChart(container: HTMLElement, props: SvgLineChartProps): void {
  mountChart(container, createElement(SvgLineChart, props));
}

export function renderDonutChart(container: HTMLElement, props: SvgDonutChartProps): void {
  mountChart(container, createElement(SvgDonutChart, props));
}

export function renderSparkline(container: HTMLElement, props: SvgSparklineProps): void {
  mountChart(container, createElement(SvgSparkline, props));
}

export {
  React,
  createElement,
  SvgBarChart,
  SvgLineChart,
  SvgDonutChart,
  SvgSparkline,
  SvgCrosshair,
  CHART_VARIANTS,
  exportChartAsImage
};

export type * from './core/types';
