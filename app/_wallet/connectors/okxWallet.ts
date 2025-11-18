"use client";
import { ethers } from "ethers";
import type { Wallet } from "../types";

let provider: any;

// ------------------ 连接 OKX Wallet ------------------
const connectOkx = async () => {
  const okx = (window as any).okxwallet;

  if (!okx) throw new Error("OKX Wallet not installed");

  if (!provider) {
    provider = new ethers.BrowserProvider(okx);
  }

  const accounts = await okx.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account found");

  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const { chainId } = await provider.getNetwork();

  return { address, chainId: chainId.toString(), signer, provider };
};

// ------------------ 断开连接（OKX 没有 revoke） ------------------
const disconnectOkx = async () => {
  // OKX Wallet 不支持 revokePermissions，只能清本地状态
  console.warn("OKX Wallet does not support programmatic disconnect");
};

// ------------------ 切换链 ------------------
const switchChainOkx = async (chainId: string) => {
  const okx = (window as any).okxwallet;
  if (!okx) throw new Error("OKX Wallet not installed");

  await okx.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }],
  });
};

// ------------------ 获取 ETH 余额 ------------------
const getBalance = async (address: string) => {
  if (!provider) return "0";
  return (await provider.getBalance(address)).toString();
};

// ------------------ 账户变化监听 ------------------
const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  const okx = (window as any).okxwallet;
  if (!okx) return;
  okx.on("accountsChanged", callback);
};

// ------------------ 链变化监听 ------------------
const onChainChanged = (callback: (chainId: string, p: any) => void) => {
  const okx = (window as any).okxwallet;
  if (!okx) return;

  okx.on("chainChanged", (hex: string) => {
    // 链切换后 provider 必须重新实例化，否则 ethers 会报 network changed 1 => xxx
    provider = new ethers.BrowserProvider(okx);

    callback(parseInt(hex, 16).toString(), provider);
  });
};

// ------------------ 获取 ERC20 余额 ------------------
const getBalanceOf = async (address: string, token: string, abi: any) => {
  if (!provider) return "0";

  const contract = new ethers.Contract(token, abi, provider);
  return (await contract.balanceOf(address)).toString();
};

// ------------------ 移除监听（与 MetaMask 保持一致格式） ------------------
const removeAllListener = async () => {
  const okx = (window as any).okxwallet;
  if (!okx) return;

  okx.removeAllListeners?.("chainChanged");
  okx.removeAllListeners?.("accountsChanged");
};

// ------------------ 导出为 Wallet ------------------
const okxwallet: Wallet = {
  id: "okx",
  name: "OKX Wallet",
  icon: "https://static.okx.com/cdn/assets/imgs/243/BC318D6AE91CE2C0.png",
  installed: typeof window !== "undefined" && Boolean((window as any).okxwallet),
  connector: connectOkx,
  disconnect: disconnectOkx,
  switchChain: switchChainOkx,
  getBalance,
  getBalanceOf,
  onAccountsChanged,
  onChainChanged,
  removeAllListener,
};

export default okxwallet;
