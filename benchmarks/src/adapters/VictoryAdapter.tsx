import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory';
import { DataPoint } from '../runner/dataGenerator';

interface AdapterProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export const VictoryAdapter: React.FC<AdapterProps> = ({ data, width = 600, height = 280 }) => {
  // Victory scales can be slow on 5k pts, so we take standard data
  const victoryData = data.map((d, i) => ({ x: i + 1, y: d.value }));

  return (
    <div
      style={{
        background: '#1a1b26',
        border: '1px solid #2f3549',
        borderRadius: '16px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#f43f5e' }}>Victory (v37.3.6)</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#9aa5ce' }}>{data.length.toLocaleString()} pts</span>
      </div>
      <div style={{ width: '100%', height: `${height}px` }}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={width}
          height={height}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          animate={false}
        >
          <VictoryAxis
            style={{
              axis: { stroke: '#565f89' },
              tickLabels: { fill: '#565f89', fontSize: 10 },
              grid: { stroke: 'rgba(255,255,255,0.05)' }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: '#565f89' },
              tickLabels: { fill: '#565f89', fontSize: 10 },
              grid: { stroke: 'rgba(255,255,255,0.05)' }
            }}
          />
          <VictoryLine
            data={victoryData}
            style={{
              data: { stroke: '#f43f5e', strokeWidth: 2 }
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};
