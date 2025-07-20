import Head from 'next/head';
import { useEffect } from 'react';
import GasWidget from '../components/GasWidget';
import SimulationForm from '../components/SimulationForm';
import { useGasStore } from '../lib/zustandStore';
import useGasPriceFetcher from '../hooks/useGasPriceFetcher';

export default function Home() {
  const mode = useGasStore(state => state.mode);
  const setMode = useGasStore(state => state.setMode);
  const isLoading = useGasStore((state) => state.isLoading);
  useGasPriceFetcher();
  return (
    <>
      <Head>
        <title>Zeru Gas Tracker</title>
        <meta name="description" content="Real-time gas price tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-container">
        <h1 className="main-heading">Zeru Gas Tracker</h1>

        <div className="mode-switcher">
          <button
            onClick={() => setMode('live')}
            className={`mode-button ${mode === 'live' ? 'active' : ''}`}
            disabled={isLoading}
          >
            Live Mode
          </button>
          <button
            onClick={() => setMode('simulation')}
            className={`mode-button ${mode === 'simulation' ? 'active' : ''}`}
            disabled={isLoading}
          >
            Simulation Mode
          </button>
        </div>

        {mode === 'live' ? <GasWidget /> : <SimulationForm />}
      </div>
    </>
  );
}