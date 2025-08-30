import { useState, useCallback } from 'react';
import { availableTokens, generateMockBalance, calculateToAmount } from '../data/tokens';

export const useSwapState = () => {
  const [fromToken, setFromToken] = useState(availableTokens[0]); // ETH
  const [toToken, setToToken] = useState(availableTokens[1]); // USDC
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [balances, setBalances] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const updateBalances = useCallback(() => {
    const newBalances = {};
    availableTokens.forEach(token => {
      newBalances[token.symbol] = generateMockBalance(token.symbol);
    });
    setBalances(newBalances);
  }, []);

  const updateToAmount = useCallback((amount) => {
    if (amount > 0) {
      const calculatedAmount = calculateToAmount(amount, fromToken, toToken);
      setToAmount(calculatedAmount);
    } else {
      setToAmount(0);
    }
  }, [fromToken, toToken]);

  const handleFromAmountChange = useCallback((amount) => {
    setFromAmount(amount);
    updateToAmount(amount);
  }, [updateToAmount]);

  const handleFromTokenChange = useCallback((token) => {
    setFromToken(token);
    if (fromAmount > 0) {
      updateToAmount(fromAmount);
    }
  }, [fromAmount, updateToAmount]);

  const handleToTokenChange = useCallback((token) => {
    setToToken(token);
    if (fromAmount > 0) {
      updateToAmount(fromAmount);
    }
  }, [fromAmount, updateToAmount]);

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    balances,
    isCalculating,
    setFromToken: handleFromTokenChange,
    setToToken: handleToTokenChange,
    setFromAmount: handleFromAmountChange,
    setToAmount,
    setSlippage,
    updateBalances,
    setIsCalculating
  };
};
