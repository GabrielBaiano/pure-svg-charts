import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DataPoint } from '../runner/dataGenerator';

interface AdapterProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export const RechartsAdapter: React.FC<AdapterProps> = ({ data, height = 280 }) => {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>Recharts (v2.15.1)</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#9aa5ce' }}>{data.length.toLocaleString()} pts</span>
      </div>
      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" stroke="#565f89" fontSize={11} interval="preserveStartEnd" />
            <YAxis stroke="#565f89" fontSize={11} />
            <Tooltip
              contentStyle={{ background: '#16161e', border: '1px solid #292e42', borderRadius: '8px' }}
              labelStyle={{ color: '#7aa2f7' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={data.length <= 60 ? { r: 3 } : false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
