# Zeru Gas Tracker 🚀
A real-time cross-chain gas price tracker with wallet simulation and live data visualization. This dashboard displays gas fees on Ethereum, Polygon, and Arbitrum networks using native RPCs, and calculates the USD transaction cost using Uniswap V3 pool data.
---
## 📌 Features
- 🔴 Real-time gas prices using WebSocket RPCs
- 📊 USD cost simulation for ETH/MATIC/ARB transactions
- 🧠 Zustand-based state machine for live/simulation mode
- 📈 Candlestick chart showing gas volatility (15-min intervals)
- 💸 ETH/USD price derived directly from Uniswap V3 Swap logs
- ⚙️ Interactive and responsive dashboard built with Next.js + React
---
## 🛠️ Tech Stack
- **Framework**: Next.js (React)
- **State Management**: Zustand
- **Web3**: Ethers.js (`WebSocketProvider`)
- **Charting**: lightweight-charts
- **Styling**: Tailwind CSS (optional)
- **RPC**: Native RPCs of Ethereum, Polygon, Arbitrum (no third-party APIs)
---
## 🧪 How It Works
### Live Mode
- Establishes WebSocket connections to RPCs
- Extracts `baseFeePerGas` and `maxPriorityFeePerGas`
- Updates gas values every 6 seconds
### Simulation Mode
- User enters transaction value (e.g. 0.5 ETH)
- USD cost = `(baseFee + priorityFee) * 21000 * ETH/USD price`
- ETH/USD price fetched by parsing `Swap` logs from:
