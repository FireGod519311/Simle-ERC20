import { ethers } from "ethers";
import { useState, useEffect } from "react"
import { tokenContractAddress, factoryAddress, factoryABI, wethAddress, UNISWAP_V2_ROUTER, ROUTER_ABI } from '../utils/contracts-config';

const Swap = () => {
    const [payToken, setPayToken] = useState("eth");
    const [recvToken, setRecvToken] = useState("mst");
    const [payAmount, setPayAmount] = useState("");
    const [recvAmount, setRecvAmount] = useState("");
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();

    const router = new ethers.Contract(UNISWAP_V2_ROUTER, ROUTER_ABI, signer);
    const handleRecvToken = (e) => {
        setRecvToken(e.target.value);
        setPayToken(e.target.value === "mst" ? "eth" : "mst");
        console.log("recv:", payToken, recvToken);
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
            console.log("invalid value");
            return;
        }
        const path = [payToken==="eth"?wethAddress:tokenContractAddress,payToken==="eth"?tokenContractAddress:wethAddress];

        try {
            const parsedPayAmount = ethers.utils.parseUnits(value, 18);
            // Get the amounts out
            const amountsOut = await router.getAmountsOut(parsedPayAmount, path);

            // Assuming amountsOut is an array and the last element is the received amount
            setRecvAmount(ethers.utils.formatUnits(amountsOut[1], 18)); // Adjust the decimals if needed
        } catch (error) {
            console.error('Error getting amounts out:', error);
        }
    };
    const handleRecvInput = async (e) => {
        const value = e.target.value;
       
        setRecvAmount(value);
        if (!(value > 0)) {
            console.log("invalid value");
            return;
        }
        const path = [recvToken==="eth"?wethAddress:tokenContractAddress,recvToken==="eth"?tokenContractAddress:wethAddress];

        try {
            const parsedRecvAmount = ethers.utils.parseUnits(value, 18);
            // Get the amounts out
            const amountsOut = await router.getAmountsOut(parsedRecvAmount, path);

            // Assuming amountsOut is an array and the last element is the received amount
            setPayAmount(ethers.utils.formatUnits(amountsOut[1], 18)); // Adjust the decimals if needed
        } catch (error) {
            console.error('Error getting amounts out:', error);
        }
    };

    return (
        <div className="text-white">

            <div className="mt-10 border border-gray-800 rounded-lg mx-auto py-5  max-w-lg ">
                <div className="flex flex-col gap-2 px-5">
                    <div className="flex-auto text-left text-2xl">
                        You pay
                    </div>
                    <div className="flex-auto">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <input
                                    className="bg-transparent w-full text-4xl text-left h-full py-2"
                                    placeholder="0.0" onChange={handlePayInput} value={payAmount}
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
            <div className="mt-5 border border-gray-800 rounded-lg mx-auto py-5  max-w-lg ">
                <div className="flex flex-col gap-2 px-5">
                    <div className="flex-auto text-left text-2xl">
                        You receive
                    </div>
                    <div className="flex-auto">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <input
                                    className="bg-transparent w-full text-4xl text-left h-full py-2"
                                    placeholder="0.0" value={recvAmount} onChange={handleRecvInput}
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


            <button
                className="bg-[#2c9986] rounded-md px-3 py-2 min-w-24 text-gray-300 text-xl mt-5"
            >
                Swap
            </button>

        </div>
    )
}

export default Swap;