// wallet/reducer.ts
export type WalletState = {
  connectorId: string | null;
  address: string | null;
  chainId: string | null; // decimal string
  provider: any | null;
  signer: any | null;
  ethBalance: string | null; // bigint string
  tokenBalances: Record<string, string>;
  isConnected: boolean;
  isConnecting: boolean;
};

export const initialState: WalletState = {
  connectorId: null,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
  ethBalance: null,
  tokenBalances: {},
  isConnected: false,
  isConnecting: false,
};

export function walletReducer(state: WalletState, action: any): WalletState {
  switch (action.type) {
    case "CONNECT_START":
      return { ...state, isConnecting: true };
    case "CONNECT_SUCCESS":
      return { ...state, ...action.payload, isConnected: true, isConnecting: false };
    case "DISCONNECT":
      return { ...initialState };
    case "SET_BALANCES":
      return { ...state, ethBalance: action.payload.ethBalance, tokenBalances: action.payload.tokenBalances };
    case "SET_CHAIN":
      return { ...state, chainId: action.payload };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    default:
      return state;
  }
}
