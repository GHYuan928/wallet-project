import React, { useEffect, useMemo, useState } from 'react'
import {useWallet} from '../provider'
import {ethers, formatEther} from 'ethers'
import {shortenEthAddress} from '../utils'
interface ConnectButtonProps {
    label?: string
    showBalance?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}
const ConnectButton = ({label="连接钱包",showBalance, size="lg", className}:ConnectButtonProps) => {
  const { isConnected, openModal , chains, chainID, switchChain, provider, address, accounts, disconnect, changeAccountByUser, balance} = useWallet();

  const sizeClass = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-md',
        lg: 'px-6 py-3 text-lg',
  }
  const currentChain = useMemo(()=>{
   return chains.find(c=>c.id ==  chainID)
  },[chains, chainID])
  const [showChainDropdown, setShowChainDropdown] =useState(false)
  const [showAccountDropdown, setShowAccountDropdown] =useState(false)
  const newBalance = useMemo(()=>{
    if(!currentChain){
        return '0'
    }
    return Number(formatEther(balance)).toFixed(6) + currentChain!.crrency.symbol

  },[balance, currentChain])

  if (!isConnected) {
      return (
          <div onClick={openModal} className='flex justify-center items-center bg-[#d4382c] w-64 h-12 rounded-md text-amber-50'>
              <button  className={`${sizeClass[size]} ${className}`}>
                  {label}
              </button>
          </div>
      )
  }
  return (
    <div className='relative flex items-center space-x-3 bg-white rounded-lg shadow-md p-2 min-w-[320px]'>
      {
        currentChain? <div className="relative">
                    <button
                        onClick={() => {
                            setShowChainDropdown(!showChainDropdown)
                            setShowAccountDropdown(false)
                        }}
                        className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <img
                            src={currentChain.icon}
                            alt={currentChain.name}
                            className="w-4 h-4 rounded-full"
                        />
                        <span className="text-sm font-medium">{currentChain.name}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${showChainDropdown ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showChainDropdown && (
                        <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                                {chains.map(chain => (
                                    <button
                                        key={chain.name}
                                        onClick={() => { 
                                            switchChain(chain.id)
                                            setShowChainDropdown(false)
                                         }}
                                        className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm ${chain.id === chainID ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <img src={chain.icon} alt={chain.name} className="w-4 h-4 rounded-full" />
                                        <span>{chain.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>: null
       
      }
      <div className='ml-[10]'>{newBalance}</div>
      {/* 账户选择器 */}
    <div className="relative ml-auto">
        <button
            onClick={() => {
                setShowAccountDropdown(!showAccountDropdown)
                setShowChainDropdown(false)
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
        >
            <div className="h-6 w-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {'OX'}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{ shortenEthAddress(address) ?? ''}</span>
            <svg
                className={`w-4 h-4 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {showAccountDropdown && (
            <div className="absolute right-0 mt-1 w-98 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-500">已连接账户</p>
                    </div>
                    {accounts.map((acc: string, index) => (
                        <button
                            key={index}
                            onClick={() => { 
                                changeAccountByUser(acc)
                                setShowAccountDropdown(!showAccountDropdown)
                                setShowChainDropdown(false)
                             }}
                            className={`flex items-center justify-between w-full text-left px-4 py-3 text-sm ${acc === address ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {acc?.slice(0, 2).toUpperCase() || ''}
                                </div>
                                <span>{acc}</span>
                            </div>
                            {acc === address && (
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={()=>{
                            disconnect()
                            setShowAccountDropdown(false)
                            setShowChainDropdown(false)
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 mt-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                        </svg>
                        <span>断开连接</span>
                    </button>
                </div>
            </div>
        )}

    </div>
    </div>
  )
}

export default ConnectButton
