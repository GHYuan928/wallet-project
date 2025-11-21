import React, { createContext, useContext, useEffect, useMemo, useState} from 'react'
import {formatEther} from 'ethers'
import type {WalletContextValue, WalletProviderProps, WalletState, Wallet} from '../types'
import {WALLET_STATE, WATTET_EVENT_ACCOUNT_CHANGE, WATTET_EVENT_CHAIN_CHANGE} from '../const'
import WalletModal from '../components/WalletModal'
const initWalletCtxValue = {
  address:'',
  chainID: '',
  walletId:'',
  balance: '0',
  isConnecting: false,
  isConnected: false,
  chains: [],
  accounts:[],
  error: null,
  provider: null,
  signer: null,
  connect:  async(walletID: string)=>{} ,
  disconnect: async()=>{},
  switchChain: async()=>{},
  changeAccountByUser: async(address:string)=>{},
  openModal:()=>{},
  closeModal:()=>{},
  getBalance: async()=>({balance: '0', formatBalance: '0'})
}
const WalletContext = createContext<WalletContextValue>(initWalletCtxValue)

export const WalletProvider:React.FC<WalletProviderProps> = ({children,chains,wallets,autoConnect})=>{
  const [walletState, setWalletState] = useState<WalletState>({
    address:'',
    chainID: '',
    walletId: '',
    balance: '0',
    isConnecting: false,
    isConnected: false,
    chains:chains,
    error: null,
    provider: null,
    signer: null,
    accounts: []
  })
  console.log('walletState',walletState)
  
  const [modalOpen, setModalOpen] = useState(false)
  const walletMap = useMemo(()=>{
    return wallets.reduce((acc,w)=>{
      acc[w.id]=w
      return acc;
    } ,{} as Record<string, Wallet>)
  },[wallets])
  const value: WalletContextValue = useMemo(()=>{
    return {
      ...walletState,
      connect: async(walletId: string)=>{
        const wallet = walletMap[walletId]
        if(!wallet){
          throw new Error(`wallet id ${walletId} not found, please check`)
        }
        setWalletState({...walletState, isConnecting: true})
        if(!wallet.connect){
          throw new Error(`${walletId} does not provide   connect method `)
        }
        const res = await wallet.connect();
        setWalletState({...walletState, isConnecting: false, isConnected: true, walletId, ...res})
      },
      disconnect: async()=>{
        if(!walletState.walletId){
          throw new Error(`disconnect error: walletId not found`)
        }
        const wallet = walletMap[walletState.walletId]
        if(!wallet){
          throw new Error(`disconnect wallet id ${walletState.walletId} not found, please check`)
        }
        await wallet.disconnect()
        setWalletState({...walletState,isConnected: false, isConnecting: false, provider: null, signer: null, chainID: '', address: '', accounts:[], walletId:''})
      },
      switchChain: async(chainID: string)=>{
        if(!walletState.walletId || !chainID){
          throw new Error(`disconnect error: walletId not found`)
        }
        const wallet = walletMap[walletState.walletId]
        if(!wallet){
          throw new Error(`disconnect wallet id ${walletState.walletId} not found, please check`)
        }
        const {provider, chainID: newChainId} = await wallet.switchChain(chainID)
        setWalletState({...walletState, provider, chainID: newChainId})
        // reload
      },
      changeAccountByUser: async()=>{},
      openModal:()=>{
        setModalOpen(true)
      },
      closeModal: ()=>{
        setModalOpen(false)
      },
      getBalance: async()=>{
        if(!walletState.provider || !walletState.address){
          return {
            balance: '0',
            formatBalance: '0'
          }
        }
        const bala = await walletState.provider.getBalance(walletState.address)
        setWalletState({...walletState, balance: bala.toString()})
        return {
          balance: bala.toString(),
          formatBalance: formatEther(bala)
        }
      }
    }
  },[walletState, walletMap])
  useEffect(()=>{
    let wallet:Wallet
    // 监听 账号切换，网络切换
    if(walletState.walletId){
      wallet = walletMap[walletState.walletId]
      wallet.addEventListener()
    }
    return ()=>{
      wallet && wallet.removeEventListener()
    }
    
  },[walletState.provider, walletMap])
  // 恢复数据  & 自动连接
  useEffect(()=>{
    const resumData = async()=>{
      const stateStr = localStorage.getItem(WALLET_STATE)
      if(!stateStr){
        return ;
      }
      const state: WalletState = JSON.parse(stateStr)
      if(autoConnect && state.walletId){
        const wallet = walletMap[state.walletId]
        const res = await wallet.connect()
        setWalletState({...state, ...res});
      }else {
        setWalletState(state);
      }
    }
    resumData()
  },[autoConnect,walletMap])
  
  // 监听插件钱包账号切换网络切换事件
  useEffect(()=>{
    const handleAccountChange =  (e:any) => {
      console.log('handleAccountChange',e)
      setWalletState({...walletState, ...e.detail})
    }
    const handleChainChange =  (e:any)  => {
      setWalletState({...walletState, ...e.detail})
    }
    window.addEventListener(WATTET_EVENT_ACCOUNT_CHANGE,handleAccountChange);
    window.addEventListener(WATTET_EVENT_CHAIN_CHANGE, handleChainChange);
    // walletState.provider?.on("network", (newNetwork:any, oldNetwork: any) => {
    //     console.log("Network changed:", oldNetwork, "=>", newNetwork);

    // })

    return ()=>{
      window.removeEventListener(WATTET_EVENT_ACCOUNT_CHANGE,handleAccountChange)

      window.removeEventListener(WATTET_EVENT_CHAIN_CHANGE,handleChainChange)
    }
  },[walletState.walletId])
  useEffect(()=>{
    localStorage.setItem(WALLET_STATE, JSON.stringify(walletState))
  },[walletState])

  return <WalletContext.Provider value={value}>
    {children}
    <WalletModal isOpen={modalOpen} onClose={value.closeModal} wallets={wallets} onSelectWallet={value.connect}/>
  </WalletContext.Provider>
}

export const useWallet = ():WalletContextValue =>{
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}