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

  const [owner, user] = await ethers.getSigners();

  const Schnorr = await ethers.getContractFactory("Schnorr");
  const schnorr = await Schnorr.deploy();
  await schnorr.waitForDeployment();


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

  const token = await ethers.getContractAt("OzoneWrapperToken", newTokenAddress)
  const approve_tx = await ( token).connect(user).approve(executor.target, 100000000000000000000000000000n);
  await approve_tx.wait();

  console.log("schnorr target", schnorr.target);
  console.log("privKey", hexlify(privKey));
  console.log("pubKey", hexlify(pubKey));
  console.log("executor target", executor.target);
  console.log("newTokenAddress", newTokenAddress);

  console.log("done");

    // Verify the new token contract
    console.log("Verifying new token contract...");
    await hre.run("verify:verify", {
      address: newTokenAddress,
      constructorArguments: ["Ozone Bitcoin", "oBTC", 8, rand_bytes],
      force : true
    });
  
    // Verify Executor contract
    console.log("Verifying Executor contract...");
    await hre.run("verify:verify", {
      address: executor.target,
      constructorArguments: [pubKey.slice(1, 33)],
      libraries: {
        Schnorr: schnorr.target.toString(),
      },
    });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  /// addresses
//   Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8
// executor target 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// newTokenAddress 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D

// morph
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8
// executor target 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// newTokenAddress 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D


//linea
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8
// executor target 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// newTokenAddress 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// done

// hedera
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8
// executor target 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// newTokenAddress 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// done


// airdao
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8
// executor target 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// newTokenAddress 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D