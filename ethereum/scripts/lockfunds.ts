import { ethers } from "hardhat";
import { Executor, OzoneWrapperToken } from "../typechain-types";

async function main() {

    const vault_addr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" // executor address
    const token_addr = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c" // token address
    const schnorrLibrary = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const orderHash  = `0x${"e7bac7887ab96146afe0400bfd544e987bc00bb771b87814692c014425aec7c0"}`

    let alice = await ethers.getSigner("0xdD2FD4581271e230360230F9337D5c0430Bf44C0"); // pen ultimate hardhat signer [local test]
    // let alice = await ethers.getSigner("0x0D3c6bc2D2edC983DE4b912C1f4C2447b7363665")
    const ExecutorFactory = await ethers.getContractFactory("Executor" , {
        libraries: {
          Schnorr: schnorrLibrary,
        }});
    const executor = ExecutorFactory.attach(vault_addr) as Executor;

    const TokenFactory = await ethers.getContractFactory("OzoneWrapperToken");
    let token = TokenFactory.attach(token_addr) as OzoneWrapperToken;

    await token.connect(alice).approve(executor.target, 3000);
    await executor.connect(alice).lock(token_addr , orderHash , 3000);

    console.log("done");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });