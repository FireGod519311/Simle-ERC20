import { tokenContractAddress, factoryAddress, factoryABI, wethAddress, UNISWAP_V2_ROUTER, ROUTER_ABI } from '../utils/contracts-config';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tokenContract from '../artifacts/contracts/SimpleToken.sol/MyToken.json';
import UniswapV2Pair from '../artifacts/contracts/SimpleToken.sol/UniswapV2Pair.json';

const Liquidity = () => {
    const [sepoliaEthBalance, setSepoliaEthBalance] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);

    const [pairAddress, setPairAddress] = useState('');
    const [isPairCreate, setIsPairCrreated] = useState('');
    const [reserve0, setReserve0] = useState('');
    const [reserve1, setReserve1] = useState('');
    const [totalSupply, setTotalSupply] = useState('');

    const [ethAmount, setEthAmount] = useState(0);
    const [mstAmount, setMstAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();
    const token_contract = new ethers.Contract(tokenContractAddress, tokenContract.abi, provider);
    const owner_contract = new ethers.Contract(tokenContractAddress, tokenContract.abi, signer);

    const contract = new ethers.Contract(factoryAddress, factoryABI, signer);
    const router = new ethers.Contract(UNISWAP_V2_ROUTER, ROUTER_ABI, signer);

    const checkPair = async () => {
        try {
            const address = await contract.getPair(wethAddress, tokenContractAddress);
            console.log("checkPair:", address);
            setPairAddress(address);
            setIsPairCrreated(address !== ethers.constants.AddressZero);
        } catch (error) {
            console.error("Error checking pair", error);
        }
    }

    const createPair = async () => {
        if (!wethAddress || !tokenContractAddress) {
            alert("Select correct tokens");
            return;
        }
        try {
            if (isPairCreate) {
                console.log("Pair is already created. Address: ", pairAddress);
                return;
            }

            const tx = await contract.createPair(wethAddress, tokenContractAddress);
            const receipt = await tx.wait(); // Wait for the transaction to be mined

            console.log("Transaction receipt:", receipt); // Log the entire receipt

        } catch (error) {
            console.error("Error creating pair:", error);
        }
    }

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const userAddress = await signer.getAddress();
                console.log("---Liquidit----", userAddress);
                const tokenBalanceValue = await token_contract.balanceOf(userAddress);
                console.log("--balance---", tokenBalanceValue);
                setTokenBalance(ethers.utils.formatUnits(tokenBalanceValue, 18));

                const sepBal = await provider.getBalance(userAddress);
                setSepoliaEthBalance(ethers.utils.formatEther(sepBal));

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchPairInfo = async () => {
            try {
                console.log("fetch pair info start1");
                const address = await contract.getPair(wethAddress, tokenContractAddress);
        
                if (address === ethers.constants.AddressZero) {
                    alert("Pair does not exist!");
                    return;
                }
        
                console.log("fetch pair info start2");
        
                setPairAddress(address);
                const pairContract = new ethers.Contract(address, UniswapV2Pair, signer);
                console.log("fetch pair info : Promise");
                const [reserves, _totalSupply] = await Promise.all([
                    pairContract.getReserves(),
                    pairContract.totalSupply(),
                ]);
        
                if (Array.isArray(reserves) && reserves.length >= 2) {
                    const _reserve0 = reserves[1]; // BigNumber
                    const _reserve1 = reserves[0]; // BigNumber
        
                    console.log("fetch pair info : get reserves:", reserves);
                    console.log("fetch pair info : get reserve0", _reserve0.toString());
                    console.log("fetch pair info : get reserve1", _reserve1.toString());
                    console.log("fetch pair info : get totalSupply:", _totalSupply.toString());
        
                    if (!_reserve0 || !_reserve1 || !_totalSupply) {
                        throw new Error("Failed to fetch valid data from pair contract.");
                    }
        
                    setReserve0(ethers.utils.formatUnits(_reserve0, 18)); // Adjust decimal places if needed
                    setReserve1(ethers.utils.formatUnits(_reserve1, 18)); // Adjust decimal places if needed
                    setTotalSupply(ethers.utils.formatUnits(_totalSupply, 18)); // Adjust decimal places if needed
                    console.log("fetch pair info : end");
                } else {
                    throw new Error("Unexpected response format from getReserves.");
                }
            } catch (error) {
                console.error("Error fetching pair info:", error);
            }
        }
        checkPair();
        fetchBalance();
        fetchPairInfo();
    }, [signer, token_contract]);

    const handleAddLiquidity = async () => {
        setLoading(true);
        setError('');
        try {
            if (!isPairCreate) {
                alert('No pair');
                return;
            }
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

            const amount0Parsed = ethers.utils.parseUnits(String(ethAmount), 18);
            const amount1Parsed = ethers.utils.parseUnits(String(mstAmount), 18);

            const approveTx = await owner_contract.approve(UNISWAP_V2_ROUTER, amount1Parsed);
            await approveTx.wait();

            const tx = await router.addLiquidityETH(
                tokenContractAddress,
                amount1Parsed,
                0, // min amount of tokenA
                0, // min amount of tokenB
                await signer.getAddress(),
                deadline,
                { value:  amount0Parsed} 
            );

            await tx.wait();
            alert('Liquidity added successfully');
        } catch (error) {
            setError('Error adding liquidity. Please check the console for details.');
            console.error('Error adding liquidity:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="bg-[#2c9986] rounded-md px-3 py-2 min-w-24 text-gray-300 text-xl mt-8"
                onClick={createPair}
            >
                Create pair
            </button>
            <div className='flex justify-center gap-8 text-white mt-10'>
                <div>
                    <p className="text-2xl">Current Sepolia Eth Balance</p>
                    <input
                        className="mt-4 bg-gray-600 border-gray-800 border-4 rounded-3xl min-w-44 min-h-12 px-5 text-xl text-center"
                        readOnly
                        value={sepoliaEthBalance}
                    />
                </div>
                <div>
                    <p className="text-2xl">Current MST Token Balance</p>
                    <input
                        className="mt-4 bg-gray-600 border-gray-800 border-4 rounded-3xl min-w-44 min-h-12 px-5 text-xl text-center"
                        readOnly
                        value={tokenBalance}
                    />
                </div>
            </div>
            {pairAddress && (
                    <div className="mt-4">
                        <p className="text-xl">Pair Address: {pairAddress}</p>
                        <p className="text-xl">Reserve 0 (Token0/WETH): {reserve0}</p>
                        <p className="text-xl">Reserve 1 (Token1): {reserve1}</p>
                        <p className="text-xl">Total Supply: {totalSupply}</p>
                    </div>
                )}
            <div className='flex justify-center gap-8 text-white mt-10'>
                <div>
                    <p className="text-2xl">Sepolia Eth Amount</p>
                    <input
                        className="mt-4 bg-gray-600 border-gray-800 border-4 rounded-3xl min-w-44 min-h-12 px-5 text-xl text-center"
                        value={ethAmount}
                        onChange={(e) => setEthAmount(e.target.value)}
                    />
                </div>
                <div>
                    <p className="text-2xl">MST Token Amount</p>
                    <input
                        className="mt-4 bg-gray-600 border-gray-800 border-4 rounded-3xl min-w-44 min-h-12 px-5 text-xl text-center"
                        value={mstAmount}
                        onChange={(e) => setMstAmount(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="bg-[#2c9986] rounded-md px-3 py-2 min-w-24 text-gray-300 text-xl mt-8"
                onClick={handleAddLiquidity}
            >
                {loading?"Loading...":"Add Luquidity"}
            </button>
            {error && <p className="text-red-500">{error}</p>}

        </>
    );
}

export default Liquidity