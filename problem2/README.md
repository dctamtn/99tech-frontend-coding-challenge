# Problem 2: CryptoSwap 

# I Followed UI from 2 URLs below: 
# https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
# https://app.uniswap.org/

## Project Structure
```
src/problem2/
├── components/           # React components
│   ├── SwapCard.jsx     # Main swap interface
│   ├── TokenModal.jsx   # Token selection modal
│   └── SettingsModal.jsx # Settings configuration
├── hooks/               # Custom React hooks
│   ├── useSwapState.js  # Swap state management
│   ├── useTokenSelection.js # Token modal state
│   └── useSettings.js   # Settings modal state
├── data/                # Data and utilities
│   └── tokens.js        # Token data and utility functions
├── App.jsx              # Main application component
├── main.jsx             # React entry point
├── style.css            # Tailwind CSS and custom styles
└── index.html           # HTML template
```

# Step-by-Step run the project
# Step 1. **Navigate to the project directory**
   ```bash
   cd src/problem2
   ```

# Step 2. **Install dependencies**
   ```bash
   npm install
   ```

# Step 3. **Start the development server**
   ```bash
   npm run dev
   ```
## Technology Stack
- **React 18**: React with hooks and functional components
- **Vite**: Build tool and development server
- **Tailwind CSS**: CSS framework for styling
- **Custom Hooks**: Reusable state management and logic
- **Font Awesome**: Professional icons
- **Inter Font**: Modern typography

# --------------------------------------------------------------------------------
# How to Use
# --------------------------------------------------------------------------------

### Basic Swap
1. **Select "From" Token**: Click on the token button in the "You Pay" section
2. **Enter Amount**: Type the amount you want to swap
3. **Select "To" Token**: Click on the token button in the "You Receive" section
4. **Review Details**: Click on down arrow button to show detail & check the exchange rate, price impact, and fees
5. **Execute Swap**: Click the "Swap" button to complete the transaction
6. **Swap Direction**: Use the arrow button to quickly swap token positions
7. **Settings**: Configure slippage tolerance.
8. **Token Search**: Use the search bar in the token selection modal

## 🎯 Explain some features in project.
### Custom Hooks
```javascript
// useSwapState.js - Manages swap state
const {
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  slippage,
  balances,
  isCalculating,
  setFromToken,
  setToToken,
  setFromAmount,
  setToAmount,
  setSlippage,
  updateBalances,
  setIsCalculating
} = useSwapState();
```

### Component Composition
```javascript
// App.jsx - Main application with state management
<SwapCard
  fromToken={fromToken}
  toToken={toToken}
  fromAmount={fromAmount}
  toAmount={toAmount}
  balances={balances}
  slippage={slippage}
  isCalculating={isCalculating}
  onFromTokenClick={() => openTokenModal('from')}
  onToTokenClick={() => openTokenModal('to')}
  onFromAmountChange={setFromAmount}
  onToAmountChange={setToAmount}
  onSwapDirection={handleSwapDirection}
  onSwap={handleSwap}
  onSettingsClick={openSettingsModal}
/>
```

### State Management
- **useState**: Local component state
- **useCallback**: Memoized functions for performance
- **useMemo**: Memoized values for expensive calculations
- **Custom Hooks**: Reusable state logic

## Performance Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoized event handlers
- **useMemo**: Memoized expensive calculations
- **Lazy Loading**: Components loaded on demand
- **Optimized Animations**: CSS-based animations for smooth performance
