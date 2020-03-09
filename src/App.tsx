import React from 'react';
import { getBalanceTimeline } from './balance/timeline';
import { Chart } from './balance/Chart';
import './App.css';

function App() {
  // @ts-ignore
  const balanceTimeline = getBalanceTimeline(transactions);
  return (
    <div className="App">
      <Chart data={balanceTimeline} />
    </div>
  );
}

export default App;

const transactions = [
  {
    date: '2020-01-05',
    type: 'BALANCE_ADJUSTMENT',
    account: 'Bank of Hawaii',
    amount: 100,
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    date: '2020-01-05',
    type: 'BALANCE_ADJUSTMENT',
    account: 'South State Bank',
    amount: 200.5,
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    date: '2020-01-06',
    type: 'EXPENSE',
    account: 'South State Bank',
    amount: -10,
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    date: '2020-01-08',
    type: 'INCOME',
    account: 'South State Bank',
    amount: 5000,
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    date: '2020-01-09',
    type: 'TRANSFER',
    account: 'South State Bank',
    amount: -1000,
    destinationAccount: 'Bank of Hawaii',
    destinationAmount: 1000,
  },
];
