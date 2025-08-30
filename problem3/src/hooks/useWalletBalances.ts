import { useState, useEffect } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

export const useWalletBalances = (): WalletBalance[] => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    // Mock data - simulating API call
    const mockBalances: WalletBalance[] = [
      { currency: 'OSMO', amount: 100, blockchain: 'Osmosis' },
      { currency: 'ETH', amount: 2.5, blockchain: 'Ethereum' },
      { currency: 'ARB', amount: 50, blockchain: 'Arbitrum' },
      { currency: 'ZIL', amount: 1000, blockchain: 'Zilliqa' },
      { currency: 'NEO', amount: 5, blockchain: 'Neo' },
      { currency: 'BTC', amount: 0.1, blockchain: 'Bitcoin' },
      { currency: 'ADA', amount: -10, blockchain: 'Cardano' }, // Negative balance
      { currency: 'DOT', amount: 0, blockchain: 'Polkadot' },  // Zero balance
    ];

    // Simulate API delay
    setTimeout(() => {
      setBalances(mockBalances);
    }, 100);
  }, []);

  return balances;
};
