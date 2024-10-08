import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";

if ((!process.env.PRIVKEY1)  || (!process.env.PRIVKEY2)) {
  throw new Error("Privkey not set");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },

    sepolia : {
      url: "https://sepolia.infura.io/v3/979d8f8712b24030a953ed0607a54e76",
      chainId: 11155111,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },

    base : {
      url: "https://base-sepolia-rpc.publicnode.com",
      chainId: 84532,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },

    scroll : {
      url: "https://rpc.ankr.com/scroll_sepolia_testnet",
      chainId: 534351,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },

    Amoy : {
      url: "https://rpc.ankr.com/polygon_amoy",
      chainId: 80002,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },

    optimism : {
      url: "https://sepolia.optimism.io",
      chainId: 11155420,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },

    airdao : {
      url: "https://network.ambrosus-test.io",
      chainId : 22040,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },
    
    rootstack : {
      url: "https://mycrypto.testnet.rsk.co",
      chainId : 31,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },

    flow : {
      url: "https://testnet.evm.nodes.onflow.org",
      chainId : 545,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },
    morph : {
      url: "https://rpc-quicknode-holesky.morphl2.io",
      chainId : 2810,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },
    linea : {
      url: "https://rpc.sepolia.linea.build",
      chainId : 59141,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },
    hedera : {
      url: "https://testnet.hashio.io/api",
      chainId : 296,
      accounts: [`0x${process.env.PRIVKEY1}` , `0x${process.env.PRIVKEY2}`]
    },
  },

  etherscan : {
    apiKey : "H1U44AP9EQHUSH4JDA47GH1FKKVJATX5HW"
  }
};

export default config;
