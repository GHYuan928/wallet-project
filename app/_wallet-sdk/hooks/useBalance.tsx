import { useWallet } from "@/app/_wallet-sdk/provider"
import { useEffect, useState } from "react"

const useBalance = (reload:string)=>{
  const {address, provider, isConnected, getBalance} = useWallet()
  const [balance, setBalance] = useState<string>('')
  useEffect(()=>{
    const getBalanceFunc = async ()=>{
      let b='';
      if(isConnected && address && provider ){
        const bala = await getBalance()
        setBalance(bala.formatBalance)
      }
    }
    getBalanceFunc()
 },[isConnected, address,provider, reload])
 return balance
}
export default useBalance