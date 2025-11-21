"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { motion } from "motion/react";
import { FiArrowUp } from 'react-icons/fi';
import { formatUnits } from 'ethers'
import StatCard from '@/components/StatCard';
import Input from '@/components/Input';
import { useAccount } from '../_wallet-sdk/hooks';
import { ConnetButton } from '../_wallet-sdk';
import {useContract} from '../_wallet-sdk/hooks';
import {CONTRACT_TOKEN} from '@/const/index'
import {stakeAbi} from '@/const/abi'
import Button from '@/components/Button';

/**
 * staked 已质押金额
 * withdrawPending 解质押金额
 * withdrawable 可提取金额
 */
interface UserStakeData {
  staked: string;
  withdrawPending: string;
  withdrawable: string;
}
const initilaData :UserStakeData = {
  staked:'0',
  withdrawPending: '0',
  withdrawable: '0'
}
const page = () => {
  const { address, isConnected} = useAccount()
  const [amount, setAmount]=useState<string>('')
  const [userData, setUserData] = useState<UserStakeData>(initilaData)
  const [loading, setLoading] = useState<boolean>(false)
  const contact = useContract(CONTRACT_TOKEN, stakeAbi)
  const handleUnstake = ()=> {
    contact?.unstake()
  }
  const getUserData = async()=>{
    const stakedAmount = await contact?.stakingBalance(0, address)
    const {requestAmount , pendingWithdrawAmount} = await contact?.withdrawAmount(0, address);
    setUserData({
      staked: formatUnits(stakedAmount),
      withdrawable: formatUnits(requestAmount),
      withdrawPending: formatUnits(pendingWithdrawAmount)
    })
  }
  useEffect(()=>{
    if(contact && address){
      getUserData();
    }
  },[contact, address])
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <motion.div 
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y:0}}
        transition={{duration: 0.5}}
        className='text-center mb-12'
      >
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
          Withdraw
        </h1>
        <p className="text-gray-600 text-lg">unstake and withdraw u eth</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className='grid grid-cols-3 gap-6 mb-8'>
          <StatCard label="Staked Amount" value={`${parseFloat(userData.staked).toFixed(4)} ETH`} />
          <StatCard label="Available to Withdraw" value={`${parseFloat(userData.withdrawable).toFixed(4)} ETH`} />
          <StatCard label="Pending Withdraw" value={`${parseFloat(userData.withdrawPending).toFixed(4)} ETH`} />
        </div>
        <div className='space-y-6'>
          <h2 className='text-xl font-semibold text-white'>Unstake</h2>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Amount to Unstake
            </label>
            <Input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              rightElement={<span className="text-gray-500">ETH</span>}
              className="text-lg sm:text-xl py-3 sm:py-5"
            />
          </div>
        </div>
        <div className='pt-4'>
              {
                !isConnected ? (
                  <div className='flex justify-center'>
                    <div className=' relative'>
                      <ConnetButton />
                    </div>
                  </div>
                ):(
                  <Button
                    onClick={handleUnstake}
                    disabled={loading || !amount}
                    loading={loading}
                    fullWidth
                    className="py-3 text-lg sm:text-xl"

                >
                  <FiArrowUp className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span>Unstake ETH</span>
                </Button>
                )
              }
            </div>
      </motion.div>

      
    </div>
  )
}

export default page
