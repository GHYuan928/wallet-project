import { useContract, useAccount } from "../_wallet-sdk/hooks"
import {CONTRACT_TOKEN} from '@/const'
import {stakeAbi} from '@/const/abi'
import { useCallback, useEffect, useState } from "react";
import { formatUnits } from 'ethers';

export type IRewardsData = {
  /** 用户在当前资金池，当前可领取的 MetaNode 数量 */
  pendingReward: string; 
  stakedAmount: string;
  lastUpdate: number;
};
export type IPoolData = {
  poolWeight: string;
  lastRewardBlock: string;
  accMetaNodePerShare: string;
  stTokenAmount:  string;
  minDepositAmount:  string;
  unstakeLockedBlocks:  string;
  stTokenAddress:  string;
};
type UserData = [bigint, bigint, bigint]; // [stAmount, finishedMetaNode, pendingMetaNode]


const useReward = ()=>{
  const contract = useContract(CONTRACT_TOKEN,stakeAbi);
  const {address, isConnected} = useAccount()
  const [rewardsData, setRewardsData] = useState<IRewardsData>({
    pendingReward: '0',
    stakedAmount: '0',
    lastUpdate: 0
  });
  const [loading, setLoading] = useState(false);
  const [poolData, setPoolData] = useState<IPoolData>({
    poolWeight: '0',
    lastRewardBlock: '0',
    accMetaNodePerShare: '0',
    stTokenAmount: '0',
    minDepositAmount: '0',
    unstakeLockedBlocks: '0',
    stTokenAddress: '0'
  });
  const [metaNodeAddress, setMetaNodeAddress] = useState<string>('');
  const fetchRewardsData = useCallback(async()=>{
    if (!contract || !address || !isConnected) return;
    try {
      setLoading(true)
      const user = await contract.user(0, address)
      console.log(`user.stAmount:${user.stAmount} finishedMetaNode:${user.finishedMetaNode} pendingMetaNode:${user.pendingMetaNode}`)

      const stakedAmount = await contract.stakingBalance(0, address)
      console.log('stakedAmount',stakedAmount)
      setRewardsData({
        pendingReward: formatUnits(user.pendingReward || BigInt(0), 18),
        stakedAmount: formatUnits(BigInt(stakedAmount)|| BigInt(0), 18),
        lastUpdate: Date.now()
      });
    } catch (error) {
      setRewardsData({
        pendingReward: '0',
        stakedAmount: '0',
        lastUpdate: Date.now()
      });
    }finally {
      setLoading(false);
    }

  },[contract, address, isConnected])
  const fetchPoolData = useCallback( async()=>{
    if (!contract || !address || !isConnected) return;
    const pool = await contract.pool(0)
    console.log(`pool stTokenAddress${pool.stTokenAddress} poolWeight:${pool.poolWeight} accMetaNodePerST:${pool.accMetaNodePerST} stTokenAmount:${pool.stTokenAmount}`)

    setPoolData({
      poolWeight: formatUnits(pool[1] as bigint || BigInt(0), 18),
      lastRewardBlock: formatUnits(pool[2] as bigint || BigInt(0), 18),
      accMetaNodePerShare: formatUnits(pool[3] as bigint || BigInt(0), 18),
      stTokenAmount: formatUnits(pool[4] as bigint || BigInt(0), 18),
      minDepositAmount: formatUnits(pool[5] as bigint || BigInt(0), 18),
      unstakeLockedBlocks: formatUnits(pool[6] as bigint || BigInt(0), 18),
      stTokenAddress: pool[0] as string
    });

  },[contract, address, isConnected])
  const fetchMetaNodeAddress = useCallback(async ()=>{
     if (!contract) return;

    try {
      const address = await contract.MetaNode();
      console.log('fetchMetaNodeAddress',address)
      setMetaNodeAddress(address as string);
    } catch (error) {
      console.error('Failed to fetch MetaNode address:', error);
    }
  },[contract, address, isConnected])
  useEffect(()=>{
    if(isConnected && address){
      fetchRewardsData()
      fetchPoolData()
      fetchMetaNodeAddress()
    }
  },[isConnected, address])
  return {
    rewardsData,
    loading,
    poolData,
    metaNodeAddress,
    canClaim: parseFloat(rewardsData.pendingReward) > 0
  };
}

export default useReward