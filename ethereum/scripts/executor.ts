import { getBytes, hexlify, randomBytes } from "ethers";
import { ethers } from "hardhat";
import secp256k1 from "secp256k1";
import hre from "hardhat";
import { Executor, Executor__factory } from "../typechain-types";

let privKey: Uint8Array;
let pubKey: Uint8Array;
let executor: Executor;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const Schnorr = await ethers.getContractFactory("Schnorr");
  const schnorr = await Schnorr.deploy();
  await schnorr.waitForDeployment();
  // await sleep(50000);
  // console.log("Schnorr deployed to:", schnorr.target);

  // // Verify Schnorr contract
  // console.log("Verifying Schnorr contract...");
  // await hre.run("verify:verify", {
  //   address: schnorr.target,
  //   constructorArguments: [],
  //   force : true

  // });

  privKey = getBytes("0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305");
  pubKey = secp256k1.publicKeyCreate(privKey);

  const ExecutorFactory = (await ethers.getContractFactory("Executor", {
    libraries: {
      Schnorr: schnorr.target.toString(),
    },
  })) as Executor__factory;
  executor = await ExecutorFactory.deploy(pubKey.slice(1, 33));
  await executor.waitForDeployment();

  console.log("Executor deployed to:", executor.target);
  await sleep(50000);

  // Verify Executor contract
  console.log("Verifying Executor contract...");
  await hre.run("verify:verify", {
    address: executor.target,
    constructorArguments: [pubKey.slice(1, 33)],
    libraries: {
      Schnorr: schnorr.target.toString(),
    },
  });

  const rand_bytes = randomBytes(32);

  const newTokenAddress = await executor.createAndRegisterToken.staticCall(
    "Ozone Bitcoin",
    "oBTC",
    8,
    rand_bytes
  );

  const tx = await executor.createAndRegisterToken("Ozone Bitcoin", "oBTC", 8, rand_bytes);
  await tx.wait(2); // Wait for 2 confirmations

  console.log("New token deployed to:", newTokenAddress);
  await sleep(50000);

  // Verify the new token contract
  console.log("Verifying new token contract...");
  await hre.run("verify:verify", {
    address: newTokenAddress,
    constructorArguments: ["Ozone Bitcoin", "oBTC", 8, rand_bytes],
    force : true
  });

  console.log("schnorr target", schnorr.target);
  console.log("privKey", hexlify(privKey));
  console.log("pubKey", hexlify(pubKey));
  console.log("executor target", executor.target);
  console.log("newTokenAddress", newTokenAddress);

  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });