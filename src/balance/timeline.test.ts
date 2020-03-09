import { getBalanceTimeline } from './timeline';

describe('getBalanceTimeline', () => {
  it('handles balance adjustments', () => {
    expect(
      getBalanceTimeline([
        {
          date: '2020-01-05',
          type: 'BALANCE_ADJUSTMENT',
          account: 'Bank of Hawaii',
          amount: 100.5,
          destinationAccount: null,
          destinationAmount: null,
        },
        {
          date: '2020-01-05',
          type: 'BALANCE_ADJUSTMENT',
          account: 'South State Bank',
          amount: 200,
          destinationAccount: null,
          destinationAmount: null,
        },
      ]),
    ).toEqual([
      {
        date: '2020-01-05',
        total: 300.5,
        accounts: {
          'Bank of Hawaii': 100.5,
          'South State Bank': 200,
        },
      },
    ]);
  });

  it('handles incomes', () => {
    expect(
      getBalanceTimeline([
        {
          date: '2020-01-06',
          type: 'BALANCE_ADJUSTMENT',
          account: 'Bank of Hawaii',
          amount: 100,
          destinationAccount: null,
          destinationAmount: null,
        },
        {
          date: '2020-01-06',
          type: 'INCOME',
          account: 'Bank of Hawaii',
          amount: 200.25,
          destinationAccount: null,
          destinationAmount: null,
        },
      ]),
    ).toEqual([
      {
        date: '2020-01-06',
        total: 300.25,
        accounts: {
          'Bank of Hawaii': 300.25,
        },
      },
    ]);
  });

  it('handles expenses', () => {
    expect(
      getBalanceTimeline([
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
          type: 'EXPENSE',
          account: 'Bank of Hawaii',
          amount: -70.75,
          destinationAccount: null,
          destinationAmount: null,
        },
      ]),
    ).toEqual([
      {
        date: '2020-01-05',
        total: 29.25,
        accounts: {
          'Bank of Hawaii': 29.25,
        },
      },
    ]);
  });

  it('handles transfers', () => {
    expect(
      getBalanceTimeline([
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
          amount: 2500,
          destinationAccount: null,
          destinationAmount: null,
        },
        {
          date: '2020-01-05',
          type: 'TRANSFER',
          account: 'South State Bank',
          amount: -2500,
          destinationAccount: 'Bank of Hawaii',
          destinationAmount: 2468.75,
        },
      ]),
    ).toEqual([
      {
        date: '2020-01-05',
        total: 2568.75,
        accounts: {
          'Bank of Hawaii': 2568.75,
          'South State Bank': 0,
        },
      },
    ]);
  });

  it('calculates balance over time, skipping dates without transactions', () => {
    expect(
      getBalanceTimeline([
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
          amount: 200,
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
      ]),
    ).toEqual([
      {
        date: '2020-01-05',
        total: 300,
        accounts: {
          'Bank of Hawaii': 100,
          'South State Bank': 200,
        },
      },
      {
        date: '2020-01-06',
        total: 290,
        accounts: {
          'Bank of Hawaii': 100,
          'South State Bank': 190,
        },
      },
      {
        date: '2020-01-08',
        total: 5290,
        accounts: {
          'Bank of Hawaii': 100,
          'South State Bank': 5190,
        },
      },
      {
        date: '2020-01-09',
        total: 5290,
        accounts: {
          'Bank of Hawaii': 1100,
          'South State Bank': 4190,
        },
      },
    ]);
  });
});
