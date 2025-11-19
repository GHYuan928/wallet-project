import { ethers } from "ethers";
import type {Wallet} from '../types'
import {WATTET_EVENT_ACCOUNT_CHANGE, WATTET_EVENT_CHAIN_CHANGE} from '../const'

const genPeovider = async()=>{
  const ethereum = window.ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const { chainId:newChainID }  = await provider.getNetwork();
  return {provider,chainID: newChainID.toString()}
}
const connectMetamask = async ()=>{
  const ethereum = window.ethereum;
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account found");
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const { chainId }  = await provider.getNetwork();
  console.log('accounts',accounts)
  return {provider, chainID: chainId.toString(),address, accounts}
}
const disconnectMetamask = async()=>{
  await window.ethereum.request({ method: "wallet_revokePermissions", params: [{ eth_accounts: {} }] });
}
const switchChainMetamask = async(chainId: string)=>{
  const hexChainID = "0x" + parseInt(chainId, 10).toString(16);
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hexChainID }] });
  return await genPeovider()
}

const addEventListener = ()=>{
  window.ethereum.on("accountsChanged", async (accounts: string[])=>{
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
  window.ethereum.on("chainChanged",async (hex: string) => {
    console.log('chainChanged',hex)
    const newProviderRes = await genPeovider()
    const event = new CustomEvent(WATTET_EVENT_CHAIN_CHANGE, {
      detail: newProviderRes
    });
    window.dispatchEvent(event);
  });
}
const removeEventListener = ()=>{
  window.ethereum.removeAllListeners("chainChanged");
  window.ethereum.removeAllListeners("accountsChanged")
}

const metamask: Wallet = {
  id: 'metamask',
  name: "Metamask",
  icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbuzbnY48o1pgrfnuxNhd-Tfhhg8hKmYv5EtvRDhjRHuqhq5EPTS8D&usqp=CAE&s",
  connect: connectMetamask,
  disconnect: disconnectMetamask,
  switchChain: switchChainMetamask,
  addEventListener,
  removeEventListener,
  description: "MetaMask is a browser extension that allows you to interact with Ethereum-based applicat",
  installed: true,
  downloadLink: "https://metamask.io/download/"
}
export default metamask