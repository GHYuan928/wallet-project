"use client";
import { ethers } from "ethers";
import type { Wallet } from "../types";

let provider: any;

const connectCoinbase = async () => {
  const cw = (window as any).coinbaseWalletExtension;
  if (!cw) throw new Error("Coinbase Wallet not installed");

  if (!provider) {
    provider = new ethers.BrowserProvider(cw);
  }

  const accounts = await cw.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account found");

  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const { chainId } = await provider.getNetwork();

  return { address, chainId: chainId.toString(), signer, provider };
};

const disconnectCoinbase = async () => {
  const cw = (window as any).coinbaseWalletExtension;
  if (!cw) return;

  await cw.request({
    method: "wallet_requestPermissions",
    params: [{ eth_accounts: {} }],
  });
};

const switchChainCoinbase = async (chainId: string) => {
  const cw = (window as any).coinbaseWalletExtension;
  if (!cw) return;

  await cw.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }],
  });
};

const getBalance = async (address: string) => {
  if (!provider) return "0";
  const bal = await provider.getBalance(address);
  return bal.toString();
};

const getBalanceOf = async (address: string, token: string, abi: any) => {
  if (!provider) return "0";
    const contract = new ethers.Contract(token, abi, provider);
    let balance = "0"
    try {
      balance =(await contract.balanceOf(address)).toString();
    
    } catch (error) {
      
    }
    return balance;
};

const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  const cw = (window as any).coinbaseWalletExtension;
  if (!cw) return;
  cw.on("accountsChanged", callback);
};

const onChainChanged = (callback: (chainId: string, p: any) => void) => {
  const cw = (window as any).coinbaseWalletExtension;
  if (!cw) return;
  console.log('onChainChanged 2')

  cw.on("chainChanged", (hex: string) => {
      console.log('onChainChanged 3',hex)
    provider = new ethers.BrowserProvider(cw);
    callback(parseInt(hex, 16).toString(), provider);
  });
};

const coinbase: Wallet = {
  id: "coinbase",
  name: "Coinbase Wallet",
  icon: "https://avatars.githubusercontent.com/u/1885080?s=200&v=4",
  installed: typeof window !== "undefined" && Boolean((window as any).coinbaseWalletExtension),
  connector: connectCoinbase,
  disconnect: disconnectCoinbase,
  switchChain: switchChainCoinbase,
  getBalance,
  getBalanceOf,
  onAccountsChanged,
  onChainChanged,
};

export default coinbase;
