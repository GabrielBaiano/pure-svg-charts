import React from 'react';
import { SvgLineChart } from 'pure-svg-charts';
import { DataPoint } from '../runner/dataGenerator';

interface AdapterProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export const PureSvgAdapter: React.FC<AdapterProps> = ({ data, width = 600, height = 280 }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SvgLineChart
        variant="tokyonight"
        data={data}
        smooth
        fillGradient
        showDots={data.length <= 60}
        strokeWidth={2.5}
        width={width}
        height={height}
        crosshair
        title="pure-svg-charts"
        metric={`${data.length.toLocaleString()} pts`}
        maxDisplayPoints={300}
      />
    </div>
  );
};
