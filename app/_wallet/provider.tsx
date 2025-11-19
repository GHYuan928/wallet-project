"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Wallet, WalletContextValue, WalletProviderProps, WalletState } from "./types";
import WalletModal from "./components/WalletModal";
import {stakeAbi} from './abi'

const WalletContext = createContext<WalletContextValue | null>(null);
const CONTRACT_ADDR = "0x53dcd07b90b6326dc0eaae84963b3100b0fe7963";
export const WalletProvider: React.FC<WalletProviderProps> = ({ children, chains, wallets }) => {
  const [state, setState] = useState<WalletState>({
    address: "",
    chainID: "",
    walletId: "",
    chains: chains,
    isConnecting: false,
    isConnected: false,
    error: null,
    ethBalance: "0",
    tokenBalances: {},
    provider: null,
  });
  const [balance, setBalance] = useState<{eth?:string,erc20?:Record<string,any>}>({})
  const [openModal, setOpenModal] = useState(false);

  const walletMap = useMemo(() => wallets.reduce((acc, w) => ({ ...acc, [w.id]: w }), {} as Record<string, Wallet>), [wallets]);

  const refreshEthBalance = async (address?: string, walletId?:string) => {
    if (!address && !state.address && !state.walletId) return;
    const addr = address || state.address;
    const wid = walletId || state.walletId;
    const wallet = walletMap[wid];
    if (!wallet) return;
    try {
      const balance = await wallet.getBalance!(addr);
      setBalance((prev) => ({ ...prev, eth: balance }));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshTokenBalances = async (address?: string, walletId?: string) => {
    if (!address && !state.address && !state.walletId) return;
    const addr = address || state.address;
    const wid = walletId|| state.walletId
    const tokenBalances: Record<string, string> = {};
    const wallet = walletMap[wid];

      if (wallet.getBalanceOf ) {
          try {
            const balance = await wallet.getBalanceOf!(addr, CONTRACT_ADDR, stakeAbi);
            tokenBalances[CONTRACT_ADDR] = balance;
          } catch (err) {
            console.error(err);
            tokenBalances[CONTRACT_ADDR] = "";
          }
      }
    
    setBalance((prev) => ({ ...prev, erc20: tokenBalances }));
  };
  const refreshAllBalances = async (address?: string, wid?: string) => {
    await refreshEthBalance(address,wid);
    await refreshTokenBalances(address,wid);
  };

  useEffect(() => {
    const activeWallet = walletMap[state.walletId];
    if (!activeWallet) return;
    const accountChange = (accounts: string[]) => {
      setState((prev) => ({
        ...prev,
        address: accounts[0] || "",
        isConnected: accounts.length > 0,
      }));
    }
    // 订阅钱包事件
    activeWallet.onAccountsChanged?.(accountChange);

    const chainChange = (chainId: string, provider: any) => {
      console.log('chainChange',chainId)
      setState((prev) => ({ ...prev, chainID: chainId , provider}));
      refreshAllBalances();
    }
    activeWallet.onChainChanged?.(chainChange);
    return () => {
      // 这里可以添加取消订阅逻辑，如果钱包支持 removeListener
      activeWallet.removeAllListener?.()
    };
  }, [state.provider, walletMap]);
  useEffect(()=>{
    const provider = state.provider
    provider && provider?.on?.("block", async () => {
      console.log('--- block')
      refreshAllBalances()
    });
    return () => {
      provider?.removeAllListeners?.("block");
    };
  },[state.provider])

  // ----------------- 本地持久化 -----------------
  useEffect(() => {
    const str = localStorage.getItem("wallet_state");
    if (str) {
      const s: WalletState = JSON.parse(str)
      setState(s)
      const lastWalletId = s.walletId;
      if (!lastWalletId) return;

      const wallet:Wallet = walletMap[lastWalletId];
      if (!wallet) return;
        wallet.connector().then((data) => {
          setState((prev) => ({
            ...prev,
            address: data.address,
            chainID: data.chainId,
            provider: data.provider,
            walletId: lastWalletId,
            isConnected: true,
          }));
        }).catch(console.error);
      }
    
  }, []);

  useEffect(() => {
    localStorage.setItem("wallet_state", JSON.stringify(state));
    if(state.address && state.walletId){
      refreshAllBalances()
    }
  }, [state]);

  // ----------------- WalletProvider 值 -----------------
  const value: WalletContextValue = useMemo(
    () => ({
      ...state,
      ethBalance: balance.eth,
      tokenBalances: balance.erc20,
      connect: async (walletId: string) => {
        const wallet = walletMap[walletId];
        if (!wallet) throw new Error(`Wallet ${walletId} not found`);
        setState((prev) => ({ ...prev, isConnecting: true }));
        try {
          const data = await wallet.connector();
          setState({
            ...state,
            address: data.address,
            chainID: data.chainId,
            walletId: walletId,
            provider: data.provider,
            isConnected: true,
            isConnecting: false,
          });
        } catch (err) {
          setState({ ...state, error: err as Error, isConnecting: false });
        }
      },
      disconnect: async () => {
        const wallet  = walletMap[state.walletId];
        if (!wallet) throw new Error("No wallet supports switchChain");
        wallet.disconnect?.()
        setState({
          address: "",
          chainID: "",
          walletId:"",
          chains,
          isConnecting: false,
          isConnected: false,
          error: null,
          ethBalance: "0",
          tokenBalances: {},
          provider: null
        });
      },
      switchChain: async (chainId: string) => {
        const wallet  = walletMap[state.walletId];
        if (!wallet) throw new Error("No wallet supports switchChain");
        await wallet.switchChain!(chainId);
        setState((prev) => ({ ...prev, chainID: chainId }));
      },
      openModal: () => setOpenModal(true),
      closeModal: () => setOpenModal(false),
      refreshAllBalances,
    }),
    [state, walletMap, balance]
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletModal
        isOpen={openModal}
        wallets={wallets}
        onClose={value.closeModal}
        onSelectWallet={value.connect}
      />
    </WalletContext.Provider>
  );
};

export const useWalletContext = (): WalletContextValue => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used within WalletProvider");
  return ctx;
};
