import React from 'react';

interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}

export const WalletRow: React.FC<WalletRowProps> = ({ 
  amount, 
  usdValue, 
  formattedAmount, 
  className = "" 
}) => {
  return (
    <div className={`wallet-row ${className}`} style={{ 
      padding: '10px', 
      border: '1px solid #ccc', 
      margin: '5px 0',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Amount: {formattedAmount}</span>
        <span>USD Value: ${usdValue.toFixed(2)}</span>
      </div>
    </div>
  );
};
