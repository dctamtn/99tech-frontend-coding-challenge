import React, { useState, useMemo } from 'react';
import { availableTokens, formatNumber, getTokenPrice, generateMockBalance } from '../data/tokens';

const TokenModal = ({
  isOpen,
  onClose,
  selectingFor,
  currentFromToken,
  currentToToken,
  onTokenSelect,
  balances
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = useMemo(() => {
    if (!searchTerm) return availableTokens;
    
    return availableTokens.filter(token => 
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleTokenClick = (token) => {
    // Don't allow selecting the same token for both from and to
    if (selectingFor === 'from' && token.symbol === currentToToken.symbol) {
      return;
    }
    if (selectingFor === 'to' && token.symbol === currentFromToken.symbol) {
      return;
    }
    
    onTokenSelect(token);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-800 rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-dark-100">Select Token</h3>
            <button 
              onClick={onClose}
              className="text-dark-400 hover:text-dark-200 transition-colors p-2 rounded-lg hover:bg-dark-600"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="Search tokens..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-dark-100 placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Token List */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {filteredTokens.map(token => {
            const isDisabled = (selectingFor === 'from' && token.symbol === currentToToken.symbol) ||
                              (selectingFor === 'to' && token.symbol === currentFromToken.symbol);
            
            return (
              <div 
                key={token.symbol}
                onClick={() => !isDisabled && handleTokenClick(token)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                  isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-medium text-dark-100">{token.symbol}</div>
                    <div className="text-xs text-dark-400">{token.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-dark-200">
                    {formatNumber(balances[token.symbol] || generateMockBalance(token.symbol))}
                  </div>
                  {token.hasPrice && (
                    <div className="text-xs text-dark-400">
                      ${getTokenPrice(token.symbol)?.toFixed(4) || '0.0000'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {filteredTokens.length === 0 && (
            <div className="text-center py-8 text-dark-400">
              No tokens found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
