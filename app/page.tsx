"use client";
import React from "react";
import { WalletProvider } from "./_wallet/provider";
import ConnectButton from "./_wallet/components/ConnectButton";
import metamask from "./_wallet/connectors/metamask";
import okxWallet from "./_wallet/connectors/okxWallet";
import coinbaseWallet from "./_wallet/connectors/coinbase";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/F0di7R5tgFYa1JkaCS_-g';
export const ALCHEMY_SEPOLIA_URL = "https://eth-sepolia.g.alchemy.com/v2/F0di7R5tgFYa1JkaCS_-g"; 
const chains = [
  { id: "0x1",  name: "Ethereum Mainnet", rpcUrl: ALCHEMY_MAINNET_URL },
  { id: "0xaa36a7", name: "Sepolia ", rpcUrl: ALCHEMY_SEPOLIA_URL }
];

const wallets = [metamask, okxWallet, coinbaseWallet]; // okxWallet, coinbaseWallet

export default function Home() {
  return (
    <WalletProvider chains={chains} wallets={wallets}>
      <div className="flex min-h-screen items-center justify-center">
        <ConnectButton />
      </div>
    </WalletProvider>
  );
}


// 0x53dcd07b90b6326dc0eaae84963b3100b0fe7963
