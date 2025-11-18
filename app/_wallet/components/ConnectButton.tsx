"use client";
import React, { useMemo } from "react";
import { useWalletContext } from "../provider";

const ConnectButton: React.FC = () => {
  const { isConnected, disconnect, address, ethBalance, tokenBalances, openModal, chains, chainID, switchChain, walletId } = useWalletContext();
  const curNetWork = useMemo(()=>{
    console.log('chains,',chains)
    console.log('chainID,',chainID, typeof chainID)

    return chains.find(c=>Number(c.id).toString()== chainID)?.name
  },[chains, chainID])
  return (
    <div className="flex flex-col items-center gap-2">
      {isConnected ? (
        <>
          <div>当前钱包：{walletId} 当前网络：{curNetWork} 切换到 {chains?.filter(c=>Number(c.id).toString()!= chainID).map(c=><button key={c.id} onClick={()=>switchChain(c.id)} className="border p-2">{c.name}</button>)}</div>
          <p>Address: {address}</p>
          <p>ETH Balance: {ethBalance}</p>
          <div>token Balance: </div>
          {tokenBalances&&Object.keys(tokenBalances).map((token)=><div key={token}>{token}: {tokenBalances[token]}</div>)}
          <button onClick={disconnect} className="px-4 py-2 bg-red-500 text-white rounded">Disconnect</button>
        </>
      ) : (
        <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded">Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectButton;
