// scripts/index.js
async function main() {
    // Our code will go here
    const signers = await ethers.getSigners();
    const accounts = signers.map(signer => signer.address);

    console.log("Accounts:", accounts);
    // const accounts = await ethers.provider.listAccounts();
    // console.log(accounts);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });