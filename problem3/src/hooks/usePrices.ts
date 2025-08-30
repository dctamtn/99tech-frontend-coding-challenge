import { useState, useEffect } from 'react';

interface Prices {
  [currency: string]: number;
}

export const usePrices = (): Prices => {
  const [prices, setPrices] = useState<Prices>({});

  useEffect(() => {
    // Mock price data - simulating API call
    const mockPrices: Prices = {
      'OSMO': 1.5,
      'ETH': 1800,
      'ARB': 1.5,
      'ZIL': 0.02,
      'NEO': 10,
      'BTC': 45000,
      'ADA': 0.5,
      'DOT': 5,
    };

    // Simulate API delay.
    setTimeout(() => {
      setPrices(mockPrices);
    }, 100);
  }, []);

  return prices;
};
