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

export interface Balance {
  date: number;
  total: number;
  accounts: BalanceByAccount;
}

export const getBalanceTimeline = (transactions: Transaction[]): Balance[] => {
  if (transactions.length === 0) {
    return [];
  }

  const startBalance = {
    date: Date.parse(transactions[0].date),
    total: 0,
    accounts: {},
  };
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
    accountsUpdate = { [account]: safeSum(balance.accounts[account], amount) };
  } else if (transaction.type === 'TRANSFER') {
    const { destinationAccount, destinationAmount } = transaction;
    accountsUpdate = {
      [account]: safeSum(balance.accounts[account], amount),
      [destinationAccount]: safeSum(
        balance.accounts[destinationAccount],
        destinationAmount,
      ),
    };
  }

  const accounts = { ...balance.accounts, ...accountsUpdate };
  const total = Object.values(accounts).reduce(safeSum, 0);
  return {
    date: Date.parse(transaction.date),
    accounts,
    total,
  };
};

// safeSum allows to reduce floating point errors
const safeSum = (a: number, b: number) => {
  return (a * 100 + b * 100) / 100;
};
