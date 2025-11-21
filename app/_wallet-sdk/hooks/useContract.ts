import { useWallet } from "@/app/_wallet-sdk/provider"
import { useEffect, useMemo, useState } from "react"
import {ethers, formatEther} from 'ethers'
const useContract = (token:string, abi: any)=>{
  const {signer, isConnected} = useWallet();
  return useMemo(()=>{
    if(!isConnected || !signer){
      return null
    }
    const contract =  new ethers.Contract(token, abi, signer); // 有 signer 就能读写
    return contract
  },[isConnected, signer, token, abi])
}
export default useContract