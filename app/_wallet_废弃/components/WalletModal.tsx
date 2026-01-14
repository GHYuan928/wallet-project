"use client";
import React from "react";
import type { Wallet } from "../types";

interface Props {
  isOpen: boolean;
  wallets: Wallet[];
  onSelectWallet: (id: string) => void;
  onClose: () => void;
}

const WalletModal: React.FC<Props> = ({ isOpen, wallets, onSelectWallet, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-2">Select Wallet</h2>
        <ul>
          {wallets.map((w) => (
            <li key={w.id} className="mb-2">
              <button
                className="w-full p-2 border rounded hover:bg-gray-100"
                onClick={() => { onSelectWallet(w.id); onClose(); }}
              >
                {w.name}
              </button>
            </li>
          ))}
        </ul>
        <button className="mt-2 p-2 bg-gray-200 rounded w-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default WalletModal;
