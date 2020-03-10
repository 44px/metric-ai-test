import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Balance } from './timeline';
import './Chart.css';

interface Props {
  data: Balance[];
}

export const Chart: React.FunctionComponent<Props> = ({ data }) => {
  return (
    <ResponsiveContainer className="Chart" width="100%" aspect={1.8}>
      <LineChart margin={{ top: 8, left: 4, right: 16, bottom: 8 }} data={data}>
        <Line type="linear" dataKey="total" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip
          labelFormatter={formatDate}
          formatter={(value) => formatAmount(value as number, 2)}
        />
        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={['dataMin', 'dataMax']}
          tickFormatter={formatDate}
          minTickGap={16}
          tickMargin={4}
          interval="preserveStartEnd"
        />
        <YAxis
          type="number"
          scale="linear"
          domain={[0, 'dataMax + 1000']}
          interval="preserveStartEnd"
          tickFormatter={formatAmount}
        />
        <ReferenceLine y={0} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const formatDate = (time: number | string) => {
  return new Date(time).toLocaleDateString();
};

const formatAmount = (amount: number, fractionDigits = 0) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};
