'use client';
import { useEffect, useState } from 'react';
import { useGasStore } from '../lib/zustandStore';

const GasWidget = () => {
  const [activeChain, setActiveChain] = useState('ethereum');
  const [isClient, setIsClient] = useState(false);

  const baseFee = useGasStore((state) => state.chains[activeChain]?.baseFee || 0);
  const priorityFee = useGasStore((state) => state.chains[activeChain]?.priorityFee || 0);
  const usdPrice = useGasStore((state) => state.usdPrice || 0);
  const isLoading = useGasStore((state) => state.isLoading);
  const error = useGasStore((state) => state.error);
  const chainKeys = useGasStore((state) => Object.keys(state.chains));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatGwei = (wei) => (wei / 1e9).toFixed(2);

  const getUSD = () => {
    const gasLimit = 21000;
    const totalGwei = baseFee + priorityFee;
    const gasEth = (totalGwei * gasLimit) / 1e9;
    const gasUsd = gasEth * usdPrice;
    return gasUsd.toFixed(4);
  };

  if (!isClient || isLoading) {
    return (
      <div className="card gas-widget loading-pulse">
        <div className="chain-tabs mb-3">
          {['ethereum', 'polygon', 'arbitrum'].map(chain => (
            <div key={chain} className="chain-tab" style={{ width: '80px', height: '36px' }}></div>
          ))}
        </div>
        <div className="gas-info">
          <div style={{ height: '24px', width: '60%', margin: '0 auto 1rem', backgroundColor: '#374151' }}></div>
          <div style={{ height: '20px', width: '40%', margin: '0 auto', backgroundColor: '#374151' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
        <p className="text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="card gas-widget">
      <div className="chain-tabs">
        {chainKeys.map((chain) => (
          <button
            key={chain}
            className={`chain-tab ${activeChain === chain ? 'active' : ''}`}
            onClick={() => setActiveChain(chain)}
          >
            {chain.charAt(0).toUpperCase() + chain.slice(1)}
          </button>
        ))}
      </div>
      <div className="gas-info">
        <h3 className="subheading mb-2">{activeChain.toUpperCase()}</h3>
        <p className="gas-metric">Base Fee: {formatGwei(baseFee)} Gwei</p>
        <p className="gas-metric">Priority Fee: {formatGwei(priorityFee)} Gwei</p>
        <p className="gas-metric">Tx Cost: ${getUSD()} USD</p>
        <p className="text-muted mt-3" style={{ fontSize: '0.875rem' }}>
          Updated at: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default GasWidget;