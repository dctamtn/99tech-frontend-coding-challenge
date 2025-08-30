import React, { useState } from 'react';

const SettingsModal = ({
  isOpen,
  onClose,
  slippage,
  onSlippageChange
}) => {
  const [customSlippage, setCustomSlippage] = useState('');

  const handleSlippageButtonClick = (value) => {
    onSlippageChange(value);
    setCustomSlippage('');
  };

  const handleCustomSlippageChange = (e) => {
    const value = parseFloat(e.target.value);
    setCustomSlippage(e.target.value);
    
    if (value >= 0.1 && value <= 50) {
      onSlippageChange(value);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="swap-card w-full max-w-md animate-slide-up">
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark-100">Slippage Setting</h3>
            <button 
              onClick={onClose}
              className="text-dark-400 hover:text-dark-200 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => handleSlippageButtonClick(0.5)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  slippage === 0.5 && !customSlippage
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-dark-600 text-dark-300 hover:bg-dark-600/50'
                }`}
              >
                0.5%
              </button>
              <button 
                onClick={() => handleSlippageButtonClick(1.0)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  slippage === 1.0 && !customSlippage
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-dark-600 text-dark-300 hover:bg-dark-600/50'
                }`}
              >
                1.0%
              </button>
              <button 
                onClick={() => handleSlippageButtonClick(2.0)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  slippage === 2.0 && !customSlippage
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-dark-600 text-dark-300 hover:bg-dark-600/50'
                }`}
              >
                2.0%
              </button>
              <input 
                type="number" 
                placeholder="Custom" 
                value={customSlippage}
                onChange={handleCustomSlippageChange}
                className="input-field flex-1 text-sm" 
                min="0.1" 
                max="50" 
                step="0.1"
              />
            </div>
          </div>

          <div className="text-xs text-dark-400">
            <p className="mb-2">
              <strong>Slippage Tolerance:</strong> The maximum price change you're willing to accept for your swap.
            </p>        
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
