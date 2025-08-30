import React, { useState, useRef, useEffect } from 'react';
import { formatNumber, calculateExchangeRate, calculatePriceImpact, getTokenPrice } from '../data/tokens';

const SwapCard = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  balances,
  slippage,
  isCalculating,
  onFromTokenClick,
  onToTokenClick,
  onFromAmountChange,
  onToAmountChange,
  onSwapDirection,
  onSwap,
  onSettingsClick
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [detailsHeight, setDetailsHeight] = useState(0);
  const [isSwapButtonHovered, setIsSwapButtonHovered] = useState(false);
  const detailsRef = useRef(null);
  
  const exchangeRate = calculateExchangeRate(fromToken, toToken);
  const priceImpact = calculatePriceImpact(fromAmount, fromToken, toToken);
  const hasAmount = fromAmount > 0;
  const hasBalance = balances[fromToken.symbol] >= fromAmount;
  const isValid = hasAmount && hasBalance && !isCalculating;

  // Calculate USD value for the input amount
  const fromTokenPrice = getTokenPrice(fromToken.symbol);
  const fromAmountUSD = fromAmount * (fromTokenPrice || 0);

  // Calculate USD value for the output amount
  const toTokenPrice = getTokenPrice(toToken.symbol);
  const toAmountUSD = toAmount * (toTokenPrice || 0);

  // Calculate additional swap details
  const minimumReceived = toAmount * (1 - slippage / 100);
  const feeSaved = toAmount * 0.002; // Mock calculation for fee saved
  const tradingFee = 0.001; // Mock trading fee in BNB
  const feeSavedUSD = feeSaved * (toTokenPrice || 0);

  // Update height when content changes
  useEffect(() => {
    if (detailsRef.current) {
      const height = detailsRef.current.scrollHeight;
      setDetailsHeight(height);
    }
  }, [fromAmount, toAmount, slippage, fromToken, toToken]);

  const handleFromMaxClick = () => {
    const balance = balances[fromToken.symbol] || 0;
    onFromAmountChange(balance);
  };

  const getSwapButtonText = () => {
    if (!hasAmount) return 'Enter an amount';
    if (!hasBalance) return 'Insufficient balance';
    if (isCalculating) return 'Calculating...';
    return 'Swap';
  };

  const toggleDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  return (
    <div className="max-w-md mx-auto bg-dark-800 rounded-2xl p-6 shadow-xl">          
      {/* From Token Section */}
      <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">From</span>          
        </div>
      <div className="bg-dark-700 rounded-xl p-4 mb-4">        
        <div className="flex items-center justify-between">
          <button 
            onClick={onFromTokenClick}
            className="flex items-center space-x-2 hover:bg-dark-600 rounded-lg p-2 transition-colors"
          >
            <img src={fromToken.icon} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
            <span className="text-white font-medium">{fromToken.symbol}</span>
            <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
          </button>
          <div className="text-right">
            <input
              type="text"
              placeholder="0"
              value={fromAmount || ''}
              onChange={(e) => onFromAmountChange(parseFloat(e.target.value) || 0)}
              className="text-white text-lg font-semibold bg-transparent text-right outline-none w-24"
              min="0"
              step="0.000001"
            />
            <div className="text-xs text-gray-400">
              {hasAmount && fromTokenPrice ? (
                <span>~${formatNumber(fromAmountUSD, 2)} USD</span>
              ) : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center">
        <button 
          onClick={onSwapDirection}
          onMouseEnter={() => setIsSwapButtonHovered(true)}
          onMouseLeave={() => setIsSwapButtonHovered(false)}
          className="w-10 h-10 bg-dark-700 border border-gray-600 rounded-full flex items-center justify-center hover:bg-dark-600 transition-all duration-200"
        >
          <i className={`text-gray-300 transition-all duration-200 ${
            isSwapButtonHovered 
              ? 'fas fa-exchange-alt transform rotate-90' 
              : 'fas fa-chevron-down'
          }`}></i>
        </button>
      </div>

      {/* To Token Section */}
      <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">To</span>          
        </div>
      <div className="bg-dark-700 rounded-xl p-4 mb-4">        
        <div className="flex items-center justify-between">
          <button 
            onClick={onToTokenClick}
            className="flex items-center space-x-2 hover:bg-dark-600 rounded-lg p-2 transition-colors"
          >
            <img src={toToken.icon} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
            <span className="text-white font-medium">{toToken.symbol}</span>
            <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
          </button>
          <div className="text-right">
            <div className="text-white text-lg font-semibold">
              {toAmount ? formatNumber(toAmount) : '0'}
            </div>
            <div className="text-xs text-gray-400">
              {toAmount > 0 && toTokenPrice ? (
                <span>~${formatNumber(toAmountUSD, 2)} USD</span>
              ) : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Slippage Tolerance */}
      {hasAmount && (
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-gray-400">Slippage Tolerance</span>
          <div className="flex items-center space-x-2">
            <span className="text-white">{slippage}%</span>
            <button 
              onClick={onSettingsClick}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-edit text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button 
        onClick={onSwap}
        disabled={!isValid}
        className={`w-full py-3 px-4 rounded-xl font-medium transition-colors mb-4 ${
          isValid 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {getSwapButtonText()}
      </button>

      {/* Exchange Rate and Fee */}
      {hasAmount && (
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">
            1 {toToken.symbol} ⇌ {formatNumber(1/exchangeRate, 7)} {fromToken.symbol}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Fee {tradingFee} {fromToken.symbol}</span>
            <button 
              onClick={toggleDetails}
              className="text-gray-400 hover:text-white transition-all duration-300 transform"
            >
              <i className={`fas fa-chevron-${isDetailsExpanded ? 'up' : 'down'} text-xs transition-transform duration-300`}></i>
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Swap Details with Smooth Animation */}
      {hasAmount && (
        <div 
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ 
            maxHeight: isDetailsExpanded ? `${detailsHeight}px` : '0px',
            opacity: isDetailsExpanded ? 1 : 0
          }}
        >
          <div 
            ref={detailsRef}
            className="bg-dark-700 rounded-xl p-4 mb-4 space-y-3 text-sm transform transition-all duration-300"
            style={{
              transform: isDetailsExpanded ? 'translateY(0)' : 'translateY(-10px)'
            }}
          >
            <div className="flex justify-between">
              <span className="text-gray-400">Minimum received</span>
              <span className="text-white">{formatNumber(minimumReceived)} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fee saved</span>
              <span className="text-green-400">
                {formatNumber(feeSaved)} {toToken.symbol} (~${formatNumber(feeSavedUSD, 1)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price Impact</span>
              <span className="text-white">{priceImpact.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Trading Fee</span>
              <span className="text-white">{tradingFee} {fromToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Route</span>
              <div className="flex items-center space-x-2">
                <span className="bg-dark-600 px-2 py-1 rounded-full text-xs">
                  {fromToken.symbol} → {toToken.symbol}
                </span>                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapCard;
