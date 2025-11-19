import React from 'react'
import type { Wallet } from '../types'

interface WalletModalProps {
    isOpen: boolean
    onClose: () => void
    wallets: Wallet[]
    onSelectWallet: (walletID: string) => void
    connecting?: boolean
    onError?: (error: Error) => void
}

const WalletModal = ({ isOpen, onClose, wallets, onSelectWallet, connecting, onError }: WalletModalProps) => {
    if (!isOpen) {
        return null
    }

    return (
        <div onClick={onClose} className='fixed top-0 left-0 w-full h-full bg-black/50 bg-opacity-50 shadow-lg z-40 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-md shadow-lg'>
                <h2 className='text-2xl font-bold mb-4'>Connect Wallet</h2>
                <div className='space-y-3 max-h-[60vh] overflow-auto pr-1'>
                    {wallets.map((wallet) => (
                        <div key={wallet.id} onClick={(e: React.MouseEvent<HTMLDivElement>)=>{
                            e.stopPropagation();
                            onSelectWallet(wallet.id)
                            onClose()
                          }} 
                          className='cursor-pointer p-2 rounded-md hover:bg-gray-100 flex items-center'>
                            <img src={wallet.icon} alt={wallet.name} className='w-8 h-8 mr-2' />
                            {wallet.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WalletModal 