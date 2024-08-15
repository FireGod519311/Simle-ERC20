import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import tokenContract from '../artifacts/contracts/SimpleToken.sol/MyToken.json';
import { tokenContractAddress } from '../utils/contracts-config';

const TokenManager = () => {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();
    const token_contract = new ethers.Contract(tokenContractAddress, tokenContract.abi, provider);
    const owner_contract = new ethers.Contract(tokenContractAddress, tokenContract.abi, signer);

    useEffect(() => {
        const fetchBalanceAndOwnerStatus = async () => {
            try {
                const userAddress = await signer.getAddress();
                const balanceValue = await token_contract.balanceOf(userAddress);
                const ownerAddress = await token_contract.owner();
                
                setBalance(ethers.utils.formatUnits(balanceValue, 18));
                setIsOwner(userAddress.toLowerCase() === ownerAddress.toLowerCase());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchBalanceAndOwnerStatus();
    }, [signer, token_contract]);

    const handleMint = async () => {
        try {
            if (!isOwner) {
                alert('You are not the owner.');
                return;
            }
            const tx = await owner_contract.mint(address, ethers.utils.parseUnits(amount, 18));
            await tx.wait();
            alert('Minting successful');
            const updatedBalance = await token_contract.balanceOf(await signer.getAddress());
            setBalance(ethers.utils.formatUnits(updatedBalance, 18));
        } catch (error) {
            console.error("Error minting tokens:", error);
        }
    };

    const handleTransfer = async () => {
        try {
            if (!address || !amount) {
                alert('Please provide a valid address and amount.');
                return;
            }
            const tx = await owner_contract.transfer(address, ethers.utils.parseUnits(amount, 18));
            await tx.wait();
            alert('Transfer successful');
            const updatedBalance = await token_contract.balanceOf(await signer.getAddress());
            setBalance(ethers.utils.formatUnits(updatedBalance, 18));
        } catch (error) {
            console.error("Error transferring tokens:", error);
        }
    };

    return (
        <div className="text-white">
            <div className="mt-10">
                <p className="text-3xl">Current Balance</p>
                <input
                    className="mt-4 bg-gray-600 border-gray-800 border-4 rounded-3xl min-w-72 min-h-16 px-5 text-2xl text-center"
                    readOnly
                    value={balance}
                />
            </div>
            {isOwner && (
                <div className="mt-10 border border-gray-800 rounded-lg max-w-3xl mx-auto py-5">
                    <div className="flex justify-center gap-4 items-center">
                        <p className="text-xl">Address</p>
                        <input
                            className="my-4 bg-gray-600 border-gray-800 border-4 rounded-3xl min-w-96 min-h-10 px-5 text-xl text-center"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center gap-4 items-center">
                        <p className="text-xl">Amount</p>
                        <input
                            className="my-4 bg-gray-600 border-gray-800 border-4 rounded-3xl min-w-96 min-h-10 px-5 text-xl text-center"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-[#2c9986] rounded-md px-3 py-2 min-w-24 text-gray-300 text-xl"
                        onClick={handleMint}>
                        Mint
                    </button>
                    <button
                        className="bg-[#2c9986] rounded-md px-3 py-2 min-w-24 text-gray-300 text-xl hidden"
                        onClick={handleTransfer}>
                        Transfer
                    </button>
                </div>
            )}
            {!isOwner && (
                <p className="text-red-500 text-center mt-10">You do not have permission to mint tokens.</p>
            )}
        </div>
    );
};

export default TokenManager;