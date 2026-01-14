export interface Chain {
  id: string; // hex string e.g. "0x1"
  name: string;
  rpcUrl: string;
}

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  installed?: boolean;
  connector: () => Promise<{
    address: string;
    chainId: string;
    signer?: any;
    provider: any;
  }>;
  disconnect?: () => Promise<void>;
  switchChain?: (chainId: string) => Promise<void>;
  getBalance?: (address: string) => Promise<string>;
  getBalanceOf?: (address: string, token: string, abi: any) => Promise<string>;
  onAccountsChanged?: (callback: (accounts: string[]) => void) => void;
  onChainChanged?: (callback: (chainId: string, provider: any) => void) => void;
  removeAllListener?: ()=>Promise<void>
}

export interface WalletState {
  address: string;
  chainID: string;
  chains: Chain[];
  walletId: string;
  isConnecting: boolean;
  isConnected: boolean;
  error: Error | null;
  ethBalance?: string;
  tokenBalances?: Record<string, string>;
  provider: any;
}

export interface WalletContextValue extends WalletState {
  connect: (walletId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
}

export interface WalletProviderProps {
  children: React.ReactNode;
  chains: Chain[];
  wallets: Wallet[];
  autoConnect?: boolean;
}
