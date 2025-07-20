'use client';
import { useState } from 'react';
import { useGasStore } from '../lib/zustandStore';

const SimulationForm = () => {
  const [amount, setAmount] = useState('');
  const { chains, usdPrice, simulatedCost, setSimulatedCost } = useGasStore();

  const handleSimulate = () => {
    if (!amount || isNaN(amount)) return;

    const gasLimit = 21000;
    const ethAmount = parseFloat(amount);
    const cost = {};

    for (const chain in chains) {
      const base = chains[chain].baseFee || 0;
      const priority = chains[chain].priorityFee || 0;
      const totalGwei = base + priority;
      const gasCostEth = (totalGwei * gasLimit) / 1e9;
      const totalEthCost = gasCostEth * ethAmount;
      const usd = totalEthCost * usdPrice;
      cost[chain] = usd.toFixed(4);
    }

    setSimulatedCost(cost);
  };

  return (
    <div className="card simulation-form">
      <h2 className="subheading mb-3">Transaction Simulation</h2>
      <div>
        <input
          type="number"
          placeholder="Enter amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-input mb-3"
        />
        <button 
          onClick={handleSimulate}
          className="btn btn-primary w-full"
        >
          Simulate Transaction Cost
        </button>

        {/* DISPLAY SIMULATION RESULTS */}
        {simulatedCost && Object.keys(simulatedCost).length > 0 && (
          <div className="simulated-result mt-4">
            <h3 className="subheading mb-2">Estimated Cost in USD (including gas)</h3>
            {Object.entries(simulatedCost).map(([chain, usd]) => (
              <p key={chain}>
                <strong>{chain.toUpperCase()}:</strong> ${usd}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationForm;
