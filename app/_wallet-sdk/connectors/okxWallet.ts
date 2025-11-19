import { ethers } from "ethers";
import type {Wallet} from '../types'
import {WATTET_EVENT_ACCOUNT_CHANGE, WATTET_EVENT_CHAIN_CHANGE} from '../const'

const genPeovider = async()=>{
  const okx = (window as any).okxwallet;
  const provider = new ethers.BrowserProvider(okx);
  const { chainId:newChainID }  = await provider.getNetwork();
  return {provider,chainID: newChainID.toString()}
}
const connect= async ()=>{
  const okx = (window as any).okxwallet;
  const accounts = await okx.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account found");
  const {provider,chainID } = await genPeovider();
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  console.log('accounts',accounts)
  return {provider, chainID:chainID,address, accounts}
}
const disconnect = async()=>{
  // okx 不支持
}
const switchChain = async(chainId: string)=>{
  const hexChainID = "0x" + parseInt(chainId, 10).toString(16);
  await window.okxwallet.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hexChainID }] });
  return await genPeovider()
}

const addEventListener = ()=>{
  window.okxwallet.on("accountsChanged", async (accounts: string[])=>{
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
  window.okxwallet.on("chainChanged",async (hex: string) => {
    console.log('chainChanged',hex)
    const newProviderRes = await genPeovider()
    const event = new CustomEvent(WATTET_EVENT_CHAIN_CHANGE, {
      detail: newProviderRes
    });
    window.dispatchEvent(event);
  });
}
const removeEventListener = ()=>{
  window.okxwallet.removeAllListeners("chainChanged");
  window.okxwallet.removeAllListeners("accountsChanged")
}

const okxwallet: Wallet = {
  id: "okx",
  name: "OKX Wallet",
  icon: "https://play-lh.googleusercontent.com/N00SbjLJJrhg4hbdnkk3Llk2oedNNgCU29DvR9cpep7Lr0VkzvBkmLqajWNgFb0d7IOO=w240-h480-rw",
  connect,
  disconnect,
  switchChain,
  addEventListener,
  removeEventListener,
  description: "MetaMask is a browser extension that allows you to interact with Ethereum-based applicat",
  installed: true,
  downloadLink: "https://metamask.io/download/"
}
export default okxwallet