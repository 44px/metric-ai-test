import React, { useState } from 'react';
import { format, subDays } from 'date-fns';
import { gql, NetworkStatus } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { getBalanceTimeline } from './balance/timeline';
import { Chart } from './balance/Chart';
import { DatePicker } from './ui/DatePicker';
import { Button } from './ui/Button';
import './App.css';

const GET_TRANSACTIONS = gql`
  query GetTransactions($fromDate: String!) {
    transactions(fromDate: $fromDate) {
      date
      type
      account
      amount
      destinationAccount
      destinationAmount
    }
  }
`;

const initialDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');

function App() {
  const [fromDate, setFromDate] = useState(initialDate);
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_TRANSACTIONS,
    {
      variables: { fromDate },
      notifyOnNetworkStatusChange: true,
    },
  );
  const balanceTimeline = getBalanceTimeline(data?.transactions || []);
  const isLoading = loading || networkStatus === NetworkStatus.refetch;

  return (
    <div className="App">
      <div className="App__toolbar">
        <div className="App__toolbar-element">
          <span className="App__toolbar-label">Show balance from date:</span>
          <DatePicker value={fromDate} onChange={setFromDate} />
        </div>
        <div className="App__toolbar-element">
          <Button onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>
      <div className="App__view">
        {isLoading && (
          <div className="App__overlay">
            <div className="App__overlay-title">Loading</div>
            <div className="App__loader">&nbsp;</div>
          </div>
        )}
        {error && (
          <div className="App__overlay">
            <div className="App__overlay-title">Error</div>
            <span>{error.message}</span>
          </div>
        )}
        <Chart data={balanceTimeline} />
      </div>
    </div>
  );
}

export default App;
