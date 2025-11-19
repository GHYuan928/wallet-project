import type {Chain, Wallet} from './_wallet-sdk/types'
import metamask from './_wallet-sdk/connectors/metamask'
import okxwallet from './_wallet-sdk/connectors/okxWallet';
import coinbase from './_wallet-sdk/connectors/coinbase'
export const chains:Chain[] =[{
  id: '11155111',
  name: 'Sepolia',
  icon: "https://t7.baidu.com/it/u=4095294316,3730432296&fm=193",
  rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/F0di7R5tgFYa1JkaCS_-g",
  crrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  blockExplorer: {
      name: 'Sepolia eth',
      url: 'https://sepolia.etherscan.io',
  }
},
  {
  id: '1',
  name: 'Ethereum',
  icon: "https://t7.baidu.com/it/u=1654006293,4153675194&fm=193",
  crrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/F0di7R5tgFYa1JkaCS_-g'",
  blockExplorer:  {
      name: 'Etherscan',
      url: 'https://etherscan.io',
  }
}]
export const CONTRACT_ADDR = "0x53dcd07b90b6326dc0eaae84963b3100b0fe7963";
export const wallets:Wallet[] = [metamask, okxwallet, coinbase]

