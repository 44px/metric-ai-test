type Transaction = SingleAccountTransaction | Transfer;

interface SingleAccountTransaction {
  date: string;
  type: 'BALANCE_ADJUSTMENT' | 'INCOME' | 'EXPENSE';
  account: string;
  amount: number;
  destinationAccount: null;
  destinationAmount: null;
}

type Transfer = Pick<
  SingleAccountTransaction,
  'date' | 'account' | 'amount'
> & {
  type: 'TRANSFER';
  destinationAccount: string;
  destinationAmount: number;
};

type BalanceByAccount = Record<string, number>;

interface Balance {
  date: string;
  total: number;
  accounts: BalanceByAccount;
}

export const getBalanceTimeline = (transactions: Transaction[]): Balance[] => {
  if (transactions.length === 0) {
    return [];
  }

  const startBalance = { date: transactions[0].date, total: 0, accounts: {} };
  return transactions.reduce(
    (balanceTimeline, transaction) => {
      const currentBalance = balanceTimeline[balanceTimeline.length - 1];
      const newBalance = updateBalance(currentBalance, transaction);

      if (newBalance.date !== currentBalance.date) {
        return [...balanceTimeline, newBalance];
      }

      return [
        ...balanceTimeline.slice(0, balanceTimeline.length - 1),
        newBalance,
      ];
    },
    [startBalance],
  );
};

const updateBalance = (balance: Balance, transaction: Transaction): Balance => {
  let accountsUpdate: BalanceByAccount = {};
  const { account, amount } = transaction;
  if (transaction.type === 'BALANCE_ADJUSTMENT') {
    accountsUpdate = { [account]: amount };
  } else if (transaction.type === 'INCOME' || transaction.type === 'EXPENSE') {
    accountsUpdate = { [account]: balance.accounts[account] + amount };
  } else if (transaction.type === 'TRANSFER') {
    const { destinationAccount, destinationAmount } = transaction;
    const currentSourceAmount = balance.accounts[account];
    const currentDestinationAmount = balance.accounts[destinationAccount];
    accountsUpdate = {
      [account]: currentSourceAmount + amount,
      [destinationAccount]: currentDestinationAmount + destinationAmount,
    };
  }

  const accounts = { ...balance.accounts, ...accountsUpdate };
  const total = Object.values(accounts).reduce((a, b) => a + b, 0);
  return {
    date: transaction.date,
    accounts,
    total,
  };
};
