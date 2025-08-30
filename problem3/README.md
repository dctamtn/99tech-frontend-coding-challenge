# --------------------------------------------------------------------------------
# Problem 3: Messy React

## Project Structure
I added the file into a project to work on it.
```
src/problem3/
├── src/
│   ├── index.tsx          # Entry point
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # WalletPage component (refactored)
│   ├── components/
│   │   └── WalletRow.tsx  # Individual wallet row component
│   └── hooks/
│       ├── useWalletBalances.ts  # Mock hook for wallet data
│       └── usePrices.ts          # Mock hook for price data
├── public/
│   └── index.html         # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
```

# Step-by-Step run the project
# Step 1: Navigate to the Project Directory
```bash
cd src/problem3
```

# Step 2: Install Dependencies
```bash
npm install
```

# Step 3: Start the Development Server
```bash
npm start
```
# --------------------------------------------------------------------------------
# Refactoring analytic
# --------------------------------------------------------------------------------

### 1. **Function re-creation prevention**

**Original Code with Issues:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  // 🚨 ISSUE 1: Function recreated on every render - performance problem
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
  // ... rest of component
};
```

**Improved Code:**
```typescript
// ✅ IMPROVEMENT: Move function outside component to prevent re-creation
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain as keyof typeof BLOCKCHAIN_PRIORITIES] ?? DEFAULT_PRIORITY;
};

// ✅ IMPROVEMENT: Extract business logic to constants
const BLOCKCHAIN_PRIORITIES = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const DEFAULT_PRIORITY = -99;

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
  // Function is now stable and doesn't recreate on every render
  // ... rest of component
};
```
# --------------------------------------------------------------------------------

### 2. **Optimized useMemo dependencies**

**Original Code with Issues:**
```typescript
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

// 🚨 ISSUE: 'prices' dependency unnecessary - causes re-computation
```

**Improved Code:**
```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      // ✅ IMPROVEMENT: Fixed filter logic - show positive balances
      return balancePriority > DEFAULT_PRIORITY && balance.amount > MIN_BALANCE_THRESHOLD;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      
      // ✅ IMPROVEMENT: Simplified comparison logic
      return rightPriority - leftPriority; // Higher priority first
    });
}, [balances]); // ✅ IMPROVEMENT: Removed unnecessary 'prices' dependency
```

# --------------------------------------------------------------------------------

### 3. **Additional memoization**

**Original Code with Issues:**
```typescript
// 🚨 ISSUE: These calculations run on every render - performance problem
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed()
  };
});

// 🚨 ISSUE: This also runs on every render
const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
  const usdValue = prices[balance.currency] * balance.amount; // 🚨 ISSUE: No error handling
  return (
    <WalletRow 
      className="wallet-row"
      key={index} // 🚨 ISSUE: Using array index as key - React anti-pattern
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={balance.formatted}
    />
  );
});
```

**Improved Code:**
```typescript
// ✅ IMPROVEMENT: Memoize formatted balances
const formattedBalances = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance) => ({
    ...balance,
    formatted: formatBalance(balance.amount)
  }));
}, [sortedBalances]);

// ✅ IMPROVEMENT: Memoize rows generation
const rows = useMemo(() => {
  return formattedBalances.map((balance: FormattedWalletBalance) => {
    // ✅ IMPROVEMENT: Safe USD value calculation with error handling
    const usdValue = calculateUsdValue(balance.amount, prices[balance.currency]);
    
    return (
      <WalletRow 
        className="wallet-row"
        // ✅ IMPROVEMENT: Stable, unique key instead of array index
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });
}, [formattedBalances, prices]);
```
# --------------------------------------------------------------------------------

### 4. **Fixed filter logic**

**Original Code with Issues:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    // 🚨 ISSUE: This logic is backwards - only shows negative/zero balances
    if (balancePriority > -99) {
      if (balance.amount <= 0) {
        return true; // Shows only balances <= 0
      }
    }
    return false;
  })
  // ... sorting logic
}, [balances, prices]);
```

**Improved Code:**
```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      // ✅ IMPROVEMENT: Fixed logic - show positive balances with valid priority
      return balancePriority > DEFAULT_PRIORITY && balance.amount > MIN_BALANCE_THRESHOLD;
    })
    // ... sorting logic
}, [balances]);
```
# --------------------------------------------------------------------------------

### 5. **Added error handling**

**Original Code with Issues:**
```typescript
const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
  // 🚨 ISSUE: No error handling - can return NaN if price is undefined
  const usdValue = prices[balance.currency] * balance.amount;
  return (
    <WalletRow 
      key={index}
      amount={balance.amount}
      usdValue={usdValue} // Could be NaN
      formattedAmount={balance.formatted}
    />
  );
});
```

**Improved Code:**
```typescript
// ✅ IMPROVEMENT: Safe utility function with error handling
const calculateUsdValue = (amount: number, price: number | undefined): number => {
  if (price === undefined || price === null) {
    return 0; // Graceful fallback
  }
  return amount * price;
};

const rows = useMemo(() => {
  return formattedBalances.map((balance: FormattedWalletBalance) => {
    // ✅ IMPROVEMENT: Safe calculation with error handling
    const usdValue = calculateUsdValue(balance.amount, prices[balance.currency]);
    
    return (
      <WalletRow 
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue} // Always a valid number
        formattedAmount={balance.formatted}
      />
    );
  });
}, [formattedBalances, prices]);
```
# --------------------------------------------------------------------------------

### 6. **Fixed react key issue**

**Original Code with Issues:**
```typescript
const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
  return (
    <WalletRow 
      // 🚨 ISSUE: Using array index as key - React anti-pattern
      key={index} // Unstable, can cause rendering issues
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={balance.formatted}
    />
  );
});
```

**Improved Code:**
```typescript
const rows = useMemo(() => {
  return formattedBalances.map((balance: FormattedWalletBalance) => {
    return (
      <WalletRow 
        // ✅ IMPROVEMENT: Stable, unique key using business data
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });
}, [formattedBalances, prices]);
```
# --------------------------------------------------------------------------------

### 7. **Extracted business logic**

**Original Code with Issues:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  // 🚨 ISSUE: Business logic hard-coded in component
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis': return 100;
      case 'Ethereum': return 50;
      case 'Arbitrum': return 30;
      case 'Zilliqa': return 20;
      case 'Neo': return 20;
      default: return -99;
    }
  };
  // ... rest of component
};
```

**Improved Code:**
```typescript
// ✅ IMPROVEMENT: Extract business logic to constants
const BLOCKCHAIN_PRIORITIES = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const DEFAULT_PRIORITY = -99;
const MIN_BALANCE_THRESHOLD = 0;

// ✅ IMPROVEMENT: Utility function outside component
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain as keyof typeof BLOCKCHAIN_PRIORITIES] ?? DEFAULT_PRIORITY;
};

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
  // Component now focuses on rendering, not business logic
  // ... rest of component
};
```
# --------------------------------------------------------------------------------

### 8. **Improved type safety**

**Original Code with Issues:**
```typescript
// 🚨 ISSUE: Weak typing with 'any' - loses type safety benefits
interface BoxProps {
  children?: React.ReactNode;
  [key: string]: any; // Loses type safety
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  // ... rest of component
};
```

**Improved Code:**
```typescript
// ✅ IMPROVEMENT: Strong typing with specific prop types
interface WalletPageProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

const WalletPage: React.FC<WalletPageProps> = ({ 
  children, 
  className,
  style,
  'data-testid': testId,
  ...rest 
}) => {
  // Better IDE support and compile-time error detection
  // ... rest of component
};
```
# --------------------------------------------------------------------------------

### 9. **Utility function extraction**

**Original Code with Issues:**
```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    // 🚨 ISSUE: Logic embedded in component - hard to test
    formatted: balance.amount.toFixed()
  };
});

const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
  // 🚨 ISSUE: Logic embedded in component - hard to test
  const usdValue = prices[balance.currency] * balance.amount;
  // ... rest of mapping
});
```

**Improved Code:**
```typescript
// ✅ IMPROVEMENT: Extract utility functions for better testability
const formatBalance = (amount: number): string => {
  return amount.toFixed();
};

const calculateUsdValue = (amount: number, price: number | undefined): number => {
  if (price === undefined || price === null) {
    return 0;
  }
  return amount * price;
};

const formattedBalances = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance) => ({
    ...balance,
    // ✅ IMPROVEMENT: Use extracted utility function
    formatted: formatBalance(balance.amount)
  }));
}, [sortedBalances]);

const rows = useMemo(() => {
  return formattedBalances.map((balance: FormattedWalletBalance) => {
    // ✅ IMPROVEMENT: Use extracted utility function
    const usdValue = calculateUsdValue(balance.amount, prices[balance.currency]);
    // ... rest of mapping
  });
}, [formattedBalances, prices]);
```
# --------------------------------------------------------------------------------