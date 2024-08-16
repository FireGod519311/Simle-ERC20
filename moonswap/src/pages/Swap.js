import { ethers } from "ethers";
import { useState } from "react";
import { tokenContractAddress, factoryAddress, factoryABI, wethAddress, UNISWAP_V2_ROUTER, ROUTER_ABI } from '../utils/contracts-config';

const Swap = () => {
    const [payToken, setPayToken] = useState("eth");
    const [recvToken, setRecvToken] = useState("mst");
    const [payAmount, setPayAmount] = useState("");
    const [recvAmount, setRecvAmount] = useState("");
    const [slippage, setSlippage] = useState(1); // Slippage tolerance in percentage
    const [loading, setLoading] = useState(false); // Loading state

    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();

    const router = new ethers.Contract(UNISWAP_V2_ROUTER, ROUTER_ABI, signer);

    const handleRecvToken = (e) => {
        setRecvToken(e.target.value);
        setPayToken(e.target.value === "mst" ? "eth" : "mst");
        setPayAmount("");
        setRecvAmount("");
    }

    const handlePayToken = (e) => {
        setPayToken(e.target.value);
        setRecvToken(e.target.value === "mst" ? "eth" : "mst");
        setPayAmount("");
        setRecvAmount("");
    }

    const handlePayInput = async (e) => {
        const value = e.target.value;
        setPayAmount(value);

        if (!(value > 0)) {
            console.log("Invalid value");
            setRecvAmount("");
            return;
        }

        const path = [payToken === "eth" ? wethAddress : tokenContractAddress, payToken === "eth" ? tokenContractAddress : wethAddress];

        try {
            const parsedPayAmount = ethers.utils.parseUnits(value, 18);
            const amountsOut = await router.getAmountsOut(parsedPayAmount, path);
            setRecvAmount(ethers.utils.formatUnits(amountsOut[1], 18));
        } catch (error) {
            console.error('Error getting amounts out:', error);
        }
    };

    const handleRecvInput = async (e) => {
        const value = e.target.value;
        setRecvAmount(value);

        if (!(value > 0)) {
            console.log("Invalid value");
            setPayAmount("");
            return;
        }

        const path = [recvToken === "eth" ? wethAddress : tokenContractAddress, recvToken === "eth" ? tokenContractAddress : wethAddress];

        try {
            const parsedRecvAmount = ethers.utils.parseUnits(value, 18);
            const amountsOut = await router.getAmountsOut(parsedRecvAmount, path);
            setPayAmount(ethers.utils.formatUnits(amountsOut[1], 18));
        } catch (error) {
            console.error('Error getting amounts out:', error);
        }
    };

    const handleSwap = async () => {
        if (!(payAmount > 0) || !(recvAmount > 0)) {
            console.log("Invalid value");
            return;
        }

        setLoading(true);

        try {
            const parsedAmountIn = ethers.utils.parseUnits(payAmount, 18);
            const parsedAmountOut = ethers.utils.parseUnits(recvAmount, 18);
            const slippageTolerance = slippage / 100;
            const parsedAmountOutMin = parsedAmountOut.mul(100 - slippageTolerance * 100).div(100);
            const path = [payToken === "eth" ? wethAddress : tokenContractAddress, payToken === "eth" ? tokenContractAddress : wethAddress];
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

            let tx;
            if (payToken === "eth") {
                console.log("swap pay eth. path=", path);
                console.log("out min:", parsedAmountOutMin);
                tx = await router.swapExactETHForTokens(
                    parsedAmountOutMin,
                    path,
                    await signer.getAddress(),
                    deadline,
                    { value: parsedAmountIn }
                );
            } else if (recvToken === "eth") {
                console.log("swap recv eth");
                const payContract = new ethers.Contract(tokenContractAddress, ['function approve(address spender, uint256 amount) public returns (bool)'], signer);
                const approveTx = await payContract.approve(UNISWAP_V2_ROUTER, parsedAmountIn);
                await approveTx.wait();

                tx = await router.swapExactTokensForETH(
                    parsedAmountIn,
                    parsedAmountOutMin,
                    path,
                    await signer.getAddress(),
                    deadline
                );
            } else {
                const payContract = new ethers.Contract(payToken === "eth" ? wethAddress : tokenContractAddress, ['function approve(address spender, uint256 amount) public returns (bool)'], signer);
                const approveTx = await payContract.approve(UNISWAP_V2_ROUTER, parsedAmountIn);
                await approveTx.wait();

                tx = await router.swapExactTokensForTokens(
                    parsedAmountIn,
                    parsedAmountOutMin,
                    path,
                    await signer.getAddress(),
                    deadline
                );
            }

            await tx.wait();
            console.log("Swap successful");
        } catch (error) {
            console.error('Swap Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="text-white">
            <div className="mt-10 border border-gray-800 rounded-lg mx-auto py-5 max-w-lg">
                <div className="flex flex-col gap-2 px-5">
                    <div className="flex-auto text-left text-2xl text-gray-400">
                        You pay
                    </div>
                    <div className="flex-auto">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <input
                                    className="bg-transparent w-full text-4xl text-left h-full py-2"
                                    placeholder="0.0" onChange={handlePayInput} value={payAmount} type="number"
                                />
                            </div>
                            <div className="flex-initial">
                                <select
                                    className="w-full bg-gray-800 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={handlePayToken} value={payToken}
                                >
                                    <option value="eth">Sepolia Eth</option>
                                    <option value="mst">MST Token</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 border border-gray-800 rounded-lg mx-auto py-5 max-w-lg">
                <div className="flex flex-col gap-2 px-5">
                    <div className="flex-auto text-left text-2xl text-gray-400">
                        You receive
                    </div>
                    <div className="flex-auto">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <input
                                    className="bg-transparent w-full text-4xl text-left h-full py-2"
                                    placeholder="0.0" value={recvAmount} onChange={handleRecvInput} type="number"
                                />
                            </div>
                            <div className="flex-initial">
                                <select
                                    className="w-full bg-gray-800 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={handleRecvToken} value={recvToken}
                                >
                                    <option value="eth">Sepolia Eth</option>
                                    <option value="mst">MST Token</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 border border-gray-800 rounded-lg mx-auto py-5 max-w-lg">
                <div className="flex flex-col gap-2 px-5">
                    <div className="flex-auto text-left text-2xl text-gray-400">
                        Slippage Tolerance (%)
                    </div>
                    <div className="flex-auto">
                        <input
                            className="bg-transparent w-full text-4xl text-left h-full py-2"
                            placeholder="1" onChange={(e) => setSlippage(e.target.value)} value={slippage} type="number" min="0" max="100"
                        />
                    </div>
                </div>
            </div>

            <button
                className="bg-[#2c9986] rounded-md px-3 py-2 min-w-24 text-gray-300 text-xl mt-5"
                onClick={handleSwap}
                disabled={loading}
            >
                {loading ? "Swapping..." : "Swap"}
            </button>
        </div>
    );
}

export default Swap;