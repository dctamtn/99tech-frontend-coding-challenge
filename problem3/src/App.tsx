import React from 'react';
import WalletPage from './main';

const App: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1>Wallet Balance Test</h1>      
      <WalletPage />
    </div>
  );
};

export default App;
