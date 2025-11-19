import { ethers } from "ethers";
import type {Wallet} from '../types'
import {WATTET_EVENT_ACCOUNT_CHANGE, WATTET_EVENT_CHAIN_CHANGE} from '../const'

const genPeovider = async()=>{
  const cbwe = window.coinbaseWalletExtension;
  const provider = new ethers.BrowserProvider(cbwe);
  const { chainId:newChainID }  = await provider.getNetwork();
  return {provider,chainID: newChainID.toString()}
}
const connect = async ()=>{
  const cbwe = window.coinbaseWalletExtension;
  const accounts = await cbwe.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account found");
  const provider = new ethers.BrowserProvider(cbwe);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const { chainId }  = await provider.getNetwork();
  console.log('accounts',accounts)
  return {provider, chainID: chainId.toString(),address, accounts}
}
const disconnect = async()=>{
  // coinbase 不支持
}
const switchChain = async(chainId: string)=>{
  const hexChainID = "0x" + parseInt(chainId, 10).toString(16);
  await window.coinbaseWalletExtension.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hexChainID }] });
  return await genPeovider()
}
const addEventListener = ()=>{
  window.coinbaseWalletExtension.on("accountsChanged", async (accounts: string[])=>{
    const newProviderRes = await genPeovider()
    const event = new CustomEvent(WATTET_EVENT_ACCOUNT_CHANGE, {
      detail: {
        ...newProviderRes,
        accounts: accounts,
        address: accounts[0]
      }
    });
    window.dispatchEvent(event);
  });
  window.coinbaseWalletExtension.on("chainChanged",async (hex: string) => {
    console.log('chainChanged',hex)
    const newProviderRes = await genPeovider()
    const event = new CustomEvent(WATTET_EVENT_CHAIN_CHANGE, {
      detail: newProviderRes
    });
    window.dispatchEvent(event);
  });
}
const removeEventListener = ()=>{
  window.coinbaseWalletExtension.removeAllListeners("chainChanged");
  window.coinbaseWalletExtension.removeAllListeners("accountsChanged")
}

const coinbase: Wallet = {
  id: "coinbase",
  name: "Coinbase Wallet",
  icon: "https://avatars.githubusercontent.com/u/1885080?s=200&v=4",
  connect,
  disconnect,
  switchChain,
  addEventListener,
  removeEventListener,
  description: "MetaMask is a browser extension that allows you to interact with Ethereum-based applicat",
  installed: true,
  downloadLink: "https://metamask.io/download/"
}
export default coinbase