"use client";
import {ConnetButton} from './_wallet-sdk'
import { motion } from "motion/react";
import { parseEther} from 'ethers'
import { FiTrendingUp, FiZap, FiArrowDown, FiGift , FiInfo} from 'react-icons/fi';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { toast } from "react-toastify";
import { useState } from 'react';
import Button from '@/components/Button';
import UMIButton from '@mui/material/Button'
import {useContract, useAccount, useBalance} from '@/app/_wallet-sdk/hooks'
import {CONTRACT_TOKEN} from '@/const/index'
import {stakeAbi} from '@/const/abi'
import useReward from './_hooks/useReward';
export default function Home() {
  const {address, isConnected} = useAccount();
  const contract = useContract(CONTRACT_TOKEN, stakeAbi)
  const [amount, setAmount] = useState<string>('')
  const [reloadBalance, setReloadBalance] = useState('')
  const balance = useBalance(reloadBalance)
  const [loading, setLoading] = useState(false);
  const {rewardsData, canClaim, poolData, addMetaNodeToWallet,refresh} = useReward()
  const [claimLoading, setClaimLoading] = useState(false);

  const handleStake = async ()=>{
    setLoading(true)
    try {
      console.log('contract',contract)
      const tx = await contract?.depositETH(({
        value: parseEther(amount)  // 发送 0.1 ETH
      }))
      console.log('tx',tx)
      // 等待链上确认
      const receipt = await tx.wait();
      console.log('receipt',receipt)
      if(receipt.status == 1){
        toast.success('质押成功!');
        setReloadBalance(Math.random().toString());
        setAmount('')
      }else {
        toast.error('质押error!');
      }
      setLoading(false)
    } catch (error) {
      toast.error('Stake failed!');
      console.log('error',error)
      setLoading(false)
    }

  }


  const handleClaim = async () => {
    try {
      setClaimLoading(true);
      const tx = await contract!.claim(0);
      const res  = await tx.wait();
      console.log('res',res)
      if (res.status === 1) {
        toast.success('Claim successful!');
        setClaimLoading(false);
        refresh(); // 刷新奖励数据
        return;
      }
      toast.error('Claim failed!');
    }  catch (error) {
      setClaimLoading(false);
      toast.error('Transaction failed. Please try again.');
      console.log(error, 'claim-error');
    }
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <motion.div 
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        transition={{duration:0.5}}
        className='text-center mb-5 mt-2'
      >
        <div className='inline-block mb-2'>
          <motion.div
            animate={{rotate: 360}}
            transition={{duration: 20, repeat: Infinity, ease: 'linear'}}
            className='w-24 h-24 rounded-full border-2 border-blue-500/20 flex items-center justify-center shadow-xl'
          >
            <FiZap className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
          MetaNode Stake
        </h1>
        <p className="text-primary text-xl">
          Stake ETH to earn tokens
        </p>
      </motion.div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
        <Card className="min-h-[420px] p-4 bg-linear-to-br from-gray-800/80 to-gray-900/80 shadow-2xl border-blue-500/20 border-[1.5px] rounded-2xl sm:rounded-3xl">
          <div className=' space-y-8 sm:space-y-8'>
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-gray-800/70 rounded-xl sm:rounded-2xl border border-gray-700/50 group-hover:border-blue-500/50 transition-colors duration-300 shadow-lg'>
              <div className='flex-shink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-blue-50 rounded-full'>
                <FiTrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              </div>
               <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
                <span className="text-gray-400 text-base sm:text-lg mb-1">Staked Amount</span>
                <span className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent leading-tight break-all">
                  {poolData.stTokenAmount} ETH
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <Input
                label="Amount to Stake"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                rightElement={<span className="text-gray-500">ETH</span>}
                helperText={balance ? `Available: ${parseFloat(balance).toFixed(4)} ETH` : undefined}
                className="text-lg sm:text-xl py-3 sm:py-5"
              />
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
                    onClick={handleStake}
                    disabled={loading || !amount}
                    loading={loading}
                    fullWidth
                    className="py-3 text-lg sm:text-xl"

                >
                  <FiArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span>Stake ETH</span>
                </Button>
                )
              }
            </div>
          </div>
        </Card>

        <Card className="min-h-[420px] p-4 bg-linear-to-br from-gray-800/80 to-gray-900/80 shadow-2xl border-blue-500/20 border-[1.5px] rounded-2xl sm:rounded-3xl">
          <div className="space-y-8 sm:space-y-12">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-gray-800/70 rounded-xl sm:rounded-2xl border border-gray-700/50 group-hover:border-primary-500/50 transition-colors duration-300 shadow-lg">
              <div className="shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-green-500/10 rounded-full">
                <FiGift className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
                <span className="text-gray-400 text-base sm:text-lg mb-1">Pending Rewards</span>
                <span className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-tight break-all">
                  {parseFloat(rewardsData.pendingReward).toFixed(4)} MetaNode
                </span>
              </div>
            </div>
            <div>
              <span className='text-primary'>{`累计获取奖励:${parseFloat(rewardsData.finishedMetaNode).toFixed(4)} metanode`}</span>
              <UMIButton onClick={addMetaNodeToWallet}>添加代币到metamask</UMIButton>
            </div>
            <div className="pt-4 sm:pt-8">
              {!isConnected ? (
                <div className="flex justify-center">
                  <div className="glow">
                    <ConnetButton />
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleClaim}
                  disabled={claimLoading || !canClaim}
                  loading={claimLoading}
                  fullWidth
                  className="py-3 sm:py-5 text-lg sm:text-xl bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <FiGift className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span>Claim Rewards</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


// 0x53dcd07b90b6326dc0eaae84963b3100b0fe7963
