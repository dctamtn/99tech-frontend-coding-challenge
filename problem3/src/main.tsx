// ORIGINAL CODE (COMMENTED OUT - SEE ISSUES BELOW)
/*
import React, { useMemo } from 'react';
import { useWalletBalances } from './hooks/useWalletBalances';
import { usePrices } from './hooks/usePrices';
import { WalletRow } from './components/WalletRow';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string;
}

interface BoxProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (balancePriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false;
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
      return 0;
    });
  }, [balances, prices]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    };
  });

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className="wallet-row"
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
*/

// REFACTORED CODE - FIXES ALL ISSUES FROM ORIGINAL
import React, { useMemo, useCallback } from 'react';
import { useWalletBalances } from './hooks/useWalletBalances';
import { usePrices } from './hooks/usePrices';
import { WalletRow } from './components/WalletRow';

// IMPROVEMENT: Define proper interfaces with specific types instead of 'any'
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string;
}

// IMPROVEMENT: Define specific prop types instead of generic BoxProps
interface WalletPageProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

// IMPROVEMENT: Extract business logic to constants for better maintainability
const BLOCKCHAIN_PRIORITIES = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const DEFAULT_PRIORITY = -99;
const MIN_BALANCE_THRESHOLD = 0;

// IMPROVEMENT: Move function outside component to prevent recreation on every render
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain as keyof typeof BLOCKCHAIN_PRIORITIES] ?? DEFAULT_PRIORITY;
};

// IMPROVEMENT: Extract utility functions for better testability and reusability
const formatBalance = (amount: number): string => {
  return amount.toFixed();
};

const calculateUsdValue = (amount: number, price: number | undefined): number => {
  // IMPROVEMENT: Add null/undefined check to prevent NaN
  if (price === undefined || price === null) {
    return 0;
  }
  return amount * price;
};

const WalletPage: React.FC<WalletPageProps> = ({ 
  children, 
  className,
  style,
  'data-testid': testId,
  ...rest 
}) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // IMPROVEMENT: Memoize expensive filtering and sorting operations
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // IMPROVEMENT: Fix the filter logic - show positive balances instead of negative
        return balancePriority > DEFAULT_PRIORITY && balance.amount > MIN_BALANCE_THRESHOLD;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        
        // IMPROVEMENT: Simplified comparison logic
        return rightPriority - leftPriority; // Higher priority first
      });
  }, [balances]); // IMPROVEMENT: Removed unnecessary 'prices' dependency

  // IMPROVEMENT: Memoize formatted balances to prevent recalculation on every render
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: formatBalance(balance.amount)
    }));
  }, [sortedBalances]);

  // IMPROVEMENT: Memoize rows generation to prevent unnecessary re-renders
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = calculateUsdValue(balance.amount, prices[balance.currency]);
      
      return (
        <WalletRow 
          className="wallet-row"
          // IMPROVEMENT: Use stable, unique key instead of array index
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  // IMPROVEMENT: Use useCallback for event handlers (if any were added)
  const handleRowClick = useCallback((balance: FormattedWalletBalance) => {
    console.log('Row clicked:', balance);
  }, []);

  return (
    <div 
      className={className}
      style={style}
      data-testid={testId}
      {...rest}
    >
      {children}
      {rows}
    </div>
  );
};

export default WalletPage;
