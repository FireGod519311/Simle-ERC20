export const tokenContractAddress = "0x116b47f05d05c524aE66b847A4d33e5c66e95a38"
export const factoryAddress = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003"
export const wethAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
export const UNISWAP_V2_ROUTER = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"
export const factoryABI = [
    "function getGasPriceQueryKey(address tokenA, address tokenB) external view returns (address pair)",
    "function allPairs(uint) external view returns (address pair)",
    "function allPairsLength() external view returns (uint)",
    "function createPair(address tokenA, address tokenB) external returns(address pair)",
    "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];

export const ROUTER_ABI = [
    "function WETH() external pure returns (address)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline)",
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
];