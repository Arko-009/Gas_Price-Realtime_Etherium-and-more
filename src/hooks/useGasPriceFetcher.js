import { useEffect } from 'react';
import { ethers } from 'ethers';
import { useGasStore } from '../lib/zustandStore';

const useGasPriceFetcher = () => {
  const { updateChainData, setLoading, setError, setUsdPrice } = useGasStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const RPC_URLS = {
      ethereum: process.env.NEXT_PUBLIC_ETH_RPC || 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID',
      polygon: process.env.NEXT_PUBLIC_POLYGON_RPC || 'wss://polygon-rpc.com',
      arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_RPC || 'wss://arb1.arbitrum.io/ws',
    };

    const PRIORITY_FEE_MULTIPLIER = 1.2;
    const providers = {};
    const cleanupFunctions = [];

    // ✅ Fetch USD price from CoinGecko
    const fetchUsdPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await res.json();
        const price = data?.ethereum?.usd || 0;
        setUsdPrice(price);
      } catch (err) {
        console.error('Failed to fetch ETH/USD price:', err);
        setError('Failed to fetch ETH/USD price');
      }
    };

    const initChain = async (chain) => {
      try {
        setLoading(true);
        const provider = new ethers.providers.WebSocketProvider(RPC_URLS[chain]);
        providers[chain] = provider;

        const feeData = await provider.getFeeData();
        const baseFee = Number(ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei'));
        const priorityFee = baseFee * PRIORITY_FEE_MULTIPLIER;
        updateChainData(chain, baseFee, priorityFee);

        provider.on('block', async (blockNumber) => {
          try {
            const block = await provider.getBlock(blockNumber);
            const baseFee = Number(ethers.utils.formatUnits(block.baseFeePerGas || 0, 'gwei'));
            const priorityFee = baseFee * PRIORITY_FEE_MULTIPLIER;
            updateChainData(chain, baseFee, priorityFee);
          } catch (err) {
            console.error(`Error processing ${chain} block:`, err);
            setError(`Error fetching ${chain} data`);
          }
        });

        cleanupFunctions.push(() => {
          provider.removeAllListeners();
          provider.destroy?.();
        });
      } catch (err) {
        console.error(`Error initializing ${chain}:`, err);
        setError(`Failed to connect to ${chain}`);
      } finally {
        setLoading(false);
      }
    };

    Object.keys(RPC_URLS).forEach(initChain);

    // ✅ Fetch price every 30 sec
    fetchUsdPrice();
    const priceInterval = setInterval(fetchUsdPrice, 30000);

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      clearInterval(priceInterval);
    };
  }, [updateChainData, setLoading, setError, setUsdPrice]);
};

export default useGasPriceFetcher;