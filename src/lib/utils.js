export function parseSqrtPriceX96(sqrtPriceX96) {
  const sqrt = BigInt(sqrtPriceX96.toString());
  const price = (sqrt * sqrt * 10n ** 12n) / 2n ** 192n;
  return Number(price) / 1_000_000; 
}

export function calculateGasCostUSD(baseFee, priorityFee, usdPrice, gasLimit = 21000) {
  const gasEth = (baseFee + priorityFee) * gasLimit / 1e9; 
  return gasEth * usdPrice;
}