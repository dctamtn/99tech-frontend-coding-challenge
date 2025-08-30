import React, { useState, useEffect } from 'react';
import SwapCard from './components/SwapCard';
import TokenModal from './components/TokenModal';
import SettingsModal from './components/SettingsModal';
import { useSwapState } from './hooks/useSwapState';
import { useTokenSelection } from './hooks/useTokenSelection';
import { useSettings } from './hooks/useSettings';

function App() {
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

  const {
    showTokenModal,
    selectingFor,
    openTokenModal,
    closeTokenModal
  } = useTokenSelection();

  const {
    showSettingsModal,
    openSettingsModal,
    closeSettingsModal
  } = useSettings();

  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Initialize balances on component mount
  useEffect(() => {
    updateBalances();
  }, [updateBalances]);

  const showError = (message, isErrorType = true) => {
    setErrorMessage(message);
    setIsError(isErrorType);

    setTimeout(() => {
      setErrorMessage('');
      setIsError(false);
    }, 5000);
  };

  const handleSwap = async () => {
    if (isCalculating) return;    
    setIsCalculating(true);
    
    try {
      // Simulate swap processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update balances
      const newBalances = { ...balances };
      newBalances[fromToken.symbol] -= fromAmount;
      newBalances[toToken.symbol] += toAmount;
      
      // Reset amounts
      setFromAmount(0);
      setToAmount(0);
      
      showError('Swap completed successfully!', false);
    } catch (error) {
      showError('Swap failed. Please try again.', true);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen flex justify-center p-4 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 mt-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="max-w-md mx-auto bg-dark-800 rounded-2xl p-3 shadow-xl mb-6">
            <h5 className="text-1xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text">
                CryptoSwap
            </h5>     
        </div>
          
        {/* Main Swap Card */}
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

        {/* Error Message */}
        {errorMessage && (
          <div className={`mt-4 p-3 rounded-lg border ${
            isError 
              ? 'bg-red-500/20 border-red-500/30' 
              : 'bg-green-500/20 border-green-500/30'
          }`}>
            <p className={`text-sm ${
              isError ? 'text-red-400' : 'text-green-400'
            }`}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Token Selection Modal */}
        {showTokenModal && (
          <TokenModal
            isOpen={showTokenModal}
            onClose={closeTokenModal}
            selectingFor={selectingFor}
            currentFromToken={fromToken}
            currentToToken={toToken}
            onTokenSelect={(token) => {
              if (selectingFor === 'from') {
                setFromToken(token);
              } else {
                setToToken(token);
              }
              closeTokenModal();
            }}
            balances={balances}
          />
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <SettingsModal
            isOpen={showSettingsModal}
            onClose={closeSettingsModal}
            slippage={slippage}
            onSlippageChange={setSlippage}
          />
        )}
      </div>
    </div>
  );
}

export default App;