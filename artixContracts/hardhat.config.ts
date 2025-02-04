require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "",
      accounts: 
        process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532
    }
  },
  // etherscan: {
  //   apiKey: {
  //     baseSepolia: process.env.BASE_ETHERSCAN_API_KEY || ""
  //   },
  //   customChains: [
  //     {
  //       network: "baseSepolia",
  //       chainId: 84532,
  //       urls: {
  //         apiURL: "https://api-sepolia.basescan.org/api",
  //         browserURL: "https://sepolia.basescan.org/"
  //       }
  //     }
  //   ]
  // }
};