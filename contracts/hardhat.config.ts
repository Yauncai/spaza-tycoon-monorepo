// import type { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import "@openzeppelin/hardhat-upgrades"; 
// import * as dotenv from "dotenv";

// dotenv.config();

// const config: HardhatUserConfig = {
//   solidity: "0.8.20",
//   defaultNetwork: "localhost",
//   networks: {
//     "base-sepolia": {
//       url: "https://sepolia.base.org",
//       accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
// };

// export default config;

import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "localhost",

  networks: {
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [process.env.PRIVATE_KEY]
          : [],
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },

};

export default config;


