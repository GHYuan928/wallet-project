
export type Chain = {
  id: string;
  name: string;
  icon: string;
  rpcUrl: string;
  crrency: {
    name: string;
    symbol: string;
    decimals: number;
  }
  blockExplorer: {
    name: string;
    url: string;
  }
}
export interface WalletState {
  address: string|null;
  chainID: string|null;
  walletId: string|null;
  balance: string;
  isConnecting: boolean;
  isConnected: boolean;
  chains: Chain[];
  error: Error|null;
  provider: any;
  signer: any;
  accounts: string[]
}
export interface WalletContextValue extends WalletState{
  connect: (walletID: string)=>Promise<void>;
  disconnect: ()=>Promise<void>;
  switchChain: (chainId: string)=>Promise<void>;
  changeAccountByUser: (address: string)=>Promise<void>
  openModal: ()=>void;
  closeModal: ()=>void;
  getBalance: ()=>Promise<{balance: string,formatBalance: string}>
}  

export type WalletProviderProps = {
   children: React.ReactNode;
   chains: Chain[];
   wallets: Wallet[];
   autoConnect?: boolean;
}
export interface Wallet {
  id: string;
  name: string;
  icon: string;
  connect: ()=>Promise<{provider:any, signer: any, chainID: string, address: string, accounts:string[]}>
  disconnect: () => Promise<void>
  switchChain:  (chainId: string) => Promise<{provider: any, chainID: string}>
  addEventListener: ()=>void
  removeEventListener: ()=>void
  description?: string;
  installed?: boolean;
  downloadLink?: string;
}