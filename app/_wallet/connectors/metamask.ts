"use client";
import { ethers } from "ethers";
import type { Wallet } from "../types";


let provider: any;

const connectMetamask = async () => {
  if (!provider) {
    provider = typeof window !== "undefined" ? new ethers.BrowserProvider(window.ethereum) : null
  };
  const ethereum = window.ethereum;
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account found");
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const { chainId } = await provider.getNetwork();
  return { address, chainId: chainId.toString(), signer, provider };
};

const disconnectMetamask = async () => {
  await window.ethereum.request({ method: "wallet_revokePermissions", params: [{ eth_accounts: {} }] });
};

const switchChainMetamask = async (chainId: string) => {
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId }] });
};

const getBalance = async (address: string) => {
  if (!provider) return "0";
  return (await provider.getBalance(address)).toString();
};

const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  window.ethereum.on("accountsChanged", callback);
};

const onChainChanged = (callback: (chainId: string, p: any) => void) => {
  window.ethereum.on("chainChanged", (hex: string) => {
    provider = new ethers.BrowserProvider(window.ethereum) ;

    callback(parseInt(hex, 16).toString(), provider)
  });
};
const getBalanceOf = async (address: string, token: string, abi: any) => {
  if (!provider) return "0";
  const contract = new ethers.Contract(token, abi, provider);
  return (await contract.balanceOf(address)).toString();
};
const removeAllListener = async ()=>{
  window.ethereum.removeAllListeners("chainChanged");
  window.ethereum.removeAllListeners("accountsChanged")
}
const metamask: Wallet = {
  id: "metamask",
  name: "MetaMask",
  icon: "https://metamask.io/images/mm-logo.svg",
  installed: typeof window !== "undefined" && Boolean(window.ethereum),
  connector: connectMetamask,
  disconnect: disconnectMetamask,
  switchChain: switchChainMetamask,
  onAccountsChanged,
  onChainChanged,
  getBalance,
  getBalanceOf,
  removeAllListener
};

export default metamask;
