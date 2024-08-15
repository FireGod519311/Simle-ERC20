import { tokenContractAddress, factoryAddress, factoryABI, wethAddress } from '../utils/contracts-config';
import { useState } from 'react';
import { ethers } from 'ethers';

const Liquidity = () => {

    const [pairAddress, setPairAddress] = useState('');
    const [isPairCreate, setIsPairCrreated] = useState('');
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();

    const contract = new ethers.Contract(factoryAddress, factoryABI, signer);

    const checkPair = async () => {
        try {
            const address = await contract.getPair(wethAddress, tokenContractAddress);
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
            if (isPairCreate)
            {
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
    return (
        <>
            <button
                className="bg-[#2c9986] rounded-md px-3 py-2 min-w-24 text-gray-300 text-xl"
                onClick={createPair}
            >
                Create pair
            </button>
        </>
    );
}

export default Liquidity